desc('Creates code documentation with NaturalDocs');
task('docs', function() {
	var commands = [
		'NaturalDocs -i ./lib -o HTML ./docs -p ./.naturaldocs'
	];
	
	jake.exec(commands, function() {
		complete();
	}, {stdout: true});
});

desc('Runs mocha.js tests');
task('test', function() {
	require ('jake-utils');
	cmd('node', ['test/runner.js']);
});

desc('Optimize Javascript Code');
task('dist', function() {
	var commands = [ 'vendor/r.js -o build.js' ];
	
	jake.exec(commands, function() {
		complete();
	}, { stdout: true });
});