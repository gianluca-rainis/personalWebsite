import { isIP } from 'node:net';
import nodemailer from 'nodemailer';

const rateLimitWindowMs = 60 * 1000;
const rateLimitMaxRequests = 3;
const rateLimitMaxTrackedIps = 10000;
const globalLimitWindowMs = 60 * 60 * 1000;
const globalLimitMaxRequests = 30;
const requestsByIp = new Map();
let globalRequests = [];
let lastRateLimitCleanup = 0;

const CONTACT_RECEIVER = 'gianlucarainis@gmail.com';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '64kb'
        }
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
        return res.status(415).json({ error: 'Unsupported content type' });
    }

    if (!isSameOrigin(req)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    if ((body.senderName != null && typeof body.senderName !== 'string') || (body.replyEmail != null && typeof body.replyEmail !== 'string') || typeof body.subject !== 'string' || typeof body.message !== 'string') {
        return res.status(400).json({ error: 'Invalid field value' });
    }

    const safeName = sanitizeText(body.senderName, { maxLength: 100 }) || 'Anonymous';
    const safeReplyEmail = sanitizeText(body.replyEmail, { maxLength: 254 });
    const safeSubject = sanitizeText(body.subject, { maxLength: 500 });
    const safeMessage = sanitizeText(body.message, { allowNewLines: true, maxLength: 10000 });

    if (!safeSubject || !safeMessage) {
        return res.status(400).json({ error: 'Subject and message are required' });
    }

    if (safeReplyEmail && !isValidEmail(safeReplyEmail)) {
        return res.status(400).json({ error: 'Invalid reply email address' });
    }

    const senderAddress = process.env.EMAIL_NODE_MAILER;
    if (!senderAddress || !process.env.PASSWORD_NODE_MAILER) {
        console.error('Missing email env vars.');

        return res.status(500).json({ success: false, error: 'Email service is not available yet' });
    }

    if (isGlobalLimited()) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderAddress,
            pass: process.env.PASSWORD_NODE_MAILER
        }
    });

    const safeReplyText = safeReplyEmail || 'Not provided';
    const escapedMessageHtml = escapeHtml(safeMessage).replace(/\n/g, '<br />');

    try {
        await transporter.sendMail({
            from: `"Website Contact" <${senderAddress}>`,
            to: CONTACT_RECEIVER,
            replyTo: safeReplyEmail || senderAddress,
            subject: `[Website Contact] ${safeSubject}`,
            text: [
                `From: ${safeName}`,
                `Reply email: ${safeReplyText}`,
                '',
                'Message:',
                safeMessage
            ].join('\n'),
            html: `
            <!DOCTYPE html>
            <html lang="en-US">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <title>[Website Contact] ${escapeHtml(safeSubject)}</title>
                </head>

                <body style="
                    margin:0;
                    padding:0;
                ">
                    <h2>New contact from ${escapeHtml(safeName)}</h2>
                    <p><strong>From:</strong> ${escapeHtml(safeName)}</p>
                    <p><strong>Reply email:</strong> ${escapeHtml(safeReplyText)}</p>
                    <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
                    <hr />
                    <p style="white-space: pre-wrap;">${escapedMessageHtml}</p>
                </body>
            </html>
            `
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending contact email:', error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
}

function isRateLimited(ip) {
    const now = Date.now();

    if (now - lastRateLimitCleanup >= rateLimitWindowMs) {
        for (const [trackedIp, requests] of requestsByIp) {
            const recentRequests = requests.filter((time) => now - time < rateLimitWindowMs);

            if (recentRequests.length) {
                requestsByIp.set(trackedIp, recentRequests);
            }
            else {
                requestsByIp.delete(trackedIp);
            }
        }

        lastRateLimitCleanup = now;
    }

    const recentRequests = (requestsByIp.get(ip) ?? []).filter((time) => now - time < rateLimitWindowMs);

    if (recentRequests.length >= rateLimitMaxRequests) {
        return true;
    }

    if (!requestsByIp.has(ip) && requestsByIp.size >= rateLimitMaxTrackedIps) {
        return true;
    }

    recentRequests.push(now);
    requestsByIp.set(ip, recentRequests);

    return false;
}

function isSameOrigin(req) {
    const origin = req.headers.origin;

    if (!origin) {
        return true;
    }

    try {
        const originUrl = new URL(origin);

        return ['http:', 'https:'].includes(originUrl.protocol) && originUrl.host.toLowerCase() === req.headers.host?.toLowerCase();
    } catch {
        return false;
    }
}

function isGlobalLimited() {
    const now = Date.now();

    globalRequests = globalRequests.filter((time) => now - time < globalLimitWindowMs);

    if (globalRequests.length >= globalLimitMaxRequests) {
        return true;
    }

    globalRequests.push(now);

    return false;
}

function getClientIp(req) {
    const remoteAddress = req.socket.remoteAddress || 'unknown';
    const trustedProxyHops = Number(process.env.CONTACT_TRUSTED_PROXY_HOPS || 0);
    const forwardedFor = req.headers['x-forwarded-for'];

    if (!Number.isInteger(trustedProxyHops) || trustedProxyHops < 1 || typeof forwardedFor !== 'string') {
        return remoteAddress;
    }

    const forwardedIps = forwardedFor.split(',').map((address) => address.trim());
    const clientIp = forwardedIps[forwardedIps.length - trustedProxyHops];

    return clientIp && isIP(clientIp) ? clientIp : remoteAddress;
}

function sanitizeText(value, options = {}) {
    if (typeof value !== 'string') {
        return '';
    }

    const input = value.trim().slice(0, options.maxLength);

    if (options.allowNewLines) {
        return input.replace(/\r/g, '');
    }

    return input.replace(/[\r\n]/g, ' ');
}

function isValidEmail(email) {
    return /^[^\s@<>(),;:"\\]+@[^\s@<>(),;:"\\]+\.[^\s@<>(),;:"\\]+$/.test(email);
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
