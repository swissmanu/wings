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
	parent.setSize(400,400);
	parent.setDraggable(true);
	var initialClick;
	parent.on('mouse:dragrequest', function(event) {
		widgetToDrag = canvasWrapper.searchDeepestWidgetOnPosition(event.absolutePosition);
		
		if(widgetToDrag !== parent) {
			event.acceptCallback(parent,widgetToDrag);
			event.stopBubbling();
			initialClick = event.absolutePosition;
		}
	});
	parent.on('mouse:drag', function(event) {
		var parentLeft = 10;
		var parentTop = 10;
		var left = event.absolutePosition.left - parentLeft;
		var top = event.absolutePosition.top - parentTop;
		
		widgetToDrag.setPosition(left, top);
	});
	

	// Add some Labels:
	for(var i = 0, l = 5; i<l; i++) {
		var y = i*50+20;
		var label = new Label('20/' + y);
		label.setPosition(20,y);
		label.setSize(150,20);
		
		label.on('widget:moved', function(e) {
			e.widget.setText(e.newPosition.left + '/' + e.newPosition.top);
		});
		
		parent.addWidget(label);
	}
	
	var additionalParent = new Rectangle();
	additionalParent.setSize(500,500)
	additionalParent.setPosition(10,10);
	additionalParent.addWidget(parent);
	canvasWrapper.addWidget(additionalParent);
	canvasWrapper.redraw();
});