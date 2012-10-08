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
		 */
		_self.mouseMoved = function mouseMoved(absolutePosition) {
			var canvasWrapper = _self.getCanvasWrapper();
			var deepestWidget = canvasWrapper.searchDeepestWidgetOnPosition(absolutePosition);
			
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
			
			
			if(deepestWidget) {
				deepestWidget.emit('dispatch', {
					name: 'mouse:move'
					,absolutePosition: absolutePosition
				});
				
				
				if(_mouseOverWidgets.indexOf(deepestWidget) === -1) {
					_mouseOverWidgets.push(deepestWidget);
					deepestWidget.emit('dispatch', {
						name: 'mouse:enter'
						,absolutePosition: absolutePosition
					});
				}
			}
			
			canvasWrapper.searchMouseWidgetsOnPosition(absolutePosition,undefined
				,function notFound(widget) {
					var index = _mouseOverWidgets.indexOf(widget);
					if(index > -1) {
						_mouseOverWidgets.splice(index,1);
						widget.emit('dispatch', {
							name: 'mouse:exit'
							,absolutePosition: absolutePosition
						});
					}
					widget.emit('native_mouseMove', absolutePosition);
				}
			);
		};
		
		/** Function: mouseButtonPressed
		 * If a "mouseDown" on the canvas was detected, a search for
		 * <MouseWidget>s beneath the cursor is started.
		 * A "native_mouseDown" event is emitted to every <MouseWidget> found.
		 */
		_self.mouseButtonPressed = function mouseButtonPressed(button, absolutePosition) {
			var canvasWrapper = _self.getCanvasWrapper();
			var deepestWidget = canvasWrapper.searchDeepestWidgetOnPosition(absolutePosition);
			
			_dragndropData.mouseButtonPressed = true;
			_dragndropData.mouseButtonPressedStartPosition = absolutePosition;
			
			if(deepestWidget) {
				deepestWidget.emit('dispatch', {
					name: 'mouse:down'
					,button: button
					,absolutePosition: absolutePosition
				});
			}
		};
		
		/** Function: mouseButtonReleased(button, absolutePosition)
		 * If a "mouseUp" on the canvas was detected, a search for
		 * <MouseWidget>s beneath the cursor is started.
		 * A "native_mouseUp event is emitted to every <MouseWidget> found.
		 */
		_self.mouseButtonReleased = function mouseButtonReleased(button, absolutePosition) {
			var canvasWrapper = _self.getCanvasWrapper();
			var deepestWidget = canvasWrapper.searchDeepestWidgetOnPosition(absolutePosition);
			
			_dragndropData.mouseButtonPressed = false;
			
			if(deepestWidget) {
				deepestWidget.emit('dispatch', {
					name: 'mouse:up'
					,button: button
					,absolutePosition: absolutePosition
				});
			}
		};
		
		/** Function: mouseClicked(button, absolutePosition)
		 * If the mouse clicks inside the Canvas, this handler looks for
		 * <MouseWidget>s below the current cursor position and translates
		 * the native MouseEvent into a proper, Widgetery specific event and
		 * sends it to the regarding <MouseWidget>s.
		 */
		_self.mouseButtonClicked = function mouseButtonClicked(button, absolutePosition) {
			var canvasWrapper = _self.getCanvasWrapper();	
			var deepestWidget = canvasWrapper.searchDeepestWidgetOnPosition(absolutePosition);
			
			if(deepestWidget) {
				deepestWidget.emit('dispatch', {
					name: 'mouse:click'
					,button: button
					,absolutePosition: absolutePosition
				});
			}
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