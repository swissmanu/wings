define(['widgetery/MouseWidget', 'widgetery/Widget'], function (MouseWidget, Widget) {

    describe('helpers/widgetery/MouseWidget', function() {
        
        it('should be a MouseWidget', function() {
            new MouseWidget().should.be.instanceof(Widget);
        });

		describe('MouseWidget()', function() {
			var widget = new MouseWidget();
			
			it('should create a new instance of MouseWidget', function() {
				widget.should.be.instanceof(MouseWidget);
			});
		});
		
		/*
		describe('drawWidget()', function() {
			it('should throw an Error telling drawWidget() should be overwritten', function() {
				(function() {
					new MouseWidget().drawWidget();
				}).should.throw('Overwrite Widget.drawWidget(ctx)!');
			});
		});
		*/
				
		describe('native_mouseEntered Event Handler', function() {
			var mouseWidget = new MouseWidget();

			it('should trigger a mouseEntered event when receiving a native_mouseEntered event', function(done) {
				mouseWidget.once('mouseEntered', function() { done(); });
				mouseWidget.emit('native_mouseEntered');
			});			
		});
		
		describe('native_mouseExited Event Handler', function() {
			var mouseWidget = new MouseWidget();
			
			beforeEach(function() {
				mouseWidget.emit('native_mouseEntered');
			});
			
			it('should trigger a mouseExited event when receiving a native_mouseExited event', function(done) {
				mouseWidget.once('mouseExited', function() { done(); });
				mouseWidget.emit('native_mouseExited');
			});
		});
		
		describe('native_clicked Event Handler', function() {
			var mouseWidget = new MouseWidget();
			var nativeButton = 2;
			var nativePosition = { left: 10, top: 20 };

			it('should trigger a clicked event when receiving a native_clicked event', function(done) {
				mouseWidget.once('clicked', function() { done(); });
				mouseWidget.emit('native_clicked');
			});

			it('should forward the correct mouse button', function(done) {
				mouseWidget.once('clicked', function(button) {
					if(button === nativeButton) done();
				});
				mouseWidget.emit('native_clicked', nativeButton, nativePosition);
			})
			
			it('should forward the correct position', function(done) {
				mouseWidget.once('clicked', function(button, position) {
					if(position.top === nativePosition.top
						&& position.left === nativePosition.left) {
						done();
					}
				});
				mouseWidget.emit('native_clicked', nativeButton, nativePosition);
			});
			
		});
		
		describe('native_mouseDown Event Handler', function() {
			var mouseWidget = new MouseWidget();
			var nativeButton = 2;
			var nativePosition = { left: 10, top: 20 };

			it('should trigger a mouseButtonPressed event when receiving a native_mouseDown event', function(done) {
				mouseWidget.once('mouseButtonPressed', function() { done(); });
				mouseWidget.emit('native_mouseDown');
			});

			it('should forward the correct mouse button', function(done) {
				mouseWidget.once('mouseButtonPressed', function(button) {
					if(button === nativeButton) done();
				});
				mouseWidget.emit('native_mouseDown', nativeButton, nativePosition);
			})
			
			it('should forward the correct position', function(done) {
				mouseWidget.once('mouseButtonPressed', function(button, position) {
					if(position.top === nativePosition.top
						&& position.left === nativePosition.left) {
						done();
					}
				});
				mouseWidget.emit('native_mouseDown', nativeButton, nativePosition);
			});
			
		});
		
		describe('native_mouseUp Event Handler', function() {
			var mouseWidget = new MouseWidget();
			var nativeButton = 2;
			var nativePosition = { left: 10, top: 20 };

			it('should trigger a mouseButtonReleased event when receiving a native_mouseUp event', function(done) {
				mouseWidget.once('mouseButtonReleased', function() { done(); });
				mouseWidget.emit('native_mouseUp');
			});

			it('should forward the correct mouse button', function(done) {
				mouseWidget.once('mouseButtonReleased', function(button) {
					if(button === nativeButton) done();
				});
				mouseWidget.emit('native_mouseUp', nativeButton, nativePosition);
			})
			
			it('should forward the correct position', function(done) {
				mouseWidget.once('mouseButtonReleased', function(button, position) {
					if(position.top === nativePosition.top
						&& position.left === nativePosition.left) {
						done();
					}
				});
				mouseWidget.emit('native_mouseUp', nativeButton, nativePosition);
			});
			
		});
		
		describe('isMouseOver()', function() {
			var mouseWidget = new MouseWidget();
			
			it('should return true after a native_mouseEntered event was received', function() {
				mouseWidget.emit('native_mouseEntered');
				mouseWidget.isMouseOver().should.be.true;
			});
			
			it('should return false after a native_mouseExited event was received', function() {
				mouseWidget.emit('native_mouseExited');
				mouseWidget.isMouseOver().should.be.false;
			});
		});
		
		describe('setDraggable()', function() {
			var mouseWidget = new MouseWidget();
			
			it('should enable the ability to be draggable', function() {
				mouseWidget.setDraggable(true);
				mouseWidget.isDraggable().should.be.true;
			});
		});
		
		describe('isDraggable()', function() {
			var mouseWidget = new MouseWidget();
			
			it('should return false by default', function() {
				mouseWidget.isDraggable().should.be.false;
			});
			
			it('should return true after MouseWidget was made draggable', function() {
				mouseWidget.setDraggable(true);
				mouseWidget.isDraggable().should.be.true;
			});
		});
		
    });
	
});