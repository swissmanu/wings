define(['wings/mixin/Stylable'], function (Stylable) {

    describe('wings/mixin/Stylable', function() {

		describe('Stylable()', function() {
			it('should create a new instance of Stylable', function() {
				new Stylable().should.be.instanceof(Stylable);
			});
		});
		
		describe('getBackgroundColor()', function() {
			it('should return the default background color', function() {
				var defaultBackgroundColor = 'none';
				new Stylable().getBackgroundColor().should.be.equal(defaultBackgroundColor);
			});
		});
		
		describe('setBackgrondColor()', function() {
			var mock = new Stylable();
			var initialColor = 'none';
			var newBackgroundColor = 'red';
				
			beforeEach(function() {
				mock['emit'] = function() {};
				mock['dispatchEvent'] = function() {};
				mock.setBackgroundColor(initialColor);
			});
			
			it('should set the background color', function() {
				mock.setBackgroundColor(newBackgroundColor);
				mock.getBackgroundColor().should.be.equal(newBackgroundColor);
			});
			
			it('should dispatch a widget:backgroundcolorchanged event if the color was changed', function(done) {
				mock.dispatchEvent = function(eventName, data) {
					if(eventName === 'widget:backgroundcolorchanged') done();
				};
				
				mock.setBackgroundColor(newBackgroundColor);
			});
			
			it('should dispatch a widget:backgroundcolorchanged event with correct parameters', function(done) {
				mock.dispatchEvent = function(eventName, data) {
					if(eventName === 'widget:backgroundcolorchanged'
						&& data.oldColor === initialColor
						&& data.newColor === newBackgroundColor
						&& data.widget === mock
					) done();
				};
				
				mock.setBackgroundColor(newBackgroundColor);
			});
			
		});
		
		describe('getBorderColor()', function() {
			it('should return the default border color', function() {
				var defaultBorderColor = 'none';
				new Stylable().getBorderColor().should.be.equal(defaultBorderColor);
			});
		});
		
		describe('setBorderColor()', function() {
			var mock = new Stylable();
			var initialColor = 'none';
			var newBorderColor = 'red';
				
			beforeEach(function() {
				mock['emit'] = function() {};
				mock['dispatchEvent'] = function() {};
				mock.setBorderColor(initialColor);
			});
			
			it('should set the border color', function() {
				mock.setBorderColor(newBorderColor);
				mock.getBorderColor().should.be.equal(newBorderColor);
			});
			
			it('should dispatch a widget:bordercolorchanged event if the color was changed', function(done) {
				mock.dispatchEvent = function(eventName, data) {
					if(eventName === 'widget:bordercolorchanged') done();
				};
				
				mock.setBorderColor(newBorderColor);
			});
			
			it('should dispatch a widget:bordercolorchanged event with correct parameters', function(done) {
				mock.dispatchEvent = function(eventName, data) {
					if(eventName === 'widget:bordercolorchanged'
						&& data.oldColor === initialColor
						&& data.newColor === newBorderColor
						&& data.widget === mock
					) done();
				};
				
				mock.setBorderColor(newBorderColor);
			});
			
		});
		
    });
	
});