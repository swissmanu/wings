/** Class: DefaultStrategy
 * The "daily use" <MouseStrategy>. The <CanvasWrapper> delegates handling of
 * native browser events to the specific methods of this <MouseStrategy>.
 * 
 * Sequence Diagram:
 *     - http://www.websequencediagrams.com/?lz=dGl0bGUgTW91c2VTdHJhdGVneQoKVXNlci0-Q2FudmFzV3JhcHBlcjptb3VzZW1vdmUKAAsNLT5EZWZhdWx0ADYIACMGTW92ZWQoKQoADg8ARRBzZWFyY2hEZWVwZXN0V2lkZ2V0T25Qb3NpdGlvbgBaDwBYEiB3AC0FAFMSAEQGOiBkaXNwYXRjaDogAIE5BToAgToFAAUpZW50ZXIKAIEQBgBKCnN0b3AgYnViYmxpbmchACMreGl0AC0gAIJfG2RvdwCCARAAgmQWQnV0dG9uUHJlc3MAgW-BEwCBQgUAhEYadXAAgTkrUmVsZWEAUYEUdXAAgzMXY2xpY2sAgxsrQ2xpY2sAhTWBEwCBQwU&s=vs2010
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
		
		/** PrivateMember: _self
		 * Keeps an internal reference on "this" for simplifying access to it.
		 */
		var _self = this;
		
		/** PrivateMember: _mouseOverWidgets
		 * To keep track on <Widget>s which have already dispatched a *mouse:enter*
		 * event, each of these gets added to this array. As soon as the user
		 * leaves the boundaries of such a <Widget>, it gets removed from here.
		 */
		var _mouseOverWidgets = [];
		
		/** PrivateMember: _dragndropData
		 * This object keeps several information about the status of the drag
		 * and drop initialisation.
		 */
		var _dragndropData = {
			mouseButtonPressed : false
			,mouseButtonPressedStartPosition : { left: 0, top: 0}
			,startThreshold : 2
			,started : false
		};
		
		MouseStrategy.call(this, canvasWrapper);
		
		
		/** Function: mouseMoved(absolutePosition)
		 * The <mouseMoved(absolutePosition)> method does three things during
		 * mouse movements:
		 *
		 * Drag And Drop Start:
		 * If the user moves the mouse during a mouse button is pressed down,
		 * the distance from the initial mouse down location and the current
		 * location is calculated. If the absolute value of this distance 
		 * exceeds a threshold, <DefaultStrategy> emits a *defaultstrategy:startDrag*
		 * event which is usually catched by the <CanvasWrapper> for further
		 * processing.
		 *
		 * Dispatch Mouse Movement and Mouse Enter:
		 * The deepest <Widget> at the current location gets searched via 
		 * <CanvasWrapper.searchDeepestWidgetOnPosition(absolutePosition)>. If
		 * a <Widget> was found, a *mouse:move* event gets emitted for dispatching.
		 * If the <Widget> is further not already contained in the _mouseOverWidgets
		 * array, it gets pushed to it and a *mouse:enter* event is dispatched
		 * by the <Widget>.
		 *
		 * Dispatch Mouse Exit:
		 * The last step is to inform <Widget>s which are not anymore beneath
		 * the cursor via a *mouse:exit* event.
		 *
		 * Parameters:
		 *     (Object) absolutePosition - { left: ?, top: ? }
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
					_self.emit('defaultstrategy:startDrag', absolutePosition);
				}
			}
			
			/* mouse:move & mouse:enter: */
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
			
			/* mouse:exit: */
			canvasWrapper.searchMouseWidgetsOnPosition(absolutePosition,undefined
				,function notFound(widget) {
					var index = _mouseOverWidgets.indexOf(widget);
					if(widget !== deepestWidget && index > -1) {
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
		
		/** Function: mouseButtonPressed(button, absolutePosition)
		 * Looks for the deepest <Widget> at the given position and emits a
		 * *mouse:down* event for dispatching.
		 *
		 * Parameters:
		 *     (int) button
		 *     (Object) absolutePosition - { left: ?, top: ? }
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
		 * Looks for the deepest <Widget> at the given position and emits a
		 * *mouse:up* event for dispatching.
		 *
		 * Parameters:
		 *     (int) button
		 *     (Object) absolutePosition - { left: ?, top: ? }
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
		 * Looks for the deepest <Widget> at the given position and emits a
		 * *mouse:click* event for dispatching.
		 *
		 * Parameters:
		 *     (int) button
		 *     (Object) absolutePosition - { left: ?, top: ? }
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
		
	};
	
	DefaultStrategy.prototype = Object.create(MouseStrategy.prototype);
	DefaultStrategy.prototype.constructor = DefaultStrategy;
	
	return DefaultStrategy;
});