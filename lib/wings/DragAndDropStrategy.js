/** Class: DragAndDropStrategy
 *
 * Inherits from:
 *     - <MouseStrategy>
 */
define(function(require, exports, module) {
	
	var MouseStrategy = require('./MouseStrategy');
	var DefaultStrategy = require('./DefaultStrategy');
	
	
	/** Constructor: DragAndDropStrategy()
	 * Creates a new instance of <DragAndDropStrategy>
	 */
	var DragAndDropStrategy = function DragAndDropStrategy(canvasWrapper) {
		var _self = this;
		
		/** PrivateMember: _data
		 * Data to transfer from the initiatior the a potential drop target.
		 */
		var _data;
		
		/** PrivateMember: _initiator
		 * The <Widget> which initiated the drag and drop process.
		 */
		var _initiator;
		
		var _mouseOverWidgets = [];
		
		var _dragging = false;
		
		
		MouseStrategy.call(this, canvasWrapper);
		
		/** Function: dragStarted(absolutePosition)
		 * Called by the <CanvasWrapper>, this method looks for the deepest
		 * <Widget> on the given absolute position and sends a native_dragStart
		 * event.
		 * The <Widget> itself can use the events *acceptCallback* to start
		 * a drag and drop sequence.
		 *
		 * Parameters:
		 *     (Object) absolutePosition - {left: ?, top: ?}
		 */
		_self.dragStarted = function dragStarted(absolutePosition) {
			var acceptCallback = handleAcceptDrag;
			var cancelCallback = stopDrag;
			var initiatorCandidate = canvasWrapper.searchDeepestWidgetOnPosition(absolutePosition);
			initiatorCandidate.dispatchEvent('mouse:dragstart', {absolutePosition: absolutePosition, acceptCallback: acceptCallback, cancelCallback: cancelCallback });
		};
		
		/** Function: mouseMoved(absolutePosition)
		 *
		 * Parameters:
		 *     (Object) absolutePosition - {left: ?, top: ?}
		 */
		_self.mouseMoved = function mouseMoved(absolutePosition) {
			if(_dragging) {
				var canvasWrapper = _self.getCanvasWrapper();
				var deepestWidget = canvasWrapper.searchDeepestWidgetOnPosition(absolutePosition);
				
				if(deepestWidget) {
					deepestWidget.dispatchEvent('mouse:drag', {absolutePosition:absolutePosition});
					
					if(_mouseOverWidgets.indexOf(deepestWidget) === -1) {
						_mouseOverWidgets.push(deepestWidget);
						deepestWidget.dispatchEvent('mouse:dragenter', {absolutePosition: absolutePosition});
					}
				}
				
				canvasWrapper.searchWidgetsOnPosition(absolutePosition,undefined
					,function notFound(widget) {
						var index = _mouseOverWidgets.indexOf(widget);
						if(widget !== deepestWidget && index > -1) {
							_mouseOverWidgets.splice(index,1);
							widget.dispatchEvent('mouse:dragexit', {absolutePosition: absolutePosition});
						}
					}
				);
			}
			
		};
		
		/** Function: mouseButtonReleased(button, absolutePosition)
		 * As soon as the mouse button was released during a drag and drop process,
		 * the process itself gets stopped.
		 * The initiating and possbile targeted <Widget> get informed with
		 * a native_dragStop event.
		 *
		 * Parameters:
		 *     (int) button - Number of the pressed button
		 *     (Object) absolutePosition - { left: ?, top: ? }
		 */
		_self.mouseButtonReleased = function mouseButtonReleased(button, absolutePosition) {
			var canvasWrapper = _self.getCanvasWrapper();
			var dropTarget = canvasWrapper.searchDeepestWidgetOnPosition(absolutePosition);

			if(_initiator) _initiator.dispatchEvent('mouse:dragstop',{absolutePosition:absolutePosition});
			if(dropTarget) dropTarget.dispatchEvent('mouse:drop',{absolutePosition:absolutePosition});
			stopDrag(absolutePosition);
		};
		
		_self.mouseButtonPressed = function mouseButtonPressed(button, absolutePosition) { };
		_self.mouseButtonClicked = function mouseButtonClicked(button, absolutePosition) { };
		
		
		/** PrivateFunction: handleAcceptDrag(widget, date)
		 * Used as callback when emitting a native_dragStart event to a potential
		 * drag and drop initiator.
		 *
		 * Parameters:
		 *     (Widget) widget - <Widget> which accepted the dnd
		 *     (Object) data
		 */
		function handleAcceptDrag(widget, data) {
			_initiator = widget;
			_data = data;
			_dragging = true;
		}
		
		/** PrivateFunction: stopDrag(absolutePosition)
		 * Stops the drag and drop process on the given absolute position.
		 *
		 * Parameters:
		 *     (Object) absolutePosition - { left: ?, top: ? }
		 */
		function stopDrag(absolutePosition) {
			_dragging = false;
			
			/** Event: stopDrag
			 * Informs (most commonly) the <CanvasWrapper> that a drag and
			 * drop process has finished.
			 *
			 * Parameters:
			 *     (Object) absolutePosition - { left: ?, top: ? } describing
			 *                                 the location where DnD has
			 *                                 stopped.
			 */
			_self.emit('draganddropstrategy:stopdrag', absolutePosition);
		}
		
	};
	
	DragAndDropStrategy.prototype = Object.create(MouseStrategy.prototype);
	DragAndDropStrategy.prototype.constructor = DragAndDropStrategy;
	
	return DragAndDropStrategy;
});