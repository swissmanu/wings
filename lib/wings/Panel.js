/** Class: Panel
 *
 * Inherits from:
 *     - <Widget>
 *
 * Mixes with:
 *     - <Stylable>
 */
define(function(require, exports, module) {
	
	var Widget = require('./Widget');
	var Stylable = require('./mixin/Stylable');
	
	/** Constructor: Panel(text)
	 * Creates a new instance of <Panel>.
	 *
	 * Parameters:
	 *     (String) text - Text to show on the Panel (optional)
	 */
	var Panel = function Panel(text) {
		var _self = this;
		var _layoutManager;
		
		Widget.call(this);	
		Stylable.call(this);
		
		/** Event Handler: widget:backgroundcolorchanged
		 * If the <Widget> changes is position or size, a drawRequest event is
		 * emitted by calling <Widget.redraw()>.
		 */
		_self.on(['widget:backgroundcolorchanged','widget:bordercolorchanged'],
			function(event) {
				event.stopBubbling();
				_self.redraw();
		});
		
		_self.on(['widget:layoutmanagerchanged','container:widgetadded','container:widgetremoved'], function(event) {
			if(event.name === 'widget:layoutmanagerchanged') event.stopBubbling();
			if(_layoutManager) _layoutManager.layoutWidgets(_self, _self.getWidgets());
		});
		
		
		/** Function: drawWidget(ctx)
		 *
		 * Overrides:
		 *     - <Widget.draw(ctx)>
		 * 
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw instance
		 */
		_self.drawWidget = function drawWidget(ctx) {
			var width = _self.getWidth();
			var height = _self.getHeight();
			
			ctx.save();
			ctx.fillStyle = _self.getBackgroundColor();
			ctx.fillRect(0,0,width,height);
			ctx.strokeStyle = _self.getBorderColor();
			ctx.strokeRect(0,0,width,height);
			ctx.restore();
		};
		
		_self.getLayoutManager = function getLayoutManager() {
			return _layoutManager;
		};
		
		_self.setLayoutManager = function setLayoutManager(newLayoutManager) {
			var oldLayoutManager = _layoutManager;
			_layoutManager = newLayoutManager;
			
			if(oldLayoutManager !== newLayoutManager) {
				_self.dispatchEvent('widget:layoutmanagerchanged', {oldLayoutManager: oldLayoutManager, newLayoutManager: newLayoutManager, widget:_self});
			}
		}
		
		
	};
	
	Panel.prototype = Object.create(Widget.prototype);
	Panel.prototype.constructor = Panel;
	
	return Panel;
});