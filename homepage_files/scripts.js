$(document).ready(function(){

var a = {};

a.settings = {
	url: 'http://localhost/',
	speed: 400,
	easing: 'easeInOutCubic'
},

a.ui = {
	body: $('body'),
	win: $(window),
	bg: $('.bg')
},

a.sizes = {
	winHeight: a.ui.win.height(),
	winWidth: a.ui.win.width(),
	navHeight: $('.nav').height() - a.ui.win.height()*0.6
},

a.site = {

	init: function(){
		a.helpers.checkMediaQuery();
		a.helpers.whichTransition();
		this.bindEvents();
		if(a.sizes.media === 'mobile'){
			// $('.loop').remove();
			if($('.nav').height() > a.sizes.winHeight){
				$('body').addClass('no-center');
			}
			
		}
		a.site.fadeIn();
		a.site.setMove();
	},

	bindEvents: function(){
		a.ui.win.on('resize', this.resize);
		$('body').one('mousemove', this.fadeIn);
		$('body').on('mouseenter', '.nav li a', this.setHover);
		$('body').on('mouseleave', '.nav li a', this.unsetHover);
		// if(a.sizes.media === 'mobile'){
		// 	$('body').on('touchend', '.nav li a', this.loadVideo);
		// } else {
			$('body').on('click', '.nav li a', this.loadVideo);
		// }
		
		$('body').on('click', '.nav li a.information-link', this.loadInfo);
		$('html').on('click', '.information-show .click-back', this.closeInfo);
		$('body').on('click', '.click-back', this.closeVideo);
		$(document).keyup(function(e){
			if (e.keyCode === 27 && !$('body').hasClass('info-open') && a.site.loading === false){a.site.closeVideo()}
		});
		$('body').on('click', '.credits-link', this.toggleCredits);
		$('body').on('mousemove', this.setMouse);
		$('body').on('mousemove', this.verticalScroll);
		$('html').on('mousemove', '.video-playing', this.showClose);
	},

	fadeIn: function(){
		// var times = 100;
		// $('.nav li').each(function(){
		// 	var that = $(this);
		// 	setTimeout(function(){
		// 		that.addClass('faded');
		// 	}, times += 60);
		// });
	},

	loading: false,
	loadVideo: function(e){
		if(a.site.loading === false && !$(this).hasClass('information-link')){
			var that = $(this);
			a.site.loading = true;
			that.addClass('clicked');
			$('.bg').css({'background':that.parents('li').data('bg')});
			var ratio = a.sizes.winWidth/a.sizes.winHeight < 1.6666666667 ? 0.85 : 0.7;
			var margin = ((a.sizes.winHeight - ((a.sizes.winWidth * ratio) / (16/9)))/2 - $('.click-back').height())/2;
			var marginLoading = ((a.sizes.winHeight - ((a.sizes.winWidth * ratio) / (16/9))*0.7)/2 - $('.click-back').height())/2;

			// $('.loading-icon').css({
			// 	top:marginLoading
			// });

			// $('.click-back').css({
			// 	top:margin
			// });

			// $('.credits-link, .footer').css({
			// 	bottom:margin
			// });
			$('body').addClass('loading');
			that.addClass('current-link');
			var centreTitle = (a.sizes.winHeight/2) - (that.height()/2) - that[0].getBoundingClientRect().top;
			if(a.sizes.media !== 'mobile'){
				$('.nav').animate({'margin-top':centreTitle}, 300);
			}

			
			
			if(a.sizes.media === 'mobile'){
				var src = $('.current-video .main-video').data('src460');
			} else if(a.sizes.winHeight < 640){
				var src = $('.current-video .main-video').data('src460');
			} else if(a.sizes.winHeight >= 640 && a.sizes.winHeight < 1000){
				var src = $('.current-video .main-video').data('src720');
			} else {
				var src = $('.current-video .main-video').data('src1080');
			}

			var video = $('.current-video .main-video');
			video[0].src = src;
			video[0].load();

			video[0].addEventListener('loadeddata', function() {
				setTimeout(function(){
					video[0].play();
					$('body').addClass('video-playing');
					$('body').removeClass('loading');
					$('.current-video').removeClass('hovered-video');

					videoWrapper = video.parents('.project-container');
					a.site.playTimer = window.setInterval(function(){
						var currentPos = video[0].currentTime;
						var maxduration = video[0].duration;
						var percentage = a.sizes.winWidth * currentPos / maxduration;
						$('.playbar-inner', videoWrapper).css({width:percentage});
					}, 30);
					if(a.sizes.media !== 'mobile'){
						setTimeout(function(){
							// $('.current-video .loop')[0].pause();
						}, 800);
					}

					$('.click-back, .credits-link').show();
				}, 800);
			}, false);
		}
		e.preventDefault();
	},

	loadInfo:function(e){
		var ratio = a.sizes.winWidth/a.sizes.winHeight < 1.6666666667 ? 0.85 : 0.7;
		var margin = ((a.sizes.winHeight - ($('.information-inner').height()))/2 - $('.footer').height())/2;
		$('.footer').css({
			bottom:margin
		});
		$('body').addClass('information-show');
		$('.click-back').show();
	},

	closeInfo:function(e){
		$('body').removeClass('information-show');
		$('.click-back').hide();
	},

	closeVideo:function(e){
		a.site.loading = false;
		$('.page-container').scrollTop(0);
		setTimeout(function(){
			$('.click-back, .credits-link').hide();
			a.site.verticalScroll();
			clearInterval(a.site.playTimer);
			$('.current-link').removeClass('current-link');
			$('.nav').css({'margin-top':0});
			$('body').removeClass('video-playing');
			// $('.current-video .loop').hide();
			setTimeout(function(){
				$('.main-video').attr('src', '');
				var vid = $('.current-video');
				$('.current-video').removeClass('current-video');
				// $('.loop', vid).show();
			}, 400);
		}, 140);
		
	},

	toggleCredits:function(e){
		$('body').toggleClass('info-open');
		if($(this).text() === '+'){
			$(this).html('&times;');
		} else {
			$(this).text('+');
		}
	},

	timer: null,
	showClose:function(e){
		$('body').addClass('mouse-moved');
		clearTimeout(a.site.timer);
		a.site.timer = setTimeout(function(){
			$('body').removeClass('mouse-moved');
		}, 1000);
	},

	unsetHover: function(){
		if(!$(this).hasClass('current-link') && !$(this).hasClass('information-link') && a.site.loading === false){
			var currentVid = $('.current-video');
			$('.videos .project-container').removeClass('current-video hovered-video');
			// if(!$('.loop', currentVid)[0].paused){
			// 	$('.loop', currentVid)[0].pause();
			// }
		} else if($(this).hasClass('information-link') && a.sizes.media !== 'mobile'){
			$(this).text('Moustafa Hassan ✌');
		}
	},

	setHover: function(){
		if(!$(this).hasClass('information-link') && a.site.loading === false){
			var thisIndex = $(this).parents('li').index();
			$('.videos .project-container').removeClass('current-video');

			var thumb = $('.videos .project-container').eq(thisIndex).find('.thumb');
			var oldWidth = thumb.attr('width');
			var oldHeight = thumb.attr('height');
			var maxWidth = a.sizes.winWidth*0.4 > oldWidth ? oldWidth : a.sizes.winWidth*0.4;
			var newWidth = a.helpers.rdm(a.sizes.winWidth*0.2, a.sizes.winWidth*0.4);
			var ratio = (newWidth/oldWidth);

			var top = a.helpers.rdm(a.sizes.winHeight * 0.025, a.sizes.winHeight - (oldHeight * ratio) - (a.sizes.winHeight * 0.025));
			var left = a.helpers.rdm(a.sizes.winWidth/3, a.sizes.winWidth - (oldWidth * ratio) - (a.sizes.winWidth * 0.025));
			
			$('.videos .project-container').eq(thisIndex).find('.thumb').css({
				width:newWidth,
				top:top,
				left:left
				// transform:'rotate(' + a.helpers.rdm(0,2) + 'deg)'
			});

			if(a.sizes.media !== 'mobile'){
				// $('.videos .project-container:eq(' + thisIndex + ') .loop')[0].play();
			}
			$('.videos .project-container').eq(thisIndex).addClass('current-video hovered-video');
			// $('.bg').css({'background':''});
		} else if($(this).hasClass('information-link') && a.sizes.media !== 'mobile'){
			$(this).text('Moustafa Hassan ✌');
		}
	},

	
	scrollAmount: 0,
	mousePos: 0,
	setMouse: function(e){
		a.site.mousePos = e;
	},

	verticalScroll: function(e){
		// var moveAmountX = ((a.site.mousePos.pageX - (a.sizes.winWidth/2)) * (a.sizes.winHeight/30000)) * -1;
		// var moveAmountY = ((a.site.mousePos.pageY - (a.sizes.winHeight/2)) * (a.sizes.winHeight/30000)) * -1;
		// console.log(moveAmountY);
		// $('.video-container').css({'transform':'translate(' + moveAmountX + 'px, ' + moveAmountY + 'px)'});

		// if(a.site.loading === false && a.sizes.media !== 'mobile'){
		// 	var percent = a.site.mousePos.clientY / a.sizes.winHeight;
		// 	a.site.scrollAmount = a.site.navHeight * percent;
		// 	$('.nav').css({'transform':'translateY(-' + a.site.scrollAmount + 'px)'});

			

		// }
	},

	tickerRepeater: null,
	pageContainer: $('.page-container'),
	setMove: function(){		
		if(a.sizes.media !== 'mobile'){
			// call the interval forever
			a.site.tickerRepeater = requestAnimationFrame(a.site.ticker);
		}
	},

	ticker: function(){
		if(a.site.loading === false){
			var decay = 0.2;
			var percent = a.site.mousePos.clientY / a.sizes.winHeight;

			// get the old scroll value
			var xp = a.site.pageContainer.scrollTop();
			a.site.scrollAmount = a.sizes.navHeight * percent;
			// the new scroll value is the destination value minus how far we've currently scrolled, multiplied by an easing number
			xp += parseFloat((a.site.scrollAmount - xp) * decay);
			a.site.pageContainer.scrollTop(xp);
		}
		a.site.tickerRepeater = requestAnimationFrame(a.site.ticker);
	},

	resizeTimer: null,
	resize: function(){
		clearTimeout(this.resizeTimer);
		this.resizeTimer = setTimeout(function(){
			a.helpers.checkMediaQuery();
			a.sizes.winHeight = a.ui.win.height(),
			a.sizes.winWidth = a.ui.win.width(),
			a.sizes.navHeight = $('.nav').height() - a.ui.win.height()*0.6
			var ratio = a.sizes.winWidth/a.sizes.winHeight < 1.6666666667 ? 0.85 : 0.7;
			var margin = ((a.sizes.winHeight - ((a.sizes.winWidth * ratio) / (16/9)))/2 - $('.click-back').height())/2;
			var marginLoading = ((a.sizes.winHeight - ((a.sizes.winWidth * ratio) / (16/9))*0.7)/2 - $('.click-back').height())/2;

			// $('.loading-icon').css({
			// 	top:marginLoading
			// });

			// $('.click-back').css({
			// 	top:margin
			// });

			// $('.credits-link, .footer').css({
			// 	bottom:margin
			// });
		}, 250);
	}

}

a.helpers = {

	init: function(){
		this.easeFunctions();
		this.checkBrowser();
		this.checkInternalLinks();
	},

	checkMediaQuery: function(){
		var mediaCheck = $('.media-check').css('text-indent');
		if(mediaCheck === '10px'){a.sizes.media = 'mobile';} 
		else if(mediaCheck === '20px'){a.sizes.media = 'tablet';} 
		else if(mediaCheck === '30px'){a.sizes.media = 'desktop';} 
		else if(mediaCheck === '40px'){a.sizes.media = 'xl';} 
		else if(mediaCheck === '50px'){a.sizes.media = 'xxl';} 
		else {a.sizes.media = 'unsure';}
	},

	rdm: function(min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	},

	/* Run function once after CSS transtion ended eg. 
	$(el).one(a.helpers.whichTransition, function(e){
		console.log('Transition complete!  This is the callback!');
	}); */
	whichTransition: function(){
		var el = document.createElement('fakeelement');
		var transitions = {
			'animation':'transitionend',
			'OAnimation':'oTransitionEnd',
			'MSAnimation':'MSTransitionEnd',
			'WebkitAnimation':'webkitTransitionEnd'
		};

		for(var t in transitions){
			if(transitions.hasOwnProperty(t) && el.style[t] !== undefined){
				a.settings.transition = transitions[t];
			}
		}
	},

	easeFunctions: function(){
		$.extend(jQuery.easing,{
			linear: function (t) { return t },
			easeInQuad: function (t) { return t*t },
			easeOutQuad: function (t) { return t*(2-t) },
			easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
			easeInCubic: function (t) { return t*t*t },
			easeOutCubic: function (t) { return (--t)*t*t+1 },
			easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
			easeInQuart: function (t) { return t*t*t*t },
			easeOutQuart: function (t) { return 1-(--t)*t*t*t },
			easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
			easeInQuint: function (t) { return t*t*t*t*t },
			easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
			easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },
			easeInElastic: function (t) { return (.04 - .04 / t) * Math.sin(25 * t) + 1 },
			easeOutElastic: function (t) { return .04 * t / (--t) * Math.sin(25 * t) },
			easeInOutElastic: function (t) { return (t -= .5) < 0 ? (.01 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1 }
		});
	},

	oldBrowser: false,
	history: false,
	checkBrowser: function(){
		if (Modernizr.history && Modernizr.cssanimations && Modernizr.cssgradients && Modernizr.csstransforms && Modernizr.csstransitions && Modernizr.borderradius && !$('html').hasClass('lt-ie9')){
			a.helpers.oldBrowser = false;
			a.helpers.history = Modernizr.history;
		} else {
			a.helpers.oldBrowser = true;
			a.helpers.history = Modernizr.history;
			var browserMessage = $("<div style='position:fixed !important; bottom:0 !important; left:0 !important; font-family:Arial, sans-serif !important; font-size:14px !important; background:#fff !important; padding:10px !important; line-height:20px !important; z-index:100001 !important; color:#000 !important; cursor:pointer !important;'>Your browser doesn't support all of the features this site requires, so it may not function as intended. Please upgrade to a newer browser.</div>");
			$('body').append(browserMessage);
			$(document).one('click', browserMessage, function(){browserMessage.remove();});
		}
		/* Check for Chrome */
		if(window.chrome){
			a.helpers.chrome = true;
			$('html').addClass('browser-chrome');
		} else {
			a.helpers.chrome = false;
		}
	},

	checkInternalLinks: function(){
		$('a[href^="' + a.settings.url + '"]').addClass('internal');
	}

}

a.helpers.init();
a.site.init();

});