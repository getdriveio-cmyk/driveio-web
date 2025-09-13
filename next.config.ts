
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['firebase-admin', 'google-auth-library', '@google-cloud/firestore', 'gaxios', 'https-proxy-agent', 'agent-base', 'gcp-metadata'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // allow images from storage + data: for inline PaymentElement icons
      "img-src 'self' https://firebasestorage.googleapis.com data:",
      // Stripe loads iframes and JS from stripe.com + js.stripe.com
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      // connections to our APIs and Firebase/Stripe
      "connect-src 'self' https://firebasestorage.googleapis.com https://api.resend.com https://hooks.stripe.com",
      // styles (allow inline for Next/Stripe)
      "style-src 'self' 'unsafe-inline'",
      // fonts
      "font-src 'self' data:",
      // media
      "media-src 'self'",
      // worker
      "worker-src 'self'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), payment=(self "https://js.stripe.com")' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/trips',
        destination: '/profile/trips',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
