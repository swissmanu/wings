define(['wings/DefaultStrategy','wings/MouseStrategy','wings/Widget'], function (DefaultStrategy, MouseStrategy,Widget) {

    describe('DefaultStrategy', function() {
		var deepestWidget = new Widget();
		var MockCanvasWrapper = function MockCanvasWrapper() {
			this.searchMouseWidgetsOnPosition = function() {};
			this.searchDeepestWidgetOnPosition = function() { return deepestWidget; };
			this.emit = function() {};
		};
	
        
        it('should be an MouseStrategy', function() {
            new DefaultStrategy().should.be.instanceof(MouseStrategy);
        });

		describe('DefaultStrategy()', function() {
			it('should create a new instance of DefaultStrategy', function() {
				new DefaultStrategy().should.be.instanceof(DefaultStrategy);
			});
			
			it('should take a CanvasWrapper instance', function() {
				var wrapperMock = new MockCanvasWrapper();
				var defaultStrategy = new DefaultStrategy(wrapperMock);
				defaultStrategy.getCanvasWrapper().should.be.equal(wrapperMock);
			});
		});
		
		describe('mouseMoved', function() {
			var wrapperMock = new MockCanvasWrapper();
			var position = {left:0,top:0};
			
			it('should not throw an error signaling missing implementation', function() {
				(function() {
					new DefaultStrategy(wrapperMock).mouseMoved(position);
				}).should.not.throw();
			});
			
			it('should emit a dispatch event "mouse:move" to the deepest widget', function(done) {
				var strategy = new DefaultStrategy(wrapperMock);
				deepestWidget.once('mouse:move', function(event) { done(); });
				strategy.mouseMoved(position);
			});
			
		});
		
		describe('mouseButtonPressed', function() {
			var wrapperMock = new MockCanvasWrapper();
			var button = 0;
			var position = {left:0,top:0};
			
			it('should not throw an error signaling missing implementation', function() {
				(function() {
					new DefaultStrategy(wrapperMock).mouseButtonPressed(button, position);
				}).should.not.throw();
			});
			
			it('should emit a dispatch event "mouse:down" to the deepest widget', function(done) {
				var strategy = new DefaultStrategy(wrapperMock);
				deepestWidget.once('mouse:down', function(event) { done(); });
				strategy.mouseButtonPressed(button, position);
			});
		});
		
		describe('mouseButtonReleased', function() {
			var wrapperMock = new MockCanvasWrapper();
			var button = 0;
			var position = {left:0,top:0};
			
			it('should not throw an error signaling missing implementation', function() {
				(function() {
					new DefaultStrategy(wrapperMock).mouseButtonReleased(button, position);
				}).should.not.throw();
			});
			
			it('should emit a dispatch event "mouse:up" to the deepest widget', function(done) {
				var strategy = new DefaultStrategy(wrapperMock);
				deepestWidget.once('mouse:up', function(event) { done(); });
				strategy.mouseButtonReleased(button, position);
			});
		});
		
		describe('mouseButtonClicked', function() {
			var wrapperMock = new MockCanvasWrapper();
			var button = 0;
			var position = {left:0,top:0};
			
			it('should not throw an error signaling missing implementation', function() {
				(function() {
					new DefaultStrategy(wrapperMock).mouseButtonClicked(button, position);
				}).should.not.throw();
			});
			
			it('should emit a dispatch event "mouse:click" to the deepest widget', function(done) {
				var strategy = new DefaultStrategy(wrapperMock);
				deepestWidget.once('mouse:click', function(event) { done(); });
				strategy.mouseButtonClicked(button, position);
			});
		});
		
    });
	
});