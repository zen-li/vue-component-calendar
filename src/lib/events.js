module.exports = function () {
	var $ = require('../lib/sprint');
	return {
		init: function () {
			$("#scrollPanel").on('scroll', function (event) {
				console.log($(".month-bar"))
                $(".month-bar:eq(0)").css({
                    'position':'fixed',

                })
			})
		}
	}
}