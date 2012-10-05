/** Class: Container
 * The <Container> takes a collection of <Widget>s.
 *
 * Most commonly you will not create instances of <Container> directly. The
 * <Widget> inherits all functionalities from the <Container> by its nature.
 * If needed, create your own <Container> subclasses.
 *
 * Emitted events:
 *     widgetAdded - Triggered when a new <Widget> was added to the
 *                   <Container>.
 *                   Parameters: [(Widget) widget]
 *     widgetRemoved - Triggered when a <Widget> was removed from the
 *                   <Container>.
 *                   Parameters: [(Widget) widget]
 *     drawRequest - Triggered when the <Widget> was updated and wants to be
 *                   drawn. Path contains the <Container> hierarchy which points
 *                   to the <Widget>. 0 = Parent of <Widget>,
 *                   1 = Parent of parent
 *                   Parameters: [(<Widget>) widget, (Array) path]	
 *     parentChanged - Triggered when a <Container> has changed its
 *                     parent <Container> (hierarchy).
 *                     Parameters: [(Container) oldParent, (Container) 
 *                     newParent, (Container) container]
 *     childAddedWidget - Triggered when a <Widget> was added to the
 *                        <Container> at the last position of the array
 *                        parameter "path". The last <Container> in the
 *                        path array is the one, which "widget" was
 *                        added to. The second last the parent of that
 *                        <Container> and so on.
 *                        Parameters: [(Widget) widget, (Array) path]
 *     childRemovedWidget - Triggered when a <Widget> was removed from the
 *                          <Container> at the last position of the array
 *                          parameter "path". The last <Container> in the
 *                          path array is the one, which "widget" was
 *                          added to. The second last the parent of that
 *                          <Container> and so on.
 *                          Parameters: [(Widget) widget, (Array) path]
 *
 * Inherits from: 
 *    - <Emitter>
 */
define(function(require, exports, module) {
	
	var Emitter = require('helpers/Emitter');
	
	/** Constructor: Container(canvas)
	 * Creates a new instance of <Container>
	 */
	var Container = function Container() {
		var _self = this;
		var _parent;
		var _widgets = [];
		
		Emitter.call(this);
		
		
		/** Event Handler: dispatch
		 * The event dispatcher expects an event object which contains at least
		 * an event name. It emits an event with the regarding name and an
		 * argument with the complete event object.
		 * If none of the event listeners requests to stop processing the event,
		 * the dispatcher emits the initial event it received to the its parent
		 * <Container>, it bubbles the event upwards.
		 * 
		 * Parameters:
		 *     (Object) event - { name: '', ... }
		 */
		_self.on('dispatch', function(event) {
			if(event && event.name) {
				if(_self.emit(event.name, event)) {
					var parent = _self.getParent();
					if(parent) parent.emit('dispatch', event);
				}
			}
		});
		
		
		
		
		/** Event Handler: childAddedWidget
		 * Handles the childAddedWidget event from a child <Widget> by adding 
		 * a reference of this <Container> to the path and reemitting the event
		 * by itself.
		 */
		_self.on('childAddedWidget', handleChildAddedWidget);
		
		/** Event Handler: childRemovedWidget
		 * Handles the childRemovedWidget event from a child <Widget> by adding 
		 * a reference of this <Container> to the path and reemitting the event
		 * by itself.
		 */
		_self.on('childRemovedWidget', handleChildRemovedWidget);
		
		
		/** Function: setParent(newParent)
		 * Sets the parent container of this <Container>.
		 *
		 * Emitted events:
		 *     parentChanged - Triggered when a <Container> has changed its
		 *                     parent <Container> (hierarchy).
		 *                     Parameters: [(Container) oldParent, (Container) 
		 *                     newParent, (Container) container]
		 *
		 * Parameters:
		 *     (Container) newParent - New parent <Container> instance
		 */
		_self.setParent = function setParent(newParent) {
			var oldParent = _parent;
			_parent = newParent;	
			_self.emit('parentChanged', oldParent, newParent, _self);
			
		};
		
		/** Function: getParent()
		 * Returns the parent <Widget> of this widget.
		 *
		 * Returns:
		 *     (Widget) parent
		 */
		_self.getParent = function getParent() {
			return _parent;
		};
		
		/** Function: getRoot()
		 * Returns the top most <Container> recursivly. Most commonly this will
		 * be an instance of <CanvasWrapper>.
		 *
		 * Returns:
		 *     <Container>
		 */
		_self.getRoot = function getRoot() {
			var parent = _parent;
			var widget = parent;

			while(parent !== undefined) {
				widget = parent;
				parent = widget.getParent();
			}
			
			return widget;
		};
		
		/** Function: addWidget(widget)
		 * Adds a new <Widget> to this <Container>. Sets automatically the
		 * parent to a reference to this <Container>.
		 *
		 * Emitted events:
		 *     widgetAdded - Triggered when a new <Widget> was added to the
		 *                   <Container>.
		 *                   Parameters: [(Widget) widget]
		 *
		 * Parameters:
		 *     (Widget) widget - <Widget> to add to this <Container>
		 */
		_self.addWidget = function addWidget(widget) {
			if(widget.getParent()) {
				widget.getParent().removeWidget(widget);
			}
			widget.setParent(_self);
			widget.on('drawRequest', handleDrawRequest);
			widget.on('widgetAdded', handleWidgetAdded);
			widget.on('childAddedWidget', handleChildAddedWidget);
			widget.on('childRemovedWidget', handleChildRemovedWidget);
			
			_widgets.push(widget);
			_self.emit('widgetAdded', widget);
		};
		
		/** Function: removeWidget(widget)
		 * Removes a widget from this <Container>.
		 *
		 * Emitted events:
		 *     widgetRemoved - Triggered when a <Widget> was removed from the
		 *                     <Container>.
		 *                     Parameters: [(Widget) widget]
		 *
		 * Parameters:
		 *     (int|Widget) widget - <Widget> to remove
		 */
		_self.removeWidget = function removeWidget(widget) {
			var index = widget;
			var removedWidget = widget;
			
			if(typeof index === 'number') {
				removedWidget = _widgets[index];
			} else {
				index = _widgets.indexOf(widget);
			}
			
			if(index > -1) {
				removedWidget.off('drawRequest', handleDrawRequest);
				removedWidget.off('widgetAdded', handleWidgetAdded);
				removedWidget.off('childAddedWidget', handleChildAddedWidget);
				removedWidget.off('childRemovedWidget', handleChildRemovedWidget);
				
				removedWidget.setParent(undefined);
				_widgets.splice(index,1);
				_self.emit('widgetRemoved', removedWidget);
			}
		};
		
		/** Function: getWidgetCount()
		 * Returns the count of <Widgets> inside this <Container>.
		 *
		 * Returns:
		 *     (int)
		 */
		_self.getWidgetCount = function getWidgetCount() {
			return _widgets.length;
		};
		
		/** Function: getWidget(index)
		 * Returns a <Widget> with given index if available.
		 *
		 * Parameters:
		 *     (int) index - index of the <Widget>
		 *
		 * Returns:
		 *     (Widget|undefined)
		 */
		_self.getWidget = function getWidget(index) {
			return _widgets[index];
		};	
		
		/** Function getWidgets()
		 * Returns an Array with all child <Widgets> of this <Container>.
		 *
		 * Attention! Don't expect that the <Container> watches this Array for
		 * any changes. Use the <Container>s methods instead.
		 *
		 * Returns:
		 *     (Array) Array with all <Widgets>
		 */
		_self.getWidgets = function getWidgets() {
			return _widgets;
		};
		
		
		/** PrivateFunction: handleDrawRequest(widget)
		 * Handles a drawRequest event from a child <Widget> by bubbling it
		 * up in the <Widget> hierarchy.
		 *
		 * Emitted events:
		 *     drawRequest - Triggered when the <Widget> was updated and wants to be
		 *                   drawn. Path contains the <Container> hierarchy which points
		 *                   to the <Widget>. 0 = Parent of <Widget>,
		 *                   1 = Parent of parent
		 *                   Parameters: [(<Widget>) widget, (Array) path]	
		 * Parameters:
		 *     (Widget) widget - widget which wants to be drawn
		 *     (Array) path - <Container> hierarchy path pointing to the <Widget>
		 */
		function handleDrawRequest(widget, path) {
			if(!(path instanceof Array)) path = [];
			path.push(_self);
			_self.emit('drawRequest', widget, path);
		};
		
		/** PrivateFunction: handleWidgetAdded(widget)
		 * Handles the widgetAdded event of child <Widget>s by emitting a new
		 * childAddedWidget.
		 * Notice: Since this is a callback, "this" references to the <Widget>,
		 * which emitted the event and called this callback. Meaning "this" is
		 * equal to the parent <Widget> of the <Widget> which was added.
		 *
		 * Emitted events:
		 *     childAddedWidget - Triggered when a <Widget> was added to the
		 *                        <Container> at the last position of the array
		 *                        parameter "path". The last <Container> in the
         *                        path array is the one, which "widget" was
		 *                        added to. The second last the parent of that
		 *                        <Container> and so on.
		 *                        Parameters: [(Widget) widget, (Array) path]
		 *
		 * Parameters:
		 *     (Widget) widget - <Widget> which was added
		 */
		function handleWidgetAdded(widget) {
			var parent = this;
			_self.emit('childAddedWidget', widget, [parent, _self]);
		}
		
		/** PrivateFunction: handleChildAddedWidget(widget, path)
		 * Used by the event handler for the childAddedWidget events. Picks a
		 * childAddedWidget event, adds this <Container> to the path and bubbles
		 * the event upwards in the <Container> hierarchy.
		 *
		 * Emitted events:
		 *     childAddedWidget - Triggered when a <Widget> was added to the
		 *                        <Container> at the last position of the array
		 *                        parameter "path". The last <Container> in the
         *                        path array is the one, which "widget" was
		 *                        added to. The second last the parent of that
		 *                        <Container> and so on.
		 *                        Parameters: [(Widget) widget, (Array) path]
		 *
		 * Parameters:
		 *     (Widget) widget - <Widget> which was added
		 *     (Array) path - The last <Container> in the array is the one,
		 *                    which "widget" was added to. The second last the
		 *                    parent of that <Container> and so on.
		 */
		function handleChildAddedWidget(widget, path) {
			if(!(path instanceof Array)) path = [];
			
			if(path.indexOf(_self) === -1) {
				path.push(_self);
				_self.emit('childAddedWidget', widget, path);
			}
		};
		
		/** PrivateFunction: handleChildRemovedWidget(widget, path)
		 * Used by the event handler for the childRemovedWidget events. Picks a
		 * childRemovedWidget event, adds this <Container> to the path and bubbles
		 * the event upwards in the <Container> hierarchy.
		 *
		 * Emitted events:
		 *     childRemovedWidget - Triggered when a <Widget> was removed from the
		 *                          <Container> at the last position of the array
		 *                          parameter "path". The last <Container> in the
		 *                          path array is the one, which "widget" was
		 *                          added to. The second last the parent of that
		 *                          <Container> and so on.
		 *                          Parameters: [(Widget) widget, (Array) path]
		 *
		 * Parameters:
		 *     (Widget) widget - <Widget> which was added
		 *     (Array) path - The last <Container> in the array is the one,
		 *                    which "widget" was added to. The second last the
		 *                    parent of that <Container> and so on.
		 */
		function handleChildRemovedWidget(widget, path) {
			if(!(path instanceof Array)) path = [];
			
			if(path.indexOf(_self) === -1) {
				path.push(_self);
				_self.emit('childRemovedWidget', widget, path);
			}
		};
		
	};
	
	Container.prototype = Object.create(Emitter.prototype);
	Container.prototype.constructor = Container;
	
	return Container;
});