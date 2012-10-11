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
			it('should not throw an error signaling missing implementation', function() {
				(function() {
					new BoxLayout().layoutWidgets(new Widget(), []);
				}).should.not.throw();
			});
			
			
			it('should lay out widgets correct', function() {
				var parent = new Panel();
				var widget1 = new Widget();
				var widget2 = new Widget();
				var boxLayout = new BoxLayout();
				
				parent.setSize(200,50);
				widget1.setSize(40,20);
				widget2.setSize(40,20);
				
				boxLayout.layoutWidgets(parent, [widget1,widget2]);
				
				widget1.getPosition().should.eql({left:0,top:0});
				widget2.getPosition().should.eql({left:40,top:0});
			});
			
		});
		
    });
	
});