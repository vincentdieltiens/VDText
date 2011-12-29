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
			
			// Create the filename span
			var $filenameSpan = new Element('span');
				$filenameSpan.appendText(name);
				$filenameSpan.addClass('filename');
			
			// Create the status span
			var $statusSpan = new Element('span');
				$statusSpan.addClass('status');
			
			// Create the waiting image
			var $waitingImg = new Element('img');
				$waitingImg.set('src', 'theme/tabs/waiting.gif');
			
			// Inject elements
			$waitingImg.inject($statusSpan);
			$statusSpan.inject($tab, 'top');
			$filenameSpan.inject($tab, 'bottom');
			
			// When a page get the waiting event, indicate it in the tab
			page.addEvent('start_waiting', function() {
				$tab.addClass('waiting');
			});
			
			page.addEvent('stop_waiting', function() {
				$tab.removeClass('waiting');
			});
			
			page.addEvent('dirty', function(data) {
				if( data.dirty == true ) {
					$tab.addClass('dirty');
				} else {
					$tab.removeClass('dirty');
				}
			});
			
			$statusSpan.addEvent('click', function(event) {
				event.stopPropagation();
				
				var tabIndex = self.getParentTabIndex($statusSpan);
				if( tabIndex == null ) {
					throw new Error("tab not found !");
				}
				
				self.getPage(tabIndex).fireEvent('close', function(close) {
					if( close ) {
						self.close(tabIndex);
					}
				});
				/*if( self.getPage(tabIndex).close() ) {
					self.close(tabIndex);
				}*/
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
			
		},
		activePage: function($tab, page) {
			
			var self = this;
			
			self.deactiveTabAndPage();

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
			var self = this;
			
			if( !$defined(index) || index < 0 || index >= this.pages.length ) {
				return;
			}
			
			this.deactiveTabAndPage();
			
			this.getTab(index).addClass('active');
			this.getPage(index).getElement().addClass('active');
			
			this.pages[index].fireEvent('active');
		},
		deactiveTabAndPage: function() {
			if( this.$tabsContainer.getElement('.active')[0] != null ) {
				this.$tabsContainer.getElement('.active')[0].removeClass('active');	
			}
			
			if( this.$pagesContainer.getElement('.active')[0] != null ) {
				this.$pagesContainer.getElement('.active')[0].removeClass('active');
			}
		},
		getParentTab: function($item) {
			return $item.getParent('li');
		},
		getParentTabIndex: function($item) {
			var $tab = this.getParentTab($item);
			
			var index = null;
			this.$tabsContainer.getElements('li')[0].each(function($currentTab, i) {
				if( $tab == $currentTab ) {
					index = i;
				}
			});
			
			return index;
		},
		getActiveIndex: function() {
			return this.active;
		},
		getActivePage: function() {
			return this.pages[this.getActiveIndex()];
		},
		getPage: function(index) {
			return this.pages[index]
		},
		getActiveTab: function() {
			return this.getTab(this.getActiveIndex());
		},
		getTab: function(index) {
			return this.$tabsContainer.getElements('li')[0][index];
		},
		isLastTab: function(index) {
			return (index == (this.pages.length-1));
		},
		close: function(index) {
			
			if( this.pages.length == 0 ) {
				return;
			}
			
			var wasLastTab = this.isLastTab(index);
			
			this.getPage(index).getElement().destroy();
			this.getTab(index).destroy();
			
			for(i=index; i < this.pages.length-1; i++) {
				this.pages[i] = this.pages[i+1];
			}
			this.pages.removeAtIndex(this.pages.length-1);
			
			if(  this.pages.length > 0 ) {
				
				if( wasLastTab ) {
					this.activePageIndex(index-1);
				} else {
					this.activePageIndex(index);
				}
			}
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