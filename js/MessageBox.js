define([], function() {
	var MessageBox = new Class({
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