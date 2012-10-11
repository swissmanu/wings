define(['wings/Label', 'wings/Widget','wings/mixin/Stylable'], function (Label, Widget, Stylable) {

    describe('wings/Label', function() {
	
        it('should be a Widget', function() {
            new Label().should.be.instanceof(Widget);
        });

		it('should mix in Stylable', function() {
			var label = new Label();
			var stylable = new Stylable();
			
			for(var property in stylable) {
				label.should.have.property(property);
			}
		});

		describe('Event Handlers', function() {
			var label = new Label();
			
			it('should trigger a drawRequest event when detecting a label:textchanged event', function(done) {
				label.once('widget:drawrequest', function(widget) { done(); });
				label.dispatchEvent('label:textchanged', {oldText: '1', newText: '2'});
			});
		});

		describe('Label()', function() {
			it('should create a new instance of Label', function() {
				new Label().should.be.instanceof(Label);
			});
			
			it('should take a text for the label initially', function() {
				var text = 'mylabel';
				var label = new Label(text);
				label.getText().should.be.equal(text);
			});
		});
		
		
		describe('getText()', function() {
			var label = new Label();
			var text = 'mylabel';
			
			it('should return the labels text', function() {
				label.setText(text);
				label.getText().should.be.equal(text);
			});
		});
		
		describe('setText()', function() {
			var label;
			var text = 'mylabel';
			
			beforeEach(function() {
				label = new Label();
			});
			
			it('should set the labels text', function() {
				label.setText(text);
				label.getText().should.be.equal(text);
			});
			
			it('should trigger a label:textchanged event', function(done) {
				label.once('label:textchanged', function(event) {
					if(event.newText === text) { done(); }
				});
				label.setText(text);
			});
		});
	});
	
});