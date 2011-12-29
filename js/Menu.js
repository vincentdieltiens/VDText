define([], function() {
	var Menu = new Class({
		initialize: function($container) {
			this.$container = $container;
			
			var fileMenu = Ext.create('Ext.menu.Menu', {
				id: 'fileMenu',
				style: {
					overflow: 'visible' // For the Combo popup
				},
				items: [
					{text: 'New'},
					{text: 'Open'},
					{text: 'Close'},
					{text: 'Close Tab'},
					{text: 'Save'},
					{text: 'Save As'},
					{text: 'Save All'},
					'-',
					{text: 'New project'},
					{text: 'Save project'},
					{text: 'Save project As'},
					'-',
					{text: 'Print'}
				]
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
		$container: null
	});
	
	return {
		Menu: Menu
	}	
});