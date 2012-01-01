define({
	Project: new Class({
		initialize: function() {
			
		},
		open: function(namespaces, conf) {
			var self = this;
			
			this.conf = conf;
			
			var className = conf['filesystem']['class'];
			var found = false;
			$each(namespaces, function(namespace, i) {
				
				if( found ) {
					return;
				}
				
				if(className in namespace) {
					found = true;
					
					self.fs = new namespace[className](conf['filesystem']['parameters']);
				}
			});
		},
		save: function() {
			
		},
		create: function() {
			
		},
		getFileSystem: function() {
			return this.fs;
		},
		conf: null,
		fs: null
	}),
});