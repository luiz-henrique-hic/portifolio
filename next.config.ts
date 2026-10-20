import type { NextConfig } from 'next';

// NEXT_PUBLIC_BASE_PATH is set by the GitHub Pages workflow (e.g. "/portfolio").
// Leave it empty for a user site (SEU_USUARIO.github.io) or Vercel.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Este projeto é independente; evita que o Next "suba" até um lockfile de pasta pai.
  outputFileTracingRoot: process.cwd(),
  // Tipos são checados no build; ESLint não faz parte deste projeto.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
