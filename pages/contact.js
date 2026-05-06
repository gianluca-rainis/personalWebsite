import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import Head from '@/components/Head';
import styles from '@/styles/contact.module.css';

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Contact Me"
        }
    }
}

export default function SearchPage({ pageTitle = "Contact Me" }) {
    const path = usePathname();
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const payload = {
            senderName: String(formData.get('senderName') || '').trim(),
            replyEmail: String(formData.get('replyEmail') || '').trim(),
            subject: String(formData.get('subject') || '').trim(),
            message: String(formData.get('message') || '').trim()
        };

        setIsSending(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Something went wrong while sending your message.');
            }

            setStatus({
                type: 'success',
                message: 'Your message was sent successfully. Thank you!'
            });
        } catch (error) {
            console.error(error.message);
            
            setStatus({
                type: 'error',
                message: 'Unable to send your message right now. Please try again later.'
            });
        } finally {
            setIsSending(false);
        }
    }

    return (
        <>
            <Head pageTitle={`${pageTitle}`} pageUrl={path} />
            <Nav />

            <main className={styles.contactMain}>
                <section className={styles.contactCard} aria-labelledby='contact-title'>
                    <p className={styles.eyebrow}>Contact Me</p>
                    <h1 id='contact-title' className={styles.title}>Get in touch with me</h1>
                    <p className={styles.description}>
                        Send me a message and I will get back to you as soon as possible.
                    </p>

                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <label className={styles.field} htmlFor='sender-name'>
                            <span className={styles.label}>Your Name or Company</span>
                            <input
                                id='sender-name'
                                name='senderName'
                                type='text'
                                autoComplete='name'
                                placeholder='Name or Company'
                                required
                            />
                        </label>

                        <label className={styles.field} htmlFor='reply-email'>
                            <span className={styles.label}>Reply Email</span>
                            <input
                                id='reply-email'
                                name='replyEmail'
                                type='email'
                                autoComplete='email'
                                placeholder='you@example.com'
                                required
                            />
                        </label>

                        <label className={styles.field} htmlFor='subject'>
                            <span className={styles.label}>Subject</span>
                            <input
                                id='subject'
                                name='subject'
                                type='text'
                                placeholder='What is this about?'
                                required
                            />
                        </label>

                        <label className={styles.field} htmlFor='message'>
                            <span className={styles.label}>Message</span>
                            <textarea
                                id='message'
                                name='message'
                                rows={6}
                                placeholder='Write your message here...'
                                required
                            />
                        </label>

                        <button type='submit' className={styles.submitButton} disabled={isSending}>
                            {isSending ? 'Sending...' : 'Send Message'}
                        </button>

                        {status.message && (
                            <p className={status.type === 'success' ? styles.statusSuccess : styles.statusError} role='status'>
                                {status.message}
                            </p>
                        )}
                    </form>
                </section>
            </main>
        </>
    );
}