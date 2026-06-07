import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone 输出：构建产物自包含一个最小的 node_modules，
  // 让 Docker 运行时镜像小到 ~150MB，无需把全套依赖拷进去
  output: "standalone",

  images: {
    // 封面图是用户自由填写的外部 URL，组件里用 unoptimized 直接加载，
    // 避免把任意第三方 URL 代理过 Next 图片优化器（SSRF 面 + 额外延迟）。
    // 这里保留一个宽松的 remotePatterns 仅作为将来按需开启优化的兜底。
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
