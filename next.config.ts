import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "api.bennettoguegbumemorial.com",
      pathname: "/**",
    },
  ],
},
};

export default nextConfig;