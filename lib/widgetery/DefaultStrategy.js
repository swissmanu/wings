/** Class: DefaultStrategy
 * The "daily use" <MouseStrategy>. It translates the native mouse events to
 * stuff like "mouseMoved", "clicked" etc.    
 * 
 * Sequence Diagram:
 *     - http://www.websequencediagrams.com/?lz=dGl0bGUgTW91c2VTdHJhdGVneQoKCmFsdCBEZWZhdWx0IEJlaGF2aW91cgoKClVzZXItPkNhbnZhc1dyYXBwZXI6IG1vdXNlZG93bgoADA0tPgA7BwBQCAAjB0J1dHRvblByZXNzZWQoKQoAFw8AJBNTYXZlIGNvb3JkaW5hdGVzAIEaBgCBLwUgAEgGIABIBwCBBhxtb3ZlAHwmTW92AHMnQ2hlY2sgVGhyZXNob2xkCgpvcHQABQogcmVhY2hlZACBURIrAIIKEXN0YXJ0RHJhZwCBfhQtAIJjD1VzZSBEcmFnQW5kRHJvcACDLwplbmQKCmVscwCDSwcAghYIUmVsZWFzZWQAgyUbdXAAgxIsAEkIKCkAaAtEcmFnIEFuZCBEcm9wAIJZMQCBPRI6AIMADQCFDwVTdG9wAFkPAIEmLQBSEwCBQBcAgkwTLT4rACwVc3RvcACDMggAIhQAgykVAIYNDgCDMwYAgzsF&s=vs2010
 *
 * Inherits from:
 *     - <MouseStrategy>
 */
define(function(require, exports, module) {
	
	var MouseStrategy = require('./MouseStrategy');
	
	
	/** Constructor: DefaultStrategy()
	 * Creates a new instance of <DefaultStrategy>
	 */
	var DefaultStrategy = function DefaultStrategy(canvasWrapper) {
		var _self = this;
		var _mouseOverWidgets = [];
		
		var _dragndropData = {
			mouseButtonPressed : false
			,mouseButtonPressedStartPosition : { left: 0, top: 0}
			,startThreshold : 2
			,started : false
		};
		
		
		
		
		MouseStrategy.call(this, canvasWrapper);
		
		
		/** Function: mouseMoved(absolutePosition)
		 * If the mouse moves over the Canvas, this handler looks for
		 * <MouseWidget>s below the current cursor position and translates
		 * the native MouseEvent into a proper, Widgetery specific event and
		 * sends it to the regarding <MouseWidget>s.
		 *
		 * Emitted events to MouseWidget:
		 *     native_mouseEntered - Signaling that the cursor entered the
		 *                           boundary of the <MouseWidget>.
		 *     native_mouseExited - Signaling that the cursor leaved the
		 *                          boundary of the <MouseWidget>
		 *     native_mouseMove - Signaling that the cursor moved.
		 *                        Parameters: [{left: ?, top: ?}]
		 *
		 * Emitted events to CanvasWrapper:
		 *     mouseMoved - Triggered when the mouse was moved somewhere over
		 *                  this <CanvasWrapper>.
		 *                  Parameters: [{ left: ?, top: ?} position,
		 *                  (CanvasWrapper) source]
		 */
		_self.mouseMoved = function mouseMoved(absolutePosition) {
			var canvasWrapper = _self.getCanvasWrapper();
			
			/* DragAndDrop: */
			if(_dragndropData.mouseButtonPressed && !_dragndropData.started) {
				var start = _dragndropData.mouseButtonPressedStartPosition;
				var distanceX = Math.abs(absolutePosition.left) - Math.abs(start.left);
				var distanceY = Math.abs(absolutePosition.top) - Math.abs(start.top);
				var distance = Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY,2),2);
			
				if(distance >= _dragndropData.startThreshold) {
					_dragndropData.started = true;
					_self.emit('startDrag', absolutePosition);
				}
			}
			
			
			/* Pass native_mouseMove, native_mouseEntered, native_mouseExited: */
			canvasWrapper.searchMouseWidgetsOnPosition(absolutePosition, 
				function found(widget) {
					if(_mouseOverWidgets.indexOf(widget) === -1) {
						_mouseOverWidgets.push(widget);
						widget.emit('native_mouseEntered');
					}
					widget.emit('native_mouseMove', absolutePosition);
					
				}, function notFound(widget) {
					var index = _mouseOverWidgets.indexOf(widget);
					if(index > -1) {
						_mouseOverWidgets.splice(index,1);
						widget.emit('native_mouseExited');
					}
					widget.emit('native_mouseMove', absolutePosition);
				}
			);
			
			canvasWrapper.emit('mouseMove', absolutePosition, canvasWrapper);
		};
		
		/** Function: mouseButtonPressed
		 * If a "mouseDown" on the canvas was detected, a search for
		 * <MouseWidget>s beneath the cursor is started.
		 * A "native_mouseDown" event is emitted to every <MouseWidget> found.
		 *
		 * Emitted events to MouseWidget:
		 *     native_mouseDown - Signaling that a mouse button was pressed on
		 *                        a <MouseWidget>.
		 *                        Parameters: [(int) button, {left: ?, top: ?}]
		 *
		 * Emitted events to CanvasWrapper:
		 *     mouseButtonPressed - Triggered when a mouse button was pressed
		 *                          while the cursor is pointing on this
		 *                          <CanvasWrapper>
		 *                          Parameters: [(int) button, {left: ?, top: ?},
		 *                          (CanvasWrapper) source]
		 */
		_self.mouseButtonPressed = function mouseButtonPressed(button, absolutePosition) {
			var canvasWrapper = _self.getCanvasWrapper();
			
			/* Drag And Drop: */
			_dragndropData.mouseButtonPressed = true;
			_dragndropData.mouseButtonPressedStartPosition = absolutePosition;
			
			/* Pass native_mouseDown event: */
			canvasWrapper.searchMouseWidgetsOnPosition(absolutePosition,
				function found(widget) {
					widget.emit('native_mouseDown', button, absolutePosition);
				});
			
			canvasWrapper.emit('mouseButtonPressed', button, absolutePosition, canvasWrapper);
		};
		
		/** Function: mouseButtonReleased(button, absolutePosition)
		 * If a "mouseUp" on the canvas was detected, a search for
		 * <MouseWidget>s beneath the cursor is started.
		 * A "native_mouseUp event is emitted to every <MouseWidget> found.
		 *
		 * Emitted events to MouseWidget:
		 *     native_mouseUp - Signaling that a mouse button was pressed on
		 *                      a <MouseWidget>.
		 *                      Parameters: [(int) button, {left: ?, top: ?}]
		 *
		 * Emitted events to CanvasWrapper:
		 *     mouseButtonReleased - Triggered when a mouse button was released
		 *                           while the cursor is pointing on this
		 *                           <CanvasWrapper>
		 *                           Parameters: [(int) button, {left: ?, top: ?},
		 *                           (CanvasWrapper) source]
		 */
		_self.mouseButtonReleased = function mouseButtonReleased(button, absolutePosition) {
			var canvasWrapper = _self.getCanvasWrapper();
			
			/* DragAndDrop: */
			_dragndropData.mouseButtonPressed = false;
			
			/* Pass native_mouseUp event: */
			canvasWrapper.searchMouseWidgetsOnPosition(absolutePosition,
				function found(widget) {
					widget.emit('native_mouseUp', button, absolutePosition);
				});
				
			canvasWrapper.emit('mouseButtonReleased', button, absolutePosition, canvasWrapper);
		};
		
		/** Function: mouseClicked(button, absolutePosition)
		 * If the mouse clicks inside the Canvas, this handler looks for
		 * <MouseWidget>s below the current cursor position and translates
		 * the native MouseEvent into a proper, Widgetery specific event and
		 * sends it to the regarding <MouseWidget>s.
		 *
		 * Emitted events to MouseWidget:
		 *     native_clicked - Signaling that the mouse has clicked on a
		 *                      <MouseWidget>
		 *                      Parameters: [(int) button, {left: ?, top: ?}]
		 */
		_self.mouseButtonClicked = function mouseButtonClicked(button, absolutePosition) {
			var canvasWrapper = _self.getCanvasWrapper();
			
			canvasWrapper.searchMouseWidgetsOnPosition(absolutePosition,
				function found(widget) {
					widget.emit('native_clicked', button, absolutePosition);
				});
		};
		
		
		
		
		
		
		
		
		
		
		
		
		/** Function: startDrag(source)
		 * Starts the handling of a drag and drop action.
		 *
		 * Parameters:
		 *     (MouseWidget) source - The <MouseWidget> instance which wants to
		 *                            initiate the drag and drop action sequence.
		 *     (Object) data - A container for data which will be examined by a
		 *                     possible drop target.
		 *
		_self.startDrag = function startDrag(source, data) {
		
			console.log('CanvasWrapper::startDrag()');
			
			_dragdropData = data;
			
			_canvas.removeEventListener('mousemove', handleNativeMouseMove_DEFAULT);
			_canvas.addEventListener('mousemove', handleNativeMouseMove_DRAGGING);
			
			_mouseInputMode = CanvasWrapper.MOUSEINPUTMODE.DRAGGING;
			
			
		};
		
		_self.stopDrag = function stopDrag() {
			console.log('CanvasWrapper::stopDrag()');
			
			_canvas.removeEventListener('mousemove', handleNativeMouseMove_DRAGGING);
			_canvas.addEventListener('mousemove', handleNativeMouseMove_DEFAULT);
		}
		*/
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	};
	
	DefaultStrategy.prototype = Object.create(MouseStrategy.prototype);
	DefaultStrategy.prototype.constructor = DefaultStrategy;
	
	return DefaultStrategy;
});