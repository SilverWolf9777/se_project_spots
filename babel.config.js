module.exports = {
  presets: [
    [
      "@babel/preset-env", // The preset you want to use
      {
        // The browser versions where we want our code to be supported.
        // This can be adjusted to support more or fewer browsers.
        // See: https://babeljs.io/docs/options#targets
        targets: "defaults, IE 11, not dead",

        // Use polyfills for the browsers specified in the targets option.
        // Babel pulls these from the core-js library.
        useBuiltIns: "entry",
        corejs: 3,

        // Let Webpack handle ES modules instead of converting them to CommonJS.
        // This is required for import/export to work correctly.
        modules: false,
      },
    ],
  ],
};
