define(['js/Page', 'js/MessageBox'], function(page, messageBox) {
	var FileEditor = new Class({
		Extends: page.AbstractPage,
		initialize: function($pageDiv, filename, fileContent, project) {
			this.parent();

			var self = this;

			this.filename = filename;
			this.$pageDiv = $pageDiv;
			this.project = project;

			this.$editor = new Element('div', {
				'class': 'editor'
			});
			this.$editor.inject(this.$pageDiv, 'bottom');

			this.$textarea = new Element('textarea');
			this.$textarea.set('name', filename);
			this.$textarea.appendText(fileContent);
			this.$textarea.inject(this.$editor);
			
			this.addEvent('close', function(callback) {
				if( self.isDirty() ) {
					
					new messageBox.MessageBox({
						title: 'File not saved',
						msg: 'This file has not been saved, really close it ?',
						fn: function(r) {
							callback(r=='yes');
						}
					});
				}
			});
			
			this.codeMirror = CodeMirror.fromTextArea(this.$textarea, {
				lineNumbers: true,
				gutter: true,
				matchBrackets: true,
				onChange: function() {
					self.setDirty(true);
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
		setContent: function(content) {
			return this.codeMirror.setValue(content);
		},
		getFilename: function() {
			return this.filename;
		},
		getElement: function() {
			return this.$pageDiv;
		},
		getProject: function() {
			return this.project;
		},
		setOnDisk: function(onDisk) {
			this.onDisk = onDisk;
		},
		isOnDisk: function() {
			return this.onDisk;
		},
		setDirty: function(dirty) {
			this.dirty = dirty;
			this.fireEvent('dirty', { dirty: dirty });
		},
		isDirty: function() {
			return this.dirty;
		},
		close: function() {
			return !this.isDirty();
		},
		$pageDiv: null,
		$textarea: null,
		$editor: null,
		codeMirror: null,
		filename: null,
		dirty: false,
		onDisk: false,
		project: null
	});
	
	return {
		FileEditor: FileEditor
	};
});