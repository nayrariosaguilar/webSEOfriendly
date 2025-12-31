export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://tusitio.com/sitemap.xml",
    host: "https://tusitio.com",
  };
}
