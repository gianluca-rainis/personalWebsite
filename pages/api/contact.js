import nodemailer from 'nodemailer';

const CONTACT_RECEIVER = 'gianlucarainis@gianlucarainis.com';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { senderName, replyEmail, subject, message } = req.body || {};

    const safeName = sanitizeText(senderName);
    const safeReplyEmail = sanitizeText(replyEmail);
    const safeSubject = sanitizeText(subject);
    const safeMessage = sanitizeText(message, { allowNewLines: true });

    if (!safeName || !safeReplyEmail || !safeSubject || !safeMessage) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!isValidEmail(safeReplyEmail)) {
        return res.status(400).json({ error: 'Invalid reply email address' });
    }

    if (!process.env.EMAIL_NODE_MAILER || !process.env.PASSWORD_NODE_MAILER) {
        console.error('Missing email env vars: EMAIL_NODE_MAILER and/or PASSWORD_NODE_MAILER');

        return res.status(500).json({ success: false, error: 'Email service is not available yet' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_NODE_MAILER,
            pass: process.env.PASSWORD_NODE_MAILER
        }
    });

    try {
        await transporter.sendMail({
            from: `Website Contact <${safeReplyEmail}>`,
            to: CONTACT_RECEIVER,
            replyTo: safeReplyEmail,
            subject: `[Website Contact] ${safeSubject}`,
            text: [
                `From: ${safeName}`,
                `Reply email: ${safeReplyEmail}`,
                '',
                'Message:',
                safeMessage
            ].join('\n'),
            html: `
            <!DOCTYPE html>
            <html lang="en-US">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <title>[Website Contact] ${safeSubject}</title>
                </head>

                <body style="
                    margin:0;
                    padding:0;
                ">
                    <h2>New contact from ${escapeHtml(safeName)}</h2>
                    <p><strong>From:</strong> ${escapeHtml(safeName)}</p>
                    <p><strong>Reply email:</strong> ${escapeHtml(safeReplyEmail)}</p>
                    <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
                    <hr />
                    <p style="white-space: pre-wrap;">${escapeHtml(safeMessage)}</p>
                </body>
            </html>
            `
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending contact email: '+error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
}

function sanitizeText(value, options = {}) {
    const input = String(value || '').trim();

    if (!input) {
        return '';
    }

    if (options.allowNewLines) {
        return input.replace(/\r/g, '');
    }

    return input.replace(/[\r\n]/g, ' ');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}