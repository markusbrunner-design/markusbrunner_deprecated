(function ($) {
	jQuery(document).ready(function(){
		var zoomer = jQuery(".jqzoom");
		var zoomswitcher = jQuery(".jqzoomtoogle");
		var zoomoptions = {
                        'zoomType': 'standard',
			'title': false,
			'zoomWidth': 250,
			'zoomHeight': 250,
                        'lens': true,
                        'preloadImages': false,
                        'alwaysOn': false
		};
		
		if(zoomer.length > 0){
			jQuery(zoomer).each(function(index,el){
				jQuery(el).jqzoom(zoomoptions);
			});
		}
		
		if(zoomswitcher.length > 0){
			jQuery(zoomswitcher).each(function(index,el){
				jQuery(el).mouseenter(function(){
					switchZoom(index);
				});
			});
		}

		var switchZoom = function(pos){
			jQuery(zoomer).each(function(index,el){
				if(index != pos){
					jQuery(el).parent().hide();
				} else {
					jQuery(el).parent().show();
				}
			});
		};
                
                jQuery('.imageElement').not(':first').hide();
	});
})(jQuery);