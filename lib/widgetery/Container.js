/** Class: Container
 * The <Container> takes a collection of <Widget>s.
 *
 * Most commonly you will not create instances of <Container> directly. The
 * <Widget> inherits all functionalities from the <Container> by its nature.
 * If needed, create your own <Container> subclasses.
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
		 * If the event object has suddently set the property *bubbleUp* set
		 * to false, the event gets not dispatched further by the <Container>s
		 * parent.
		 * 
		 * Parameters:
		 *     (Object) event - { name: '', bubbleUp: ?, ... }
		 */
		_self.on('dispatch', function(event) {
			if(event && event.name) {
				_self.emit(event.name, event);
				
				if(!event.hasOwnProperty('bubbleUp') || event.bubbleUp === true) {
					var parent = _self.getParent();
					if(parent) parent.emit('dispatch', event);
				}
			}
		});
			
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
			_self.dispatchEvent('container:parentchanged', {oldParent: oldParent, newParent: newParent})	
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
			
			/*
			widget.on('drawRequest', handleDrawRequest);
			widget.on('widgetAdded', handleWidgetAdded);
			widget.on('childAddedWidget', handleChildAddedWidget);
			widget.on('childRemovedWidget', handleChildRemovedWidget);
			*/
			
			_widgets.push(widget);
			_self.dispatchEvent('container:widgetadded', {widget: widget});
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
				/*removedWidget.off('drawRequest', handleDrawRequest);
				removedWidget.off('widgetAdded', handleWidgetAdded);
				removedWidget.off('childAddedWidget', handleChildAddedWidget);
				removedWidget.off('childRemovedWidget', handleChildRemovedWidget);
				*/
				
				removedWidget.setParent(undefined);
				_widgets.splice(index,1);
				_self.dispatchEvent('container:widgetremoved', {removedWidget:removedWidget});
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
		
		
		/** Function: dispatchEvent(name, data)
		 * Creates a dispatchable event with given parameters and emits it
		 * to this <Container>.
		 *
		 * Parameters:
		 *     (String) name
		 *     (Object) data
		 */
		_self.dispatchEvent = function dispatchEvent(name, data) {
			var event = _self.createDispatchableEvent(name, data);
			_self.emit('dispatch', event);
		}
		
		/** Function: createDispatchableEvent(name, data)
		 * Creates an event object which contains necessary data for event
		 * bubbling.
		 *
		 * Paremeters:
		 *     (String) name
		 *     (Object) data
		 *
		 * Returns:
		 *     (Object) - {name: '', bubbleUp = true, stopBubbling = Function, ...}
		 */
		_self.createDispatchableEvent = function createDispatchableEvent(name, data) {
			var event = clone(data) || {};
			
			event.name = name;
			event.bubbleUp = true;
			event.stopBubbling = function() { this.bubbleUp = false; }
			event.source = _self;
			
			return event;
		}
		
		/** PrivateFunction: clone(obj)
		 * Creates a clone of an object.
		 *
		 * Parameters:
		 *     (Object) obj
		 *
		 * Returns:
		 *     (Object) cloned version of input parameter.
		 */
		function clone(obj) {
		    if (null == obj || "object" != typeof obj || obj instanceof Container) return obj;


		    // Handle Date
		    if (obj instanceof Date) {
		        var copy = new Date();
		        copy.setTime(obj.getTime());
		        return copy;
		    }

		    // Handle Array
		    if (obj instanceof Array) {
		        var copy = [];
		        for (var i = 0, l = obj.length; i < l; ++i) {
		            copy[i] = clone(obj[i]);
		        }
		        return copy;
		    }

		    // Handle Object
		    if (obj instanceof Object) {
		        var copy = {};
		        for (var attr in obj) {
		            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		        }
		        return copy;
		    }

		    throw new Error("Unable to copy obj! Its type isn't supported.");
		};
		
	};
	
	Container.prototype = Object.create(Emitter.prototype);
	Container.prototype.constructor = Container;
	
	return Container;
});