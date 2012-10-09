define('wingsdemo', function(require,exports,module) {
	var CanvasWrapper = require('wings/CanvasWrapper');
	var MouseWidget = require('wings/MouseWidget');
	var Label = require('wings/Label');
	var Rectangle = require('wings/Rectangle');

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
			initialClick = canvasWrapper.convertAbsoluteToRelativePosition(event.absolutePosition,widgetToDrag);
		}
	});
	parent.on('mouse:drag', function(event) {
		var position = canvasWrapper.convertAbsoluteToRelativePosition(event.absolutePosition, parent);
		widgetToDrag.setPosition(position.left-initialClick.left, position.top-initialClick.top);
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