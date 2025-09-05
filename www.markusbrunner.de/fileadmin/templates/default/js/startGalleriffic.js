/* from: ../example-2.html */
(function ($) {
	jQuery(document).ready(function($) {
		jQuery('.galleriffic_gallery').each(function(galleryIndex, galleryElem){
			// Initially set opacity on thumbs and add
			// additional styling for hover effect on thumbs
			var onMouseOutOpacity = 0.67;
			$(galleryElem).find('.galleriffic_thumbs ul.galleriffic_thumbs_list li').opacityrollover({
				mouseOutOpacity:   onMouseOutOpacity,
				mouseOverOpacity:  1.0,
				fadeSpeed:         'fast',
				exemptionSelector: '.selected'
			});

			// Initialize Advanced Galleriffic Gallery
			var gallery = $(galleryElem).find('.galleriffic_thumbs').galleriffic({
				delay:                     2500,
				numThumbs:                 10,
				preloadAhead:              10,
				enableTopPager:            true,
				enableBottomPager:         true,
				maxPagesToShow:            7,
				imageContainerSel:         $(galleryElem).find('.slideshow'),
				controlsContainerSel:      $(galleryElem).find('.controls'),
				captionContainerSel:       $(galleryElem).find('.caption-container'),
				loadingContainerSel:       $(galleryElem).find('.loader'),
				renderSSControls:          true,
				renderNavControls:         true,
				playLinkText:              'Slideshow starten',
				pauseLinkText:             'Slideshow anhalten',
				prevLinkText:              '&lsaquo; Vorheriges Bild',
				nextLinkText:              'N&auml;chstes Bild &rsaquo;',
				nextPageLinkText:          'N&auml;chstes &rsaquo;',
				prevPageLinkText:          '&lsaquo; Vorheriges',
				enableHistory:             false,
				autoStart:                 false,
				syncTransitions:           true,
				defaultTransitionDuration: 900,
				onSlideChange:             function(prevIndex, nextIndex) {
					// 'this' refers to the gallery, which is an extension of $('#thumbs')
					this.find('ul.galleriffic_thumbs_list').children()
						.eq(prevIndex).fadeTo('fast', onMouseOutOpacity).end()
						.eq(nextIndex).fadeTo('fast', 1.0);
				},
				onPageTransitionOut:       function(callback) {
					this.fadeTo('fast', 0.0, callback);
				},
				onPageTransitionIn:        function() {
					this.fadeTo('fast', 1.0);
				}
			});
		});
	});
})(jQuery);