define([], function() {
	
	var TabPanel = new Class({
		Implements: Events,
		initialize: function($tabPanelDiv, $pagesContainer) {
			var self = this;

			this.$tabsContainer = $tabPanelDiv;
			this.$pagesContainer = $pagesContainer;

			this.$tabsContainer.addEvent('dblclick', function(event){
				if( event.target.match('ul') ) {
					self.fireEvent('newTab');
				}
			});
		},
		add: function(name, pageId, page, active) {
			var self = this;
			
			// Create new Tab
			var $tab = new Element('li');
			    $tab.set('page', pageId);
				//$tab.addClass('waiting');
			
			var $filenameSpan = new Element('span');
				$filenameSpan.appendText(name);
				$filenameSpan.addClass('filename');
			
			var $statusSpan = new Element('span');
				$statusSpan.addClass('status');
				
			var $waitingImg = new Element('img');
				$waitingImg.set('src', 'theme/tabs/waiting.gif');
			
			$waitingImg.inject($statusSpan);
			
			$statusSpan.inject($tab, 'top');
			$filenameSpan.inject($tab, 'bottom');
			
			page.addEvent('start_waiting', function() {
				$tab.addClass('waiting');
			});
			
			page.addEvent('stop_waiting', function() {
				$tab.removeClass('waiting');
			});
			
			this.pages.push(page);
			var index = this.pages.length-1;

			// Add the tab into the tabs container
			$tab.inject(this.$tabsContainer.getElement('ul')[0], 'bottom');

			// Add the page into the pages container
			page.getElement().inject(this.$pagesContainer[0], 'bottom');

			// Add Event when tab is clicked ?
			$tab.addEvent('click', function() {
				self.activePage($tab, page);
			});

			// If the new tab is the active one, before deactive the current active tab)
			if( $defined(active) && active ) {
				self.activePage($tab, page);
			}
			self.activePageIndex(0);
		},
		activePage: function($tab, page) {
			var self = this;
			$$(this.$tabsContainer.getElement('.active')).removeClass('active');
			$$(this.$pagesContainer.getElements('.active')).removeClass('active');

			Array.each(this.$tabsContainer.getElements('li')[0], function(item, index) {
				if( item == $tab ) {
					self.active = index;
					return;
				}
			});

			$tab.addClass('active');
			page.getElement().addClass('active');

			page.fireEvent('active');
		},
		activePageIndex: function(index) {
			if( !$defined(index) && index < this.$tabsContainer.getElements('li')[0].length ) {
				return;
			}

			this.active = index;

			$$(this.$tabsContainer.getElement('.active')).removeClass('active');
			$$(this.$pagesContainer.getElements('.active')).removeClass('active');

			this.$tabsContainer.getElements('li')[0][index].addClass('active');
			this.$pagesContainer.getElements('div')[0][index].addClass('active');

			this.pages[index].fireEvent('active');
		},
		getActiveIndex: function() {
			return this.active;
		},
		getActivePage: function() {
			return this.pages[this.getActiveIndex()];
		},
		$tabsContainer: null,
		$pagesContainer: null,
		pages: [],
		active: null,
	});
	
	return {
		TabPanel: TabPanel
	}
})