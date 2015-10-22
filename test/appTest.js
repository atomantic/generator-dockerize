describe("Testing dockerize with app issue fixed", function(){
  var yeoman = require('yeoman-generator'); // a reference to the generator module
	var path = require('path'); // reference to the built in path module
	var assert; // will become the Yeoman assert object
	var mockGen; // will become the mock Yeoman generator for the tests

  before(function(done){
		assert = yeoman.assert; // create the yeoman assert object
		mockGen = yeoman.test; // create the yeoman test generator

		// run the mock generator with some options
    mockGen.run(dockerize)
		.inDir(path.join(__dirname, './tmp'))
		.on('end', done);
	});
  it('should generate a root directory', function(){
    // since we can not assert if a directory exists,
    // we use the file() method and provide a path to the directory itself

    assert.file('repo-gen-test/');
  });

});
