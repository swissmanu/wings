define(['widgetery/Widget', 'widgetery/Container'], function (Widget, Container) {

    describe('helpers/widgetery/Widget', function() {
        
        it('should be a Container', function() {
            new Widget().should.be.instanceof(Container);
        });

		describe('Widget()', function() {
			var widget = new Widget();
			
			it('should create a new instance of Widget', function() {
				widget.should.be.instanceof(Widget);
			});
			
			it('should trigger a drawRequest event when moved event was detected', function(done) {
				widget.once('drawRequest', function() { done(); });
				widget.emit('moved');
			});
			
			it('should trigger a drawRequest event when resized event was detected', function(done) {
				widget.once('drawRequest', function() { done(); });
				widget.emit('resized');
			});
			
			it('should trigger a drawRequest event when stateChanged event was detected', function(done) {
				widget.once('drawRequest', function() { done(); });
				widget.emit('stateChanged');
			});
		});

		/*
		describe('drawWidget()', function() {
			it('should throw an Error telling drawWidget() should be overwritten', function() {
				(function() {
					new Widget().drawWidget();
				}).should.throw('Overwrite Widget.drawWidget(ctx)!');
			});
		});
		*/
		
		describe('redraw()', function() {
			it('should trigger a drawRequest event', function(done) {
				var widget = new Widget();
				widget.once('drawRequest', function() { done(); });
				widget.redraw();
			});
		});
		
		describe('setTop()', function() {
			var widget;
			var top = 10;
			
			beforeEach(function() {
				widget = new Widget();
			});
			
			it('should set the vertical position', function() {
				widget.setTop(top);
				widget.getTop().should.be.equal(top);
			});
			
			it('should trigger a moved event', function(done) {
				widget.once('moved', function(oldPosition, newPosition, widget) {
					if(newPosition.top === top) done();
				});
				widget.setTop(top);
			});
		});
		
		describe('getTop()', function() {
			it('should return the vertical position', function() {
				var widget = new Widget();
				var top = 10;
				widget.setTop(top);
				widget.getTop().should.be.equal(top);
			});
		});
        
		describe('setLeft()', function() {
			var widget;
			var left = 10;
			
			beforeEach(function() {
				widget = new Widget();
			});
			
			it('should set the horizontal position', function() {
				widget.setLeft(left);
				widget.getLeft().should.be.equal(left);
			});
			
			it('should trigger a moved event', function(done) {
				widget.once('moved', function(oldPosition, newPosition, widget) {
					if(newPosition.left === left) done();
				});
				widget.setLeft(left);
			});
		});
		
		describe('getLeft()', function() {
			it('should return the horizontal position', function() {
				var widget = new Widget();
				var left = 10;
				widget.setLeft(left);
				widget.getLeft().should.be.equal(left);
			});
		});
		
		describe('setPosition()', function() {
			var widget;
			var left = 10;
			var top = 20;
			
			beforeEach(function() {
				widget = new Widget();
			});
			
			it('should set left and top', function() {
				widget.setPosition(left, top);
				widget.getPosition().should.be.eql({left: left, top: top});
			});
			
			it('should trigger a moved event', function(done) {
				widget.once('moved', function(oldPosition, newPosition, widget) {
					if(newPosition.left === left && newPosition.top === top) done();
				});
				widget.setPosition(left, top);
			});
		});
		
		describe('getPosition()', function() {
			it('should return horizontal and vertical position as literal', function() {
				var widget = new Widget();
				var left = 10;
				var top = 20;
				widget.setPosition(left, top);
				widget.getPosition().should.be.eql({left:left, top:top});
			});
		});
		
		describe('setWidth()', function() {
			var widget;
			var width = 10;
			
			beforeEach(function() {
				widget = new Widget();
			});
			
			it('should set the width', function() {
				widget.setWidth(width);
				widget.getWidth().should.be.equal(width);
			});
			
			it('should trigger a resized event', function(done) {
				widget.once('resized', function(oldSize, newSize, widget) {
					if(newSize.width === width) done();
				});
				widget.setWidth(width);
			});
		});
		
		describe('getWidth()', function() {
			it('should return the width', function() {
				var widget = new Widget();
				var width = 10;
				widget.setWidth(width);
				widget.getWidth().should.be.equal(width);
			});
		});
		
		describe('setHeight()', function() {
			var widget;
			var height = 10;
			
			beforeEach(function() {
				widget = new Widget();
			});
			
			it('should set the height', function() {
				widget.setHeight(height);
				widget.getHeight().should.be.equal(height);
			});
			
			it('should trigger a resized event', function(done) {
				widget.once('resized', function(oldSize, newSize, widget) {
					if(newSize.height === height) done();
				});
				widget.setHeight(height);
			});
		});
		
		describe('getHeight()', function() {
			it('should return the height', function() {
				var widget = new Widget();
				var height = 10;
				widget.setHeight(height);
				widget.getHeight().should.be.equal(height);
			});
		});
		
		describe('setSize()', function() {
			var widget;
			var width = 10;
			var height = 20;
			
			beforeEach(function() {
				widget = new Widget();
			});
			
			it('should set width and height', function() {
				widget.setSize(width, height);
				widget.getSize().should.be.eql({width: width, height: height});
			});
			
			it('should trigger a resized event', function(done) {
				widget.once('resized', function(oldSize, newSize, widget) {
					if(newSize.width === width && newSize.height === height) done();
				});
				widget.setSize(width, height);
			});
		});
		
		describe('getSize()', function() {
			it('should return width and height as literal', function() {
				var widget = new Widget();
				var width = 10;
				var height = 20;
				widget.setSize(width, height);
				widget.getSize().should.be.eql({width:width, height:height});
			});
		});
		
		describe('getBoundingBox()', function() {
			it('should return position and size as literal', function() {
				var widget = new Widget();
				var left = 10;
				var top = 20;
				var width = 30;
				var height = 40;
				widget.setPosition(left, top);
				widget.setSize(width, height);
				
				widget.getBoundingBox().should.be.eql({
					left: left, top: top
					,width: width, height: height
				});
			});
		});
		
		describe('setState()', function() {
			var widget;
			
			beforeEach(function() {
				widget = new Widget();
			});
			
			it('should set the state to true', function() {
				var enabled = true;
				widget.setState(enabled);
				widget.getState().should.be.equal(enabled);
			});
			
			it('should set the state to false', function() {
				var disabled = false;
				widget.setState(disabled);
				widget.getState().should.be.equal(disabled);
			});
			
			it('should trigger a stateChanged event', function(done) {
				var disabled = false;
				widget.once('stateChanged', function(oldState, newState, widget) {
					if(newState === disabled) done();
				});
				widget.setState(disabled);
			});
		});
		
		describe('getState()', function() {
			it('should return the widgets current state', function() {
				var widget = new Widget();
				var disabled = false;
				widget.setState(disabled);
				widget.getState().should.be.equal(disabled);
			});
		});
		
    });
	
});