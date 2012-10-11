define(['wings/layout/LayoutManager','wings/layout/BoxLayout','wings/Widget'], function (LayoutManager, BoxLayout,Widget) {

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
					new BoxLayout().layoutWidgets();
				}).should.not.throw();
			});
		});
		
    });
	
});