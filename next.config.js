/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '', // No prefixs
    trailingSlash: false,
    poweredByHeader: false,
    
    // Asset optimization
    images: {
        unoptimized: true, // Temp
    },
}

module.exports = nextConfig
