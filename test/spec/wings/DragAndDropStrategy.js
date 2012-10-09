define(['wings/DragAndDropStrategy','wings/MouseStrategy'], function (DragAndDropStrategy, MouseStrategy) {

    describe('DragAndDropStrategy', function() {
		var MockCanvasWrapper = function MockCanvasWrapper() {
			this.searchMouseWidgetsOnPosition = function() {};
			this.emit = function() {};
			this.useDefaultStrategy = function() {};
			this.searchDeepestWidgetOnPosition = function() {};
		};
		
        it('should be an MouseStrategy', function() {
            new DragAndDropStrategy().should.be.instanceof(MouseStrategy);
        });

		describe('DragAndDropStrategy()', function() {
			it('should create a new instance of DragAndDropStrategy', function() {
				new DragAndDropStrategy().should.be.instanceof(DragAndDropStrategy);
			});
			
			it('should take a CanvasWrapper instance', function() {
				var wrapperMock = new MockCanvasWrapper();
				var defaultStrategy = new DragAndDropStrategy(wrapperMock);
				defaultStrategy.getCanvasWrapper().should.be.equal(wrapperMock);
			});
		});
		
		describe('mouseMoved', function() {
			var wrapperMock = new MockCanvasWrapper();
			var position = {left:0,top:0};
			
			it('should not throw an error signaling missing implementation', function() {
				(function() {
					new DragAndDropStrategy(wrapperMock).mouseMoved(position);
				}).should.not.throw();
			});
		});
		
		describe('mouseButtonPressed', function() {
			var wrapperMock = new MockCanvasWrapper();
			var button = 0;
			var position = {left:0,top:0};
			
			it('should not throw an error signaling missing implementation', function() {
				(function() {
					new DragAndDropStrategy(wrapperMock).mouseButtonPressed(button, position);
				}).should.not.throw();
			});
		});
		
		describe('mouseButtonReleased', function() {
			var wrapperMock = new MockCanvasWrapper();
			var button = 0;
			var position = {left:0,top:0};
			
			it('should not throw an error signaling missing implementation', function() {
				(function() {
					new DragAndDropStrategy(wrapperMock).mouseButtonReleased(button, position);
				}).should.not.throw();
			});
		});
		
		describe('mouseButtonClicked', function() {
			var wrapperMock = new MockCanvasWrapper();
			var button = 0;
			var position = {left:0,top:0};
			
			it('should not throw an error signaling missing implementation', function() {
				(function() {
					new DragAndDropStrategy(wrapperMock).mouseButtonClicked(button, position);
				}).should.not.throw();
			});
		});
		
    });
	
});