define(['wings/LayoutManager'], function(LayoutManager) {

	describe('wings/LayoutManager', function() {

		describe('LayoutManager()', function() {
			it('should create a new instance of LayoutManager', function() {
				new LayoutManager().should.be.instanceof(LayoutManager);
			});
		});
		
		describe('layoutWidgets(parent, widgets)', function() {
			it('should throw an error signaling missing implementation', function() {
				(function() {
					new LayoutManager().layoutWidgets();
				}).should.throw('Implement layoutWidgets!');
			});
		});
		
	});
	
});