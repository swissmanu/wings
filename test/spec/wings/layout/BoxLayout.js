define(['wings/layout/LayoutManager','wings/layout/BoxLayout','wings/Widget','wings/Panel'], function (LayoutManager, BoxLayout,Widget,Panel) {

    describe('BoxLayout', function() {
        it('should be an LayoutManager', function() {
            new BoxLayout().should.be.instanceof(LayoutManager);
        });

		describe('BoxLayout()', function() {
			it('should create a new instance of BoxLayout', function() {
				new BoxLayout().should.be.instanceof(BoxLayout);
			});
		});
		
		describe('layoutWidgets(parent,widgets)', function() {
			var parent;
			var widget1;
			var widget2;
			var widget3;
			
			beforeEach(function() {
				parent = new Panel();
				widget1 = new Widget();
				widget2 = new Widget();
				widget3 = new Widget();
				
				widget1.setSize(40,20);
				widget2.setSize(10,20);
				widget3.setSize(30,20);
			});
			
			it('should not throw an error signaling missing implementation', function() {
				(function() {
					new BoxLayout().layoutWidgets(new Widget(), []);
				}).should.not.throw();
			});
			
			it('should lay out widgets without horizontal margin correctly', function() {
				var boxLayout = new BoxLayout(BoxLayout.ORIENTATION.LEFT, 0);
				parent.setSize(200,50);
				
				var expectedLeftPositionWidget1 = 0;
				var expectedLeftPositionWidget2 = widget1.getSize().width;
				var expectedLeftPositionWidget3 = widget1.getSize().width + widget2.getSize().width;
				
				boxLayout.layoutWidgets(parent, [widget1,widget2,widget3]);
				
				widget1.getPosition().should.eql({left:expectedLeftPositionWidget1,top:0});
				widget2.getPosition().should.eql({left:expectedLeftPositionWidget2,top:0});
				widget3.getPosition().should.eql({left:expectedLeftPositionWidget3,top:0});
			});
			
			it('should lay out widgets with default horizontal margin correctly', function() {
				var boxLayout = new BoxLayout(BoxLayout.ORIENTATION.LEFT);
				var defaultMargin = 5;
				parent.setSize(200,50);
				
				var expectedLeftPositionWidget1 = 0;
				var expectedLeftPositionWidget2 = defaultMargin + widget1.getSize().width;
				var expectedLeftPositionWidget3 = 2*defaultMargin + widget1.getSize().width + widget2.getSize().width;
				
				boxLayout.layoutWidgets(parent, [widget1,widget2,widget3]);
				
				widget1.getPosition().should.eql({left:expectedLeftPositionWidget1,top:0});
				widget2.getPosition().should.eql({left:expectedLeftPositionWidget2,top:0});
				widget3.getPosition().should.eql({left:expectedLeftPositionWidget3,top:0});
			});
			
			it('should lay out widgets with specified horizontal margin correctly', function() {
				var margin = 10;
				var boxLayout = new BoxLayout(BoxLayout.ORIENTATION.LEFT, margin);
				parent.setSize(200,50);
				
				var expectedLeftPositionWidget1 = 0;
				var expectedLeftPositionWidget2 = margin + widget1.getSize().width;
				var expectedLeftPositionWidget3 = 2*margin + widget1.getSize().width + widget2.getSize().width;
				
				boxLayout.layoutWidgets(parent, [widget1,widget2,widget3]);
				
				widget1.getPosition().should.eql({left:expectedLeftPositionWidget1,top:0});
				widget2.getPosition().should.eql({left:expectedLeftPositionWidget2,top:0});
				widget3.getPosition().should.eql({left:expectedLeftPositionWidget3,top:0});
			});
			
		});
		
    });
	
});