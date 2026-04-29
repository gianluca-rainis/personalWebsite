import React from 'react'
import Nav from '@/components/Nav'

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Error 500 - Internal Server Error"
        }
    }
}

export default function Page500({ pageTitle }) {
    return (
        <>
            <Nav />

            <main className="errorPageMain">
                <h1>Error 500</h1>
                <h2>Internal Server Error</h2>
                <p>
                    We're sorry, but we encountered a server error. Please try again later.
                </p>
            </main>
        </>
    )
}