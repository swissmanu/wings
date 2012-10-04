define(['widgetery/Container', 'helpers/Emitter', 'widgetery/Widget'], function (Container, Emitter, Widget) {

    describe('helpers/widgetery/Container', function() {
        
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
			
			it('should trigger a parentChanged event', function(done) {
				var parent = new Container();
				container.once('parentChanged', function(oldParent, newParent, container) {
					if(newParent === parent) { done(); }
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
			
			it('should trigger a widgetAdded event', function(done) {
				container.once('widgetAdded', function(addedWidget) {
					if(addedWidget === widget) { done(); }
				});
				container.addWidget(widget);
			});
			
			it('should trigger a drawRequest event when a child widget emits one', function(done) {
				container.once('drawRequest', function(widgetToDraw) {
					if(widgetToDraw === widget) { done(); }
				});
				container.addWidget(widget);
				widget.emit('drawRequest', widget);
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
			
			it('should trigger a widgetRemoved event', function(done) {
				container.once('widgetRemoved', function(removedWidget) {
					if(removedWidget === widget) { done(); }
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
		
    });
	
});