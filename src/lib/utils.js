module.exports = {
	filters: {
		//处理日期
		convertDateFormat: function (date) {
			if (date != '') {
				return new Date(date).getDate()
			} else {
				return '';
			}
		}
	},
	/**
	 * 判断闰年
	 * @param  {Number}  year 需要判断的年份
	 * @return {Boolean}      
	 */
	isLeap: function (year) {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	},
	/**
	 * 计算每个月包含多少天
	 * @return {Array} 12个月，每个月包含多少天
	 */
	allMonth: function () {
		var thisYear = this.getThisYear();
		var month = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		month[1] = this.isLeap(thisYear) ? 28 : 29;
		return month;
	},

	/**
	 * get this year
	 * @return {Number} return this year 
	 */
	getThisYear: function () {
		return new Date().getFullYear();
	},
	getThisMonth: function () {
		return new Date().getMonth() + 1;
	},
	/**
	 * 获取当前月份表格内的数
	 * @return {[type]} [description]
	 */
	getCurrentMonthTableData: function (date) {
		//如果传递了Date对象，则按Date对象进行计算月份面板
		//否则，按照当前月份计算面板
		var date = date || new Date(),
			year = date.getFullYear(),
			month = date.getMonth(),
			day = date.getDate(),
			week = date.getDay(),
			currentDays = new Date(year, month + 1, 0).getDate(),
			preDays = new Date(year, month, 0).getDate(),
			firstDay = new Date(year, month, 1),
			firstCell = firstDay.getDay() === 0 ? 7 : firstDay.getDay(),
			bottomCell = 35 - currentDays - firstCell;

		//前一个月该显示多少天
		var preMonth = [];
		for (var p = firstCell; p > 0; p--) {
			// preMonth.push(new Date(year, month - 1, preDays - p + 1));
			preMonth.push('');
		}
		//本月
		var currentMonth = [];
		for (var c = 0; c < currentDays; c++) {
			currentMonth.push(new Date(year, month, c + 1));
			// currentMonth.push('');
		}
		//下一个月
		var nextMonth = [];
		for (var n = 0; n < bottomCell; n++) {
			// nextMonth.push(new Date(year, month + 1, n + 1));
			nextMonth.push('');
		}

		preMonth = preMonth.concat(currentMonth, nextMonth);
		return preMonth;
	},

	getAllPanelData: function (maxDate) {
		var self = this;
		if (maxDate.indexOf('d') == -1 && maxDate.indexOf('m') == -1) {
			self.consoleError('Vue Component Calendar Error: Parameter error, the \'maxDate\' parameter must contain a string \'d\' or \'m\'.');
			return;
		}
		if (maxDate.indexOf('d') > -1 && maxDate.indexOf('m') > -1) {
			self.consoleError('Vue Component Calendar Error: Parameter error, the \'maxDate\' parameter must contain one string: \'d\' or \'m\'.');
			return;
		}
		if (maxDate.indexOf('d') > -1) {
			//按天计算
			var days = maxDate.replace('d', '') * 1;
			if (days) {

			} else {
				self.consoleError('Vue Component Calendar Error: maxDate parameter error')
			}
		}
		if (maxDate.indexOf('m') > -1) {
			//按月计算
			var all = [];
			var thisMonth = {};
			var months = maxDate.replace('m', '') * 1;
			if (months) {
				for (var i = 0; i < months; i++) {
					var thisMonth = self.getThisMonth() + i;
					var thisYear = self.getThisYear();
					var num = 0;
					if (thisMonth > 12 && thisMonth <= 24) {
						num = 1;
					} else if (thisMonth > 24 && thisMonth <= 36) {
						num = 2;
					} else if (thisMonth > 36 && thisMonth <= 48) {
						num = 3;
					} else if (thisMonth > 48) {
						self.consoleError('Vue Component Calendar Error: maxDate parameter error, maxDate max\'s value is 48m');
					}
					thisYear = thisYear + num;
					thisMonth = thisMonth - 12 * num

					all.push({
						month: thisYear + '年' + thisMonth + '月',
						days: self.getCurrentMonthTableData(new Date(thisYear, thisMonth - 1, 1))
					})
				}
			} else {
				self.consoleError('Vue Component Calendar Error: maxDate parameter error')
			}
			console.log(all)
			return all;

		}

	},
	consoleError: function (msg) {
		console.error(msg);
	}
}