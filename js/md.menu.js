/*
 * jQuery MegaMenu v1.0
 * http://www.megadrupal.com/flexslider/
 *
 * Copyright 2012 MegaDrupal
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Contributing author: BaoNV
 */

(function($){
    $(window).resize(function () {
        $('.mdmegamenu').each(function() {
            var self = $(this);
            if (self.hasClass("md-vertical")) {  // vertical menu
                var ulwidth = $('> ul', self).width(),
                    ulleft = $('> ul', self).offset().left,
                    fullwidth = $(window).width() - ulwidth - ulleft - 20;
                if (fullwidth > 960) fullwidth = 960 - ulwidth;
                if(ulwidth > ($(window).width() - ulleft - 20) / 2) {
                    $('.mm-container', self).each(function() {
                        var parent = $(this).parent();
                        $(this).css({top: parent.height(), left: 0});
                        if($(this).hasClass("mm-fullwidth"))
                            $(this).width(self.width());
                    });
                } else {
                    $('div.mm-fullwidth', self).width(fullwidth);
                }

            } else {
                $('> ul > li', self).each(function() {
                    $("> .mm-container", $(this)).css('top', $(this).height() + $(this).position().top);
                });
                $(".mm-dropdown", self).each(function() {
                    $(this).children('.mm-container').css('left', $(this).position().left);
                });
            }
        });
    });
	$.fn.megadrupalMenu = function(options){
		var opts = $.extend({
				effects : {
					effectSpeedOpen : 300, // Speed of the opening animation, in milliseconds
					effectSpeedClose : 200, // Speed of the closinging animation, in milliseconds
					effectTypeOpen : 'slide', // Effect open sub-menu (fade, slide, show-hide)
					effectTypeClose : 'slide', // Effect open sub-menu (fade, slide, show-hide)
					effectOpen : 'linear', // Easing effect when sub-menu appear
					effectClose : 'linear' // Easing effect when sub-menu hide
				},
				timeBeforeOpening : 100, // The delay before sub-menu opening when mouse over (milliseconds)
				timeBeforeClosing : 200, // The delay in milliseconds that the mouse can remain outside a sub-menu without it closing
				trigger : "hover-intent", // How to Open & Close sub menu (hover-intent, hover, click)
				arrow: false, // If true, arrow mark-up generated automatically, you dont need to change HTML code
				vertical: false, // Set to true if you want to use vertical megamenu
                subAlign: "middle" // If vertical = true, sub-menu align with menu item (middle, top)
			}, options);
        //Mobile - iOS
        var deviceAgent = navigator.userAgent.toLowerCase();
        var is_Mobile = deviceAgent.match(/(iphone|ipod|ipad|android|"windows phone")/);

		return this.each(function() {
			var megaMenu = $(this),
                megaMenuwrap = megaMenu.parent(),
				menuItem = $("li.mm-parent", megaMenu);

            megaMenuwrap.addClass("mdmegamenu");
            if(opts.vertical)
                megaMenuwrap.addClass("md-vertical");
            else
                megaMenuwrap.addClass("md-horizontal");

			menuItem.each(function() {
				var self = $(this);
				if(opts.arrow) {
                        $("> a", self).addClass('with-arrow').append('<span class="mm-arrow"></span>');
				}

				if (opts.vertical) {
                    if(opts.subAlign == "middle") {
                        var position = self.position(),
                            parentTop = position.top,
                            parentHeight = self.height(),
                            mainSub = $('> .mm-container', this),
                            mainSubHeight = mainSub.height(),
                            mainSubTop = (mainSubHeight/2 - parentHeight/2);
                        if(parentTop > mainSubTop)
                            mainSub.css('top', -mainSubTop);
                        else {
                            mainSub.css('top', -parentTop);
                        }
                    }
                }

			});
			/* Actions on parents links */
			if(opts.trigger === "hover") {
				menuItem.hover(megaOver, megaOut);
			} else if(opts.trigger === "click") {
				$('body').mouseup(function(e){
					if(!$(e.target).parents('.mm-hover').length){
						megaReset(megaMenu);
					}
				});

				$('> a', menuItem).click(function(e){
					var $parentLi = $(this).parent();
					if(!$parentLi.hasClass('mm-hover')){
                        megaAction($parentLi);
                        e.preventDefault();
					}
				});
			} else {
				var config = {
						sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)
						interval: 100, // number = milliseconds for onMouseOver polling interval
						over: megaOver, // function = onMouseOver callback (REQUIRED)
						timeout: 400, // number = milliseconds delay before onMouseOut
						out: megaOut // function = onMouseOut callback (REQUIRED)
					};
				menuItem.hoverIntent(config);
			}
			
			if (is_Mobile) {
                var text_arrow = "&darr;";
                if (opts.vertical) text_arrow = "&rarr;";
                $('<span class="mm-close">&times;</span>').appendTo($("> li.mm-parent > a", megaMenu)).hide().click(function(e) {
                    e.preventDefault();
                    "open" == $(this).attr("data-mega-status") ? (megaActionClose($(this).parents("li.mm-parent").first()), $(this).html(text_arrow).attr("data-mega-status", "closed")) : (megaAction($(this).parents("li.mm-parent").first()), $(this).html("&times;").attr("data-mega-status", "open"));
                    return false;
                });
                $("> li.mm-parent", megaMenu).hover(function(e){
					e.preventDefault();
                    $(this).find(".mm-close").html("&times;").attr("data-mega-status", "open").show();
					$(this).find(".mm-arrow").hide();
                }, function(){
                    $(this).find(".mm-close").hide();
					$(this).find(".mm-arrow").show();
                });
            }
            $(window).resize();
		});
        function megaOver(){
            megaAction(this);
        }
        function megaOut(){
            megaActionClose(this);
        }
        function megaReset(megaMenu){
            $('li', megaMenu).removeClass('mm-hover');
            $('.mm-container', megaMenu).hide();
        }
        function megaAction(obj){
            var $dropDown = $('> .mm-container', obj);
            $(obj).parents(".mdmegamenu").find(".mm-container").not($(obj).parents(".mm-container")).hide();
            $(obj).addClass('mm-hover');
            if ($dropDown.length > 0 && $dropDown.is(':hidden') == false) return;
            if($dropDown.is(':hidden')) {
                switch(opts.effects.effectTypeOpen)
                {
                    case 'slide':
                        $dropDown.stop(true, true).delay(opts.timeBeforeOpening).slideDown(opts.effects.effectSpeedOpen, opts.effects.effectOpen);
                        break;
                    case 'fade':
                        $dropDown.stop(true, true).delay(opts.timeBeforeOpening).fadeIn(opts.effects.effectSpeedOpen, opts.effects.effectOpen);
                        break;
                    default :
                        $dropDown.stop(true, true).delay(opts.timeBeforeOpening).show();
                }
            }
        }
        function megaActionClose(obj){
            var $dropDown = $('> .mm-container', obj);
            if($dropDown.length > 0 && $dropDown.is(':hidden') == false) {
                switch(opts.effects.effectTypeClose)
                {
                    case 'slide':
                        $dropDown.stop(true, true).delay(opts.timeBeforeClosing).slideUp(opts.effects.effectSpeedClose, opts.effects.effectClose, function(){$(obj).removeClass('mm-hover');});
                        break;
                    case 'fade':
                        $dropDown.stop(true, true).delay(opts.timeBeforeClosing).fadeOut(opts.effects.effectSpeedClose, opts.effects.effectClose, function(){$(obj).removeClass('mm-hover');});
                        break;
                    default :
                        $dropDown.stop(true, true).delay(opts.timeBeforeClosing).hide();
                        $(obj).removeClass('mm-hover');
                }
            }
            else {
                $(obj).removeClass('mm-hover');
            }
        }
	};
})(jQuery); 