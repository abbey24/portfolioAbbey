// SmoothScroll v0.9.9
// Licensed under the terms of the MIT license.
// People involved
// - Balazs Galambosi: maintainer (CHANGELOG.txt)
// - Patrick Brunner (patrickb1991@gmail.com)
// - Michael Herf: ssc_pulse Algorithm

function ssc_init() {
  if (!document.body) return;
  var e = document.body;
  var t = document.documentElement;
  var n = window.innerHeight;
  var r = e.scrollHeight;
  ssc_root = document.compatMode.indexOf("CSS") >= 0 ? t : e;
  ssc_activeElement = e;
  ssc_initdone = true;
  if (top != self) {
    ssc_frame = true
  } else if (r > n && (e.offsetHeight <= n || t.offsetHeight <= n)) {
    ssc_root.style.height = "auto";
    if (ssc_root.offsetHeight <= n) {
      var i = document.createElement("div");
      i.style.clear = "both";
      e.appendChild(i)
    }
  }
  if (!ssc_fixedback) {
    e.style.backgroundAttachment = "scroll";
    t.style.backgroundAttachment = "scroll"
  }
  if (ssc_keyboardsupport) {
    ssc_addEvent("keydown", ssc_keydown)
  }
}

function ssc_scrollArray(e, t, n, r) {
  r || (r = 1e3);
  ssc_directionCheck(t, n);
  ssc_que.push({
    x: t,
    y: n,
    lastX: t < 0 ? .99 : -.99,
    lastY: n < 0 ? .99 : -.99,
    start: +(new Date)
  });
  if (ssc_pending) {
    return
  }
  var i = function() {
    var s = +(new Date);
    var o = 0;
    var u = 0;
    for (var a = 0; a < ssc_que.length; a++) {
      var f = ssc_que[a];
      var l = s - f.start;
      var c = l >= ssc_animtime;
      var h = c ? 1 : l / ssc_animtime;
      if (ssc_pulseAlgorithm) {
        h = ssc_pulse(h)
      }
      var p = f.x * h - f.lastX >> 0;
      var d = f.y * h - f.lastY >> 0;
      o += p;
      u += d;
      f.lastX += p;
      f.lastY += d;
      if (c) {
        ssc_que.splice(a, 1);
        a--
      }
    }
    if (t) {
      var v = e.scrollLeft;
      e.scrollLeft += o;
      if (o && e.scrollLeft === v) {
        t = 0
      }
    }
    if (n) {
      var m = e.scrollTop;
      e.scrollTop += u;
      if (u && e.scrollTop === m) {
        n = 0
      }
    }
    if (!t && !n) {
      ssc_que = []
    }
    if (ssc_que.length) {
      setTimeout(i, r / ssc_framerate + 1)
    } else {
      ssc_pending = false
    }
  };
  setTimeout(i, 0);
  ssc_pending = true
}

function ssc_wheel(e) {
  if (!ssc_initdone) {
    ssc_init()
  }
  var t = e.target;
  var n = ssc_overflowingAncestor(t);
  if (!n || e.defaultPrevented || ssc_isNodeName(ssc_activeElement, "embed") || ssc_isNodeName(t, "embed") && /\.pdf/i.test(t.src)) {
    return true
  }
  var r = e.wheelDeltaX || 0;
  var i = e.wheelDeltaY || 0;
  if (!r && !i) {
    i = e.wheelDelta || 0
  }
  if (Math.abs(r) > 1.2) {
    r *= ssc_stepsize / 120
  }
  if (Math.abs(i) > 1.2) {
    i *= ssc_stepsize / 120
  }
  ssc_scrollArray(n, -r, -i);
  e.preventDefault()
}

function ssc_keydown(e) {
  var t = e.target;
  var n = e.ctrlKey || e.altKey || e.metaKey;
  if (/input|textarea|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n) {
    return true
  }
  if (ssc_isNodeName(t, "button") && e.keyCode === ssc_key.spacebar) {
    return true
  }
  var r, i = 0,
      s = 0;
  var o = ssc_overflowingAncestor(ssc_activeElement);
  var u = o.clientHeight;
  if (o == document.body) {
    u = window.innerHeight
  }
  switch (e.keyCode) {
  case ssc_key.up:
    s = -ssc_arrowscroll;
    break;
  case ssc_key.down:
    s = ssc_arrowscroll;
    break;
  case ssc_key.spacebar:
    r = e.shiftKey ? 1 : -1;
    s = -r * u * .9;
    break;
  case ssc_key.pageup:
    s = -u * .9;
    break;
  case ssc_key.pagedown:
    s = u * .9;
    break;
  case ssc_key.home:
    s = -o.scrollTop;
    break;
  case ssc_key.end:
    var a = o.scrollHeight - o.scrollTop - u;
    s = a > 0 ? a + 10 : 0;
    break;
  case ssc_key.left:
    i = -ssc_arrowscroll;
    break;
  case ssc_key.right:
    i = ssc_arrowscroll;
    break;
  default:
    return true
  }
  ssc_scrollArray(o, i, s);
  e.preventDefault()
}

function ssc_mousedown(e) {
  ssc_activeElement = e.target
}

function ssc_setCache(e, t) {
  for (var n = e.length; n--;) ssc_cache[ssc_uniqueID(e[n])] = t;
  return t
}

function ssc_overflowingAncestor(e) {
  var t = [];
  var n = ssc_root.scrollHeight;
  do {
    var r = ssc_cache[ssc_uniqueID(e)];
    if (r) {
      return ssc_setCache(t, r)
    }
    t.push(e);
    if (n === e.scrollHeight) {
      if (!ssc_frame || ssc_root.clientHeight + 10 < n) {
        return ssc_setCache(t, document.body)
      }
    } else if (e.clientHeight + 10 < e.scrollHeight) {
      overflow = getComputedStyle(e, "").getPropertyValue("overflow");
      if (overflow === "scroll" || overflow === "auto") {
        return ssc_setCache(t, e)
      }
    }
  } while (e = e.parentNode)
}

function ssc_addEvent(e, t, n) {
  window.addEventListener(e, t, n || false)
}

function ssc_removeEvent(e, t, n) {
  window.removeEventListener(e, t, n || false)
}

function ssc_isNodeName(e, t) {
  return e.nodeName.toLowerCase() === t.toLowerCase()
}

function ssc_directionCheck(e, t) {
  e = e > 0 ? 1 : -1;
  t = t > 0 ? 1 : -1;
  if (ssc_direction.x !== e || ssc_direction.y !== t) {
    ssc_direction.x = e;
    ssc_direction.y = t;
    ssc_que = []
  }
}

function ssc_pulse_(e) {
  var t, n, r;
  e = e * ssc_pulseScale;
  if (e < 1) {
    t = e - (1 - Math.exp(-e))
  } else {
    n = Math.exp(-1);
    e -= 1;
    r = 1 - Math.exp(-e);
    t = n + r * (1 - n)
  }
  return t * ssc_pulseNormalize
}

function ssc_pulse(e) {
  if (e >= 1) return 1;
  if (e <= 0) return 0;
  if (ssc_pulseNormalize == 1) {
    ssc_pulseNormalize /= ssc_pulse_(1)
  }
  return ssc_pulse_(e)
}

var ssc_framerate = 150;
var ssc_animtime = 500;
var ssc_stepsize = 150;
var ssc_pulseAlgorithm = true;
var ssc_pulseScale = 6;
var ssc_pulseNormalize = 1;
var ssc_keyboardsupport = true;
var ssc_arrowscroll = 50;
var ssc_frame = false;
var ssc_direction = {
  x: 0,
  y: 0
};

var ssc_initdone = false;
var ssc_fixedback = true;
var ssc_root = document.documentElement;
var ssc_activeElement;
var ssc_key = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  spacebar: 32,
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36
};

var ssc_que = [];
var ssc_pending = false;
var ssc_cache = {};

setInterval(function() {
  ssc_cache = {}
}, 10 * 1e3);

var ssc_uniqueID = function() {
  var e = 0;
  return function(t) {
    return t.ssc_uniqueID || (t.ssc_uniqueID = e++)
  }
}();

var ischrome = /chrome/.test(navigator.userAgent.toLowerCase());

if (ischrome) {
  ssc_addEvent("mousedown", ssc_mousedown);
  // ssc_addEvent("mousewheel", ssc_wheel);
  ssc_addEvent("load", ssc_init)
}

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.smoothScroll = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//

	var smoothScroll = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root && 'onhashchange' in root; // Feature test
	var settings, eventTimeout, fixedHeader, headerHeight, anchor;

	// Default settings
	var defaults = {
		selector: '[data-scroll]',
		selectorHeader: '[data-scroll-header]',
		speed: 500,
		easing: 'easeInOutCubic',
		offset: 0,
		scrollOnLoad: true,
		callback: function () {}
	};


	//
	// Methods
	//

	/**
	 * Merge two or more objects. Returns a new object.
	 * @private
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Get the height of an element.
	 * @private
	 * @param  {Node} elem The element to get the height of
	 * @return {Number}    The element's height in pixels
	 */
	var getHeight = function ( elem ) {
		return Math.max( elem.scrollHeight, elem.offsetHeight, elem.clientHeight );
	};

	/**
	 * Get the closest matching element up the DOM tree.
	 * @private
	 * @param  {Element} elem     Starting element
	 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
	 * @return {Boolean|Element}  Returns null if not match found
	 */
	var getClosest = function ( elem, selector ) {

		// Variables
		var firstChar = selector.charAt(0);
		var supports = 'classList' in document.documentElement;
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( firstChar === '[' ) {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split( '=' );

			if ( attribute.length > 1 ) {
				value = true;
				attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
			}
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {

			// If selector is a class
			if ( firstChar === '.' ) {
				if ( supports ) {
					if ( elem.classList.contains( selector.substr(1) ) ) {
						return elem;
					}
				} else {
					if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
						return elem;
					}
				}
			}

			// If selector is an ID
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}

			// If selector is a data attribute
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( attribute[0] ) ) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Escape special characters for use with querySelector
	 * @public
	 * @param {String} id The anchor ID to escape
	 * @author Mathias Bynens
	 * @link https://github.com/mathiasbynens/CSS.escape
	 */
	smoothScroll.escapeCharacters = function ( id ) {

		// Remove leading hash
		if ( id.charAt(0) === '#' ) {
			id = id.substr(1);
		}

		var string = String(id);
		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = '';
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);
			// Note: there’s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then throw an
			// `InvalidCharacterError` exception and terminate these steps.
			if (codeUnit === 0x0000) {
				throw new InvalidCharacterError(
					'Invalid character: the input contains U+0000.'
				);
			}

			if (
				// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
				// U+007F, […]
				(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
				// If the character is the first character and is in the range [0-9]
				// (U+0030 to U+0039), […]
				(index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				// If the character is the second character and is in the range [0-9]
				// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
				(
					index === 1 &&
					codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
					firstCodeUnit === 0x002D
				)
			) {
				// http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}

			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), […]
			if (
				codeUnit >= 0x0080 ||
				codeUnit === 0x002D ||
				codeUnit === 0x005F ||
				codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
				codeUnit >= 0x0041 && codeUnit <= 0x005A ||
				codeUnit >= 0x0061 && codeUnit <= 0x007A
			) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// http://dev.w3.org/csswg/cssom/#escape-a-character
			result += '\\' + string.charAt(index);

		}

		return '#' + result;

	};

	/**
	 * Calculate the easing pattern
	 * @private
	 * @link https://gist.github.com/gre/1650294
	 * @param {String} type Easing pattern
	 * @param {Number} time Time animation should take to complete
	 * @returns {Number}
	 */
	var easingPattern = function ( type, time ) {
		var pattern;
		if ( type === 'easeInQuad' ) pattern = time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuad' ) pattern = time * (2 - time); // decelerating to zero velocity
		if ( type === 'easeInOutQuad' ) pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
		if ( type === 'easeInCubic' ) pattern = time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutCubic' ) pattern = (--time) * time * time + 1; // decelerating to zero velocity
		if ( type === 'easeInOutCubic' ) pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
		if ( type === 'easeInQuart' ) pattern = time * time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuart' ) pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
		if ( type === 'easeInOutQuart' ) pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
		if ( type === 'easeInQuint' ) pattern = time * time * time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuint' ) pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
		if ( type === 'easeInOutQuint' ) pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
		return pattern || time; // no easing, no acceleration
	};

	/**
	 * Calculate how far to scroll
	 * @private
	 * @param {Element} anchor The anchor element to scroll to
	 * @param {Number} headerHeight Height of a fixed header, if any
	 * @param {Number} offset Number of pixels by which to offset scroll
	 * @returns {Number}
	 */
	var getEndLocation = function ( anchor, headerHeight, offset ) {
		var location = 0;
		if (anchor.offsetParent) {
			do {
				location += anchor.offsetTop;
				anchor = anchor.offsetParent;
			} while (anchor);
		}
		location = location - headerHeight - offset;
		return location >= 0 ? location : 0;
	};

	/**
	 * Determine the document's height
	 * @private
	 * @returns {Number}
	 */
	var getDocumentHeight = function () {
		return Math.max(
			root.document.body.scrollHeight, root.document.documentElement.scrollHeight,
			root.document.body.offsetHeight, root.document.documentElement.offsetHeight,
			root.document.body.clientHeight, root.document.documentElement.clientHeight
		);
	};

	/**
	 * Convert data-options attribute into an object of key/value pairs
	 * @private
	 * @param {String} options Link-specific options as a data attribute string
	 * @returns {Object}
	 */
	var getDataOptions = function ( options ) {
		return !options || !(typeof JSON === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse( options );
	};

	/**
	 * Get the height of a fixed header in pixels
	 * @param  {Node} header The header
	 * @return {Integer}     The header height in pixels
	 */
	var getHeaderHeight = function ( header ) {
		return header === null ? 0 : ( getHeight( header ) + header.offsetTop );
	};

	/**
	 * Start/stop the scrolling animation
	 * @public
	 * @param {Element} toggle The element that toggled the scroll event
	 * @param {Element} anchor The element to scroll to
	 * @param {Object} options
	 */
	smoothScroll.animateScroll = function ( anchor, toggle, options ) {

		// Options and overrides
		var overrides = getDataOptions( toggle ? toggle.getAttribute('data-options') : null );
		var settings = extend( settings || defaults, options || {}, overrides ); // Merge user options with defaults

		// Selectors and variables
		var isNum = Object.prototype.toString.call( anchor ) === '[object Number]' ? true : false;
		var anchorElem = isNum ? null : root.document.querySelector(anchor);
		if ( !isNum && !anchorElem ) return;
		var startLocation = root.pageYOffset; // Current location on the page
		if ( !fixedHeader ) { fixedHeader = root.document.querySelector( settings.selectorHeader ); }  // Get the fixed header if not already set
		if ( !headerHeight ) { headerHeight = getHeaderHeight( fixedHeader ); } // Get the height of a fixed header if one exists and not already set
		var endLocation = isNum ? anchor : getEndLocation( anchorElem, headerHeight, parseInt(settings.offset, 10) ); // Location to scroll to
		var animationInterval; // interval timer
		var distance = endLocation - startLocation; // distance to travel
		var documentHeight = getDocumentHeight();
		var timeLapsed = 0;
		var percentage, position;

		/**
		 * Stop the scroll animation when it reaches its target (or the bottom/top of page)
		 * @private
		 * @param {Number} position Current position on the page
		 * @param {Number} endLocation Scroll to location
		 * @param {Number} animationInterval How much to scroll on this loop
		 */
		var stopAnimateScroll = function (position, endLocation, animationInterval) {
			var currentLocation = root.pageYOffset;
			if ( position == endLocation || currentLocation == endLocation || ( (root.innerHeight + currentLocation) >= documentHeight ) ) {
				clearInterval(animationInterval);
				if ( anchorElem ) {
					anchorElem.focus();
				}
				settings.callback( anchor, toggle ); // Run callbacks after animation complete
			}
		};

		/**
		 * Loop scrolling animation
		 * @private
		 */
		var loopAnimateScroll = function () {
			timeLapsed += 16;
			percentage = ( timeLapsed / parseInt(settings.speed, 10) );
			percentage = ( percentage > 1 ) ? 1 : percentage;
			position = startLocation + ( distance * easingPattern(settings.easing, percentage) );
			root.scrollTo( 0, Math.floor(position) );
			stopAnimateScroll(position, endLocation, animationInterval);
		};

		/**
		 * Set interval timer
		 * @private
		 */
		var startAnimateScroll = function () {
			animationInterval = setInterval(loopAnimateScroll, 16);
		};

		/**
		 * Reset position to fix weird iOS bug
		 * @link https://github.com/cferdinandi/smooth-scroll/issues/45
		 */
		if ( root.pageYOffset === 0 ) {
			root.scrollTo( 0, 0 );
		}

		// Start scrolling animation
		startAnimateScroll();

	};

	/**
	 * Handle has change event
	 * @private
	 */
	var hashChangeHandler = function () {

		// Get hash from URL
		var hash = root.location.hash;

		// If anchor target is cached, reset it's ID
		if ( anchor ) {
			anchor.id = anchor.getAttribute( 'data-scroll-id' );
			anchor = null;
		}

		// If there's a URL hash, animate scrolling to the matching ID
		if ( !hash ) return;
		hash = smoothScroll.escapeCharacters( hash ); // Escape special characters and leading numbers
		var toggle = document.querySelector( settings.select + '[href*="' + hash + '"]');
		smoothScroll.animateScroll( hash, toggle, settings); // Animate scroll

	};

	/**
	 * Handle toggle click events
	 * @private
	 * @param {Event} event
	 */
	var clickHandler = function (event) {

		// Check if event target is a smooth scroll link and has a hash
		var toggle = getClosest( event.target, settings.selector );
		if ( !toggle || !toggle.hash ) return;

		// Escape the hash characters
		var hash = smoothScroll.escapeCharacters( toggle.hash ); // Escape special characters and leading numbers

		// If hash is already active, animate immediately (no hash change will fire)
		if ( hash === ( root.location.hash || '#top' ) ) {
			smoothScroll.animateScroll( hash, toggle, settings);
			return;
		}

		// Get the anchor target
		anchor = document.querySelector( hash );

		// If anchor exists, save the ID as a data attribute and remove it (prevents scroll jump)
		if ( anchor ) {
			anchor.setAttribute( 'data-scroll-id', anchor.id );
			anchor.id = '';
		}

	};

	/**
	 * On window resize, only run events at a rate of 15fps for better performance
	 * @private
	 * @param  {Event} event
	 */
	var resizeThrottler = function (event) {
		if ( !eventTimeout ) {
			eventTimeout = setTimeout(function() {
				eventTimeout = null; // Reset timeout
				headerHeight = getHeaderHeight( fixedHeader ); // Get the height of a fixed header if one exists
			}, 66);
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	smoothScroll.destroy = function () {

		// If plugin isn't already initialized, stop
		if ( !settings ) return;

		// Remove event listeners
		document.removeEventListener( 'click', clickHandler, false );
		root.removeEventListener( 'hashchange', hashChangeHandler, false );
		root.removeEventListener( 'resize', resizeThrottler, false );

		// Reset variables
		settings = null;
		eventTimeout = null;
		fixedHeader = null;
		headerHeight = null;
		anchor = null;
	};

	/**
	 * Initialize Smooth Scroll
	 * @public
	 * @param {Object} options User settings
	 */
	smoothScroll.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		smoothScroll.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		fixedHeader = root.document.querySelector( settings.selectorHeader ); // Get the fixed header
		headerHeight = getHeaderHeight( fixedHeader );

		// Event listeners
		document.addEventListener('click', clickHandler, false);
		root.addEventListener('hashchange', hashChangeHandler, false);
		if ( fixedHeader ) { root.addEventListener( 'resize', resizeThrottler, false ); }

		// Scroll on load
		if ( settings.scrollOnLoad ) {
			setTimeout(function() {
				window.scrollTo(0, 0);
			}, 1);
			hashChangeHandler();
		}

	};


	//
	// Public APIs
	//

	return smoothScroll;

});
