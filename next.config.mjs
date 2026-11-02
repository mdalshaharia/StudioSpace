/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // https://unsplash.com/photos/a-man-in-a-white-shirt-is-posing-for-a-picture-mRVP1c59wko' />
  // https://lh3.googleusercontent.com/a/ACg8ocLx67rUPcXs3RBgXX0j7FNYD75rVGxVpcymVsM5oLrB1Q8-qP5r=s96-c
 images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      }
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;