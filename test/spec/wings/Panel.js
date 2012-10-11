define(['wings/Panel', 'wings/Widget','wings/mixin/Stylable'], function (Panel, Widget, Stylable) {

    describe('wings/Panel', function() {
	
        it('should be a Widget', function() {
            new Panel().should.be.instanceof(Widget);
        });

		it('should mix in Stylable', function() {
			var panel = new Panel();
			var stylable = new Stylable();
			
			for(var property in stylable) {
				panel.should.have.property(property);
			}
		});

		describe('Panel()', function() {
			it('should create a new instance of Panel', function() {
				new Panel().should.be.instanceof(Panel);
			});
		});
		
	});
	
});