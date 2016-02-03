var utils = require('./lib/utils');

module.exports = require('./components/calendar.vue');

// 声明全局filter
window.Vue.filter('convertDateFormatDisplay', utils.filters().convertDateFormatDisplay);
window.Vue.filter('convertDateFormatValue', utils.filters().convertDateFormatValue);
