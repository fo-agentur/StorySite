import type { NextConfig } from "next";

// Statischer Export – die Seite braucht keinen Server und kann überall gehostet werden.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
