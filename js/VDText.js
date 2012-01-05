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

/**
 * Used modules in VDText
 */
modules = [
	'js/Menu', 
	'js/fs/HttpFileSystem', 
	'js/FileEditor', 
	'js/TabPanel', 
	'js/ShortcutManager.js', 
	'js/Project.js', 
	'js/ProjectNavigator.js'
];

define(modules, function(menu, http_file_system, file_editor, tab_panel, shortcut_manager, project, project_navigator) {

	/**
	 * Class VDText is the main class.
	 * 
	 */
	var VDText = new Class({
		Implements: Events,
		/**
		 * Initiliaze the general GUI structure of VDText and inject it in the
		 * dom
		 */
		initialize_gui: function() {
			var self = this;

			// Creates the basic structure of VDText
			this.viewport = Ext.create('Ext.Viewport', {
				id: 'vdtext',
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
						minWidth: 100
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
		/**
		 * Initialize VDText 
		 */
		initialize: function() {
			// Keep reference to this object
			var self = this;

			// Constructs the main menu and attach it to the top
			this.mainMenu = new menu.Menu($$('#toolbar')[0], this);

			// Initialize the gui
			this.initialize_gui();

			// Creates the project navigator and add it to the west panel
			this.projectNavigator = new project_navigator.ProjectNavigator(this);
			Ext.getCmp('west-p').add(this.projectNavigator.getTree());

			// Creates the tab panel
			this.tabPanel = new tab_panel.TabPanel($$('#tabs'), $$('#pages'));

			// Get event when tab panel says that the user wants to create
			// a new tab
			this.tabPanel.addEvent('newTab', function(){
				self.newFile(true);
			});

			// Add handler on the open_project event
			this.addEvent('open_project', function(event) {
				var files = event.target.files;

				for (var i = 0, f; f = files[i]; i++) {
					self.openProject(f);
				}
			});

			// Configure shortcuts
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
		/**
		 * Save the file at a given index in the tab panel
		 * @param index : the index (in the tab panel) of the file to save
		 */
		saveFile: function(index) {
			var self = this;

			// Get the page at the given index
			var page = self.tabPanel.getPage(index);

			// Notify to the page that we are working on it
			page.fireEvent('start_waiting');

			page.getProject().getFileSystem().save(page.getContent(), page.getFilename(), function() {
				// Notify to the page that we are not working on it anymore
				page.fireEvent('stop_waiting');

				page.setDirty(false);
			});
		},
		/**
		 * Open a file in the editor
		 * @param filename : the filename of the file to open
		 * @param project: the project containing the file
		 * @param pageId : the id to give to the page
		 * @param active : is the new tab the new active one ?
		 */
		openFile: function(filename, project, pageId, active) {
			var self = this;

			var active = $defined(active) && active == true;

			// Creates the html Page
			var $page = new Element('div', {
				'class': 'file_editor',
				'id': pageId
			});

			// Creates the editor
			var fileEditor = new file_editor.FileEditor($page, filename, "", project);

			// Adds the editor to the tab panel
			self.tabPanel.add(filename, pageId, fileEditor, active);

			// Notify the page/editor that we are working on it
			fileEditor.fireEvent('start_waiting');

			// Load the given file using the filesystem. When it's opened,
			// put it in the edito
			project.getFileSystem().open(filename, function(content) {
				var fileContent = content;
				fileEditor.setContent(content);
				fileEditor.setDirty(false);

				// Notify the page/editor that we are not working on it anymore
				fileEditor.fireEvent('stop_waiting');
			});
		},
		/**
		 * Open a new file in VDText
		 * @param active : is the new tab the new active one ?
		 */
		newFile: function(active) {
			this.loadFile("Untitled "+this.untitled, "", "untitled_"+this.untitled, active)	
			this.untitled++;
		},
		/**
		 * Load a file for which we already have the content
		 * @param filename : the filename
		 * @param fileContent : the content of the file to open
		 * @param pageId : the id to give to the page
		 * @param active : is this tab the new active one ?
		 */
		loadFile: function(filename, fileContent, pageId, active) {
			active = $defined(active) && active == true;

			// Creates the html Page
			var $page = new Element('div', {
				'class': 'file_editor',
				'id': pageId
			});

			// Creates the editor for this page
			var fileEditor = new file_editor.FileEditor($page, filename, fileContent);

			// Add the file editor to the tab panel
			this.tabPanel.add(filename, pageId, fileEditor, active);
		},
		/**
		 * Open a project file and load the file list
		 * @param file : the project file object
		 */
		openProject: function(file) {
			var self = this;

			// Creates the reader
			var reader = new FileReader();

			// When file is loaded
			reader.onload = (function(theFile) {
				return function(e) {
					// Get the JSON configuration of the file
					var conf = JSON.decode(e.target.result);

					// Creates the project
					var p = new project.Project();

					// Open the project
					p.open([http_file_system], conf);

					// Get the file list and show it in the project navigator
					p.getFileSystem().list('/', function(data) {
						var root = self.projectNavigator.store.getRootNode().appendChild({
							text: p.getName(), 
							icon: 'img/folder.png', 
							expanded: true,
							project: p
						});

						$each(data, function(item, i) {
							root.appendChild({
								text: item.filename, 
								leaf: true, 
								icon: 'img/file.png',
								rootNode: root
							});
						});
					});

					// Add this project to the loaded projects
					self.projects.push(p);

					// Notify that the filesystem is initialize
					self.fireEvent('file_system_initialized');
				}
			})(file);

			// Load and read the text file
			reader.readAsText(file);
		},
		/**
		 * Instances
		 */
		// The tab pabel
		tabPanel: null,
		// The index for the next new (untitled) file
		untitled: 1,
		// The shortcut manager
		shortcutManager: null,
		// The general viewport of VDText
		viewport: null,
		// The loaded projects
		projects: [],
		// The project Navigator
		projectNavigator: null,
		// The main menu
		mainMenu: null
	});

	return {
		VDText: VDText
	};
});