Element.implement({
    //implement show
    show: function() {
      this.setStyle('display','block');
    },
    //implement hide
    hide: function() {
      this.setStyle('display','none');
    },
	isShown: function() {
		return this.getStyle('display') != 'none';
	},
	toggleShow: function() {
		if( this.isShown() ) {
			this.hide();
		} else {
			this.show();
		}
	}
});

define(['js/fs/HttpFileSystem', 'js/FileEditor', 'js/TabPanel'], function(httpFileSystem, file_editor, tab_panel) {
	var VDText = new Class({
		initialize: function() {
			var self = this;
			
			// Create the tab panel
			this.tabPanel = new tab_panel.TabPanel($$('#tabs'), $$('#pages'));
			
			// Get event when tab panel says that the user wants to create
			// a new tab
			this.tabPanel.addEvent('newTab', function(){
				self.newFile(true);
			});
			
			this.fileSystem = new httpFileSystem.HttpFileSystem('localhost', {
				save: '/vdtext/connector/save.php',
				open: '/vdtext/connector/open.php'
			});
			
			// When the user click on cmd+s
			$(document).addEvent('keydown', function(event){
				if( event.key == "s" && event.meta ) {
					// preventDefault prevent the user to execute his own shortcut !
					event.preventDefault();
					var page = self.tabPanel.getActivePage();
					
					self.fileSystem.save(page.getContent(), page.getFilename(), function(){
						// Do what you want
					});
				}
			});
		},
		openFile: function(filename, pageId, active) {
			var self = this;
			
			active = $defined(active) && active == true;
			
			// Creates the html Page
			var $page = new Element('div', {
				'class': 'file_editor',
				'id': pageId
			});
			
			var fileEditor = new file_editor.FileEditor($page, filename, "");
			self.tabPanel.add(filename, pageId, fileEditor, active);
			
			this.fileSystem.open(filename, function(content) {
				var fileContent = content;
				fileEditor.setContent(content);
				
			});
		},
		newFile: function(active) {
			this.loadFile("Untitled "+this.untitled, "", "untitled_"+this.untitled, active)	
			this.untitled++;
		},
		loadFile: function(filename, fileContent, pageId, active) {
			active = $defined(active) && active == true;
			
			// Creates the html Page
			var $page = new Element('div', {
				'class': 'file_editor',
				'id': pageId
			});
			
			// Creates the editor for this page
			var fileEditor = new file_editor.FileEditor($page, filename, fileContent);
			/* Done is the FileEditor class now (by extending page)
				this.addEvent('active', function() {
				this.refresh();
			});*/

			// Add the file editor to the tab panel
			this.tabPanel.add(filename, pageId, fileEditor, active);
		},
		tabPanel: null,
		untitled: 1,
		fileSystem: null,
		shortcutManager: null
	});
	
	return {
		VDText: VDText
	};
});