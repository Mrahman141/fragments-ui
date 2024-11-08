// Updated next.config.mjs with output: 'export'
import path from 'path';

export default {
  reactStrictMode: true,
  output: 'export',  // This tells Next.js to export static files
  webpack(config) {
    config.resolve.alias['@'] = path.join(process.cwd(), 'src');
    return config;
  },
};
