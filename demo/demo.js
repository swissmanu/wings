define('widgeterydemo', function(require,exports,module) {
	var CanvasWrapper = require('widgetery/CanvasWrapper');
	var MouseWidget = require('widgetery/MouseWidget');
	var Label = require('widgetery/Label');
	var Rectangle = require('widgetery/Rectangle');

	var canvas = document.getElementById('view');
	var canvasWrapper = new CanvasWrapper(canvas);
	var parent = new Rectangle();
	
	// Prepare parent:
	var widgetToDrag = undefined;
	parent.setPosition(10,10);
	parent.setSize(500,500);
	parent.setDraggable(true);
	parent.on('mouse:dragrequest', function(event) {
		widgetToDrag = canvasWrapper.searchDeepestWidgetOnPosition(event.absolutePosition);
		
		if(widgetToDrag !== parent) {
			event.acceptCallback(parent,widgetToDrag);
			event.stopBubbling();
		}
	});
	parent.on('mouse:drag', function(event) {
		widgetToDrag.setPosition(event.absolutePosition.left, event.absolutePosition.top);
		canvasWrapper.redraw();
		event.stopBubbling();
	});
	

	// Add some Labels:
	for(var i = 0, l = 5; i<l; i++) {
		var label = new Label('Drag Me! I\'m #' + i);
		label.setPosition(20,i*50+20);
		label.setSize(150,20);
		parent.addWidget(label);
	}
	
	canvasWrapper.addWidget(parent);
	canvasWrapper.redraw();
});