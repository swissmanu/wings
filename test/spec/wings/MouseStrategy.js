define(['wings/MouseStrategy', 'helpers/Emitter'], function (MouseStrategy, Emitter) {

    describe('helpers/wings/MouseStrategy', function() {
        
        it('should be an Emitter', function() {
            new MouseStrategy().should.be.instanceof(Emitter);
        });

		describe('MouseStrategy()', function() {
			it('should create a new instance of MouseStrategy', function() {
				new MouseStrategy().should.be.instanceof(MouseStrategy);
			});
			
			it('should take a CanvasWrapper instance', function() {
				var wrapperDummy = { dummy: true };
				var mouseStrategy = new MouseStrategy(wrapperDummy);
				mouseStrategy.getCanvasWrapper().should.be.equal(wrapperDummy);
			});
		});
		
		describe('mouseMoved', function() {
			it('should throw an error signaling missing implementation', function() {
				(function() {
					new MouseStrategy().mouseMoved();
				}).should.throw('Implement mouseMoved!');
			});
		});
		
		describe('mouseButtonPressed', function() {
			it('should throw an error signaling missing implementation', function() {
				(function() {
					new MouseStrategy().mouseButtonPressed();
				}).should.throw('Implement mouseButtonPressed!');
			});
		});
		
		describe('mouseButtonReleased', function() {
			it('should throw an error signaling missing implementation', function() {
				(function() {
					new MouseStrategy().mouseButtonReleased();
				}).should.throw('Implement mouseButtonReleased!');
			});
		});
		
		describe('mouseButtonClicked', function() {
			it('should throw an error signaling missing implementation', function() {
				(function() {
					new MouseStrategy().mouseButtonClicked();
				}).should.throw('Implement mouseButtonClicked!');
			});
		});
		
    });
	
});