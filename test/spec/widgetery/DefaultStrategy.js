define(['widgetery/DefaultStrategy','widgetery/MouseStrategy'], function (DefaultStrategy, MouseStrategy) {

    describe('DefaultStrategy', function() {
		var MockCanvasWrapper = function MockCanvasWrapper() {
			this.searchMouseWidgetsOnPosition = function() {};
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
		});
		
    });
	
});