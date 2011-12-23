define(["js/fs/FileSystem"], function(fss) {
	
	var HttpFileSystem = new Class({
		Implements: fss.FileSystem,
		initialize: function(domain, scripts) {
			
			this.scripts = $extend(this.scripts, scripts);
				
			if( !domain.match(/^http:\/\//) ) {
				this.domain = 'http://'+domain;
			} else {
				this.domain = domain;
			}
		},
		save: function(content, path, done) {
			var request = new Request({
				url: this.domain+this.scripts.save,
				data: {
					content: content,
					path: path
				},
				onComplete: function() {
					done();
				} 
			});

			request.send();
		},
		open: function(path, done) {
			var request = new Request.JSON({
				url: this.domain+this.scripts.open,
				data: {
					path: path
				},
				onComplete: function(data) {
					done(data.content);
				}
			});
			
			request.send();
		},
		domain: null,
		scripts: {
			save: '/save.php',
			open: '/open.php'
		}
	}) ;
	
	return {
		HttpFileSystem: HttpFileSystem
	};
});