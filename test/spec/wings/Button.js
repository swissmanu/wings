define(['wings/Button', 'wings/Widget'], function (Button, Widget) {

    describe('helpers/wings/Button', function() {
	
        it('should be a Widget', function() {
            new Button().should.be.instanceof(Widget);
        });

		describe('Event Handlers', function() {
			var button = new Button();
			
			it('should trigger a drawRequest event when detecting a button:textchanged event', function(done) {
				button.once('widget:drawrequest', function(widget) { done(); });
				button.dispatchEvent('button:textchanged', {oldText: '1', newText: '2'});
			});
			
			it('should trigger a drawRequest event when detecting a button:iconchanged event', function(done) {
				button.once('widget:drawrequest', function(widget) { done(); });
				button.dispatchEvent('button:iconchanged', {oldIcon: function(){}, newIcon: function(){}});
			});
		});

		describe('Button()', function() {
			it('should create a new instance of Button', function() {
				new Button().should.be.instanceof(Button);
			});
			
			it('should take a text for the button initially', function() {
				var text = 'mybutton';
				var button = new Button(text);
				button.getText().should.be.equal(text);
			});
		});
		
		describe('draw()', function() {
			it('should not throw an Error telling draw() should be overwritten', function() {
				(function() {
					new Button().draw();
				}).should.not.throw('Overwrite Widget.draw(ctx)!');
			});
		});
		
		describe('setText()', function() {
			var button;
			var text = 'mybutton';
			
			beforeEach(function() {
				button = new Button();
			});
			
			it('should set the buttons text', function() {
				button.setText(text);
				button.getText().should.be.equal(text);
			});
			
			it('should trigger a button:textchanged event', function(done) {
				button.once('button:textchanged', function(event) {
					if(event.newText === text) { done(); }
				});
				button.setText(text);
			});
		});
		
		describe('getText()', function() {
			var button = new Button();
			var text = 'mybutton';
			
			it('should return the buttons text', function() {
				button.setText(text);
				button.getText().should.be.equal(text);
			});
		});
		
		describe('setIcon()', function() {
			var button;
			var icon = function drawIcon(ctx, width, height) {};
			
			beforeEach(function() {
				button = new Button();
			});
			
			it('should set the buttons icon', function() {
				button.setIcon(icon);
				button.getIcon().should.be.equal(icon);
			});
			
			it('should trigger a button:iconchanged event', function(done) {
				button.once('button:iconchanged', function(event) {
					if(event.newIcon === icon) { done(); }
				});
				button.setIcon(icon);
			});
		});
		
		describe('getIcon()', function() {
			it('should return the buttons current icon', function() {
				var button = new Button();
				var icon = function drawIcon(ctx, width, height) {};
				button.setIcon(icon);
				button.getIcon().should.be.equal(icon);
			});
		});
		
    });
	
});