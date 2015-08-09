var should = require('should'),
  path = require('path'),
  BrowserifyBridge = require('../bin/index'),
  glob = require('glob');

var loadTestHarness = function(path, done) {
  var that = this;
  glob(path + "/**/*.js", function(err, files) {
    if (err)
      return done(err);
    return done(null, files);
  });
};

describe('integration tests', function() {

  describe('simple', function() {

    it('Sources only', function(done) {
      loadTestHarness(path.join(__dirname, "harness", "simple"),
        function(err, files) {
          if (err)
            return done(err);

          var instance = new BrowserifyBridge({
            sources: files
          });

          var resp = instance.generate();

          // TODO: do some assertions

          return done();
        });
    });

    it('Sources relative with Package', function(done) {
      var simpleDir = path.join(__dirname, "harness", "simple");
      loadTestHarness(simpleDir,
        function(err, files) {
          if (err)
            return done(err);

          var instance = new BrowserifyBridge({
            sources: files,
            package: path.join(simpleDir, "package.json")
          });

          var resp = instance.generate();

          // TODO: do assertions

          return done();
        });
    });
  });
});
