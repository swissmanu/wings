/** Class: Widget
 * A <Widget> represents an interactive, graphical user interface component.
 * Subclass from this class to create your own, specialized <Widget>s like
 * Buttons, textfields etc.
 *
 * When subclassing, ensure you overwrite the <Widget.draw(ctx)> method,
 * otherwise an error gets thrown.
 *
 * Since <Widget> is a subclass of <Container>, you can place other <Widget>s
 * inside a specific <Widget> instance.
 *
 * Emitted events:
 *     drawRequest - Triggered when the <Widget> was updated and wants to be
 *                   drawn. Path contains the <Container> hierarchy which points
 *                   to the <Widget>. 0 = Parent of <Widget>,
 *                   1 = Parent of parent
 *                   Parameters: [(<Widget>) widget, (Array) path]
 *     moved - Triggered when the widget changed its location.
 *             Parameters: [(Object) oldLocation, (Object) newLocation, 
 *             (Widget) widget]
 *     resized - Triggered when the widget changes its size.
 *               Parameters: [(Object) oldSize, (Object) newSize, (Widget)
 *               widget]
 *     stateChanged - Triggered when the <Widget> was enabled or disabled.
 *                    Parameters: [(boolean) oldState, (boolean) newState, 
 *                    (Widget) widget]
 *
 * Inherits from:
 *     - <Container>
 */
define(function(require, exports, module) {
	
	var Container = require('./Container');
	
	
	/** Constructor: Widget()
	 * Creates a new instance of <Widget>
	 */
	var Widget = function Widget() {
		var _self = this;
		var _id = generateId();
		var _top = 0;
		var _left = 0;
		var _width = 0;
		var _height = 0;
		var _state = true;
		
		Container.call(this);
		
		/** Event Handler: moved, resized, stateChanged
		 * If the <Widget> changes is position or size, a drawRequest event is
		 * emitted by calling <Widget.redraw()>.
		 */
		_self.on(['moved','resized','stateChanged'],
			function(oldValue, newValue, widget) {
				_self.redraw();
		});
		
		
		
		/** Function: redraw()
		 * Trigger a fresh drawing if this <Widget>.
		 *
		 * Emitted events:
		 *     drawRequest - Triggered when the <Widget> was updated and wants to be
		 *                   drawn. Path contains the <Container> hierarchy which points
		 *                   to the <Widget>. 0 = Parent of <Widget>,
		 *                   1 = Parent of parent
		 *                   Parameters: [(<Widget>) widget, (Array) path]
		 * 
		 * See also:
		 *     - <Container.handleDrawRequest(widget,path>)
		 */
		_self.redraw = function redraw() {
			_self.emit('drawRequest', _self);
		};
		
		/** Function: drawWidget(ctx)
		 * Render the actual <Widget>. Overwrite this method in your <Widget>
		 * sublcasses to draw the UI.
		 *
		 * Don't call this method explicitly from outside. Better use
		 * <Widget.redraw()> if you want to force the redrawing of a
		 * <Widget>.
		 *
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw in
		 */
		_self.drawWidget = function drawWidget(ctx) { };
		
		/** Function: draw(ctx)
		 * Draws this <Widget> via <Widget.drawWidget(ctx)> and uses
		 * <Widget.drawChildWidgets(ctx)> to draw all child <Widgets>
		 * automatically.
		 *
		 * Don't call this method explicitly from outside. Better use
		 * <Widget.redraw()> if you want to force redrawing of a <Widget>.
		 *
		 * Parameters:
		 *     (Object) ctx - Grapical context to draw in
		 */
		_self.draw = function draw(ctx) {
			_self.drawWidget(ctx);
			drawChildWidgets(ctx);
		};
		
		/** Function: getId()
		 * Returns the ID of this <Widget>.
		 *
		 * Returns:
		 *     (String)
		 */
		_self.getId = function getId() {
			return _id;
		}
		
		/** Function: getTop()
		 * Returns the vertical position of this <Widget>.
		 *
		 * Returns:
		 *     (int)
		 */
		_self.getTop = function getTop() {
			return _top;
		};
		
		/** Function: getLeft()
		 * Returns the horizontal position of this <Widget>.
		 *
		 * Returns:
		 *     (int)
		 */
		_self.getLeft = function getLeft() {
			return _left;
		};
		
		/** Function: getWidth()
		 * Returns the width of this <Widget>.
		 *
		 * Returns:
		 *     (int)
		 */
		_self.getWidth = function getWidth() {
			return _width;
		};

		/** Function: getHeight()
		 * Returns the height of this <Widget>.
		 *
		 * Returns:
		 *     (int)
		 */
		_self.getHeight = function getHeight() {
			return _height;
		};
		
		/** Function: getPosition()
		 * Returns a literal with the vertical and horizontal position of this
		 * <Widget>
		 *
		 * Returns:
		 *     (Object) { top: ?, left: ? }
		 */
		_self.getPosition = function getPosition() {
			return { top: _top, left: _left };
		};
		
		/** Function: getSize()
		 * Returns a literal with the width and height of this <Widget>.
		 *
		 * Returns:
		 *     (Object) { width: ?, height: ? }
		 */
		_self.getSize = function getSize() {
			return { width: _width, height: _height };
		};
		
		/** Function: getBoundingBox()
		 * Returns a literal with all position and size related information of
		 * this <Widget>.
		 *
		 * Returns:
		 *     (Object) { top: ?, left: ?, width: ?, height: ? }
		 */
		_self.getBoundingBox = function getBoundingBox() {
			return { top: _top, left: _left, width: _width, height: _height };
		};
		
		/** Function: setTop(newTop)
		 * Moves the <Widget> vertically to the passed location.
		 *
		 * Emitted events:
		 *     moved - Triggered when the widget changed its location.
		 *             Parameters: [(Object) oldLocation, (Object) newLocation, 
		 *             (Widget) widget]
		 *
		 * Parameters:
		 *     (int) newTop - new vertical position
		 */
		_self.setTop = function setTop(newTop) {
			var oldPosition = _self.getPosition();
			_top = newTop;
			var newPosition = _self.getPosition();
			
			_self.emit('moved', oldPosition, newPosition, _self);
		};
		
		/** Function: setLeft(newLeft)
		 * Moves the <Widget> horizontally to the passed location.
		 *
		 * Emitted events:
		 *     moved - Triggered when the widget changed its location.
		 *             Parameters: [(Object) oldLocation, (Object) newLocation, 
		 *             (Widget) widget]
		 *
		 * Parameters:
		 *     (int) newLeft - new vertical position
		 */
		_self.setLeft = function setLeft(newLeft) {
			var oldPosition = _self.getPosition();
			_left = newLeft;
			var newPosition = _self.getPosition();
			
			_self.emit('moved', oldPosition, newPosition, _self);
		};
		
		/** Function: setWidth(newWidth)
		 * Sets the width of <Widget> to the passed size.
		 *
		 * Emitted events:
		 *     resized - Triggered when the widget changes its size.
		 *               Parameters: [(Object) oldSize, (Object) newSize,
		 *               (Widget) widget]
		 *
		 * Parameters:
		 *     (int) newWidth - new width
		 */
		_self.setWidth = function setWidth(newWidth) {
			var oldSize = _self.getSize();
			_width = newWidth;
			var newSize = _self.getSize();
			
			_self.emit('resized', oldSize, newSize, _self);
		};
		
		/** Function: setHeight(newHeight)
		 * Sets the height of <Widget> to the passed size.
		 *
		 * Emitted events:
		 *     resized - Triggered when the widget changes its size.
		 *               Parameters: [(Object) oldSize, (Object) newSize,
		 *               (Widget) widget]
		 *
		 * Parameters:
		 *     (int) newHeight - new height
		 */
		_self.setHeight = function setHeight(newHeight) {
			var oldSize = _self.getSize();
			_height = newHeight;
			var newSize = _self.getSize();
			
			_self.emit('resized', oldSize, newSize, _self);
		};
		
		/** Function: setPosition(left, top)
		 * Moves the <Widget> to the specified position.
		 *
		 * Emitted events:
		 *     moved - Triggered when the widget changed its location.
		 *             Parameters: [(Object) oldLocation, (Object) newLocation, 
		 *             (Widget) widget]
		 *
		 * Parameters:
		 *     (int) left - horizontal position
		 *     (int) top - vertical position
		 */
		_self.setPosition = function setPosition(left, top) {
			var oldPosition = _self.getPosition();
			_left = left;
			_top = top;
			var newPosition = _self.getPosition();
			
			_self.emit('moved', oldPosition, newPosition, _self);
		};
		
		/** Function: setSize(width, height)
		 * Resizes the <Widget> to the specified size.
		 *
		 * Emitted events:
		 *     resized - Triggered when the widget changes its size.
		 *               Parameters: [(Object) oldSize, (Object) newSize,
		 *               (Widget) widget]
		 *
		 * Parameters:
		 *     (int) width - width
		 *     (int) height - height
		 */
		_self.setSize = function setSize(width, height) {
			var oldSize = _self.getSize();
			_width = width;
			_height = height;
			var newSize = _self.getSize();
			
			_self.emit('resized', oldSize, newSize, _self);
		};
		
		/** Function: getState()
		 * Returns the current state of this <Widget>. "true" means, it is
		 * enabled, "false" says it is disabled.
		 *
		 * Returns:
		 *     (boolean) - true = enabled, false = disabled
		 */
		_self.getState = function getState() {
			return _state
		};
		
		/** Function: setState(state)
		 * Sets this <Widget> state on enabled or disabled.
		 *
		 *
		 * Parameters:
		 *     (boolean) newState - true = enabled, false = disabled
		 */
		_self.setState = function setState(newState) {
			var oldState = _state;
			_state = newState;
			
			if(oldState !== newState) {
				_self.emit('stateChanged', oldState, newState, _self);
			}
		};
		
		
		/** PrivateFunction: drawChildWidgets(ctx)
		 * Draws all child <Widget>s of this <Container> to the given graphic
		 * context.
		 *
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw into
		 */
		function drawChildWidgets(ctx) {
			for(var i = 0, l = _self.getWidgetCount(); i < l; i++) {
				drawWidgetToContext(ctx, _self.getWidget(i));
			}
		};
		
		/** PrivateFunction: drawWidgetToContext(widget)
		 * Draws a <Widget> to the given context.
		 * Before the widget gets drawn, the coordinate system gets translated
		 * to the widgets position and the rectangular area of the widgets
		 * bounds gets cleared. Further a clipping area with the bounds is
		 * created.
		 *
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw widget into
		 *     (Widget) widget - <Widget> which should be drawn
		 */
		function drawWidgetToContext(ctx, widget) {
			var bounds = widget.getBoundingBox();
			
			// Problem: if a widget is beneath another, rendering can be
			// invalid regarding specific update situations.
			
			ctx.save();
			ctx.translate(bounds.left, bounds.top);
			ctx.beginPath();
			ctx.rect(0, 0, bounds.width, bounds.height);
			ctx.clip();
			ctx.clearRect(0, 0, bounds.width, bounds.height);
			widget.draw(ctx);
			ctx.restore();
		};
		
		/** PrivateFunction: generateId()
		 * Generates a, hopefully, unique ID which can be used to identify
		 * a <Widget> instance.
		 *
		 * Returns:
		 *     (String)
		 */
		function generateId() {
			var currentTime = new Date().getTime();
			var random1 = Math.ceil(1000*Math.random());
			var random2 = Math.ceil(1000*Math.random());
			
			return (random1 + '-' + currentTime + '-' + random2);
		}
		
	};
	
	Widget.prototype = Object.create(Container.prototype);
	Widget.prototype.constructor = Widget;
	
	return Widget;
});