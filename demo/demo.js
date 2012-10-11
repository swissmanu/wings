define(function(require) {
	var CanvasWrapper = require('wings/CanvasWrapper');
	var Panel = require('wings/Panel');
	var Label = require('wings/Label');
	var canvasWrapper = new CanvasWrapper(document.getElementById('view'));

	// Prepare parent:
	var parent = new Panel();
	var widgetToDrag = undefined;
	parent.setPosition(10,10);
	parent.setSize(400,400);
	parent.setBackgroundColor('blue');
	parent.setBorderColor('white');
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

	var additionalParent = new Panel();
	additionalParent.setSize(500,500)
	additionalParent.setPosition(10,10);
	additionalParent.setBackgroundColor('red');
	additionalParent.setBorderColor('black');
	additionalParent.addWidget(parent);
	canvasWrapper.addWidget(additionalParent);
	
	canvasWrapper.redraw();	
});