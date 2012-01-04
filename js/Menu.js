define([], function() {
	var Menu = new Class({
		initialize: function($container, vdtext) {
			var self = this;
			
			this.$container = $container;
			this.vdtext = vdtext;
			
			var $inputProjectFile = new Element('input');
			$inputProjectFile.set('type', 'file');
			$inputProjectFile.set('name', 'openProjectFile');
			$inputProjectFile.setStyles({
				'position': 'absolute',
				'top': -100
			});
			$$('body').adopt($inputProjectFile, 'bottom');
			
			$inputProjectFile.addEvent('change', function(event) {
				self.vdtext.fireEvent('open_project', event);
			});
			
			var fileMenu = Ext.create('Ext.menu.Menu', {
				id: 'fileMenu',
				style: {
					overflow: 'visible' // For the Combo popup
				},
				items: [{
					text: 'Open project',
					handler: function() {
						$inputProjectFile.click();
						
						//var files = evt.target.files
					}
				}]
			});
			
			var editMenu = Ext.create('Ext.menu.Menu', {
				id: 'editMenu',
				style: {
					overflow: 'visible' // For the Combo popup
				},
				items: [
					{text: 'Undo'},
					{text: 'Redo'},
					'-',
					{text: 'Cut'},
					{text: 'Copy'},
					{text: 'Paste'}
				]
			});
			
			this.toolbar = Ext.create('Ext.toolbar.Toolbar');
			this.toolbar.suspendLayout = true;
			this.toolbar.render(this.$container.get('id'));
			
			this.toolbar.add({
				text: 'File',
				menu: fileMenu
			}, {
				text: 'Edit',
				menu: editMenu
			});
			
			this.toolbar.suspendLayout = false;
			this.toolbar.doLayout();
		},
		getExtJsToolbar: function() {
			return this.toolbar;
		},
		$container: null,
		vdtext: null
	});
	
	return {
		Menu: Menu
	}	
});