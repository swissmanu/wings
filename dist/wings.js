(function(global, define) {
  var globalDefine = global.define;

/**
 * almond 0.2.0 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        aps = [].slice;

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!defined.hasOwnProperty(name) && !defining.hasOwnProperty(name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (defined.hasOwnProperty(depName) ||
                           waiting.hasOwnProperty(depName) ||
                           defining.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        waiting[name] = [name, deps, callback];
    };

    define.amd = {
        jQuery: true
    };
}());

define("../node_modules/almond/almond", function(){});

/** Class: Emitter
 * A base class which provides basic functionalities for emitting events.
 * 
 * Original implementation:
 *     - https://github.com/visionmedia/uikit/blob/master/lib/components/emitter/emitter.js
 */
define('wings/Emitter',['require','exports','module'],function(require, exports, module) {
	
	/** Constructor: Emitter()
	 * Creates a new instance of <Emitter>.
	 */
	var Emitter = function Emitter() {
		this.callbacks = {};
	};

	/** Function: on(event, fn)
	 * Registers a new handler for an event.
	 * If you want to register a handler for more than one event at once, just
	 * pass an array with event names for the "event" parameter:
	 *
	 * > emitter.on('event1', function() { ... });
	 * > emitter.on(['event1','event2', 'event3'], function() { ... });
	 *
	 * Parameters:
	 *     (String|Array) event - event name
	 *     (Function) fn - handler callback
	 */
	Emitter.prototype.on = function(event, fn) {
		if(!(event instanceof Array)) event = [event];
		for(var i = 0, l = event.length; i<l; i++) {
			(this.callbacks[event[i]] = this.callbacks[event[i]] || [])
				.push(fn);
		}
		return this;
	};
	
	/** Function: once(event, fn)
	 * Registers a new handler for an event. After running the handler for the
	 * first time, the handler removes itself automatically.
	 *
	 * Parameters:
	 *     (String) event - event name
	 *     (Function) fn - handler callback
	 */
	Emitter.prototype.once = function(event, fn){
		var self = this;

		function on() {
			self.off(event, on);
			return fn.apply(this, arguments);
		}

		this.on(event, on);
		return this;
	};

	/** Function: off(event, fn)
	 * Removes a specific handler for the given event.
	 *
	 * Parameters:
	 *     (String) event - event name
	 *     (Function) fn - handler callback
	 */
	Emitter.prototype.off = function(event, fn){
		var callbacks = this.callbacks[event];
		if (!callbacks) return this;

		// remove all handlers
		if (1 == arguments.length) {
			delete this.callbacks[event];
			return this;
		}

		// remove specific handler
		var i = callbacks.indexOf(fn);
		callbacks.splice(i, 1);
		return this;
	};

	/** Function: emit(event)
	 * Triggers an event. Add as many additional arguments as you want to the
	 * <emit(event)> call. Examples:
	 *
	 * > emitter.emit('eventWithNoArguments');
	 * > emitter.emit('eventWith1Argument', 'argument1');
	 * > emitter.emit('eventWith3Arguments', 'argument1',10,false);
	 *
	 * A callback can return false to request stop processing the current
	 * event.
	 *
	 * Parameters:
	 *     (String) event - event name
	 *
	 * Returns:
	 *     (Boolean) false, if a callback requested to stop processing the event.
	 */
	Emitter.prototype.emit = function(event){
		var args = [].slice.call(arguments, 1);
		var callbacks = this.callbacks[event];
		var continueProcessing = true;
		
		if (callbacks) {
			for (var i = 0, len = callbacks.length; i < len; ++i) {
				continueProcessing = callbacks[i].apply(this, args);
				
				if(continueProcessing === undefined) continueProcessing = true;
				if(continueProcessing === false) break;
			}
		}
		
		return continueProcessing;
	};
	
	return Emitter;
});
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
define('wings/Container',['require','exports','module','./Emitter'],function(require, exports, module) {
	
	var Emitter = require('./Emitter');
	
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
/** Class: MouseStrategy
 * A <MouseStrategy> picks native mouse events from a <CanvasWrapper> and
 * translates them into Wings internal events.
 *
 * See also:
 *     - <DefaultStrategy>
 *     - <DragAndDropStrategy>
 *
 * Inherits from:
 *     - <Emitter>
 */
define('wings/MouseStrategy',['require','exports','module','./Emitter'],function(require, exports, module) {
	
	var Emitter = require('./Emitter');
	
	
	/** Constructor: MouseStrategy()
	 * Creates a new instance of <MouseStrategy>
	 */
	var MouseStrategy = function MouseStrategy(canvasWrapper) {
		var _self = this;
		var _canvasWrapper = canvasWrapper;
		
		Emitter.call(this);
		
		/** Function: mouseMoved(absolutePosition)
		 * The <CanvasWrapper> calls this method when the cursor was moved on
		 * the canvas.
		 *
		 * Parameters:
		 *     (Object) absolutePosition - { left: ?, top: ? }
		 */
		_self.mouseMoved = function mouseMoved(absolutePosition) {
			throw new Error('Implement mouseMoved!');
		}
		
		/** Function: mouseButtonPressed(button, absolutePosition)
		 * Called from the <CanvasWrapper> to delegate processing of a pressed
		 * mouse button.
		 *
		 * Parameters:
		 *     (int) button - Number of the pressed button
		 *     (Object) absolutePosition - { left: ?, top: ? }
		 */
		_self.mouseButtonPressed = function mouseButtonPressed(button, absolutePosition) {
			throw new Error('Implement mouseButtonPressed!');
		};

		/** Function: mouseButtonReleased(button, absolutePosition)
		 * Called from the <CanvasWrapper> to delegate processing of a released
		 * mouse button.
		 *
		 * Parameters:
		 *     (int) button - Number of the released button
		 *     (Object) absolutePosition - { left: ?, top: ? }
		 */		
		_self.mouseButtonReleased = function mouseButtonReleased(button, absolutePosition) {
			throw new Error('Implement mouseButtonReleased!');
		};
		
		/** Function: mouseButtonClicked(button, absolutePosition)
		 * Called from the <CanvasWrapper> when the mouse clicked somewhere on
		 * the canvas.
		 *
		 * Parameters:
		 *     (int) button - Number of the clicked button
		 *     (Object) absolutePosition - { left: ?, top: ? }
		 */
		_self.mouseButtonClicked = function mouseButtonClicked(button, absolutePosition) {
			throw new Error('Implement mouseButtonClicked!');
		};
			
		/** Function: getCanvasWrapper()
		 * Returns the <CanvasWrapper> which is in controll of this
		 * <MouseStrategy>.
		 *
		 * Returns:
		 *     (CanvasWrapper) - <CanvasWrapper> instance
		 */
		_self.getCanvasWrapper = function getCanvasWrapper() {
			return _canvasWrapper;
		};
		
	};
	
	MouseStrategy.prototype = Object.create(Emitter.prototype);
	MouseStrategy.prototype.constructor = MouseStrategy;
	
	return MouseStrategy;
});
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
define('wings/DefaultStrategy',['require','exports','module','./MouseStrategy'],function(require, exports, module) {
	
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
					_self.emit('defaultstrategy:startdrag', absolutePosition);
				}
			}
			
			/* mouse:move & mouse:enter: */
			if(deepestWidget) {
				deepestWidget.dispatchEvent('mouse:move', {absolutePosition:absolutePosition});
				
				if(_mouseOverWidgets.indexOf(deepestWidget) === -1) {
					_mouseOverWidgets.push(deepestWidget);
					deepestWidget.dispatchEvent('mouse:enter', {absolutePosition: absolutePosition});
				}
			}
			
			/* mouse:exit: */
			canvasWrapper.searchMouseWidgetsOnPosition(absolutePosition,undefined
				,function notFound(widget) {
					var index = _mouseOverWidgets.indexOf(widget);
					if(widget !== deepestWidget && index > -1) {
						_mouseOverWidgets.splice(index,1);
						widget.dispatchEvent('mouse:exit', {absolutePosition: absolutePosition});
					}
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
				deepestWidget.dispatchEvent('mouse:down', {button:button, absolutePosition: absolutePosition});
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
				deepestWidget.dispatchEvent('mouse:up', {button:button, absolutePosition: absolutePosition});
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
				deepestWidget.dispatchEvent('mouse:click', {button:button, absolutePosition: absolutePosition});
			}
		};
		
	};
	
	DefaultStrategy.prototype = Object.create(MouseStrategy.prototype);
	DefaultStrategy.prototype.constructor = DefaultStrategy;
	
	return DefaultStrategy;
});
/** Class: DragAndDropStrategy
 *
 * Inherits from:
 *     - <MouseStrategy>
 */
define('wings/DragAndDropStrategy',['require','exports','module','./MouseStrategy','./DefaultStrategy'],function(require, exports, module) {
	
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
				
				canvasWrapper.searchMouseWidgetsOnPosition(absolutePosition,undefined
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
/** Class: Widget
 * A <Widget> represents an interactive, graphical user interface component.
 * Subclass from this class to create your own, specialized <Widget>s like
 * Buttons, textfields etc.
 *
 * When subclassing, ensure you overwrite the <Widget.draw(ctx)> method,
 * otherwise an error gets thrown.
 *
 * Since <Widget> is a subclass of <Container>, you can place other <Widget>s
 * inside a specific <Widget> instance.
 *
 * Inherits from:
 *     - <Container>
 */
define('wings/Widget',['require','exports','module','./Container'],function(require, exports, module) {
	
	var Container = require('./Container');
	
	
	/** Constructor: Widget()
	 * Creates a new instance of <Widget>
	 */
	var Widget = function Widget() {
		var _self = this;
		var _id = generateId();
		var _top = 0;
		var _left = 0;
		var _width = 0;
		var _height = 0;
		var _state = true;
		
		Container.call(this);
		
		
		/** Event Handler: moved, resized, stateChanged
		 * If the <Widget> changes is position or size, a drawRequest event is
		 * emitted by calling <Widget.redraw()>.
		 */
		_self.on(['widget:moved','widget:resized','widget:statechanged'],
			function(event) {
				_self.redraw();
		});
		
		
		/** Function: redraw()
		 * Trigger a fresh drawing if this <Widget>.
		 */
		_self.redraw = function redraw() {
			_self.dispatchEvent('widget:drawrequest');
		};
		
		/** Function: drawWidget(ctx)
		 * Render the actual <Widget>. Overwrite this method in your <Widget>
		 * sublcasses to draw the UI.
		 *
		 * Don't call this method explicitly from outside. Better use
		 * <Widget.redraw()> if you want to force the redrawing of a
		 * <Widget>.
		 *
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw in
		 */
		_self.drawWidget = function drawWidget(ctx) { };
		
		/** Function: draw(ctx)
		 * Draws this <Widget> via <Widget.drawWidget(ctx)> and uses
		 * <Widget.drawChildWidgets(ctx)> to draw all child <Widgets>
		 * automatically.
		 *
		 * Don't call this method explicitly from outside. Better use
		 * <Widget.redraw()> if you want to force redrawing of a <Widget>.
		 *
		 * Parameters:
		 *     (Object) ctx - Grapical context to draw in
		 */
		_self.draw = function draw(ctx) {
			_self.drawWidget(ctx);
			drawChildWidgets(ctx);
		};
		
		/** Function: getId()
		 * Returns the ID of this <Widget>.
		 *
		 * Returns:
		 *     (String)
		 */
		_self.getId = function getId() {
			return _id;
		}
		
		/** Function: getTop()
		 * Returns the vertical position of this <Widget>.
		 *
		 * Returns:
		 *     (int)
		 */
		_self.getTop = function getTop() {
			return _top;
		};
		
		/** Function: getLeft()
		 * Returns the horizontal position of this <Widget>.
		 *
		 * Returns:
		 *     (int)
		 */
		_self.getLeft = function getLeft() {
			return _left;
		};
		
		/** Function: getWidth()
		 * Returns the width of this <Widget>.
		 *
		 * Returns:
		 *     (int)
		 */
		_self.getWidth = function getWidth() {
			return _width;
		};

		/** Function: getHeight()
		 * Returns the height of this <Widget>.
		 *
		 * Returns:
		 *     (int)
		 */
		_self.getHeight = function getHeight() {
			return _height;
		};
		
		/** Function: getPosition()
		 * Returns a literal with the vertical and horizontal position of this
		 * <Widget>
		 *
		 * Returns:
		 *     (Object) { top: ?, left: ? }
		 */
		_self.getPosition = function getPosition() {
			return { top: _top, left: _left };
		};
		
		/** Function: getSize()
		 * Returns a literal with the width and height of this <Widget>.
		 *
		 * Returns:
		 *     (Object) { width: ?, height: ? }
		 */
		_self.getSize = function getSize() {
			return { width: _width, height: _height };
		};
		
		/** Function: getBoundingBox()
		 * Returns a literal with all position and size related information of
		 * this <Widget>.
		 *
		 * Returns:
		 *     (Object) { top: ?, left: ?, width: ?, height: ? }
		 */
		_self.getBoundingBox = function getBoundingBox() {
			return { top: _top, left: _left, width: _width, height: _height };
		};
		
		/** Function: setTop(newTop)
		 * Moves the <Widget> vertically to the passed location.
		 *
		 * Emitted events:
		 *     moved - Triggered when the widget changed its location.
		 *             Parameters: [(Object) oldLocation, (Object) newLocation, 
		 *             (Widget) widget]
		 *
		 * Parameters:
		 *     (int) newTop - new vertical position
		 */
		_self.setTop = function setTop(newTop) {
			var oldPosition = _self.getPosition();
			_top = newTop;
			var newPosition = _self.getPosition();
			
			_self.dispatchEvent('widget:moved', {oldPosition:oldPosition, newPosition:newPosition, widget:_self});
		};
		
		/** Function: setLeft(newLeft)
		 * Moves the <Widget> horizontally to the passed location.
		 *
		 * Emitted events:
		 *     moved - Triggered when the widget changed its location.
		 *             Parameters: [(Object) oldLocation, (Object) newLocation, 
		 *             (Widget) widget]
		 *
		 * Parameters:
		 *     (int) newLeft - new vertical position
		 */
		_self.setLeft = function setLeft(newLeft) {
			var oldPosition = _self.getPosition();
			_left = newLeft;
			var newPosition = _self.getPosition();
			
			_self.dispatchEvent('widget:moved', {oldPosition:oldPosition, newPosition:newPosition, widget:_self});
		};
		
		/** Function: setWidth(newWidth)
		 * Sets the width of <Widget> to the passed size.
		 *
		 * Emitted events:
		 *     resized - Triggered when the widget changes its size.
		 *               Parameters: [(Object) oldSize, (Object) newSize,
		 *               (Widget) widget]
		 *
		 * Parameters:
		 *     (int) newWidth - new width
		 */
		_self.setWidth = function setWidth(newWidth) {
			var oldSize = _self.getSize();
			_width = newWidth;
			var newSize = _self.getSize();
			
			_self.dispatchEvent('widget:resized', {oldSize:oldSize, newSize:newSize, widget:_self});
		};
		
		/** Function: setHeight(newHeight)
		 * Sets the height of <Widget> to the passed size.
		 *
		 * Emitted events:
		 *     resized - Triggered when the widget changes its size.
		 *               Parameters: [(Object) oldSize, (Object) newSize,
		 *               (Widget) widget]
		 *
		 * Parameters:
		 *     (int) newHeight - new height
		 */
		_self.setHeight = function setHeight(newHeight) {
			var oldSize = _self.getSize();
			_height = newHeight;
			var newSize = _self.getSize();
			
			_self.dispatchEvent('widget:resized', {oldSize:oldSize, newSize:newSize, widget:_self});
		};
		
		/** Function: setPosition(left, top)
		 * Moves the <Widget> to the specified position.
		 *
		 * Emitted events:
		 *     moved - Triggered when the widget changed its location.
		 *             Parameters: [(Object) oldLocation, (Object) newLocation, 
		 *             (Widget) widget]
		 *
		 * Parameters:
		 *     (int) left - horizontal position
		 *     (int) top - vertical position
		 */
		_self.setPosition = function setPosition(left, top) {
			var oldPosition = _self.getPosition();
			_left = left;
			_top = top;
			var newPosition = _self.getPosition();
			
			_self.dispatchEvent('widget:moved', {oldPosition:oldPosition, newPosition:newPosition, widget:_self});
		};
		
		/** Function: setSize(width, height)
		 * Resizes the <Widget> to the specified size.
		 *
		 * Emitted events:
		 *     resized - Triggered when the widget changes its size.
		 *               Parameters: [(Object) oldSize, (Object) newSize,
		 *               (Widget) widget]
		 *
		 * Parameters:
		 *     (int) width - width
		 *     (int) height - height
		 */
		_self.setSize = function setSize(width, height) {
			var oldSize = _self.getSize();
			_width = width;
			_height = height;
			var newSize = _self.getSize();
			
			_self.dispatchEvent('widget:resized', {oldSize:oldSize, newSize:newSize, widget:_self});
		};
		
		/** Function: getState()
		 * Returns the current state of this <Widget>. "true" means, it is
		 * enabled, "false" says it is disabled.
		 *
		 * Returns:
		 *     (boolean) - true = enabled, false = disabled
		 */
		_self.getState = function getState() {
			return _state
		};
		
		/** Function: setState(state)
		 * Sets this <Widget> state on enabled or disabled.
		 *
		 *
		 * Parameters:
		 *     (boolean) newState - true = enabled, false = disabled
		 */
		_self.setState = function setState(newState) {
			var oldState = _state;
			_state = newState;
			
			if(oldState !== newState) {
				_self.dispatchEvent('widget:statechanged', {oldState:oldState, newState:newState, widget:_self});
			}
		};
		
		
		/** PrivateFunction: drawChildWidgets(ctx)
		 * Draws all child <Widget>s of this <Container> to the given graphic
		 * context.
		 *
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw into
		 */
		function drawChildWidgets(ctx) {
			for(var i = 0, l = _self.getWidgetCount(); i < l; i++) {
				drawWidgetToContext(ctx, _self.getWidget(i));
			}
		};
		
		/** PrivateFunction: drawWidgetToContext(widget)
		 * Draws a <Widget> to the given context.
		 * Before the widget gets drawn, the coordinate system gets translated
		 * to the widgets position and the rectangular area of the widgets
		 * bounds gets cleared. Further a clipping area with the bounds is
		 * created.
		 *
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw widget into
		 *     (Widget) widget - <Widget> which should be drawn
		 */
		function drawWidgetToContext(ctx, widget) {
			var bounds = widget.getBoundingBox();
			
			// Problem: if a widget is beneath another, rendering can be
			// invalid regarding specific update situations.
			
			ctx.save();
			ctx.translate(bounds.left, bounds.top);
			ctx.beginPath();
			ctx.rect(0, 0, bounds.width, bounds.height);
			ctx.clip();
			ctx.clearRect(0, 0, bounds.width, bounds.height);
			widget.draw(ctx);
			ctx.restore();
		};
		
		/** PrivateFunction: generateId()
		 * Generates a, hopefully, unique ID which can be used to identify
		 * a <Widget> instance.
		 *
		 * Returns:
		 *     (String)
		 */
		function generateId() {
			var currentTime = new Date().getTime();
			var random1 = Math.ceil(1000*Math.random());
			var random2 = Math.ceil(1000*Math.random());
			
			return (random1 + '-' + currentTime + '-' + random2);
		}
		
	};
	
	Widget.prototype = Object.create(Container.prototype);
	Widget.prototype.constructor = Widget;
	
	return Widget;
});
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
define('wings/MouseWidget',['require','exports','module','./Widget'],function(require, exports, module) {
	
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
				event.stopBubbling();
				
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
				var dragRequestEvent = _self.createDispatchableEvent('mouse:dragrequest',{absolutePosition:event.absolutePosition,acceptCallback: event.acceptCallback,cancelCallback: event.cancelCallback});
				_self.emit('dispatch', dragRequestEvent);
			} else {
				//event.cancelCallback();
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
/** Class: Button
 *
 * Emitted events:
 *     textChanged - Triggered when the <Button>s text was changed.
 *                   Parameters: [(String) oldText, (String) newText,
 *                   (Widget) widget]
 *     iconChanged - Triggered when the <Button>s icon was changed.
 *                   Parameters: [(Function) oldIcon, (Function) newIcon,
 *                   (Widget) widget]
 *
 * Inherits from:
 *     - <MouseWidget>
 */
define('wings/Button',['require','exports','module','./MouseWidget'],function(require, exports, module) {
	
	var MouseWidget = require('./MouseWidget');
		
	/** Constructor: Button(text)
	 * Creates a new instance of <Button>.
	 *
	 * Parameters:
	 *     (String) text - Text to show on the button (optional)
	 */
	var Button = function Button(text) {
		var _self = this;
		var _text = text || '';
		var _icon;
		var _iconPadding = 5;
		
		MouseWidget.call(this);
		
		/** Event Handler: textChanged, iconChanged
		 * Triggers a redraw as soon as the text or the icon of this <Button>
		 * was changed.
		 */
		_self.on(['button:textchanged','button:iconchanged'], function(oldValue, newValue, widget) {
			_self.redraw();
		});
		
		
		/** Function: drawWidget(ctx)
		 * Draws the <Level>, currently present in "_level".
		 *
		 * Overrides:
		 *     - <Widget.draw(ctx)>
		 * 
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw instance
		 */
		_self.drawWidget = function drawWidget(ctx) {
			var width = _self.getWidth();
			var height = _self.getHeight();
			var background = 'lightgray';

			if(!_self.getState()) {
				background = 'darkgray';
			}
			
			ctx.strokeStyle = 'black';
			ctx.fillStyle = background;
			ctx.fillRect(0,0,width,height);
			ctx.strokeRect(0,0,width,height);
			
			if(_icon) {
				var iconWidth = width-_iconPadding*2;
				var iconHeight = height-_iconPadding*2;
				ctx.save();
				ctx.translate(_iconPadding, _iconPadding);
				ctx.rect(0,0,iconWidth,iconHeight);
				ctx.clip();
				_icon(ctx, iconWidth, iconHeight);
				ctx.restore();
			} else if(_text && _text.length > 0) {
				var textWidth = ctx.measureText(_text).width;
				ctx.fillStyle = 'black';
				ctx.textBaseline = 'middle';
				ctx.fillText(_text, (width-textWidth)/2, height/2);
			}
		}
		
		/** Function: setText(newText)
		 * Sets the text which is displayed on this <Button>.
		 *
		 * Emitted events:
		 *     textChanged - Triggered when the <Button>s text was changed.
		 *                   Parameters: [(String) oldText, (String) newText,
		 *                   (Widget) widget]
		 */
		_self.setText = function setText(newText) {
			var oldText = _text;
			_text = newText;
			_self.dispatchEvent('button:textchanged', {oldText:oldText, newText:newText});
		}
		
		/** Function: getText()
		 * Returns the <Button>s current text.
		 *
		 * Returns:
		 *     (String)
		 */
		_self.getText = function getText() {
			return _text;
		}
		
		/** Function: setIcon(icon)
		 * Sets the icon of this <Button>.
		 *
		 * Emitted events:
		 *     iconChanged - Triggered when the <Button>s icon was changed.
		 *                   Parameters: [(Function) oldIcon, (Function)
		 *                   newIcon, (Widget) widget]
		 *
		 * Parameters:
		 *     (Function) icon - A function which draws an icon in given
		 *                       context with specified width and height.
		 *                       Parameters: [(Context) ctx, (int) width,
		 *                       (int) height]
		 */ 
		_self.setIcon = function setIcon(newIcon) {
			var oldIcon = _icon;
			_icon = newIcon;
			_self.dispatchEvent('button:iconchanged', {oldIcon:oldIcon, newIcon:newIcon});
		}
		
		/** Function: getIcon()
		 * Returns the current icon of this <Button>.
		 *
		 * Returns:
		 *     (Function|undefined) - icon draw function
		 */
		_self.getIcon = function getIcon() {
			return _icon;
		}
		
	};
	
	Button.prototype = Object.create(MouseWidget.prototype);
	Button.prototype.constructor = Button;
	
	return Button;
});
/** Class: CanvasWrapper
 * The <CanvasWrapper> takes a canvas from the DOM and renders a tree of
 * <Widget>s on it.
 *
 * Beside rendering <Widget>s into the Canvas, it also converts user input
 * like native mouse events into Wings-understandable "internal" events.
 * Example: The user moves the mouse over a <MouseWidget>, (or a subclass of
 * it), the <CanvasWrapper> converts this interaction into a native_mouseMove
 * event, which is then processed by the <MouseWidget> itself. For more
 * in-depth information, have a look at the "Canvas.*" event handlers.
 *
 * Inherits from:
 *     - <Widget>
 */
define('wings/CanvasWrapper',['require','exports','module','./Widget','./MouseWidget','./DefaultStrategy','./DragAndDropStrategy'],function(require, exports, module) {
	
	var Widget = require('./Widget');
	var MouseWidget = require('./MouseWidget')
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
		 * Detect drawRequest events from child <Widget>s and redraws them. The
		 * path parameter is used to set up correct clipping since it contains
		 * all the parent <Container>s of the <Widget>.
		 */
		_self.on('widget:drawrequest', function(event) {
			var widget = event.source;
			var bounds = widget.getBoundingBox();
			
			_ctx.save();
			
			var absolutePosition = { left: 0, top: 0 };
			if(!(widget instanceof CanvasWrapper)) {
				absolutePosition = _boostWidgets[widget.getId()].absolutePosition;
			}
			
			_ctx.translate(absolutePosition.left, absolutePosition.top);
			_ctx.beginPath();
			_ctx.rect(0,0,bounds.width,bounds.height);
			_ctx.clip();
			_ctx.clearRect(0,0,bounds.width,bounds.height);
			widget.draw(_ctx);
			_ctx.restore();
		});
		
		/** Event Handler: widgetAdded, widgetRemoved, childAddedWidget, childRemovedWidget
		 * Everytime a <Widget> gets added/removed directly to the
		 * <CanvasWrapper> OR somewhere below in the <Container> hierarchy, the
		 * internal list containing all <Widget>s gets refreshed.
		 *
		 * Parameters:
		 *     (Widget) widget - <Widget> which was added
		 *     (Array) path - The last <Container> in this array is the one,
		 *                    which "widget" was added to. The second last the
		 *                    parent of that <Container> and so on.
		 */
		_self.on(['container:widgetadded','container:widgetremoved','container:childaddedwidget','container:childremovedwidget'], function(event) {
			prepareSearchBoost();
		});
		
		
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
			if(point.top >= rect.top && point.top <= rect.top+rect.height
				&& point.left >= rect.left && point.left <= rect.left+rect.width) {
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
		
		/** Function: searchMouseWidgetsOnPosition(position, containedHandler, notContainedHandler)
		 * This is a wrapper for <CanvasWrapper.searchWidgetsOnPosition(position,
		 * containedHandler, notContainedHandler)>. It searches for <Widget>s
		 * too, but only if they are interested into mouse events, meaning that
		 * the widget must be a subclass of <MouseWidget>.
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
		_self.searchMouseWidgetsOnPosition = function searchMouseWidgetsOnPosition(position, containedHandler, notContainedHandler) {
			_self.searchWidgetsOnPosition(position,
				function(widget) {
					if(widget instanceof MouseWidget && containedHandler) {
						containedHandler(widget);
					}
				}, function(widget) {
					if(widget instanceof MouseWidget && notContainedHandler) {
						notContainedHandler(widget);						
					}
				}
			);
		};
		
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
/** Class: Label
 *
 * Emitted events:
 *     textChanged - Triggered when the <Label>s text was changed.
 *                   Parameters: [(String) oldText, (String) newText,
 *                   (Widget) widget]
 *
 * Inherits from:
 *     - <MouseWidget>
 */
define('wings/Label',['require','exports','module','./MouseWidget'],function(require, exports, module) {
	
	var MouseWidget = require('./MouseWidget');
	
	
	/** Constructor: Label(text)
	 * Creates a new instance of <Label>.
	 *
	 * Parameters:
	 *     (String) text - Text to show on the Label (optional)
	 */
	var Label = function Label(text) {
		var _self = this;
		var _text = text || '';
		
		MouseWidget.call(this);
		
		/** Event Handler: textChanged
		 * Triggers a redraw as soon as the text of this <Label> was changed.
		 */
		_self.on(['textChanged'], function(oldValue, newValue, widget) {
			_self.redraw();
		});
		
		
		/** Function: drawWidget(ctx)
		 *
		 * Overrides:
		 *     - <Widget.draw(ctx)>
		 * 
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw instance
		 */
		_self.drawWidget = function drawWidget(ctx) {
			var width = _self.getWidth();
			var height = _self.getHeight();
			
			ctx.borderStyle = 'black';
			ctx.strokeRect(0,0, width, height);
			
			if(_text && _text.length > 0) {
				var textWidth = ctx.measureText(_text).width;
				ctx.fillStyle = 'black';
				ctx.textBaseline = 'middle';
				ctx.font = "10px Verdana";
				ctx.fillText(_text, (width-textWidth)/2, height/2);
			}
		}
		
		/** Function: setText(newText)
		 * Sets the text which is displayed on this <Label>.
		 *
		 * Emitted events:
		 *     textChanged - Triggered when the <Label>s text was changed.
		 *                   Parameters: [(String) oldText, (String) newText,
		 *                   (Widget) widget]
		 */
		_self.setText = function setText(newText) {
			var oldText = _text;
			_text = newText;
			_self.emit('textChanged', oldText, newText, _self);
		}
		
		/** Function: getText()
		 * Returns the <Label>s current text.
		 *
		 * Returns:
		 *     (String)
		 */
		_self.getText = function getText() {
			return _text;
		}
		
	};
	
	Label.prototype = Object.create(MouseWidget.prototype);
	Label.prototype.constructor = Label;
	
	return Label;
});
/** Class: Rectangle
 *
 * Inherits from:
 *     - <MouseWidget>
 */
define('wings/Rectangle',['require','exports','module','./MouseWidget'],function(require, exports, module) {
	
	var MouseWidget = require('./MouseWidget');
	
	/** Constructor: Rectangle(text)
	 * Creates a new instance of <Rectangle>.
	 *
	 * Parameters:
	 *     (String) text - Text to show on the Rectangle (optional)
	 */
	var Rectangle = function Rectangle(text) {
		var _self = this;
		
		MouseWidget.call(this);	
		
		/** Function: drawWidget(ctx)
		 *
		 * Overrides:
		 *     - <Widget.draw(ctx)>
		 * 
		 * Parameters:
		 *     (Object) ctx - Graphical context to draw instance
		 */
		_self.drawWidget = function drawWidget(ctx) {
			var width = _self.getWidth();
			var height = _self.getHeight();
			var background = 'lightgray';
			
			ctx.strokeStyle = 'black';
			ctx.fillStyle = background;
			ctx.fillRect(0,0,width,height);
			ctx.strokeRect(0,0,width,height);
		}
		
	};
	
	Rectangle.prototype = Object.create(MouseWidget.prototype);
	Rectangle.prototype.constructor = Rectangle;
	
	return Rectangle;
});
define('wings',['require','wings/Button','wings/CanvasWrapper','wings/Container','wings/DefaultStrategy','wings/DragAndDropStrategy','wings/Emitter','wings/Label','wings/MouseStrategy','wings/MouseWidget','wings/Rectangle','wings/Widget'],function(require) {
	
	/** Module: wings
	 *
	 */
	var wings = {
		Button: require('wings/Button')
		,CanvasWrapper: require('wings/CanvasWrapper')
		,Container: require('wings/Container')
		,DefaultStrategy: require('wings/DefaultStrategy')
		,DragAndDropStrategy: require('wings/DragAndDropStrategy')
		,Emitter: require('wings/Emitter')
		,Label: require('wings/Label')
		,MouseStrategy: require('wings/MouseStrategy')
		,MouseWidget: require('wings/MouseWidget')
		,Rectangle: require('wings/Rectangle')
		,Widget: require('wings/Widget')
	};

	return wings;
});  var library = require('wings');
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = library;
  } else if(globalDefine) {
    (function (define) {
      define(function () { return library; });
    }(globalDefine));
  } else {
    global['wings'] = library;
  }
}(this));
