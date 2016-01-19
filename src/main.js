var utils = require('./lib/utils');

module.exports = {
	calendar: require('./components/calendar.vue')
}


//声明全局filter
Vue.filter('convertDateFormat', utils.filters().convertDateFormat);