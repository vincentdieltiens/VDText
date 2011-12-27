define({
	ShortcutManager: new Class({
		initialize: function($container) {
			this.$container = $container;
			
			this.keydown = function(event) {
				
			}
		},
		add: function(cmd, f) {
			this.bindings.push({
				'cmd': cmd,
				'f': f
			});
		},
		update_bindings: function() {
			var self = this;
			
			this.$container.removeEvent('keydown');
			this.$container.addEvent('keydown', function(event) {
				
				self.bindings.each(function(o){
					
					
					
				});
				
				if( event.key == "s" && event.meta ) {
					
				}
				
			});
		},
		remove: function(cmd) {
			
		},
		$container: null,
		keydown: null,
		bindings: []
	});
});