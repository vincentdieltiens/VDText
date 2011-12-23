define(['js/Page'], function(page) {
	var FileEditor = new Class({
		Extends: page.Page,
		initialize: function($pageDiv, filename, fileContent) {
			this.parent();

			var self = this;

			this.filename = filename;
			this.$pageDiv = $pageDiv;

			this.$editor = new Element('div', {
				'class': 'editor'
			});
			this.$editor.inject(this.$pageDiv, 'bottom');

			this.$textarea = new Element('textarea');
			this.$textarea.set('name', filename);
			this.$textarea.appendText(fileContent);
			this.$textarea.inject(this.$editor);

			this.codeMirror = CodeMirror.fromTextArea(this.$textarea, {
				lineNumbers: true,
				gutter: true,
				matchBrackets: true,
				onChange: function() {

				}
			});
		},
		refresh: function() {
			this.codeMirror.refresh();
		},
		onActive: function() {
			this.refresh();
		},
		getContent: function() {
			return this.codeMirror.getValue();
		},
		getFilename: function() {
			return this.filename;
		},
		getElement: function() {
			return this.$pageDiv;
		},
		save: function() {
			console.log('save '+this.filename);
		},
		$pageDiv: null,
		$textarea: null,
		$editor: null,
		codeMirror: null,
		filename: null
	});
	
	return {
		FileEditor: FileEditor
	};
});