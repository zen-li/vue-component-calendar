function scrollDirection(option) {
	var option = option || {};
	this.posNew = 0;
	this.posOld = 0;
	this.direction = null;
	this.point = 0;
	this.distance = 0;
	this.status = null;

	// container scroll
	this.$scroller = option.scroller || $(window);
	// Orientation of scroll
	this.orientation = option.orientation || 'vertical';
	// Number of pixel scrolled to trigger a function
	this.step = option.step || 10;
	// height min before enable stepsensor()
	this.minHeight = option.minHeight || 0;

	// Event on scroll
	this.eventScroll = option.scroll || function () {
		return false
	};
	// Event on scroll UP
	this.eventScrollUp = option.scrollUp || function () {
		return false
	};
	// Event on scroll DOWN
	this.eventScrollDown = option.scrollDown || function () {
		return false
	};

	// Get scroll top
	this.getScrollPos = function () {
		if (this.orientation == 'vertical') return document.getElementById("scrollPanel").scrollTop;
	}

	// Detect direction of scroll
	this.directionSensor = function () {
		this.posNew = this.getScrollPos();
		// console.log(this.posNew);
		if (this.posNew > this.posOld && this.posNew > this.minHeight) this.stepSensor(false);;
		if (this.posNew < this.posOld && this.posNew > this.minHeight) this.stepSensor(true);;
		this.posOld = this.posNew;
	};

	// calcul distance scrolled and trigger a function
	this.stepSensor = function (bool) {

		if (bool != this.status) {
			this.point = this.getScrollPos();
			this.distance = 0;
		}

		this.distance = this.point - this.getScrollPos();

		if (this.distance > this.step) this.eventScrollDown();
		if (this.distance < -this.step) this.eventScrollUp();

		this.status = bool;

		this.eventScroll();
	};

	//init plugin
	this.init = function () {
		var that = this;
		document.getElementById("scrollPanel").addEventListener('scroll', function () {
			that.directionSensor()
		});
	};
}
module.exports = scrollDirection;
