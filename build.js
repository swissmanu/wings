// see a complete list of options here:
// https://github.com/jrburke/r.js/blob/master/build/example.build.js
({
	out: "./dist/widgetery.js"
	
	,baseUrl: "./lib"
	,include: [
		"widgetery/Button"
		,"widgetery/CanvasWrapper"
		,"widgetery/Container"
		,"widgetery/DefaultStrategy"
		,"widgetery/DragAndDropStrategy"
		,"widgetery/Label"
		,"widgetery/MouseStrategy"
		,"widgetery/MouseWidget"
		,"widgetery/Rectangle"
		,"widgetery/Widget"
		,"helpers/Emitter"
	]

	,name: "../vendor/almond"
	,optimize: "uglify"

})