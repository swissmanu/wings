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
		
		describe('isMouseOver()', function() {
			var mouseWidget = new MouseWidget();
			
			it('should return true after a mouse:enter event was received', function() {
				mouseWidget.emit('dispatch',{name:'mouse:enter'});
				mouseWidget.isMouseOver().should.be.true;
			});
			
			it('should return false after a native_mouseExited event was received', function() {
				mouseWidget.emit('dispatch',{name:'mouse:exit'});
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