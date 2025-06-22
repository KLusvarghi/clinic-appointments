import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // para que possa usar a imagem que vem do google, temos que adicionar o dominio dela:
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "clinic-saas-assets.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: `${process.env.AWS_S3_BUCKET}.supabase.co`,
        pathname: "/storage/**",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
