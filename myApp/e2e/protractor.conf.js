// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  SELENIUM_PROMISE_MANAGER: false, //Turn off control_flow and use async/await
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    browser.manage().window().maximize();
    
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });

    jasmine.getEnv().addReporter(new SpecReporter({
      // Defaults: https://github.com/bcaudan/jasmine-spec-reporter#default-options
      // Configuration: https://github.com/bcaudan/jasmine-spec-reporter/blob/master/src/configuration.ts
      suite: {
        displayNumber: true,    // display each suite number (hierarchical)
      },
      spec: {
        displayPending: true,   // display each pending spec
        displayDuration: true,  // display each spec duration
        displayStacktrace: true 
      },
      summary: {
        displaySuccesses: false, // display summary of all successes after execution
        displayFailed: false,    // display summary of all failures after execution
        displayPending: false,   // display summary of all pending specs after execution
      },
    }));
  }
};