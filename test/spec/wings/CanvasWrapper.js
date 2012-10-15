define(['wings/CanvasWrapper', 'wings/Widget'], function (CanvasWrapper, Widget) {

    describe('helpers/wings/CanvasWrapper', function() {
		var mockCanvas = {
			width: 100
			,height: 100
			,addEventListener: function() {}
			,getContext: function() { return {
				save:function(){}
				,restore:function(){}
				,scale:function(){}
				,translate:function(){}
				,beginPath:function(){}
				,rect:function(){}
				,clip:function(){}
				,clearRect:function(){}
			}}
		};
		
        it('should be a Widget', function() {
            new CanvasWrapper(mockCanvas).should.be.instanceof(Widget);
        });

		describe('getZoomFactor()', function() {
			it('should return the default zoom factor', function() {
				var canvasWrapper = new CanvasWrapper(mockCanvas);
				var defaultZoomFactor = 1;
				
				canvasWrapper.getZoomFactor().should.be.equal(defaultZoomFactor);
			});
		});
		
		describe('setZoomFactor()', function() {
			var canvasWrapper;
			var newZoomFactor = 2;
			
			beforeEach(function() {
				canvasWrapper = new CanvasWrapper(mockCanvas);
			});
			
			it('should change the zoom factor', function() {
				canvasWrapper.setZoomFactor(newZoomFactor);
				canvasWrapper.getZoomFactor().should.be.equal(newZoomFactor);
			});
			
			it('should dispatch a canvaswrapper:zoomfactorchanged event', function(done) {
				canvasWrapper.once('canvaswrapper:zoomfactorchanged', function(e) {
					if(e.newZoomFactor === newZoomFactor) done();
				});
				canvasWrapper.setZoomFactor(newZoomFactor);
			});
			
			it('should not allow zoom factors less than 0', function() {
				var invalidZoomFactor = -1;
				
				(function() {
					canvasWrapper.setZoomFactor(invalidZoomFactor);
				}).should.throw();
			});
			
		});

		describe('searchDeepestWidgetOnPosition()', function() {
			var canvasWrapper;
			var widgetA;
			var widgetB;
			var widgetC;
			
			beforeEach(function() {
 				canvasWrapper = new CanvasWrapper(mockCanvas);

				/* Widget Hierarchy under test:
				 * +--------------------------+ A
				 * |                          |
				 * +----------------+ B       |
				 * |                |         |
				 * |                |         |
				 * |            +---+ C       |
				 * |            |   |         |
				 * +------------+---+---------+
				 */
				widgetA = new Widget();
				widgetB = new Widget();
				widgetC = new Widget();
				
				widgetA.setPosition(0,0);
				widgetA.setSize(100,50);
				widgetB.setPosition(0,10);
				widgetB.setSize(50,40);
				widgetC.setPosition(30,30);
				widgetC.setSize(10,10);
				
				widgetB.addWidget(widgetC);
				widgetA.addWidget(widgetB);
				canvasWrapper.addWidget(widgetA);
			});
			
			it('should return the widget c at position (35/45)', function() {
				var position = {left:35,top:45};
				var deepestWidget = canvasWrapper.searchDeepestWidgetOnPosition(position);
				
				should.exist(deepestWidget);
				deepestWidget.should.be.equal(widgetC);
			});
		
			it('should return the widget b at position (50/10)', function() {
				var position = {left:50,top:10};
				var deepestWidget = canvasWrapper.searchDeepestWidgetOnPosition(position);
				
				should.exist(deepestWidget);
				deepestWidget.should.be.equal(widgetB);
			});
		
			it('should return the widget a at position (80/30)', function() {
				var position = {left:80,top:30};
				var deepestWidget = canvasWrapper.searchDeepestWidgetOnPosition(position);
				
				should.exist(deepestWidget);
				deepestWidget.should.be.equal(widgetA);
			});
			
			it('should return no widget at position (110/10)', function() {
				var position = {left:110,top:10};
				var deepestWidget = canvasWrapper.searchDeepestWidgetOnPosition(position);
				
				should.not.exist(deepestWidget);
			});
		});
		
		describe('convertAbsoluteToRelativePosition()', function() {
			var canvasWrapper;
			var widgetA;
			var widgetB;
			var widgetC;
			
			beforeEach(function() {
 				canvasWrapper = new CanvasWrapper(mockCanvas);

				/* Widget Hierarchy under test:
				 * +--------------------------+ A
				 * |                          |
				 * +----------------+ B       |
				 * |                |         |
				 * |                |         |
				 * |            +---+ C       |
				 * |            | X |         |
				 * +------------+---+---------+
				 *
				 * X = Absolute Position to Calculate
				 */
				widgetA = new Widget();
				widgetB = new Widget();
				widgetC = new Widget();
				
				widgetA.setPosition(0,0);
				widgetA.setSize(100,50);
				widgetB.setPosition(0,10);
				widgetB.setSize(50,40);
				widgetC.setPosition(30,30);
				widgetC.setSize(10,10);
				
				widgetB.addWidget(widgetC);
				widgetA.addWidget(widgetB);
				canvasWrapper.addWidget(widgetA);
			});
			
			it('should return the correct relative coordinate', function() {
				var absolute = { left: 35, top: 45 };
				var relative = { left: 5, top: 5 };
				
				canvasWrapper.convertAbsoluteToRelativePosition(absolute, widgetC)
					.should.eql(relative);
			});
			
		});
		
    });
	
});