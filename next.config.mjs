/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // GitHub Pages serves static files and cannot run a Next.js server.
  // `next build` creates HTML files in out/ for each portfolio route.
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

}

export default nextConfig
