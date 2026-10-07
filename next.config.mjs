/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // The icon set is a large barrel; import only what a file names.
  experimental: {
    optimizePackageImports: ['@hugeicons/core-free-icons'],
  },
}

export default nextConfig
