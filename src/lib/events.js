module.exports = function () {
	var $ = require('../lib/sprint');
	var calHeight = $(".vue-calendar-content").height();
	var titleHeight = $(".vue-calendar-content-title-wrapper").height();
	var weekBarHeight = $(".week-bar").height();
	var monthBar = $(".month-bar").height();
	return {
		init: function () {
			var self = this;
            this.renderUI();
            return;
			$("#scrollPanel").on('scroll', function (event) {
				var thisIndex = $(".vue-calendar").attr("data-index") * 1;
				var moveOffsetTop = $($(".month-bar").dom[thisIndex + 1]).offset().top;
				var staticOffsetTop = $($(".month-bar").dom[thisIndex]).offset().top;
				
                // console.log(moveOffsetTop)
                // console.log('----')
                // console.log(staticOffsetTop)
                // console.log( staticOffsetTop + monthBar)

                if(moveOffsetTop == staticOffsetTop + monthBar){
                    alert("ddd")
                }

			});
			
		},
		renderUI: function () {
			var oh = this.getHeightOffset();
			$("#scrollPanel").css({
				height: oh + "px"
			});
		},
		getHeightOffset: function () {
			return calHeight - titleHeight - weekBarHeight;
		},
	}
}