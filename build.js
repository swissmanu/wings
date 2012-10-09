// see a complete list of options here:
// https://github.com/jrburke/r.js/blob/master/build/example.build.js
({
	out: "./dist/wings.js"
	
	,baseUrl: "./lib"
	,include: [
		"wings/Button"
		,"wings/CanvasWrapper"
		,"wings/Container"
		,"wings/DefaultStrategy"
		,"wings/DragAndDropStrategy"
		,"wings/Label"
		,"wings/MouseStrategy"
		,"wings/MouseWidget"
		,"wings/Rectangle"
		,"wings/Widget"
		,"helpers/Emitter"
	]

	,name: "../node_modules/almond/almond"
	,optimize: "uglify"

})