define({
	Page: new Class({
		Implements: Events,
		initialize: function() {
			var self = this;
			this.addEvent('active', function() {
				self.onActive();
			});
		},
		onActive: function() {
			// do nothing
		},
		getElement: function() {
			// Must be implemented
			return null;
		},
		close: function() {
			return false;
		}
	})
});