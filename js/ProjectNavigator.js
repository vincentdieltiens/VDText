define([], {
	ProjectNavigator: new Class({
		Implements: Events,
		/**
		 * Creates the tree that display files
		 * @param renderTo : an element id, or an Ext component in which
		 * we render the tree
		 */
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
		/**
		 * Initialize the Project Navigator
		 * @param vdtext : the vdtext instance
		 * @param renderTo : an element id or an Ext component in which to render
		 *    the project navigator
		 */
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
		/**
		 * Get the tree of the project navigator
		 * @return the Ext.tree.Panel
		 */
		getTree: function() {
			return this.tree;
		},
		/**
		 * Get the tree store of the project navigator
		 * @return the Ext.data.TreeStore
		 */
		getStore: function() {
			return this.store;
		},
		/**
		 * Instances
		 */
		// The vdtext general instance
		vdtext: null,
		// The tree store
		store: null,
		// The tree
		tree: null
	})
});