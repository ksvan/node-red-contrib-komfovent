module.exports = function(config) {
  config.set({
    mutate: ['komfnodes/komfovent.js'],
    mutator: 'javascript',
    packageManager: 'npm',
    reporters: ['html', 'clear-text', 'progress'],
    testRunner: 'mocha',
    mochaOptions: {
      spec: ['./test/test_komfoclass_spec.js']
      // require: ['./test/unit/testHelper.js']
    },
    transpilers: [],
    testFramework: 'mocha',
    coverageAnalysis: 'perTest',
    maxConcurrentRunners: 2
  });
};
