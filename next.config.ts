import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone' // Enable standalone output for Docker production builds
}

export default nextConfig
