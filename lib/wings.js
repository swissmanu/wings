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
		,Panel: require('wings/Panel')
		,Widget: require('wings/Widget')
		,layout: {
			LayoutManager: require('wings/layout/LayoutManager')
			,BoxLayout: require('wings/layout/BoxLayout')
		}
		,mixin: {
			Stylable: require('wings/mixin/Stylable')
		}
	};

	return wings;
});