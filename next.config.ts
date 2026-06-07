import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 封面图是用户自由填写的外部 URL，组件里用 unoptimized 直接加载，
    // 避免把任意第三方 URL 代理过 Next 图片优化器（SSRF 面 + 额外延迟）。
    // 这里保留一个宽松的 remotePatterns 仅作为将来按需开启优化的兜底。
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
