/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    quietDeps: true, // This will silence deprecation warnings
    silenceDeprecations: [
      "mixed-decls",
      "legacy-js-api",
      "import",
      "slash-div",
      "global-builtin",
    ],
  },
  // express backend  configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Match any request to /api/*
        destination: 'http://localhost:5000/api/:path*', // Forward to backend, local
        // destination: 'https://cispro-job-site-apis.onrender.com/api/:path*', // Forward to backend, production
      },
    ];
  },
};

module.exports = nextConfig;
