require('jake-utils');

desc('Create Documentation using NaturalDocs');
task('docs', function() {
	var commands = [
		'NaturalDocs -i ./lib -o HTML ./docs -p ./.naturaldocs'
	];
	
	jake.exec(commands, function() {
		complete();
	}, {stdout: true});
});

desc('Run all tests');
task('test', function() {
	cmd('node', ['test/runner.js']);
});

desc('Run all tests and create a code coverage report under test/coverage.html');
task('test-coverage', function() {
	cmd('jscoverage', ['--no-highlight','lib','test/coverage-tmp']);
	cmd('node', ['test/runner.js','--coverage'], 'test/coverage.html');
});

desc('Build Wings Distributable');
task('dist', function() {
	var commands = [ 'node_modules/requirejs/bin/r.js -o build.js' ];
	
	jake.exec(commands, function() {
		complete();
	}, { stdout: true });
});