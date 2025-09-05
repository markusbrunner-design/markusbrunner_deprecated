/**
 * Copyright (c) 2010 Markus Brunner
 * @author			Markus Brunner
 * @date			2011-04-11
 * @name			jQuery-Plugin for Suggest-Functionality
 * @type			jQuery
 * @version			1.1
 * @jQuery-version	1.5.*
 * @param			Object settings [optional]
 *	url: [default 'http://domain.de/ajax.php?searchword='] ajax-URL
 *	minlength: [default 3] minimum length of chars befor ajax-request is performed
 *	suggestBoxSelector: [default '#suggestOutput'] selector for suggestBox
 *	suggestBoxMaxHeight: [default 250] maximum height in px of suggestBox [if bigger -> scrollbar is activated]
 *	highlightMatch: [default true] define if searchWord is wrapped by a <strong>-tag
 *	wrapStart: [default '<ul>'] define suggestBox wrap-start
 *	wrapEnd: [default '</ul>'] define suggestBox wrap-end
 *	elemStart: [default '<li class="suggestElem">'] define suggestBox element-start
 *	elemEnd: [default '</li>'] define suggestBox element-end
 *	elemSelector: [default '.suggestElem'] define suggestBox element-selector
 *	getNewSuggestsOnSelect: [default false] defines if an ajax-request is performed after value-selection (otherwise you see the old results again)
 *	onShow: [default undefined] onShow-Event -> you can define a function onShow of suggestBox
 *	onHide: [default undefined] onHide-Event -> you can define a function onHide of suggestBox
 *	onSelect: [default undefined] onShow-Event -> you can define a function onSelect (hover- and focus-state) of a suggestBox-element
 *	onClick: [default undefined] onShow-Event -> you can define a function onClick of a suggestBox-element
 *
 * @how to use
 * ***********
 * HTML
 * <input id="inputElementId" name="inputElementName" value="" />
 * <div id="suggestOutput" style="display:none"></div>
 * JS
 * jQuery('#inputElementId').addInputSuggest({url:'http://domain.de/ajax.php?searchword=',suggestBoxSelector:'#suggestOutput',onClick:function(elem){jQuery('#myForm').submit();}});
 * PHP
 * header('Content-Type: application/json',true);
 * echo json_encode(array(0=>'value1',1=>'value2'));exit;
 */
(function($){
	$.fn.addInputSuggest = function(options) {
		// function options
		var defaults = {
			url: 'http://domain.de/ajax.php?searchword=',
			minlength: 3,
			suggestBoxSelector: '#suggestOutput',
			suggestBoxMaxHeight: 250,
			highlightMatch: true,
			wrapStart: '<ul>',
			wrapEnd: '</ul>',
			elemStart: '<li class="suggestElem">',
			elemEnd: '</li>',
			elemSelector: '.suggestElem',
			getNewSuggestsOnSelect: false,
			onShow: undefined,
			onHide: undefined,
			onSelect: undefined,
			onClick: undefined
		};
		var options = $.extend(defaults, options);
		// function
		return this.each(function() {
			// getElements
			var searchField = $(this);
			var searchFieldOldValue = $(searchField).val();			
			var searchSuggestBox = $(options.suggestBoxSelector);
			// set browser autocomplete for searchfield off
			$(searchField).attr('autocomplete','off');
			// keyCodes
			var KEY = {
				UP: 38,
				DOWN: 40,
				RIGHT: 39,
				LEFT: 37,
				RETURN: 13,
				ESC: 27,
				SHIFT: 16,
				STRG: 17,
				ALT: 18
			};
			// addAction for typing
			$(searchField).keyup(function(event){
				// keyCodeSelection
				switch(event.keyCode) {
					case KEY.LEFT:
					case KEY.SHIFT:
					case KEY.STRG:
					case KEY.ALT:
						// nothing to do
						break;
					case KEY.ESC:
						// hide suggests
						$(searchSuggestBox).hide();
						callFunction(options.onHide,searchSuggestBox);
						break;
					case KEY.DOWN:
						// show suggest field if hidden
						if($(searchSuggestBox).is(':hidden')) {
							$(searchSuggestBox).show();
							callFunction(options.onShow,searchSuggestBox);
						} else {
							// select next element and fill value
							var baseElem = ($(options.elemSelector+'.hover').length > 0) ?  $(options.elemSelector+'.hover') : undefined;
							var nextElem = null;
							if($(baseElem).length > 0 && $(baseElem).next().length == 0) {
								removeHover();
								nextElemText = searchFieldOldValue;
							} else if($(baseElem).next().length > 0) {
								nextElem = $(baseElem).next();
								nextElemText = $(nextElem).text();
							} else {
								nextElem = $(options.elemSelector+':first');
								nextElemText = $(nextElem).text();
							}
							setHover(nextElem);
							$(searchField).val(nextElemText);
							callFunction(options.onSelect,nextElem);
						}
						break;
					case KEY.UP:
						// show suggest field if hidden
						if($(searchSuggestBox).is(':hidden')) {
							$(searchSuggestBox).show();
							callFunction(options.onShow,searchSuggestBox);
						} else {
							// select previous element and fill value
							var baseElem = ($(options.elemSelector+'.hover').length > 0) ?  $(options.elemSelector+'.hover') : undefined;
							var prevElem = null;
							if($(baseElem).length > 0 && $(baseElem).prev().length == 0) {
								removeHover();
								prevElemText = searchFieldOldValue;
							} else if($(baseElem).prev().length > 0) {
								prevElem = $(baseElem).prev();
								prevElemText = $(prevElem).text();
							} else {
								prevElem = $(options.elemSelector+':last');
								prevElemText = $(prevElem).text();
							}
							setHover(prevElem);
							$(searchField).val(prevElemText);
							callFunction(options.onSelect,prevElem);
						}
						break;
					case KEY.RIGHT:
					case KEY.RETURN:
						// store new searchWord and hide suggests / show suggestbox if hidden
						searchFieldOldValue = $(searchField).val();
						if($(searchSuggestBox).is(':visible')) {
							$(searchSuggestBox).hide();
							callFunction(options.onHide,searchSuggestBox);
						}
						// no break if hidden so only new selection/topic is in suggestlist
						if(options.getNewSuggestsOnSelect == true && $(searchSuggestBox).is(':visible')) {} else { break; }
					default:			
						// get searchval
						var searchVal = $(this).val();
						// store new searchword
						searchFieldOldValue = searchVal;
						// get suggest if minlength is reached
						if(searchVal.length >= options.minlength) {
							// Ajax-Request
							jQuery.ajax({
								url: options.url+searchVal,
								type: 'GET',
								success: function(data){
									// build suggest content
									var suggestContent = options.wrapStart;
									$.each(data, function(index,elem){
										// add highlight if activated
										if (options.highlightMatch === true) {
											elem = elem.replace(new RegExp('('+searchVal+')','ig'),'<strong>$1</strong>');
										}
										suggestContent+= options.elemStart+elem+options.elemEnd;
									});
									suggestContent+= options.wrapEnd;
									// set content in suggestBox
									$(searchSuggestBox).show().html(suggestContent).css('height','auto');
									callFunction(options.onShow,searchSuggestBox);
									// set scrollbars for suggestBox if maxHeight is reached
									if ($(searchSuggestBox).height() > options.suggestBoxMaxHeight) {
										$(searchSuggestBox).css({'overflow':'auto','height':options.suggestBoxMaxHeight+'px'});
									}

									// add selection possibilities
									$(options.elemSelector).hover(function(){
										setHover(this);
										var searchFieldValue = $(this).text();
										$(searchField).val(searchFieldValue);
										callFunction(options.onSelect,this);
									});
									// add click activity
									$(options.elemSelector).click(function(){	
										callFunction(options.onClick,this);
										$(searchSuggestBox).hide();
										callFunction(options.onHide,searchSuggestBox);
									});
								}
							});
						} else {
							$(searchSuggestBox).hide();
						}
				}
			});
			function removeHover() {
				$(options.elemSelector).removeClass('hover');
			}
			function setHover(elem) {
				if(elem) {
					removeHover();
					$(elem).addClass('hover');
				}
			}
			function callFunction(myFunc,elem) {
				if (typeof myFunc === 'function') {
					myFunc(elem);
				}
			}
		});
	};
})(jQuery);