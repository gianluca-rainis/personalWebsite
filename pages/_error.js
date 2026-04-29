import React from 'react'

GenericError.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : (err ? err.statusCode : 404);

    return {
        pageTitle: `Error ${statusCode?statusCode:""}`,
        statusCode: statusCode
    };
}

export default function GenericError({ pageTitle, statusCode }) {
    return (
        <>
            <main className="errorPageMain">
                <h1>Error {statusCode}</h1>
                <h2>Generic Error</h2>
                <p>
                    We're sorry, but we've encountered an unexpected error. Please try again later.
                </p>
            </main>
        </>
    )
}