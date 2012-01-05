define({
	/**
	 * AbstractPage is a class that define which method a page must have. It's like
	 * an Abstract class (but Abstract doesn't exist in JS)
	 */
	AbstractPage: new Class({
		Implements: Events,
		/**
		 * Initialize the
		 */
		initialize: function() {
			var self = this;
			this.addEvent('active', function() {
				self.onActive();
			});
		},
		/**
		 * Handler when the tab is activated
		 */
		onActive: function() {
			// do nothing
		},
		/**
		 * Returns the element of the page
		 * @return the element
		 */
		getElement: function() {
			return null;
		},
		/**
		 * Close the page
		 * @return true if success, false otherwise
		 */
		close: function() {
			return false;
		}
	})
});