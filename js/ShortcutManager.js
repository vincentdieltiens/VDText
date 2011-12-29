define({
	ShortcutManager: new Class({
		initialize: function($container, options, bindings) {
			this.$container = $container;
			$extend(this.options, options);
			var self = this;
			
			if( $defined(bindings) ) {
				$each(bindings, function(item, cmd) {
					
					if( typeof(item) == 'function' ) {
						self.add(cmd, item);
					} else if( typeof(item) == 'Object' ) {
						self.add(cmd, item.f);
					}
				});
			}
			console.log('haha');
		},
		add: function(cmd, f) {
			this.bindings[cmd] = {
				'cmd': cmd,
				'f': f
			};
			this.update_bindings();
		},
		remove: function(cmd) {
			var self = this;
			
		},
		_eventToCmd: function(event) {
			var cmd = event.key;
				
			if( event.shift ) {
				cmd = "shift+"+cmd;
			}
			
			if( event.alt ) {
				cmd = "alt+"+cmd;
			}
			
			if( event.meta ) {
				cmd = "cmd+"+cmd;
			}
			
			if( event.ctrl ) {
				cmd = "ctrl+"+cmd;
			}
			
			return cmd;
		},
		update_bindings: function() {
			var self = this;
			
			this.$container.removeEvent('keydown');
			this.$container.addEvent('keydown', function(event){
				var cmd = self._eventToCmd(event);
				
				console.log(cmd);
				
				if( cmd in self.bindings ) {
					if( self.options.preventDefaultAll ) {
						console.log('preventdefault');
						event.preventDefault();					
					}
					console.log(self.bindings[cmd]);
					self.bindings[cmd].f(event);
					
				}
			});
		},
		$container: null,
		keydown: null,
		bindings: [],
		options: {}
	})
});