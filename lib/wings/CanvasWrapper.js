/** Class: CanvasWrapper
 * The <CanvasWrapper> takes a canvas from the DOM and renders a tree of
 * <Widget>s on it.
 *
 * Beside rendering <Widget>s into the Canvas, it also converts user input
 * like native mouse events into Wings-understandable "internal" events.
 * Example: The user moves the mouse over a <Widget>, (or a subclass of
 * it), the <CanvasWrapper> converts this interaction into a native_mouseMove
 * event, which is then processed by the <Widget> itself. For more
 * in-depth information, have a look at the "Canvas.*" event handlers.
 *
 * Inherits from:
 *     - <Widget>
 */
define(function(require, exports, module) {
	
	var Widget = require('./Widget');
	var DefaultStrategy = require('./DefaultStrategy');
	var DragAndDropStrategy = require('./DragAndDropStrategy');
	
	/** Constructor: CanvasWrapper(canvas)
	 * Creates a new instance of <CanvasWrapper>
	 *
	 * Parameters:
	 *     (Canvas) canvas - A DOM canvas to draw onto.
	 */
	var CanvasWrapper = function CanvasWrapper(canvas) {
		
		/** PrivateMember: _self
		 * Keeps an internal reference on "this" for simplifying access to it.
		 */
		var _self = this;
		
		/** PrivateMember: _canvas
		 * The Canvas DOM Element which this <CanvasWrapper> is wrapped around.
		 */
		var _canvas = canvas;
		
		/** PrivateMember: _ctx
		 * This is the graphical context of _canvas.
		 * Use it to draw stuff on the Canvas DOM Element.
		 */
		var _ctx = canvas.getContext('2d');
		
		/** PrivateMember: _boostWidgets
		 * This is a simple associative array which holds all <Widget>s
		 * currently available somewhere in the widget hierarchy.
		 * By keeping this list, the search algorithms for specific <Widget>s
		 * can be implemented iterative instead of recursive to improve the
		 * overall performance.
		 *
		 * See also:
		 *     - <prepareSearchBoost()>
		 */
		var _boostWidgets = {};
		
		/** PrivateMember: _boostWidgetIds
		 * In addtion to <_boostWidgets>, this Array keeps track of each 
		 * <Widget>s ID. The Array itself is sorted to the corresponding
		 * depth in the widget hierarchy from the deepest to the highest.
		 * This makes a major improvment to <searchDeepestWidgetOnPosition()>s
		 * searching performance.
		 *
		 * See also:
		 *     - <prepareSearchBoost()>
		 */
		var _boostWidgetIds = [];
		
		/** PrivateMember: _mouseStrategy
		 * An instance of <MouseStrategy> which is currently used to delegate
		 * the further processing of native mouse events.
		 */
		var _mouseStrategy = createDefaultStrategy();
		
		/** PrivateMember: _zoomFactor
		 * Sets the scaling which is used for drawing the canvas.
		 */
		var _zoomFactor = 1;
		
		
		Widget.call(this);
		
		if(canvas) _self.setSize(canvas.width, canvas.height);
		
		/** Event Handler: Canvas.mousemove
		 * 
		 */
		_canvas.addEventListener('mousemove', function(e) {
			var absolutePosition = extractPositionFromNativeMouseEvent(e);
			e.stopPropagation();
			
			_mouseStrategy.mouseMoved(absolutePosition);
		});
		
		
		/** Event Handler: Canvas.mouseDown
		 */
		_canvas.addEventListener('mousedown', function(e) {
			var button = e.button;
			var absolutePosition = extractPositionFromNativeMouseEvent(e);
			e.stopPropagation();
			
			_mouseStrategy.mouseButtonPressed(button, absolutePosition);
		});
		
		/** Event Handler: Canvas.mouseUp
		 */
		_canvas.addEventListener('mouseup', function(e) {
			var button = e.button;
			var absolutePosition = extractPositionFromNativeMouseEvent(e);
			e.stopPropagation();
			
			_mouseStrategy.mouseButtonReleased(button, absolutePosition);
		});
		
		/** Event Handler: Canvas.click
		 *
		 */
		_canvas.addEventListener('click', function(e) {
			var button = e.button;
			var absolutePosition = extractPositionFromNativeMouseEvent(e);
			e.stopPropagation();
			
			_mouseStrategy.mouseButtonClicked(button, absolutePosition);
		});
		
		
		
		/** Event Handler: drawRequest
		 * Detect drawRequest events from child <Widget>s and redraws them.
		 */
		_self.on('widget:drawrequest', function(event) {
			var widget = event.source;
			var bounds = widget.getBoundingBox();
			var absolutePosition = { left: 0, top: 0 };
			var boosted = _boostWidgets[widget.getId()];
			
			if(boosted !== undefined || widget instanceof CanvasWrapper) {
				if(!(widget instanceof CanvasWrapper)) absolutePosition = boosted.absolutePosition;
				
				_ctx.save();
				
				_ctx.scale(_zoomFactor, _zoomFactor);
				_ctx.translate(absolutePosition.left, absolutePosition.top);
				
				_ctx.beginPath();
				_ctx.rect(0,0,bounds.width,bounds.height);
				_ctx.clip();
				_ctx.clearRect(0,0,bounds.width,bounds.height);
				widget.draw(_ctx);
				
				_ctx.restore();
			}
		});
		
		/** Event Handler: canvaswrapper:zoomfactorchanged
		 * Automatically redraws the <CanvasWrapper> if the zoom factor was
		 * changed.
		 */
		_self.on('canvaswrapper:zoomfactorchanged', function(event) {
			_self.dispatchEvent('widget:drawrequest');
		});

		/** Event Handler: container:widgetadded, container:widgetremoved
		 * Recreates the internal search algorithm booster as soon as a <Widget>
		 * was added or removed from the <Widget> hierarchy.
		 */
		_self.on(['container:widgetadded','container:widgetremoved'], function(event) {
			prepareSearchBoost();
		});
		
		/** Event Handler: widget:moved, widget:resized
		 * Recreates the internal search algorithm booster as soon as a <Widget>
		 * was moved or resized somewhere in the <Widget> hierarchy.
		 * Hint: The <CanvasWrapper> gets informed because of the event bubbling.
		 */
		_self.on(['widget:moved','widget:resized'], function(event) {
			if(event.source !== _self) {
				prepareSearchBoost();
			}
		});
		
		
		
		/** Function: drawWidget(ctx)
		 * Since the <CanvasWrapper> does not draw something for itself, it
		 * implements this method empty.
		 *
		 * Overrides:
		 *     - <Widget.draw(ctx)>
		 * 
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw instance
		 */
		_self.drawWidget = function drawWidget(ctx) { };
		

		/** Function: isPointContained(point, rect) 
		 * Checks if a point is contained in a rectangle.
		 *
		 * Parameters:
		 *     (Object) point - { left: ?, top: ? }
		 *     (Object) rect - { left: ?, top: ?, width: ?, height: ? }
		 *
		 * Returns:
		 *     (boolean) - true if contained, false if not
		 */
		_self.isPointContained = function isPointContained(point, rect) {
			var zoomed = {
				left: rect.left*_zoomFactor
				,top: rect.top*_zoomFactor
				,width: rect.width*_zoomFactor
				,height: rect.height*_zoomFactor
			}
			
			if(point.top >= zoomed.top && point.top <= zoomed.top+zoomed.height
				&& point.left >= zoomed.left && point.left <= zoomed.left+zoomed.width) {
				return true;
			} else {
				return false;
			}
		};
		
		/** Function: searchWidgetsOnPosition(position, containedHandler, notContainedHandler)
		 * Looks for <Widget>s on a specific position and returns one or more
		 * if there are any.
		 *
		 * Parameters:
		 *     (Object) position - { left: ?, top: ? }
		 *     (Function) containedHandler - Handler is executed for every
		 *                                   <Widget> which was found on given
		 *                                   positon.
		 *     (Function) notContainedHandler - Handler is executed for each
		 *                                      <Widget> which was not localized
		 *                                      at the give position.
		 */
		_self.searchWidgetsOnPosition = function searchWidgetsOnPosition(position, containedHandler, notContainedHandler) {
			for(var widgetId in _boostWidgets) {
				var widget = _boostWidgets[widgetId].widget;
				
				if(_self.isPointContained(position, widget.getBoundingBox())) {
					if(containedHandler) containedHandler(widget);
				} else {
					if(notContainedHandler) notContainedHandler(widget);
				}
			}
		}
		
		/** Function: searchDeepestWidgetOnPosition(position)
		 * Looks for the hierarchicaly "deepest" <Widget> at the given,
		 * absolute position.
		 *
		 *
		 * Parameters:
		 *     (Object) absolutePosition - {left: ?, top: ? }
		 *
		 * Returns:
		 *     (Widget)
		 */
		_self.searchDeepestWidgetOnPosition = function searchDeepestWidgetOnPosition(absolutePosition) {
			var deepestWidget;
			
			for(var i = 0, l = _boostWidgetIds.length; i < l; i++) {
				var boost = _boostWidgets[_boostWidgetIds[i]];
				var widget = boost.widget;
				var boundingBox = widget.getBoundingBox();
				
				boundingBox.left = boost.absolutePosition.left;
				boundingBox.top = boost.absolutePosition.top;
				
				if(_self.isPointContained(absolutePosition, boundingBox)) {
					deepestWidget = widget;
					break;
				}
			}
			
			return deepestWidget;
		}
		
		/** Function: convertAbsoluteToRelativePosition(absolutePosition, widget)
		 * Converts an absolute position to the coordinate system of the passed
		 * <Widget>.
		 *
		 * Parameters:
		 *     (Object) absolutePosition - { left: ?, top: ? }
		 *     (Widget) widget
		 *
		 * Returns:
		 *     (Object) {left: ?, top: ?}
		 */ 
		_self.convertAbsoluteToRelativePosition = function convertAbsoluteToRelativePosition(absolutePosition, widget) {
			var offset = _boostWidgets[widget.getId()].absolutePosition;
			var relativePosition = {
				left: absolutePosition.left - offset.left
				,top: absolutePosition.top - offset.top
			};
			
			return relativePosition;
		}
		
		/** Function: getZoomFactor()
		 * Returns the current zoom factor used for drawing all <Widget>s to
		 * the canvas.
		 *
		 * Returns:
		 *     (Float) A value >= 0
		 */
		_self.getZoomFactor = function getZoomFactor() {
			return _zoomFactor;
		}

		/** Function: setZoomFactor(newZoomFactor)
		 * Sets the zoom factor which is used to render all <Widget>s using
		 * this <CanvasWrapper>. The passed value is absolute.
		 *
		 * Parameters:
		 *     (Float) newZoomFactor -  A value >= 0. 1 = No Zoom (100%), 2 =
		 *                              Double the size (200%), 0.5 = half size
		 *                              50% (50%)
		 */
		_self.setZoomFactor = function setZoomFactor(newZoomFactor) {
			if(newZoomFactor >= 0) {
				var oldZoomFactor = _zoomFactor;
				_zoomFactor = newZoomFactor;

				if(oldZoomFactor !== newZoomFactor) {
					_self.dispatchEvent('canvaswrapper:zoomfactorchanged', {oldZoomFactor:oldZoomFactor, newZoomFactor:newZoomFactor, widget:_self});
				}				
			} else {
				throw new Error('zoom factors less than zero are not allowed!');
			}
		}
		
		/** PrivateFunction: extractPositionFromNativeMouseEvent(e)
		 *
		 * Parameters:
		 *     (MouseEvent) e - native mouse event
		 *
		 * Returns:
		 *     (Object) { left: ?, top: ? }
		 */
		function extractPositionFromNativeMouseEvent(e) {
			return {
				left: e.clientX-e.target.offsetLeft
				,top: e.clientY-e.target.offsetTop
			};
		}
		
		
		/** PrivateFunction: prepareSearchBoost()
		 * Generates the content for <_boostWidgets> and <_boostWidgetIds>  to
		 * improve various <Widget> search algorithms.
		 */
		function prepareSearchBoost() {
			var widgetMap = {};
			var widgetIds = [];
			
			(function crawler(parent, parentAbsolutePosition, depth) {
				var currentDepth = depth+1;
				
				for(var i = 0, l = parent.getWidgetCount(); i < l; i++) {
					var container = parent.getWidget(i);
					var position = container.getPosition();
					var absolutePosition = {
						left: parentAbsolutePosition.left + position.left
						,top: parentAbsolutePosition.top + position.top
					};
					var id = container.getId();
					
					widgetMap[id] = {
						widget: container
						,depth: currentDepth
						,absolutePosition: absolutePosition
					};
					widgetIds.push(id);
					
					crawler(container,absolutePosition,currentDepth);
				}
			})(_self, {left:0,top:0}, [], 0);
			
			widgetIds.sort(function(a,b) { return (widgetMap[b].depth - widgetMap[a].depth); });
			
			_boostWidgets = widgetMap;
			_boostWidgetIds = widgetIds;
		}
		
		/** PrivateFunction: createDefaultStrategy()
		 * Creates a <DefaultStrategy> and attaches a "defaultstrategy:startdrag" event
		 * listener to it. As soon as the event gets detected, the <CanvasWrapper>s
		 * mouse strategy gets replaced with the result of <createDragAndDropStrategy()>.
		 *
		 * Returns:
		 *     (DefaultStrategy)
		 */
		function createDefaultStrategy() {
			var defaultStrategy = new DefaultStrategy(_self);
			defaultStrategy.on('defaultstrategy:startdrag', function handleStartDrag(absolutePosition) {
				var dragAndDropStrategy = createDragAndDropStrategy();
				_mouseStrategy = dragAndDropStrategy;
				dragAndDropStrategy.dragStarted(absolutePosition);
			});
						
			return defaultStrategy;
		}
		
		/** PrivateFunction: createDragAndDropStrategy()
		 * Creates a <DragAndDropStrategy> and attaches a "draganddropstrategy:stopdrag" event
		 * listener to it. As soon as the event gets detected, the <CanvasWrapper>s
		 * mouse strategy gets replaced with the result of <createDefaultStrategy()>.
		 *
		 * Returns:
		 *     (DragAndDropStrategy)
		 */
		function createDragAndDropStrategy() {
			var dragAndDropStrategy = new DragAndDropStrategy(_self);
			dragAndDropStrategy.on('draganddropstrategy:stopdrag', function handleStopDrag(absolutePosition) {
				var defaultStrategy = createDefaultStrategy();
				_mouseStrategy = defaultStrategy;
			});
			
			return dragAndDropStrategy;
		}
		
	};
	
	CanvasWrapper.prototype = Object.create(Widget.prototype);
	CanvasWrapper.prototype.constructor = CanvasWrapper;
	
	return CanvasWrapper;
});