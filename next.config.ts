import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.bennettoguegbumemorial.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
