module.exports = function () {
	var doc = document;

	return {
		init: function () {
			var self = this;
			this.renderUI();
		},
		renderUI: function () {
			this.calScrollHeight()
		},
		calScrollHeight: function () {
			var cal = doc.getElementById('vueCalendarTemplate').clientHeight,
				ele1 = doc.getElementById('topHeight1').clientHeight,
				ele2 = doc.getElementById('topHeight2').clientHeight,
				ele3 = doc.getElementById('topHeight3').clientHeight;

			var height = cal - ele1 - ele2;
			console.log(height)
			doc.getElementById('scrollPanel').style.height = height + 'px';
		},
	}
}