import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // para que possa usar a imagem que vem do google, temos que adicionar o dominio dela:
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
