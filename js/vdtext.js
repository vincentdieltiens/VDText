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

define(['js/Menu', 'js/fs/HttpFileSystem', 'js/FileEditor', 'js/TabPanel', 'js/ShortcutManager.js', 'js/Project.js', 'js/ProjectNavigator.js'], function(menu, httpFileSystem, file_editor, tab_panel, shortcut_manager, project, project_navigator) {
	var VDText = new Class({
		Implements: Events,
		initialize_gui: function() {
			var self = this;
			
			this.viewport = Ext.create('Ext.Viewport', {
				id: 'border-example',
				layout: 'border',
				defaults: {
					split: true
				},
				
				items: [
					{
						region: 'north',
						contentEl: 'toolbar',
						resizable: false,
						split: false
					},
					{
						region: 'west',
						id: 'west-p',
						width: 150,
						minWidth: 100,
						contentEl: 'west'
					},
					{
						region: 'center',
						contentEl: 'tabPanel',
						flex: 1,
						items: [
							{
								region: 'north',
								contentEl: 'tabs',
								height: 25
							},
							{
								region: 'center',
								contentEl: 'pages',
								flex: 1,
								height: '100%'
							}
						]
					}
					
				]
			});
		},
		initialize: function() {
			var self = this;
			
			var mainMenu = new menu.Menu($$('#toolbar')[0], this);
			
			this.projectNavigator = new project_navigator.ProjectNavigator(this, 'west');
			//this.projectNavigator.renderTo('west-p');
			
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
				},
				'cmd+n': function(event) {
					alert('cmd+t');
					self.newFile(true);
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
					
					//self.openFile("test1.js", "test1", true);
					/*var store = Ext.create('Ext.data.TreeStore', {
						root: {
							text: self.project.getName(),
							id: 'src',
							expanded: true,
							icon: 'img/folder.png'
						},
						autoLoad: true,
						folderSort: true,
						sorters: [{
							property: 'text',
							direction: 'ASC'
						}]
					});*/
					
					/*var tree = Ext.create('Ext.tree.Panel', {
						store: store,
						renderTo: 'fileList',
						flex: 1,
						height: '100%',
						width: '100%',
						title: 'Files',
						useArrows: true,
						listeners: {
							itemclick: function(view, record, item, index, event) {            
								self.openFile(record.data.text, record.data.text, true);
							}
						}
					});*/
					
					self.project.getFileSystem().list('/', function(data) {
						console.log(data);
						var root = self.projectNavigator.store.getRootNode().appendChild({text: self.project.getName(), icon: 'img/folder.png', expanded: true});
						$each(data, function(item, i) {
							root.appendChild({text: item.filename, leaf: true, icon: 'img/file.png'});
						});
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
		project: null,
		projectNavigator: null
	});
	
	return {
		VDText: VDText
	};
});