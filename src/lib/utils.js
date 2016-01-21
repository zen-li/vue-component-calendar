var config = require('./config');
var vication = config.vication;
var holiday = config.holiday;
var work = config.work;
var allVications = [];
var allHolidays = [];
var allWorks = [];
//处理所有的日期数据
(function handleVication() {
	for (var i in vication) {
		var item = vication[i]
		var d = item.dates;
		for (var j in d) {
			allVications.push(d[j]);
		}
	}

	for (var m in holiday) {
		allHolidays.push(m);
	}

	for (var n in work) {
		allWorks.push(n);
	}
})();

module.exports = {
	filters: function () {
		var self = this;
		return {
			//处理日期
			convertDateFormatDisplay: function (date, isHoliday, isVication) {
				if (date != '') {
					return self.handleCalendarDisplayName(date, isHoliday, isVication);
				} else {
					return '';
				}
			},
			convertDateFormatValue: function (date) {
				if (date != '') {
					return self.dateFormat('yyyy-MM-dd', date);
				} else {
					return '';
				}
			}
		}
	},
	judgeIsHoliday: function (day) {
		var date = this.dateFormat('yyyy-MM-dd', new Date(day));
		if (this.inArray(date, allHolidays) > -1) {
			return true;
		} else {
			return false;
		}
	},
	judgeIsWork: function (day) {
		var date = this.dateFormat('yyyy-MM-dd', new Date(day));
		if (this.inArray(date, allWorks) > -1) {
			return true;
		} else {
			return false;
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
	getAllMonth: function () {
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
	 * Get all date's data you want.
	 * @param  {Date}  date  The date you want to start.
	 * @param  {Boolean} isCompleteMonth Whether display the days which has passed.
	 * @return {Array}
	 */
	getCurrentMonthTableData: function (date, isCompleteMonth) {
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
			firstCell = firstDay.getDay() === 0 ? 7 : firstDay.getDay(), //从周日开始
			bottomCell = 35 - currentDays - firstCell;
		var tof = isCompleteMonth || typeof (isCompleteMonth) === 'undefined' ? true : false; //if `isCompleteMonth` is undefined, default the value is true.
		if (tof) {
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
		} else {

			//前一个月该显示多少天
			var preMonth = [];
			for (var p = firstCell; p > 0; p--) {
				// preMonth.push(new Date(year, month - 1, preDays - p + 1));
				preMonth.push('');
			}
			var currentMonth = [];
			for (var c = 0; c < currentDays; c++) {
				currentMonth.push(new Date(year, month, c + 1));
				// currentMonth.push('');
			}
		}
	},

	getAllPanelData: function (maxDate, isCompleteMonth) {
		var self = this;
		if (maxDate.indexOf('d') == -1 && maxDate.indexOf('m') == -1) {
			self.logError('Parameter error, the \'maxDate\' parameter must contain a string \'d\' or \'m\'.');
			return;
		}
		if (maxDate.indexOf('d') > -1 && maxDate.indexOf('m') > -1) {
			self.logError('Parameter error, the \'maxDate\' parameter must contain one string: \'d\' or \'m\'.');
			return;
		}
		if (maxDate.indexOf('d') > -1) {
			//按天计算
			var days = maxDate.replace('d', '') * 1;
			if (days) {

			} else {
				self.logError('maxDate parameter error')
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
						self.logError('maxDate parameter error, maxDate max\'s value is 48m');
					}
					thisYear = thisYear + num;
					thisMonth = thisMonth - 12 * num

					all.push({
						month: thisYear + '年' + thisMonth + '月',
						days: self.getCurrentMonthTableData(new Date(thisYear, thisMonth - 1, 1), isCompleteMonth)
					})
				}
			} else {
				self.logError('maxDate parameter error')
			}
			return all;

		}

	},
	logError: function (msg) {
		var msg = 'Vue Component Calendar Error: ' + msg;
		window.console && console.error(msg);
	},
	/**
	 * demo:yyyy-MM-dd hh:mm:ss.S
	 * @param  {[type]} fmt  [description]
	 * @param  {[type]} date [description]
	 * @return {[type]}      [description]
	 */
	dateFormat: function (fmt, date) {
		var thisDate = date || new Date();
		var o = {
			"M+": thisDate.getMonth() + 1, //月份
			"d+": thisDate.getDate(), //日
			"h+": thisDate.getHours(), //小时
			"m+": thisDate.getMinutes(), //分
			"s+": thisDate.getSeconds(), //秒
			"q+": Math.floor((thisDate.getMonth() + 3) / 3), //季度
			"S": thisDate.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (thisDate.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},
	/**
	 * Convert the date like "2016-01-01" to seconds like '1454256000000'
	 * @param  {String} date The format like this: 2016-01-01.
	 * @return {Number}      The value like this: 1454256000000
	 */
	formatDateConvert: function (date) {
		var self = this;
		if (date) {

			var date = date.split('-');
			var dateSec = new Date(date[0] * 1, date[1] * 1 - 1, date[2] * 1).getTime(); //Compatible safari browser & webkit kernel.
			if (dateSec >= self.getTodaySec()) {
				return dateSec
			} else {
				self.logError('maybe your "startDate" is before today? please check the value with "startDate" or "endDate".');
			}
		} else {
			return '';
		}

	},

	/**
	 * Judge element is in Array or not. like the lodash's `_.contains()` method or jQuery's `inArray` method.
	 * @param  {String or Number} elem The element you want to judge.
	 * @param  {Array} arr  The array you want to test.
	 * @param  {number} i   The index you want to start check.
	 * @return {Number} If the value equals '-1', it means that the result is NOT in your Array. Attention, it is not Boolean return.
	 */
	inArray: function (elem, arr, i) {
		var len;
		if (arr) {
			len = arr.length;
			i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

			for (; i < len; i++) {
				// Skip accessing in sparse arrays
				if (i in arr && arr[i] === elem) {
					return i;
				}
			}
		}
		return -1;
	},

	/**
	 * Handle the display name by different properties.
	 * @param  {Date} date The Date Object, format like this: 'Wed Jan 20 2016 16:47:00 GMT+0800 (CST)'
	 * @return {String}
	 */
	handleCalendarDisplayName: function (date, isHoliday, isVication) {
		var self = this;
		var dt = this.dateFormat('yyyy-MM-dd', date);
		if (isVication) {
			var isInVication = this.inArray(dt, allVications);
			if (isInVication > -1) {
				return self.showVicationNameWithDate(dt);
			}
		}
		if (self.isToday(dt)) {
			return '今天';
		}
		if (self.isTomorrow(dt)) {
			return '明天';
		} else {
			return new Date(date).getDate();
		}
	},

	/**
	 * Get the vication name by date
	 * @param  {String} date The date value's format like this: "2016-02-07"
	 * @return {String}      The vication name which matched your date.
	 */
	showVicationNameWithDate: function (date) {
		for (var i in vication) {
			for (var j in vication[i].dates) {
				if (vication[i]["dates"][j] == date) {
					return vication[i].name;
				}
			}
		}
	},

	showHolidayNameWithDate: function(date){
		return holiday[date];
	},

	/**
	 * judge the value you check is Chinese or not.
	 * @param  {String}  text The value you want to check.
	 * @return {Boolean}
	 */
	isChinese: function (text) {
		var re = /[^\u4e00-\u9fa5]/;
		if (re.test(text)) return false;
		return true;
	},
	/**
	 * Judge today's date is "today" or not.
	 * @param  {String}  day The value's format like this: "2016-01-20"
	 * @return {Boolean}
	 */
	isToday: function (day) {
		var today = this.dateFormat('yyyy-MM-dd', new Date());
		if (day == today) {
			return true
		};
		return false;
	},
	/**
	 * Judge tomorrow's date is "tomorrow" or not.
	 * @param  {String}  day The value's format like this: "2016-01-20"
	 * @return {Boolean}     isTomorrow
	 */
	isTomorrow: function (day) {
		var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		var format = this.dateFormat('yyyy-MM-dd', tomorrow)
		if (day == format) return true;
		return false;
	},

	getTodaySec: function () {
		var year = new Date().getFullYear(),
			month = new Date().getMonth(),
			day = new Date().getDate();
		return new Date(year, month, day).getTime();
	},

	/**
	 * Number of days between two days.
	 * @param  {Number} start Start time, format like this: 1453359993611
	 * @param  {Number} end   End time, format like this: 1453359993611
	 * @return {Number}       days number.
	 */
	calculateDaysNum: function (start, end) {
		var interval = end - start;
		return interval / 86400000 + 1; //return days number.
	},

	calculateDaysInfo: function (start, end) {
		var self = this;
		var days = {};
		var daysNum = self.calculateDaysNum(start, end);
		for (var i = 0; i < daysNum; i++) {
			var nextDay = Number(start) + 86400000 * i;
			if (nextDay <= end) {
				var thisDateWithFormat = self.dateFormat('yyyy-MM-dd', new Date(nextDay));
				var thisDate = nextDay;
				days[thisDate] = {
					'date': thisDateWithFormat,
					'vicationName': self.showVicationNameWithDate(thisDateWithFormat) || '',
					'holidayName': self.showHolidayNameWithDate(thisDateWithFormat) || ''
				};
			}
		}
		return days;
	},
	getFirstMonthName: function(maxDate){
		var panel = this.getAllPanelData(maxDate);
		return panel[0]['month'];
	}

}
