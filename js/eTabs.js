/**
 * eTabs.js v2.8.2
 */
;
(function(window) {

    'use strict';

    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function IW_Tabs(el, options) {
        this.el = el;
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }
    IW_Tabs.prototype.options = {
        start: 0
    };
    IW_Tabs.prototype._init = function() {
        // tabs elems
        this.tabs = [].slice.call(this.el.querySelectorAll('nav > ul > li'));
        // content items
        this.items = [].slice.call(this.el.querySelectorAll('.et-content-wrap > section'));
        // current index
        this.current = -1;
        // show current content item
        this._show();
        // init events
        this._initEvents();
    };
    IW_Tabs.prototype._initEvents = function() {
        var self = this;
        this.tabs.forEach(function(tab, idx) {
            tab.addEventListener('click', function(ev) {
				var showHideAttr = jQuery( tab ).parents( '.et-tabs' ).data( 'show-hide' ),
                    show = self._showHideTab( jQuery( tab ).attr( 'class' ), showHideAttr );

                ev.preventDefault();

                jQuery(document).trigger("resize");

				if ( show ) {
 					self._show( idx );
				}

				// Check if is sticky tab and scroll up to the tab content start position.
				if ( jQuery( tab ).parents( '.et-tabs' ).hasClass( 'et-tabs-sticky' ) ) {
					var headerHeight = jQuery( tab ).parents( '.et-tabs' ).attr( 'data-header-height' );
					headerHeight = parseInt( headerHeight );

					jQuery( 'html, body' ).animate( { scrollTop:( jQuery( tab ).parents( '.et-tabs' ).offset().top ) - ( headerHeight + 40 ) }, 300 );
				}
            });
        });
    };
    IW_Tabs.prototype._show = function(idx) {
		var tabClass = ( jQuery( 'body' ).hasClass( 'fusion-builder-live-preview' ) ) ? ' fusion-builder-live-child-element fusion-builder-data-cid fusion-builder-live-child-element fusion-builder-data-cid' : '';

        if (this.current >= 0) {
            this.tabs[this.current].className = tabClass;
			this.items[this.current].className = '';
        }
        this.tabs.forEach(function(tab, idx) {
            tab.className = tabClass;
        });

        // change current
        this.current = idx != undefined ? idx : this.options.start >= 0 && this.options.start < this.items.length ? this.options.start : 0;

        var hash = jQuery(jQuery(this.tabs[this.current]).find('a.et-anchor-tag')[0]).data('href');
        hash = ( 'undefined' !== typeof hash ) ? hash.substr( hash.indexOf("#") ) : '';

        setTimeout(function() {
            jQuery(document).trigger("elegantTabSwitched", [hash]);
        }, 100);

        var anim = jQuery(this.items[this.current]).data('animation');

        this.items.forEach(function(tab, idx) {
            tab.className = '';
        });

        // Make first tab inactive.
        if (-1 == this.options.start) {
            var loaded = jQuery(jQuery(this.tabs[this.current]).parents('.elegant-tabs-container')[0]).data('loaded');

            if ('undefined' !== typeof loaded || loaded) {
                this.tabs[this.current].className = 'tab-current' + tabClass;
                this.items[this.current].className = 'content-current';
                jQuery(this.items[this.current]).find('.infi-content-wrapper')[0].className = 'infi-content-wrapper animated ' + anim;
            }
            jQuery(jQuery(this.tabs[this.current]).parents('.elegant-tabs-container')[0]).attr('data-loaded', true);
        } else {
            this.tabs[this.current].className = 'tab-current' + tabClass;
            this.items[this.current].className = 'content-current';
            jQuery(this.items[this.current]).find('.infi-content-wrapper')[0].className = 'infi-content-wrapper animated ' + anim;
        }
    };

	IW_Tabs.prototype._showHideTab = function( cls, showHideAttr ) {
        if ( showHideAttr ) {

            this.items.forEach( function( tab, idx ) {
                tab.className = '';
            } );

            this.tabs.forEach( function( tabContent, idx ) {
                tabContent.className = '';
            } );

    		if ( 'tab-current' === cls ) {
    			return false;
    		} else {
    			return true;
    		}
        } else {
            return true;
        }
	};

    // add to global namespace
    window.IW_Tabs = IW_Tabs;
})(window);

function checkHash(hashLink) {
    if (hashLink !== '') {
        hash = hashLink.substr(hashLink.indexOf("#"));
        if (jQuery(hash).length) {
            var animation = jQuery(hash).data('animation');
            var tab_link = jQuery('a[data-href="' + hash + '"]').parents("ul").find('li');
            var tabs = jQuery(hash).parents(".et-tabs").find("section");
            tab_link.removeClass('tab-current');
            tab_link.each(function(index, element) {
                jQuery(this).removeClass('tab-current');
            });
            tabs.each(function(index, element) {
                jQuery(this).removeClass('content-current');
            });
            jQuery('a[data-href="' + hash + '"]').parent('li').addClass('tab-current');
            jQuery(hash + ' > .infi-content-wrapper')[0].className = 'infi-content-wrapper animated ' + animation;
            jQuery(hash).addClass('content-current');
            setTimeout(function() {
                jQuery(document).trigger("elegantTabSwitched", [hash]);
            }, 100);
        }
    }
}

function checkHashPosition(hash) {
    var hashPosition = 0;
    hashPosition = jQuery('a[data-href="' + hash + '"]').parent('li').index();
    return hashPosition;
}

function elegantAutoSwitchTabs(el, interval, startTab) {
    var timeInterval, tabCount = 0,
        currentIndex = 1;

    tabCount = jQuery(el).find('li').length;

    currentIndex = startTab + 1;

    changeTabIndex();
    timeInterval = setInterval(function() {
        changeTabIndex();
    }, interval * 1000);


    function changeTabIndex() {
        if (currentIndex > tabCount) {
            currentIndex = 1;
        }

		var currentAncorObj = jQuery(el).find('li.tab-current').next();

        jQuery( currentAncorObj ).trigger('click');
		jQuery( document ).trigger( 'elegantCarouselTabSwitched' );

        currentIndex++;
    };

    jQuery(el).find('li').mouseenter(function() {
        clearInterval(timeInterval);
    }).mouseleave(function() {
        timeInterval = setInterval(function() {
            changeTabIndex();
        }, interval * 1000);
    });
}

function etGenerateCSS() {
    var css = '<style type="text/css" id="tabs-dynamic-css">';
    [].slice.call(document.querySelectorAll('.et-tabs')).forEach(function(el) {

        var url = window.location;
        hash = url.href,
            hashPosition = 0,
            listContainer = '',
            autoSwitch = false,
            autoSwitchInterval = 5;;

		setTimeout( function() {
	        if (-1 !== hash.indexOf('#')) {
	            hash = hash.replace("/#", '#');
	            hash = hash.substr(hash.indexOf("#"));

	            if (jQuery(el).find('a[data-href="' + hash + '"]').length) {
	                hashPosition = checkHashPosition(hash);
	                setTimeout(function() {
	                    jQuery('html, body').animate({
	                        scrollTop: ((jQuery(hash)).offset().top) - 150
	                    }, 300);
	                }, 500);
	            } else {
	                hashPosition = ('undefined' !== typeof jQuery(el).data('active-tab-index')) ? jQuery(el).data('active-tab-index') : 0;
	            }
	        } else {
	            hashPosition = ('undefined' !== typeof jQuery(el).data('active-tab-index')) ? jQuery(el).data('active-tab-index') : 0;
	        }

	        if ('' === hashPosition) {
	            hashPosition = 0;
	        }

	        new IW_Tabs(el, {
	            start: hashPosition
	        });
		}, 500 );

        listContainer = jQuery(el).find('.elegant-tabs-list-container');
        autoSwitch = jQuery(el).data('auto-switch-tab');
        autoSwitchInterval = jQuery(el).data('switch-interval');

        if ( 'undefined' !== typeof autoSwitch && 'no' !== autoSwitch && ! jQuery( 'body' ).hasClass( 'fusion-builder-live-preview' ) ) {
            elegantAutoSwitchTabs(listContainer[0], autoSwitchInterval, hashPosition);
        }

        var cn = el.className.split(" ");
        var cl = '';
        jQuery(cn).each(function(i, v) {
			if ( '' !== v ) {
            	cl += "." + v;
			}
        });
        var st = jQuery(cl).data("tab_style");
        var bg = jQuery(cl).data("active-bg");
        var color = jQuery(cl).data("active-text");
        var bg_hover = jQuery(cl).data("hover-bg");
        var color_hover = jQuery(cl).data("hover-text");

        css += cl + ' .infi-tab-accordion.infi-active-tab .infi_accordion_item{background:' + bg + ' !important; color:' + color + ' !important;}\n';
        css += cl + ' .infi-tab-accordion.infi-active-tab .infi_accordion_item .infi-accordion-item-heading{color:' + color + ' !important;}\n';
        css += cl + ' .infi-tab-accordion.infi-active-tab .infi_accordion_item .infi-accordion-item-heading .iw-icons{color:' + color + ' !important;}\n';
        switch (st) {
            case 'bars':
                css += cl + ' li.tab-current a{background:' + bg + '; color:' + color + ';}\n';
                css += cl + ' nav ul li.tab-current a, ' + cl + ' nav ul li.tab-current a > i{color:' + color + ' !important;}\n';
                css += cl + ' li:not(.tab-current) a:hover{background:' + bg_hover + '; color:' + color_hover + ';}\n';
                css += cl + ' nav ul li:not(.tab-current) a:hover, ' + cl + ' nav ul li:not(.tab-current):hover a > i{color:' + color_hover + ' !important;}\n';
                break;
            case 'iconbox':
            case 'iconbox-iconlist':
                css += cl + ' li.tab-current a{background:' + bg + '; color:' + color + ' !important;}\n';
                css += cl + ' nav ul li.tab-current a > i{color:' + color + ' !important;}\n';
                css += cl + ' nav ul li.tab-current::after{color:' + bg + ';}\n';
                css += cl + ' nav ul li.tab-current{color:' + bg + ' !important;}\n';
                css += cl + ' li:not(.tab-current) a:hover{background:' + bg_hover + '; color:' + color_hover + ';}\n';
                css += cl + ' nav ul li:not(.tab-current) a:hover, ' + cl + ' nav ul li:not(.tab-current):hover a > i{color:' + color_hover + ' !important;}\n';
                break;
            case 'underline':
                css += cl + ' nav ul li a::after{background:' + bg + ';}\n';
                css += cl + ' nav ul li.tab-current a, ' + cl + ' nav ul li.tab-current a > i{color:' + color + ' !important;}\n';
                css += cl + ' nav ul li:not(.tab-current) a:hover:after{background:' + bg_hover + '; transform: translate3d(0,0,0);}\n';
                css += cl + ' nav ul li:not(.tab-current) a:hover, ' + cl + ' nav ul li:not(.tab-current):hover a > i{color:' + color_hover + ' !important;}\n';
                break;
            case 'topline':
                css += cl + ' nav ul li.tab-current a{box-shadow:inset 0px 3px 0px ' + bg + ';}\n';
                css += cl + ' nav ul li.tab-current {border-top-color: ' + color + ';}\n';
                css += cl + ' nav ul li.tab-current a, ' + cl + ' nav ul li.tab-current a > i{color:' + color + ' !important;}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a{box-shadow:inset 0px 3px 0px ' + bg_hover + ';}\n';
                css += cl + ' nav ul li:not(.tab-current):hover {border-top-color: ' + color_hover + ';}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a, ' + cl + ' nav ul li:not(.tab-current):hover a > i{color:' + color_hover + ' !important;}\n';
                break;
            case 'iconfall':
            case 'circle':
            case 'square':
                css += cl + ' nav ul li::before{background:' + bg + '; border-color:' + bg + ';}\n';
                css += cl + ' nav ul li.tab-current::after { border-color:' + bg + ';}\n';
                css += cl + ' nav ul li.tab-current a, ' + cl + ' nav ul li.tab-current a > i{color:' + color + ' !important;}\n';
                css += cl + ' nav ul li:not(.tab-current):hover::before{background:' + bg_hover + '; border-color:' + bg_hover + '; transform: translate3d(0,0,0);}\n';
                css += cl + ' nav ul li:not(.tab-current):hover::after { border-color:' + bg_hover + ';}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a, ' + cl + ' nav ul li:not(.tab-current):hover a > i{color:' + color_hover + ' !important;}\n';
                break;
            case 'line':
                css += cl + ' nav ul li.tab-current a{box-shadow:inset 0px -2px ' + bg + ' !important;}\n';
                css += cl + ' nav ul li.tab-current a, ' + cl + ' nav ul li.tab-current a > i{color:' + color + ' !important;}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a{box-shadow:inset 0px -2px ' + bg_hover + ' !important;}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a, ' + cl + ' nav ul li:not(.tab-current):hover a > i{color:' + color_hover + ' !important;}\n';
                break;
            case 'linebox':
                css += cl + ' nav ul li a::after{background:' + bg + ';}\n';
                css += cl + ' nav ul li.tab-current a, ' + cl + ' nav ul li.tab-current a > i{color:' + color + ' !important;}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a::after{background:' + bg_hover + '; transform: translate3d(0,0,0);}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a, ' + cl + ' nav ul li:not(.tab-current):hover a > i{color:' + color_hover + ' !important;}\n';
                break;
            case 'flip':
                css += cl + ' nav ul li a::after, ' + cl + ' nav ul li.tab-current a{background:' + bg + ';}\n';
                css += cl + ' nav ul li.tab-current a, ' + cl + ' nav ul li.tab-current a > i{color:' + color + ' !important;}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a::after, ' + cl + ' nav ul li:not(.tab-current):hover a{background:' + bg_hover + '; transform: translate3d(0,0,0);}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a, ' + cl + ' nav ul li:not(.tab-current):hover a > i{color:' + color_hover + ' !important;}\n';
                break;
            case 'tzoid':
                var style = jQuery(cl + ' nav ul li').attr('style');
                css += cl + ' nav ul li a::after{' + style + ';}\n';
                css += cl + ' li.tab-current a::after{background:' + bg + '; color:' + color + ';}\n';
                css += cl + ' nav ul li.tab-current a, ' + cl + ' nav ul li.tab-current a > i{color:' + color + ' !important;}\n';
                css += cl + ' li:not(.tab-current):hover a::after{background:' + bg_hover + '; color:' + color_hover + '; transform: perspective(5px) rotateX(0.7deg) translateZ(-1px);}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a, ' + cl + ' nav ul li:not(.tab-current):hover a > i{color:' + color_hover + ' !important;}\n';
                break;
            case 'fillup':
                css += cl + ' nav ul li.tab-current a::after{background:' + bg + '; border-color: ' + bg + ';}\n';
                css += cl + ' nav ul li a::after{background:' + bg_hover + '; border-color: ' + bg_hover + ';}\n';
                css += cl + ' nav ul li.tab-current a, ' + cl + ' nav ul li.tab-current a > i{color:' + color + ' !important;}\n';
                css += cl + ' nav ul li a {border-color:' + color + ' !important;}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a::after{background:' + bg_hover + '; translate3d(0,0,0)}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a::after{background:' + bg_hover + '; border-color: ' + bg_hover + '; transform: translate3d(0,0,0)}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a {border-color:' + color_hover + ' !important;}\n';
                css += cl + ' nav ul li:not(.tab-current):hover a, ' + cl + ' nav ul li:not(.tab-current):hover a > i{color:' + color_hover + ' !important;}\n';
                break;
        }

        var listContainer = jQuery(cl).find('.elegant-tabs-list-container');
        listContainer.find('li').each(function(index, el) {
            var textColor = jQuery(this).attr('data-tab-text-color'),
                tabBGColor = jQuery(this).attr('data-tab-bg-color'),
                $this = jQuery(this);

            css += cl + ' .infi-responsive-tabs:nth-of-type(' + (index + 1) + ') .infi-tab-accordion.infi-active-tab .infi_accordion_item{background:' + tabBGColor + ' !important; color:' + textColor + ' !important;}\n';
            css += cl + ' .infi-responsive-tabs:nth-of-type(' + (index + 1) + ') .infi-tab-accordion.infi-active-tab .infi_accordion_item .infi-accordion-item-heading{color:' + textColor + ' !important;}\n';
            css += cl + ' .infi-responsive-tabs:nth-of-type(' + (index + 1) + ') .infi-tab-accordion.infi-active-tab .infi_accordion_item .infi-accordion-item-heading .iw-icons{color:' + textColor + ' !important;}\n';

            switch (st) {
                case 'bars':
                    css += cl + ' li:nth-child(' + (index + 1) + ') a{background:' + tabBGColor + '; color:' + textColor + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a, ' + cl + ' nav ul li:nth-child(' + (index + 1) + ') a > i{color:' + textColor + ' !important;}\n';
                    break;
                case 'iconbox':
                case 'iconbox-iconlist':
                    css += cl + ' li:nth-child(' + (index + 1) + ') a{background:' + tabBGColor + '; color:' + textColor + ' !important;}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a > i{color:' + textColor + ' !important;}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ')::after{color:' + tabBGColor + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + '){color:' + tabBGColor + ' !important;}\n';
                    break;
                case 'underline':
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a::after{background:' + tabBGColor + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a, ' + cl + ' nav ul li:nth-child(' + (index + 1) + ') a > i{color:' + textColor + ' !important;}\n';
                    break;
                case 'topline':
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a{box-shadow:inset 0px 3px 0px ' + tabBGColor + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') {border-top-color: ' + textColor + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a, ' + cl + ' nav ul li:nth-child(' + (index + 1) + ') a > i{color:' + textColor + ' !important;}\n';
                    break;
                case 'iconfall':
                case 'circle':
                case 'square':
                    css += cl + ' nav ul li::before{background:' + tabBGColor + '; border-color:' + tabBGColor + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ')::after { border-color:' + tabBGColor + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a, ' + cl + ' nav ul li:nth-child(' + (index + 1) + ') a > i{color:' + textColor + ' !important;}\n';
                    break;
                case 'line':
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a{box-shadow:inset 0px -2px ' + tabBGColor + ' !important;}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a, ' + cl + ' nav ul li:nth-child(' + (index + 1) + ') a > i{color:' + textColor + ' !important;}\n';
                    break;
                case 'linebox':
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a::after{background:' + tabBGColor + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a, ' + cl + ' nav ul li:nth-child(' + (index + 1) + ') a > i{color:' + textColor + ' !important;}\n';
                    break;
                case 'flip':
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ').tab-current a::after, ' + cl + ' nav ul li:nth-child(' + (index + 1) + ').tab-current a{background:' + tabBGColor + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a, ' + cl + ' nav ul li:nth-child(' + (index + 1) + ') a > i{color:' + textColor + ' !important;}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + '):not(.tab-current):hover a::after, ' + cl + ' nav ul li:nth-child(' + (index + 1) + '):not(.tab-current):hover a{background:' + tabBGColor + '; transform: translate3d(0,0,0);}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + '):not(.tab-current):hover a, ' + cl + ' nav ul li:nth-child(' + (index + 1) + '):not(.tab-current):hover a > i{color:' + textColor + ' !important;}\n';
                    break;
                case 'tzoid':
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a::after{background:' + tabBGColor + '; color:' + textColor + ';}\n';
                    css += cl + ' li:nth-child(' + (index + 1) + ') a::after{background:' + tabBGColor + '; color:' + textColor + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a, ' + cl + ' nav ul li:nth-child(' + (index + 1) + ') a > i{color:' + textColor + ' !important;}\n';
                    break;
                case 'fillup':
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a::after{background:' + tabBGColor + '; border-color: ' + tabBGColor + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a::after{background:' + bg_hover + '; border-color: ' + bg_hover + ';}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a, ' + cl + ' nav ul li:nth-child(' + (index + 1) + ') a > i{color:' + textColor + ' !important;}\n';
                    css += cl + ' nav ul li:nth-child(' + (index + 1) + ') a {border-color:' + textColor + ' !important;}\n';
                    break;
            }

        });
    });
    css += '</style>';
    jQuery("head").append(css);
}

// Handle tabs navigation to carousel.
function elegantTabsNavigationToCarousel() {
	jQuery( '.et-tabs.et-tabs-carousel:not(.et-vertical)' ).each( function() {
		var $thisTabs = jQuery( this ),
			tabNavContainer = $thisTabs.find( '.elegant-tabs-list-container' ),
			tabNavContainerWidth = 0,
			tabNavWidth = 0,
			singletabNavWidth = 0,
			singletabNavHeight = 0,
			nextTabWidth = 0,
			tabNavStyle = '',
			tabIconColor = $thisTabs.attr( 'data-arrow-color' ),
			tabIconBgColor = $thisTabs.attr( 'data-arrow-bg-color' ),
			nextTabIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 240.823 240.823" style="enable-background:new 0 0 240.823 240.823;width: 24px;height: 24px;fill:' + tabIconColor + ';" xml:space="preserve"><g xmlns="http://www.w3.org/2000/svg"><path id="Chevron_Right_1_" d="M183.189,111.816L74.892,3.555c-4.752-4.74-12.451-4.74-17.215,0c-4.752,4.74-4.752,12.439,0,17.179   l99.707,99.671l-99.695,99.671c-4.752,4.74-4.752,12.439,0,17.191c4.752,4.74,12.463,4.74,17.215,0l108.297-108.261   C187.881,124.315,187.881,116.495,183.189,111.816z"/></g></svg>',
			prevTabIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 240.823 240.823" style="enable-background:new 0 0 240.823 240.823;width: 24px;height: 24px;fill:' + tabIconColor + ';" xml:space="preserve"><g><path id="Chevron_Right" d="M57.633,129.007L165.93,237.268c4.752,4.74,12.451,4.74,17.215,0c4.752-4.74,4.752-12.439,0-17.179   l-99.707-99.671l99.695-99.671c4.752-4.74,4.752-12.439,0-17.191c-4.752-4.74-12.463-4.74-17.215,0L57.621,111.816   C52.942,116.507,52.942,124.327,57.633,129.007z"/></g></svg>';

		if ( tabNavContainer.length ) {
			tabNavContainerWidth = tabNavContainer.width();
		}

		jQuery( tabNavContainer ).find( 'li' ).each( function() {
			tabNavWidth += jQuery( this ).width();
			singletabNavWidth = jQuery( this ).width();
			singletabNavHeight = jQuery( this ).height();
		} );

		if ( tabNavWidth > tabNavContainerWidth ) {
			tabNavContainerWidth = tabNavContainerWidth - 32;
			tabNavStyle = $thisTabs.find( '.elegant-tabs-nav' ).attr( 'style' );
			$thisTabs.find( '.elegant-tabs-nav' ).attr( 'style', tabNavStyle + ';width:' + tabNavContainerWidth + 'px;padding-left:32px;' + 'overflow: hidden !important;' );
			tabNavContainer.css( { width: tabNavWidth + 20 } );
			tabIconBgColor = ( 'undefined' !== typeof tabIconBgColor ) ? tabIconBgColor : '#ddd';

			jQuery( '<span class="et-prev-tab" data-width="' + singletabNavWidth + 'px" style="height:' + singletabNavHeight + 'px;background:' + tabIconBgColor + ';">' + prevTabIcon + '</span>' ).insertBefore( tabNavContainer );
			jQuery( '<span class="et-next-tab" data-width="' + singletabNavWidth + 'px" style="height:' + singletabNavHeight + 'px;background:' + tabIconBgColor + ';">' + nextTabIcon + '</span>' ).insertAfter( tabNavContainer );

			$thisTabs.find( '.et-prev-tab' ).on( 'click', function() {
				var lastTab = jQuery( this ).next( '.elegant-tabs-list-container' ).find( 'li:last-child' ),
					firstTab = jQuery( this ).next( '.elegant-tabs-list-container' ).find( 'li:first-child' )
					clone = jQuery( lastTab ).clone();

				if ( lastTab.length ) {

					lastTabWidth = lastTab.width();

					lastTab.css( { marginLeft: -lastTabWidth } );
					// firstTab.css( { marginLeft: lastTabWidth } );
					tabNavContainer.css( { width: tabNavWidth + 500 } );
					tabNavContainer.prepend( lastTab );
					tabNavContainer.append( clone );

					setTimeout( function(){
						lastTab.css( { marginLeft: 0 } );
						firstTab.css( { marginLeft: 0 } );
						clone.remove();
					});
				}
			} );

			$thisTabs.find( '.et-next-tab' ).on( 'click', function() {
				var nextTab = jQuery( this ).prev( '.elegant-tabs-list-container' ).find( 'li:first-child' ),
					clone = jQuery( nextTab ).clone();

				if ( nextTab.length ) {

					nextTabWidth = nextTab.width();

					nextTab.css( { marginLeft: -nextTabWidth } );
					tabNavContainer.css( { width: tabNavWidth + 500 } );
					tabNavContainer.append( clone );
					setTimeout( function(){
						nextTab.css( { marginLeft: 0 } );
						tabNavContainer.append( nextTab );
						clone.remove();
					}, 200 );
				}
			} );

			jQuery( document ).on( 'elegantCarouselTabSwitched', function() {
				$thisTabs.find( '.et-next-tab' ).trigger( 'click' );
			} );
		}
	} );
}

/* Call tabs function */
(function() {

	if ( ! jQuery( 'body' ).hasClass( 'fusion-builder-live-preview' ) ) {
    	etGenerateCSS();
	}

    var nav = jQuery('.et-mobile-tabs');
    nav.change(function() {
        var hashLink = jQuery(this).find("option:selected").val();
        checkHash(hashLink);
    });

    var url = window.location;
    hash = url.href;

    if (-1 !== hash.indexOf('#')) {
        hash = hash.replace("/#", '#');
        checkHash(hash);
    }
    jQuery("a").not('.et-anchor-tag').on( 'click', function(e) {
        var url = jQuery(this).attr("href");
        if (url !== "" && typeof url !== "undefined") {
            var isHash = url.indexOf('#section');
            var isTabPage = '';
            hash = url.substring(url.indexOf('#section'));
            if (isHash !== -1) {
                isTabPage = jQuery(hash).length;
            }
            if (isHash !== -1 && isTabPage) {
                e.preventDefault();
                checkHash(url);
            }
        }
    });

	jQuery(".et-anchor-tag").on( 'hover mouseenter', function( e ) {
		if ( ! jQuery(this).parent('li').hasClass('tab-current') ) {
			var hover_src = jQuery(this).find('.elegant-tabs-image-icon').data( 'hover-src' );
			if ( '' !== hover_src ) {
				jQuery(this).find('.elegant-tabs-image-icon').attr( 'src', hover_src );
			}
		}
	} );
	jQuery(".et-anchor-tag").on( 'mouseleave', function( e ) {
		if ( ! jQuery(this).parent('li').hasClass('tab-current') ) {
			var original_src = jQuery(this).find('.elegant-tabs-image-icon').data( 'original-src' );
			jQuery(this).find('.elegant-tabs-image-icon').attr( 'src', original_src );
		}
	} );

    jQuery(document).on("elegantTabSwitched", function(e, hash) {
        var original_src = '',
            hover_src = '';
        jQuery(document).trigger("resize");
        jQuery(hash).parent('.et-content-wrap').find('.infi-tab-accordion').removeClass('infi-active-tab');
        jQuery('div[data-href="' + hash + '"]').parents('.infi-tab-accordion').addClass('infi-active-tab');
        jQuery(hash).siblings().find('iframe').each(function(i) {
            jQuery(this).attr('src', jQuery(this).attr('src'));
        });
        hover_src = jQuery('a[data-href*="' + hash + '"]').find('.elegant-tabs-image-icon').data('hover-src');
        jQuery('a[data-href*="' + hash + '"]').parents('.elegant-tabs-list-container').find('.elegant-tabs-image-icon').each(function() {
            original_src = jQuery(this).data('original-src');
            jQuery(this).attr('src', original_src);
        });
		if ( hover_src ) {
        	jQuery('a[data-href*="' + hash + '"]').find('.elegant-tabs-image-icon').attr('src', hover_src);
		}

        jQuery(hash).parent('.et-content-wrap').find('.fusion-gallery').each(function() {
            jQuery(this).isotope();
        });

        // Check if tab content has google map, then reinitialize it.
        jQuery(hash).find('.shortcode-map').each(function() {
            jQuery(this).reinitializeGoogleMap();
        });
    });

    // Responsive Tabs.
    jQuery(document).ready(function() {
        var accHD = document.getElementsByClassName('infi-accordion-item-heading');
        for (i = 0; i < accHD.length; i++) {
            jQuery( accHD[i] ).on( 'click', function( event ) {
				toggleItem( i, event );
			} );
        }

        function toggleItem(index, event) {
            var $this = jQuery(event.target),
                hash = $this.data('href'),
                itemID,
                animation,
                hashLink;

            if (typeof hash == 'undefined') {
                hash = $this.parent('.infi-accordion-item-heading').data('href');
                $this = $this.parent('.infi-accordion-item-heading');
            }

            itemID = hash;
            animation = jQuery(itemID).data('animation');

            jQuery(itemID).parents('.et-tabs').find('nav > ul li').removeClass('tab-current');
			jQuery(itemID).parents( '.et-tabs' ).find( 'a[data-href="' + itemID +'"]').parents( 'li' ).addClass( 'tab-current' );
            jQuery(itemID).parent('.et-content-wrap').find('section').removeClass('content-current');
            jQuery(itemID).parent('.et-content-wrap').find('.infi-tab-accordion').removeClass('infi-active-tab');
            $this.parents('.infi-tab-accordion').addClass('infi-active-tab');

            jQuery(itemID)[0].className = 'content-current';
            jQuery(itemID + ' > .infi-content-wrapper')[0].className = 'infi-content-wrapper animated ' + animation;

            jQuery('html, body').animate({
                scrollTop: (($this).offset().top) - 85
            }, 300);
        }
    });

	jQuery( document ).on( 'fusion-element-render-fusion_et_tabs', function( event, cid ) {
		[].slice.call(document.querySelectorAll('.elegant-tabs-cid' + cid + ' .et-tabs')).forEach(function(el) {
			var hashPosition = ('undefined' !== typeof jQuery(el).data('active-tab-index')) ? jQuery(el).data('active-tab-index') : 0,
				listContainer = jQuery(el).find('.elegant-tabs-list-container'),
	        	autoSwitch = jQuery(el).attr('data-auto-switch-tab'),
	        	autoSwitchInterval = jQuery(el).data('switch-interval');

			var Tabs = new IW_Tabs(el, {
	            start: hashPosition
	        });

			if ( 'undefined' !== typeof autoSwitch && 'yes' === autoSwitch) {
				elegantAutoSwitchTabs(listContainer[0], autoSwitchInterval, hashPosition);
			}

			// Create the dropdown base
			var nav = jQuery(el).find("nav");
			jQuery("<select />", { "class":"et-mobile-tabs"}).appendTo( nav );

			// Populate dropdown with menu items
			nav.find("a.et-anchor-tag").each(function() {
			 var el = jQuery(this);
			 jQuery("<option />", {
					 "value"   : el.attr("data-href"),
					 "text"    : el.find('span').text()
			 }).appendTo(nav.find("select") );
			});
			nav.find( "select" ).change( function() {
				var hashLink = jQuery( this ).find( "option:first-child" ).val();
				checkHash( hashLink );
			});
		});

		// Tabs to carousel.
		elegantTabsNavigationToCarousel();
	} );

	jQuery( document ).ready( function() {
		// Tabs to carousel.
		elegantTabsNavigationToCarousel();
	} );
}(jQuery));
