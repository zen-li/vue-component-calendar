var utils = require('./lib/utils');

module.exports = {
	calendar: require('./components/calendar.vue')
}


//声明全局filter
Vue.filter('convertDateFormatDisplay', utils.filters().convertDateFormatDisplay);
Vue.filter('convertDateFormatValue', utils.filters().convertDateFormatValue);