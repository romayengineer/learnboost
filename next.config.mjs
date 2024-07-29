/** @type {import('next').NextConfig} */

// Changed disabling Strict Mode because
// useEffect is called twice and triggers an auto cancellation
// of pocketbase requests to avoid request duplication
// Strict Mode is disabled in production but enabled in dev
const nextConfig = {
  reactStrictMode: false,
};

export default nextConfig;
