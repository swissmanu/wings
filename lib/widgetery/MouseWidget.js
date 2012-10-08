/** Class: MouseWidget
 * <MouseWidget> is a specialization of a simple <Widget>. In addition, the
 * <MouseWidget> reacts on and handles mouse inputs.
 *
 * <MouseWidget> is not usable directly. It is a superclass for <Widget>s
 * which are reactive on mouse input.
 *
 * Inherits from:
 *     - <Widget>
 */
define(function(require, exports, module) {
	
	var Widget = require('./Widget');
	
	
	/** Constructor: MouseWidget()
	 * Creates a new instance of <MouseWidget>
	 */
	var MouseWidget = function MouseWidget() {
		var _self = this;
		var _mouseOver = false;
		var _draggable = false;
		
		Widget.call(this);
		
		
		/** Event Handler: mouse:enter
		 * As soon as the user enters this <Widget> with the cursor, the
		 * mouse over property gets set to true.
		 *
		 * This event handler stops event bubbling!
		 *
		 * Paremters:
		 *    (Object) event - Event information
		 */
		_self.on('mouse:enter', function(event) {
			setMouseOver(true);
			event.stopBubbling();
		});
		
		/** Event Handler: mouse:exit
		 * As soon as the user leaves this <Widget> with the cursor, the
		 * mouse over property gets set to false.
		 *
		 * This event handler stops event bubbling!
		 *
		 * Paremters:
		 *    (Object) event - Event information
		 */
		_self.on('mouse:exit', function(event) {
			setMouseOver(false);
			event.stopBubbling();
		});
		
		
		/** Event Handler: mouse:dragstart
		 * Handles the native dragStart event. If this <MouseWidget> is
		 * draggable, a "dragRequest" event is emitted. The implementing
		 * MouseWidget/subclass can react on this event and calls one of the
		 * two callbacks to start or cancel the drag and drop procedure.
		 */
		_self.on('mouse:dragstart', function(event) {
			if(_draggable) {
				/** Event: dragRequest
				 * Signals that the user wants to initiate a drag and drop
				 * process. The receiving <MouseWidget> can use one of the
				 * callbacks to accept or cancel the request.
				 *
				 * Parameters:
				 *     (Function) acceptCallback - Callback to call, if a Widget wants
				 *                                 to start a drag and drop process
				 *     (Fucntion) cancelCallback -  Callback to not start a drag and drop
				 *                                  or cancel a drag and drop process
				 */
				var draqRequestEvent = _self.createDispatchableEvent('widget:dragrequest',{acceptCallback: event.acceptCallback,cancelCallback: event.cancelCallback});
				_self.emit('dispatch', dragRequestEvent);
			} else {
				event.cancelCallback();
			}
		});
		
		
		
		/** Function: isMouseOver()
		 * Returns true, if the cursor is currently located over this
		 * <MouseWidget> or false, if not.
		 *
		 * Returns:
		 *     (boolean) - true = cursor over this <MouseWidget>, otherwise
		 *                 not
		 */
		_self.isMouseOver = function isMouseOver() {
			return _mouseOver;
		}
		
		/** Function: setDraggable(newDraggable)
		 * Enables or disabled the ability do drag this <MouseWidget>.
		 *
		 * Parameters:
		 *     (boolean) newDraggable - true to enable, false to disable
		 */
		_self.setDraggable = function setDraggable(newDraggable) {
			_draggable = newDraggable;
		}
		
		/** Function: isDraggable()
		 * Returns if this <MouseWidget> is able to be dragged with the mouse.
		 *
		 * Returns:
		 *     (boolean)
		 */
		_self.isDraggable = function isDraggable() {
			return _draggable;
		}
		
		/** PrivateFunction: setMouseOver(newMouseOver)
		 * Sets the mouse over state of this <MouseWidget>.
		 *
		 * Parameters:
		 *     (boolean) newMouseOver - is the cursor over the widget?
		 */
		function setMouseOver(newMouseOver) {
			var oldMouseOver = _mouseOver;
			
			if(oldMouseOver !== newMouseOver) {
				_mouseOver = newMouseOver;
			}
		}
	};
	
	MouseWidget.prototype = Object.create(Widget.prototype);
	MouseWidget.prototype.constructor = MouseWidget;
	
	
	return MouseWidget;
});