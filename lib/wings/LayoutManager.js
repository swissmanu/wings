/** Class: LayoutManager
 * 
 *
 * See also:
 *     - <DefaultStrategy>
 *     - <DragAndDropStrategy>
 */
define(function(require, exports, module) {
	
	/** Constructor: LayoutManager()
	 * Creates a new instance of <LayoutManager>
	 */
	var LayoutManager = function LayoutManager() {
		var _self = this;
		
		/** Function: layoutWidgets(parent, widgets)
		 * Takes an array of <Widget>s and positions them inside parents bounds.
		 *
		 * Parameters:
		 *     (Widget) parent
		 *     (Array) widgtes - An Array containing parents children
		 */
		_self.layoutWidgets = function layoutWidgets(parent, widgets) {
			throw new Error('Implement layoutWidgets!');
		}
		
	};
	
	return LayoutManager;
});