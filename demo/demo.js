define('widgeterydemo', function(require,exports,module) {
	var CanvasWrapper = require('widgetery/CanvasWrapper');
	var MouseWidget = require('widgetery/MouseWidget');
	var Label = require('widgetery/Label');
	var Rectangle = require('widgetery/Rectangle');

	var canvas = document.getElementById('view');
	var canvasWrapper = new CanvasWrapper(canvas);

	var widget = new Rectangle();
	widget.setPosition(10,10);
	widget.setSize(500,500);
	canvasWrapper.addWidget(widget);

	var lblText = new Label('Drag Me!');
	lblText.setPosition(10,10);
	lblText.setSize(100,20);
	lblText.setDraggable(true);
	lblText.on('dragRequest', function(acceptCallback, cancelCallback) {
		acceptCallback(this, 'data yay');
	});
	lblText.on('dragged', function(position,source) {
		lblText.setPosition(position.left, position.top);
		widget.redraw();
	});

	var lblNotDraggable = new Label('Cant touch me');
	lblNotDraggable.setPosition(50,50);
	lblNotDraggable.setSize(100,20);

	widget.addWidget(lblNotDraggable);
	widget.addWidget(lblText);


	canvasWrapper.redraw();
});