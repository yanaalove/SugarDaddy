/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "robohash.org",
          port: "", // You can leave this empty if no specific port is required
          pathname: "/**", // To accept all paths
        },
      ],
    },
    webpack(config) {
      config.optimization.splitChunks = {
        chunks: 'all', // تقسيم الكود لجميع الكودات
      };
  
      // يمكنك إضافة تحسينات أخرى إذا لزم الأمر هنا
  
      return config;
    },
  };
  
  export default nextConfig;
  