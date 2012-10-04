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
		
		/** Event Handler: native_mouseMoved
		 * Handles the "native" "mousemove" event.
		 */
		_self.on('native_mouseMove', function(position) {
			if(_self.getState()) {
				
				/** Event: mouseMoved
				 * Signals that the cursor was moved over a <MouseWidget>.
				 *
				 * Parameters:
				 *     (Object) position - { left: ?, top: ? }
				 *     (MouseWidget) source
				 */
				_self.emit('mouseMoved', position, _self);
			}
		});
		
		/** Event Handler: native_mouseEntered
		 * Handles the "native" mouse entered event and translates it into a
		 * <MouseWidget> specific event.
		 */
		_self.on('native_mouseEntered', function() {
			setMouseOver(true);
		});
		
		/** Event Handler: native_mouseExited
		 * Handles the "native" mouse exited event and translates it into a
		 * <MouseWidget> specific event.
		 */
		_self.on('native_mouseExited', function() {
			setMouseOver(false);
		});
		
		/** Event Handler: native_clicked
		 * Handles the "native" clicked event and triggers the <MouseWidget>
		 * specific event "clicked", if the <MouseWidget> is enabled.
		 */
		_self.on('native_clicked', function(button, position) {
			if(_self.getState()) {
				
				/** Event: clicked
				 * Occurs if the user clicked on a <MouseWidget> on the given
				 * position with the given button.
				 *
				 * Parameters:
				 *     (int) button - Mouse button number
				 *     (Object) position - { left: ?, top: ? }
				 *     (MouseWidget) source
				 */
				_self.emit('clicked', button, position, _self);
			}
		});
		
		/** Event Handler: native_mouseDown
		 * Handles the "native" mouseDown event which is received when a mouse
		 * button was pressed.
		 * A <MouseWidget> specific event "mouseButtonPressed" event is
		 * triggered, if the <MouseWidget> is enabled.
		 */
		_self.on('native_mouseDown', function(button, position) {
			if(_self.getState()) {
				
				/** Event: mouseButtonPressed
				 * Occurs if the user pressed the given mouse button on the
				 * given position on a <MouseWidget>.
				 *
				 * Parameters:
				 *     (int) button - Mouse button number
				 *     (Object) position - { left: ?, top: ? }
				 *     (MouseWidget) source
				 */
				_self.emit('mouseButtonPressed', button, position, _self);
			}
		});
		
		/** Event Handler: native_mouseUp
		 * Handles the "native" mouseUp event which is received when a mouse
		 * button was released.
		 * A <MouseWidget> specific event "mouseButtonReleased" event is
		 * triggered, if the <MouseWidget> is enabled.
		 */
		_self.on('native_mouseUp', function(button, position) {
			if(_self.getState()) {
				/** Event: mouseButtonReleased
				 * Occurs if the user released the given mouse button on the
				 * given position on a <MouseWidget>.
				 *
				 * Parameters:
				 *     (int) button - Mouse button number
				 *     (Object) position - { left: ?, top: ? }
				 *     (MouseWidget) source
				 */
				_self.emit('mouseButtonReleased', button, position, _self);
			}
		});	
		
		/** Event Handler: native_dragStart
		 * Handles the native dragStart event. If this <MouseWidget> is
		 * draggable, a "dragRequest" event is emitted. The implementing
		 * MouseWidget/subclass can react on this event and calls one of the
		 * two callbacks to start or cancel the drag and drop procedure.
		 */
		_self.on('native_dragStart', function(position, acceptCallback, cancelCallback) {
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
				_self.emit('dragRequest', acceptCallback, cancelCallback);
			} else {
				cancelCallback();
			}
		});
		
		_self.on('native_mouseDrag', function(position) {
			//console.log('MouseWidget::native_drage', position, _self);
			_self.emit('dragged',position,_self);
		});
		
		_self.on('native_dragStop', function(position) {
			//console.log('MouseWidget::native_dragStop', position, _self);
		})
		
		
		
		
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
		 * Sets the mouse over state of this <MouseWidget> and triggers a 
		 * "mouseEntered" or "mouseExited" event if necessary.
		 *
		 * Parameters:
		 *     (boolean) newMouseOver - is the cursor over the widget?
		 */
		function setMouseOver(newMouseOver) {
			var oldMouseOver = _mouseOver;
			
			if(oldMouseOver !== newMouseOver) {
				_mouseOver = newMouseOver;
				
				/** Event: mouseEntered
				 * Signals that the user has just entered the boundaries of
				 * a <MouseWidget> with the cursor.
				 *
				 * Parameters:
				 *     (MouseWidget) source
				 */
				/** Event: mouseExited
				 * Signals that the user has just left the boundaries of
				 * a <MouseWidget> with the cursor.
				 *
				 * Parameters:
				 *     (MouseWidget) source
				 */
				var event = (_mouseOver) ? 'mouseEntered' : 'mouseExited';
				_self.emit(event, _self);
			}
		}
	};
	
	MouseWidget.prototype = Object.create(Widget.prototype);
	MouseWidget.prototype.constructor = MouseWidget;
	
	
	return MouseWidget;
});