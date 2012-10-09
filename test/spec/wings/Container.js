define(['wings/Container', 'wings/Emitter', 'wings/Widget'], function (Container, Emitter, Widget) {

    describe('helpers/wings/Container', function() {
        
        it('should be an Emitter', function() {
            new Container().should.be.instanceof(Emitter);
        });

		describe('Container()', function() {
			it('should create a new instance of Container', function() {
				new Container().should.be.instanceof(Container);
			});
		});
		
		describe('setParent', function() {
			var container;
			
			beforeEach(function() {
				container = new Container();
			});
			
			it('should set the parent of the widget', function() {
				var parent = new Container();
				container.setParent(parent);
				container.getParent().should.be.equal(parent);
			});
			
			it('should trigger a container:parentchanged event', function(done) {
				var parent = new Container();
				container.once('container:parentchanged', function(event) {
					if(event.newParent === parent) done();
				});
				container.setParent(parent);
			});
		});
		
		describe('getParent', function() {
			it('it should return the parent of a container', function() {
				var container = new Container();
				var parent = new Container();
				container.setParent(parent);
				container.getParent().should.be.equal(parent);
			});
		});
		
		describe('getRoot', function() {
			it('it should return the top most Container instance from the hierarchy', function() {
				var root = new Container();
				var parent = new Container();
				var child = new Container();
				root.addWidget(parent);
				parent.addWidget(child);
				
				child.getRoot().should.be.equal(root);
			});
		});
		
		describe('addWidget()', function() {
			var container;
			var widget;
			
			beforeEach(function() {
				container = new Container();
				widget = new Widget();
			});
			
			it('should add a widget to the container', function() {
				container.addWidget(widget);
				container.getWidget(0).should.be.equal(widget);
			});
			
			it('should set the parent of the added widget to itself', function() {
				container.addWidget(widget);
				widget.getParent().should.be.equal(container);
			});
			
			it('should remove the widget from its old parent, before adding it to itself', function() {
				var oldParent = new Container();
				oldParent.addWidget(widget);
				container.addWidget(widget);
				should.not.exist(oldParent.getWidget(widget));
			});
			
			it('should trigger a container:widgetadded event', function(done) {
				container.once('container:widgetadded', function(event) {
					if(event.widget === widget) { done(); }
				});
				container.addWidget(widget);
			});
			
		});
		
		describe('removeWidget()', function() {
			var container;
			var widget;
			
			beforeEach(function() {
				container = new Container();
				widget = new Widget();
				container.addWidget(widget);
			});
			
			it('should remove a widget (identified by its instance) from the container', function() {
				container.removeWidget(widget);
				container.getWidgetCount().should.be.equal(0);
			});
			
			it('should remove a widget (identified by its index) from the container', function() {
				container.removeWidget(0);
				container.getWidgetCount().should.be.equal(0);
			});
			
			it('should trigger a container:widgetremoved event', function(done) {
				container.once('container:widgetremoved', function(event) {
					if(event.removedWidget === widget) { done(); }
				});
				container.removeWidget(widget);
			});
			
			it('should set the removed widgets parent to undefined', function() {
				container.removeWidget(widget);
				should.not.exist(widget.getParent());
			});
			
		});
		
		describe('getWidgetCount()', function() {
			it('should return the correct number of contained widgets', function() {
				var container = new Container();
				var widgets = [
					new Widget()
					,new Widget()
				];
				container.addWidget(widgets[0]);
				container.addWidget(widgets[1]);
				
				container.getWidgetCount().should.be.equal(widgets.length);
			});
		});
		
		describe('getWidget()', function() {
			var container;
			
			beforeEach(function() {
				container = new Container();
			});
			
			it('should return the correct widget', function() {
				var widget = new Widget();
				container.addWidget(widget);
				container.getWidget(0).should.be.equal(widget);
			});
			
			it('should return undefined if widget index is not available', function() {
				should.not.exist(container.getWidget(0));
			});
		});
		
		describe('Event Handler: dispatch', function() {
			it('should emit the dispatchable event to itself', function(done) {
				var container = new Container();
				var event = 'emit_me!';
				
				container.on(event, function() { done(); });
				container.emit('dispatch', {name: event});
			});
			
			it('should bubble events upwards', function(done) {
				var a = new Container();
				var b = new Container();
				var c = new Container();
				
				b.addWidget(c);
				a.addWidget(b);
				
				a.on('dispatch', function() { done(); });
				c.emit('dispatch', {name: 'xy'});
			});
		});
		
    });
	
});