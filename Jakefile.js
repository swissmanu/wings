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
	require ("jake-utils");
	
	mochaTests({
		directory: "test/",
		files    : /.*\.js/,
		coverage : true,
		reporter : 'progress'
	});
});

desc('Optimize Javascript Code');
task('dist', function() {
	var commands = [
		'r.js -o name=widgetery out=./dist/widgetery.js baseUrl=./lib'
	];
	
	jake.exec(commands, function() {
		complete();
	}, { stdout: true });
});