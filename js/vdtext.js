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

Array.implement({
	removeAtIndex: function(index) {
		return this.splice(index, 1);
	}
});

define(['js/Menu', 'js/fs/HttpFileSystem', 'js/FileEditor', 'js/TabPanel', 'js/ShortcutManager.js', 'js/Project.js'], function(menu, httpFileSystem, file_editor, tab_panel, shortcut_manager, project) {
	var VDText = new Class({
		Implements: Events,
		initialize_gui: function() {
			
			this.viewport = Ext.create('Ext.Viewport', {
				id: 'border-example',
				layout: 'border',
				items: [
					{
						region: 'north',
						contentEl: 'toolbar'
					},
					{
						region: 'center',
						contentEl: 'tabPanel'
					},
					{
						region: 'west',
						contentEl: 'fileList',
						width: 150,
						//collapsible: true,
						resizable: true
					}
				]
			});
		},
		initialize: function() {
			var self = this;
			
			var mainMenu = new menu.Menu($$('#toolbar')[0], this);
			
			this.initialize_gui();
			
			// Create the tab panel
			this.tabPanel = new tab_panel.TabPanel($$('#tabs'), $$('#pages'));
			
			// Get event when tab panel says that the user wants to create
			// a new tab
			this.tabPanel.addEvent('newTab', function(){
				self.newFile(true);
			});
			
			this.addEvent('open_project', function(event) {
				var files = event.target.files;
				
				for (var i = 0, f; f = files[i]; i++) {
					self.openProject(f);
				}
			});
			
			// When the user click on cmd+s
			var shortcutManager = new shortcut_manager.ShortcutManager($(window), {
				preventDefaultAll: true
			}, {
				'cmd+s': function() {
					self.saveFile(self.tabPanel.getActiveIndex());
				}
			});
			
		},
		saveFile: function(index) {
			var self = this;
			
			var page = self.tabPanel.getPage(index);
			page.fireEvent('start_waiting');
			
			self.project.getFileSystem().save(page.getContent(), page.getFilename(), function(){
				page.fireEvent('stop_waiting');
				page.setDirty(false);
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
			fileEditor.fireEvent('start_waiting');
			
			console.log(self.project.getFileSystem());
			self.project.getFileSystem().open(filename, function(content) {
				var fileContent = content;
				fileEditor.setContent(content);
				fileEditor.fireEvent('stop_waiting');
				fileEditor.setDirty(false);
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
		openProject: function(file) {
			var self = this;
			var reader = new FileReader();
			
			reader.onload = (function(theFile) {
				return function(e) {
					
					var conf = JSON.decode(e.target.result);
					self.project = new project.Project();
					self.project.open([httpFileSystem], conf);
					
					/*var store = Ext.create('Ext.data.TreeStore', {
						proxy: {
							type: 'ajax',
							url: 'get-nodes.php'
						},
						root: {
							text: 'Ext JS',
							id: 'src',
							expanded: true
						},
						folderSort: true,
						sorters: [{
							property: 'text',
							direction: 'ASC'
						}]
					});
					
					var tree = Ext.create('Ext.tree.Panel', {
						store: store,
						viewConfig: {
							plugins: {
								//ptype: 'treeviewdragdrop'
							}
						},
						renderTo: 'fileList',
						height: 300,
						width: 150,
						title: 'Files',
						useArrows: true,
						dockedItems: [{
							xtype: 'toolbar',
							items: [{
								text: 'Expand All',
								handler: function() {
									tree.expandAll();
								}
							}, {
								text: 'Collapse All',
								handler: function() {
									tree.collapseAll();
								}
							}]
						}]
					});*/
					
					self.project.getFileSystem().list('/', function(){
						
					});
					self.fireEvent('file_system_initialized');
				}
			})(file);
			
			reader.readAsText(file);
		},
		tabPanel: null,
		untitled: 1,
		shortcutManager: null,
		viewport: null,
		project: null
	});
	
	return {
		VDText: VDText
	};
});