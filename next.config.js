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
   // Only use rewrite to local Express server during development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*', // Local backend
        },
      ];
    }

    // In production, let the frontend use the public API base URL directly
    return [
      {
        source: '/api/:path*',
        destination: 'https://cispro-job-site-apis.onrender.com/api/:path*', // for production
      },
    ];
  },
};

module.exports = nextConfig;
