define({
	Project: new Class({
		/**
		 * Initialize the project object
		 */
		initialize: function() {
			
		},
		/**
		 * Open a project given his configuration. the filesystem must be
		 * defined in the given namepace array
		 * @param namespaces : an array of filesystem namespaces
		 * @param conf : the configuration (an object)
		 */
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
		/**
		 * Returns the filesystem related to this project
		 * @return the filesystem
		 */
		getFileSystem: function() {
			return this.fs;
		},
		/**
		 * Get the name of the project
		 * @return the project's name
		 */
		getName: function() {
			return this.conf['name'];
		},
		/**
		 * Instances
		 */
		// The configuration object
		conf: null,
		// The filesystem
		fs: null
	}),
});