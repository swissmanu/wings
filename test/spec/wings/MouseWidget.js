define(['wings/MouseWidget', 'wings/Widget'], function (MouseWidget, Widget) {

    describe('helpers/wings/MouseWidget', function() {
        
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
				var enterEvent = mouseWidget.createDispatchableEvent('mouse:enter');
				mouseWidget.emit('dispatch', enterEvent);
				mouseWidget.isMouseOver().should.be.true;
			});
			
			it('should return false after a mouse:exit event was received', function() {
				var exitEvent = mouseWidget.createDispatchableEvent('mouse:exit');
				mouseWidget.emit('dispatch',exitEvent);
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