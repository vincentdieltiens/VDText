require(["FileSystem.js"], function(){
	var HttpFileSystem = new Class({
		Implements: FileSystemInterface,
		initialize: function(domain) {

		},
		save: function(content, path, done) {
			var request = new Request({
				url: domain+'/save.php',
				data: {
					content: content,
					path: path
				},
				onComplete: function() {
					done();
				}
			});

			request.send();
		}
	});
});