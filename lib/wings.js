define(function(require) {
	
	/** Module: wings
	 *
	 */
	var wings = {
		Button: require('wings/Button')
		,CanvasWrapper: require('wings/CanvasWrapper')
		,Container: require('wings/Container')
		,DefaultStrategy: require('wings/DefaultStrategy')
		,DragAndDropStrategy: require('wings/DragAndDropStrategy')
		,Emitter: require('wings/Emitter')
		,Label: require('wings/Label')
		,MouseStrategy: require('wings/MouseStrategy')
		,Rectangle: require('wings/Rectangle')
		,Widget: require('wings/Widget')
	};

	return wings;
});