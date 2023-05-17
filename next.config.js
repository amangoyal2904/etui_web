/* next.config.js  */
module.exports = {
    i18n: {
      locales: ["en"],
      defaultLocale: "en",
    },
    images: {
      domains: ['img.etimg.com'],
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
  };