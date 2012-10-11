define(function(require) {
	var CanvasWrapper = require('wings/CanvasWrapper');
	var Panel = require('wings/Panel');
	var Label = require('wings/Label');
	var BoxLayout = require('wings/layout/BoxLayout');
	var Button = require('wings/Button');
	var canvasWrapper = new CanvasWrapper(document.getElementById('view'));
	
	var orientation = BoxLayout.ORIENTATION.RIGHT;
	var panel = new Panel();
	panel.setSize(500,50);
	panel.setBackgroundColor('lightgray');
	panel.setBorderColor('black');
	panel.setLayoutManager(new BoxLayout(orientation));
	canvasWrapper.addWidget(panel);
	
	panel.on('mouse:click', function(e) {
		var subPanel = new Label('#' + (panel.getWidgetCount()+1));
		subPanel.setSize(30,20);
		//subPanel.setBorderColor('#FF0000');
		//subPanel.setBackgroundColor('rgba(255,0,0,.1)');
		panel.addWidget(subPanel);
	});
	
	var btnToggleOrientation = new Button('Toggle Orientation');
	btnToggleOrientation.setSize(150,20);
	btnToggleOrientation.setPosition(0,60);
	btnToggleOrientation.on('mouse:click', function(e) {
		if(orientation === 0) orientation = 1;
		else orientation = 0;
		panel.setLayoutManager(new BoxLayout(orientation));
	});
	canvasWrapper.addWidget(btnToggleOrientation);

	/*
	// Prepare parent:
	var parent = new Panel();
	var widgetToDrag = undefined;
	parent.setPosition(10,10);
	parent.setSize(400,400);
	parent.setBackgroundColor('lightgray');
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
	additionalParent.setBackgroundColor('gray');
	additionalParent.setBorderColor('black');
	additionalParent.addWidget(parent);
	canvasWrapper.addWidget(additionalParent);
	*/
	canvasWrapper.redraw();	
});