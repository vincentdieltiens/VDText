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

var VDText = new Class({
	initialize: function() {
		var self = this;
		
		this.tabPanel = new TabPanel($$('#tabs'), $$('#pages'));
		
		this.tabPanel.addEvent('newTab', function(){
			self.newFile(true);
		});
		
		$(document).addEvent('keydown', function(event){
			
			if( event.key == "s" && event.meta ) {
			  event.preventDefault();
			  console.log('save it');
			}
			
		});
		
	},
	openFile: function() {
		var fileEditor = new FileEditor($$('#file_editor')[0]);
		
	},
	newFile: function(active) {
		this.loadFile("Untitled "+this.untitled, "", "untitled_"+this.untitled, active)
		
		this.untitled++;
	},
	loadFile: function(filename, fileContent, pageId, active) {
		
		var $page = new Element('div', {
			'class': 'file_editor',
			'id': pageId
		});
		
		active = $defined(active) && active == true;
		
		this.tabPanel.addTab(filename, pageId, $page, active);
		
		var fileEditor = new FileEditor($page, filename, fileContent);
		
		$page.addEvent('active', function() {
			fileEditor.refresh();
		});
		
		this.documents.push({
			'page': pageId,
			'editor': fileEditor
		});
	},
	documents: [],
	tabPanel: null,
	untitled: 1
});

var TabPanel = new Class({
	Implements: Events,
	initialize: function($tabPanelDiv, $pagesContainer) {
		var self = this;
		
		this.$tabsContainer = $tabPanelDiv;
		this.$pagesContainer = $pagesContainer;
		
		this.$tabsContainer.addEvent('dblclick', function(event){
			if( event.target.match('ul') ) {
				console.log('fireEvent newTab');
				self.fireEvent('newTab');
			}
		});
	},
	addTab: function(name, pageId, $page, active) {
		var self = this;
		
		// Create new Tab
		var $tab = new Element('li').appendText(name);
		$tab.set('page', pageId);
		
		// Add the tab into the tabs container
		$tab.inject(this.$tabsContainer.getElement('ul')[0], 'bottom');
		
		// Add the page into the pages container
		$page.inject(this.$pagesContainer[0], 'bottom');
		
		// Add Event when tab is clicked ?
		$tab.addEvent('click', function() {
			self.activeTabAndPage($tab, $page);
		});
		
		// If the new tab is the active one, before deactive the current active tab)
		if( $defined(active) && active ) {
			self.activeTabAndPage($tab, $page);
		}
	},
	activeTabAndPage: function($tab, $page) {
		$$(this.$tabsContainer.getElement('.active')).removeClass('active');
		$$(this.$pagesContainer.getElements('.active')).removeClass('active');
		
		$tab.addClass('active');
		$page.addClass('active');
		
		$page.fireEvent('active');
	},
	$tabsContainer: null,
	$pagesContainer: null,
	$tabs: []
});

var FileEditor = new Class({
	initialize: function($div, filename, fileContent) {
		var self = this;
		
		this.div = $div;
		
		this.$editor = new Element('div', {
			'class': 'editor'
		});
		this.$editor.inject($div, 'bottom');
		
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
	div: null,
	$textarea: null,
	$editor: null,
	codeMirror: null
});