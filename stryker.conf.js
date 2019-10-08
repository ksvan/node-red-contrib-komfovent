module.exports = function(config) {
  config.set({
    mutator: "javascript",
    packageManager: "npm",
    reporters: ["html", "clear-text", "progress"],
    testRunner: "mocha tests/test_komfoclass_spec.js",
    transpilers: [],
    testFramework: "mocha",
    coverageAnalysis: "perTest"
  });
};
