define([], function() {
	/**
	 * MessageBox reprensents a dialog that display a message and show
	 * action buttons
	 */
	var MessageBox = new Class({
		/** 
		 * Initialize the box
		 */
		initialize: function(options) {
			Ext.MessageBox.show({
			      title: options.title,
			      msg: options.msg,
			      buttons: Ext.MessageBox.YESNOCANCEL,
			      fn: options.fn,
			      icon: Ext.MessageBox.QUESTION
			});
		}	
	});
	
	return {
		MessageBox: MessageBox
	};
});