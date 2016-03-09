/**
 * boxlayout.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var Boxlayout = (function() {

  var $el = $('#bl-main'),
    $sections = $el.children('section'),
    // works section
    $sectionWork = $('#bl-work-section'),
    // blog section
    $sectionBlog = $('#bl-blog-section'),
    // contact section
    $sectionWork = $('#bl-contact-section'),
    // work items
    $workItems = $('#bl-work-items > .item'),
    // blog items
    $blogItems = $('#bl-blog-items .blog-opinion > .blog-item').children('.blog-desc').children('.blog-inf').children('a.blog-read'),
    // work panels
    $workPanelsContainer = $('#bl-panel-work-items'),
    $workPanels = $workPanelsContainer.children('div'),
    totalWorkPanels = $workPanels.length,
    // blog panels
    $blogPanelsContainer = $('#bl-panel-blog-items'),
    $blogPanels = $blogPanelsContainer.children('div'),
    totalBlogPanels = $blogPanels.length,
    // navigating the blog panels
    $nextBlogItem = $blogPanelsContainer.find('nav > .bl-next-blog'),
    $prevBlogItem = $blogPanelsContainer.find('nav > .bl-prev-blog'),
    // navigating the work panels
    $nextWorkItem = $workPanelsContainer.find('nav > .bl-next-work'),
    $prevWorkItem = $workPanelsContainer.find('nav > .bl-prev-work'),
    // if currently navigating the work items
    isAnimating = false,
    // close work panel trigger
    $closeWorkItem = $workPanelsContainer.find('nav > .bl-icon-close'),
    // close blog panel trigger
    $closeBlogItem = $blogPanelsContainer.find('nav > .bl-icon-close'),
    transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    },
    // transition end event name
    transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
    // support css transitions
    supportTransitions = Modernizr.csstransitions;

  function init() {
    initEvents();
  }

  function initEvents() {
    var sectionLogo = $('.contain-logo');
    $sections.each(function() {

      var $section = $(this);

      // expand the clicked section and scale down the others
      $section.on('click', function() {

        if (!$section.data('open')) {
          $section.data('open', true).addClass('bl-expand bl-expand-top');
          $el.addClass('bl-expand-item');
          sectionLogo.addClass('bl-expand-item');

          if ($section.attr('id') == 'bl-work-section') {
            setTimeout(function() {
              $(".bl-expand-top #owl-demo").owlCarousel({
                navigation: true, // Show next and prev buttons
                slideSpeed: 300,
                paginationSpeed: 400,
                singleItem: true

                // "singleItem:true" is a shortcut for:
                // items : 1,
                // itemsDesktop : false,
                // itemsDesktopSmall : false,
                // itemsTablet: false,
                // itemsMobile : false

              });
            }, 1000);

          }
          if ($section.attr('id') == 'bl-contact-section') {
            var city = new google.maps.LatLng(41.391013, 2.160882);
            var parliament = new google.maps.LatLng(41.391303, 2.160743);
            var image = 'images/marker.png';
            var marker;
            var map;
            timeout = setTimeout(function() {
              var styleArray = [{
                featureType: 'all',
                stylers: [{
                  saturation: -1000
                }]
              }, {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{
                  hue: '#00ffee'
                }, {
                  saturation: -100
                }, {
                  "lightness": -8
                }, {
                  "gamma": 1.18
                }]
              }];
              var mapOptions = {
                zoom: 14,
                styles: styleArray,
                center: city
              };

              map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

              marker = new google.maps.Marker({
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                icon: image,
                position: parliament
              });
              google.maps.event.addListener(marker, 'click', toggleBounce);

              function toggleBounce() {

                if (marker.getAnimation() != null) {
                  marker.setAnimation(null);
                } else {
                  marker.setAnimation(google.maps.Animation.BOUNCE);
                }
              }

            }, 1000);
          }
        }

      }).find('.bl-icon-close').on('click', function() {

        // close the expanded section and scale up the others
        $section.data('open', false).removeClass('bl-expand').on(transEndEventName, function(event) {
          if (!$(event.target).is('section')) return false;
          $(this).off(transEndEventName).removeClass('bl-expand-top');
        });

        sectionLogo.removeClass('bl-expand-item');

        if (!supportTransitions) {
          $section.removeClass('bl-expand-top');
        }

        $el.removeClass('bl-expand-item');

        return false;

      });

    });

    // clicking on a work item: the current section scales down and the respective work panel slides up
    $workItems.on('click', function(event) {

      // scale down main section
      $sectionWork.addClass('bl-scale-down');

      // show panel for this work item
      $workPanelsContainer.addClass('bl-panel-items-show');

      var $panel = $workPanelsContainer.find("[data-panel='" + $(this).data('panel') + "']");
      currentWorkPanel = $panel.index();
      $panel.addClass('bl-show-work');


      return false;

    });

    $blogItems.on('click', function(event) {

      // scale down main section
      $sectionBlog.addClass('bl-scale-down');

      // show panel for this work item
      $blogPanelsContainer.addClass('bl-panel-items-show');

      var $panel = $blogPanelsContainer.find("[data-panel='" + $(this).data('panel') + "']");
      currentBlogPanel = $panel.index();
      $panel.addClass('bl-show-blog');


      return false;

    });

    // navigating the work items: current work panel scales down and the next work panel slides up
    $nextWorkItem.on('click', function(event) {

      if (isAnimating) {
        return false;
      }
      isAnimating = true;

      var $currentPanel = $workPanels.eq(currentWorkPanel);
      currentWorkPanel = currentWorkPanel < totalWorkPanels - 1 ? currentWorkPanel + 1 : 0;
      var $nextPanel = $workPanels.eq(currentWorkPanel);

      $currentPanel.removeClass('bl-show-work').addClass('bl-hide-current-work').on(transEndEventName, function(event) {
        if (!$(event.target).is('div')) return false;
        $(this).off(transEndEventName).removeClass('bl-hide-current-work');
        isAnimating = false;
      });

      if (!supportTransitions) {
        $currentPanel.removeClass('bl-hide-current-work');
        isAnimating = false;
      }

      $nextPanel.addClass('bl-show-work');

      return false;

    });

    //view previous item
    $prevWorkItem.on('click', function(event) {

      if (isAnimating) {
        return false;
      }
      isAnimating = true;

      var $currentPanel = $workPanels.eq(currentWorkPanel);
      currentWorkPanel = currentWorkPanel < totalWorkPanels - 1 ? currentWorkPanel - 1 : 0;
      var $prevPanel = $workPanels.eq(currentWorkPanel);

      $currentPanel.removeClass('bl-show-work').addClass('bl-hide-current-work').on(transEndEventName, function(event) {
        if (!$(event.target).is('div')) return false;
        $(this).off(transEndEventName).removeClass('bl-hide-current-work');
        isAnimating = false;
      });

      if (!supportTransitions) {
        $currentPanel.removeClass('bl-hide-current-work');
        isAnimating = false;
      }

      $prevPanel.addClass('bl-show-work');

      return false;

    });

    // navigating the next blog items
    $nextBlogItem.on('click', function(event) {

      if (isAnimating) {
        return false;
      }
      isAnimating = true;

      var $currentPanel = $blogPanels.eq(currentBlogPanel);
      currentBlogPanel = currentBlogPanel < totalBlogPanels - 1 ? currentBlogPanel + 1 : 0;
      var $nextPanel = $blogPanels.eq(currentBlogPanel);

      $currentPanel.removeClass('bl-show-blog').addClass('bl-hide-current-blog').on(transEndEventName, function(event) {
        if (!$(event.target).is('div')) return false;
        $(this).off(transEndEventName).removeClass('bl-hide-current-blog');
        isAnimating = false;
      });

      if (!supportTransitions) {
        $currentPanel.removeClass('bl-hide-current-blog');
        isAnimating = false;
      }

      $nextPanel.addClass('bl-show-blog');

      return false;

    });

// navigating the previous blog items:
    $prevBlogItem.on('click', function(event) {

      if (isAnimating) {
        return false;
      }
      isAnimating = true;

      var $currentPanel = $blogPanels.eq(currentBlogPanel);
      currentBlogPanel = currentBlogPanel < totalBlogPanels - 1 ? currentBlogPanel - 1 : 0;
      var $prevPanel = $blogPanels.eq(currentBlogPanel);

      $currentPanel.removeClass('bl-show-blog').addClass('bl-hide-current-blog').on(transEndEventName, function(event) {
        if (!$(event.target).is('div')) return false;
        $(this).off(transEndEventName).removeClass('bl-hide-current-blog');
        isAnimating = false;
      });

      if (!supportTransitions) {
        $currentPanel.removeClass('bl-hide-current-blog');
        isAnimating = false;
      }

      $prevPanel.addClass('bl-show-blog');

      return false;

    });


    // clicking the work panels close button: the current work panel slides down and the section scales up again
    $closeWorkItem.on('click', function(event) {

      // scale up main section
      $sectionWork.removeClass('bl-scale-down');
      $workPanelsContainer.removeClass('bl-panel-items-show');
      $workPanels.eq(currentWorkPanel).removeClass('bl-show-work');

      return false;

    });

    // clicking the blog panels close button: the current work panel slides down and the section scales up again
    $closeBlogItem.on('click', function(event) {

      // scale up main section
      $sectionBlog.removeClass('bl-scale-down');
      $blogPanelsContainer.removeClass('bl-panel-items-show');
      $blogPanels.eq(currentBlogPanel).removeClass('bl-show-blog');

      return false;

    });
  }

  return {
    init: init
  };

})();
