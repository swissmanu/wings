define(['wings/Emitter'], function(Emitter) {

	describe('wings/Emitter', function() {
		var emitter = new Emitter();
		var event1 = 'event1';
		var event2 = 'event2';
		
		describe('on()', function() {
			afterEach(function() {
				emitter.off(event1);
				emitter.off(event2);
			});
			
			it('should add a callback for a single event', function(done) {
				emitter.on(event1, function() { done(); });
				emitter.emit(event1);
			});
			
			it('should add a callback for multiple events', function(done) {
				var checkCounter = 0;
				var checker = function() { checkCounter++; if(checkCounter === 2) done(); }
				
				emitter.on([event1,event2], function() { checker(); });
				emitter.emit(event1);
				emitter.emit(event2);
			});
		});
		
		describe('emit()', function() {
			it('should emit an event', function(done) {
				emitter.once(event1, function() { done(); });
				emitter.emit(event1);
			});
			
			it('should return true, if an event listener does not return any value', function() {
				emitter.once(event1, function() {});
				emitter.emit(event1).should.be.true;
			});
			
			it('should return true, if an event listener returns true', function() {
				emitter.once(event1, function() { return true; });
				emitter.emit(event1).should.be.true;
			});
			
			it('should return false, if an event listener wants to stop event processing', function() {
				emitter.once(event1, function() { return false; });
				emitter.emit(event1).should.be.false;
			});
			
		});
		
	});

	
});