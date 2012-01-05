define([], {
	ProjectNavigator: new Class({
		Implements: Events,
		initialize_gui: function(renderTo) {
			var self = this;
			
			this.tree = Ext.create('Ext.tree.Panel', {
				store: store,
				listeners: {
					itemdblclick: function(view, record, item, index, event) {
						if( record.data.leaf ) {
							self.vdtext.openFile(record.data.text, record.data.rootNode.data.project, record.data.text, true);
						}
					}
				},
				renderTo: renderTo,
				store: this.store,
				title: 'Files',
				useArrows: true,
				rootVisible: false,
				flex: 1,
				height: '100%'
			});
		},
		initialize: function(vdtext, renderTo) {
			this.vdtext = vdtext;
			
			this.store = Ext.create('Ext.data.TreeStore', {
				root: {
					text: 'root',
					id: 'src',
					expanded: true,
					icon: 'img/folder.png',
				},
				autoLoad: true,
				folderSort: true,
				sorters: [{
					property: 'text',
					direction: 'ASC'
				}]
			});
			
			this.initialize_gui(renderTo);
		},
		renderTo: function(id) {
			
			//this.tree.render(id);
		},
		getTree: function() {
			return this.tree;
		},
		getStore: function() {
			return this.store;
		},
		vdtext: null,
		store: null,
		tree: null
	})
});