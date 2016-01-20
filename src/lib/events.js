module.exports = function () {
	var doc = document;

	return {
		init: function () {
			var self = this;
			this.renderUI();
		},
		renderUI: function () {
			this.calScrollHeight();
			this.simulatScroll();
		},
		calScrollHeight: function () {
			var cal = doc.getElementById('vueCalendarTemplate').clientHeight,
				ele1 = doc.getElementById('topHeight1').clientHeight,
				ele2 = doc.getElementById('topHeight2').clientHeight,
				ele3 = doc.getElementById('topHeight3').clientHeight;

			var height = cal - ele1 - ele2;
			doc.getElementById('scrollPanel').style.height = height + 'px';
		},
		simulatScroll: function () {
			return;
			var list = document.getElementById("scrollPanel"),
				isTouched = false,
				isMoved = false;
			// list列表距离body的距离
			var prevY = parseInt(list.offsetTop);
			// list绝对定位的高度
			var cssY = list.style.top;
			cssY = parseInt(cssY.substring(0, cssY.length - 2));
			//添加手机触摸事件
			list.addEventListener("touchstart", function (e) {
				isTouched = true;
				//初始化触摸的位置
				prevY = e.changedTouches[0].clientY;
				//添加 css3 效果
				list.style.transition = "";
			}, false);
			list.addEventListener("touchend", function (e) {
				// 取消向上划屏是的触摸事件
				isTouched = false;
				// 如果列表向下拉了，向上放回去有个css3的过渡效果
				list.style.transition = "top ease-out 0.5s";
				if (isMoved) {
					//显示加载的元素
					// loader.style.display = "block";
					loadNewData();
				}
				list.style.top = cssY + 'px';
				isMoved = false;

			}, false);

			list.addEventListener("touchmove", function (e) {
				if (isTouched) {

					if (e.changedTouches[0].clientY > prevY) {

						var change = e.changedTouches[0].clientY - prevY;

						list.style.top = cssY + change + 'px';
						isMoved = true;
					}
				}
			}, false);
			//绑定鼠标事件让在电脑浏览器里也能用
			list.addEventListener("mousedown", function (e) {
				isTouched = true;
				prevY = e.clientY;
				list.style.transition = "";
			}, false);
			list.addEventListener("mouseup", function (e) {
				isTouched = false;

				list.style.transition = "top ease-out 0.5s";
				if (isMoved) {
					// loader.style.display = "block";
					loadNewData();
				}
				list.style.top = cssY + 'px';
				isMoved = false;
			}, false);
			list.addEventListener("mousemove", function (e) {
				if (isTouched) {
					if (e.clientY > prevY) {
						var change = e.clientY - prevY;
						list.style.top = cssY + change + 'px';
						isMoved = true;
					}
				}
			}, false);

			function loadNewData() {

				/**
				 * callback here.
				 */
			}
		}
	}
}
