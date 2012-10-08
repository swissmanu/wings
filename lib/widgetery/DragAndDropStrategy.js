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

			/** Event: native_dragStart
			 * 
			 * Parameters:
			 *     (Object) absolutePosition - { left: ?, top: ? }
			 *     (Function) acceptCallback - Callback to call, if a Widget wants
			 *                                 to start a drag and drop process
			 *     (Fucntion) cancelCallback -  Callback to not start a drag and drop
			 *                                  or cancel a drag and drop process
			 */
			var dragStartEvent = initiatorCandidate.createDispatchableEvent('mouse:dragstart', {
				absolutePosition: absolutePosition
				,acceptCallback: acceptCallback
				,cancelCallback: cancelCallback
			});
			initiatorCandidate.emit('dispatch', dragStartEvent);
		};
		
		/** Function: mouseMoved(absolutePosition)
		 *
		 * Parameters:
		 *     (Object) absolutePosition - {left: ?, top: ?}
		 */
		_self.mouseMoved = function mouseMoved(absolutePosition) {
			if(_dragging) {
				_self.getCanvasWrapper().searchMouseWidgetsOnPosition(absolutePosition, 
					function found(widget) {
						if(_mouseOverWidgets.indexOf(widget) === -1) {
							_mouseOverWidgets.push(widget);
							
							/** Event: native_mouseDragEntered
							 * Signals a <Widget> that the cursor has entered
							 * its boundaries while a drag and drop process is
							 * ongoing.
							 *
							 * Parameters:
							 *     (Widget) initiator - <Widget> which started
							 *                          the DnD process.
							 *     (Object) data - Data which wants to be
							 *                     transfered with the DnD process.
							 */
							var dragEnterEvent = widget.createDispatchableEvent('mouse:dragenter',{
								initiator: _initiator
								,data: _data
							});
							widget.emit('dispatch',dragEnterEvent);
						}
						var dragEvent = widget.createDispatchableEvent('mouse:drag', {absolutePosition: absolutePosition,initiator: _initiator,data: _data});
						widget.emit('dispatch', dragEvent);

					}, function notFound(widget) {
						var index = _mouseOverWidgets.indexOf(widget);
						if(index > -1) {
							_mouseOverWidgets.splice(index,1);
							
							/** Event: native_mouseDragEntered
							 * Signals a <Widget> that the cursor has left
							 * its boundaries while a drag and drop process is
							 * ongoing.
							 *
							 * Parameters:
							 *     (Widget) initiator - <Widget> which started
							 *                          the DnD process.
							 *     (Object) data - Data which wants to be
							 *                     transfered with the DnD process.
							 */
							var dragEnterEvent = widget.createDispatchableEvent('mouse:dragenter',{
								initiator: _initiator
								,data: _data
							});
							widget.emit('dispatch',dragEnterEvent);
						}
						var dragEvent = widget.createDispatchableEvent('mouse:drag', {absolutePosition: absolutePosition,initiator: _initiator,data: _data});
						widget.emit('dispatch', dragEvent);
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

			if(_initiator) _initiator.emit('dispatch', _initiator.createDispatchableEvent('mouse:dragstop',{absolutePosition:absolutePosition}));
			if(dropTarget !== _initiator) dropTarget.emit('dispatch', dropTarget.createDispatchableEvent('mouse:dragstop',{absolutePosition:absolutePosition}));
			stopDrag(absolutePosition);
		};
		
		_self.mouseButtonPressed = function mouseButtonPressed(button, absolutePosition) { };
		_self.mouseButtonClicked = function mouseButtonClicked(button, absolutePosition) { };
		
		
		/** PrivateFunction: handleAcceptDrag(widget, date)
		 * Used as callback when emitting a native_dragStart event to a potential
		 * drag and drop initiator.
		 *
		 * Parameters:
		 *     (MouseWidget) widget - <MouseWidget> which accepted the dnd
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