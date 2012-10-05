/** Class: Emitter
 * A base class which provides basic functionalities for emitting events.
 * 
 * Original implementation:
 *     - https://github.com/visionmedia/uikit/blob/master/lib/components/emitter/emitter.js
 */
define(function(require, exports, module) {
	
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