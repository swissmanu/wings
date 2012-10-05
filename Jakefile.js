desc('Create Documentation using NaturalDocs');
task('docs', function() {
	var commands = [
		'NaturalDocs -i ./lib -o HTML ./docs -p ./.naturaldocs'
	];
	
	jake.exec(commands, function() {
		complete();
	}, {stdout: true});
});

desc('Run Tests');
task('test', function() {
	require('jake-utils');
	cmd('node', ['test/runner.js']);
});

desc('Build Widgetery Distributable');
task('dist', function() {
	var commands = [ 'node_modules/requirejs/bin/r.js -o build.js' ];
	
	jake.exec(commands, function() {
		complete();
	}, { stdout: true });
});