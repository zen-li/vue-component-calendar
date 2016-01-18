module.exports = {
    /**
     * 判断闰年
     * @param  {Number}  year 需要判断的年份
     * @return {Boolean}      
     */
    isLeap: function(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },
    /**
     * 计算每个月包含多少天
     * @return {Array} 12个月，每个月包含多少天
     */
    allMonth: function(){
        var thisYear = this.getThisYear();
        var month = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        month[1] = this.isLeap(thisYear) ? 28 : 29;
        return month;
    },

    /**
     * get this year
     * @return {Number} return this year 
     */
    getThisYear: function(){
        return new Date().getFullYear();
    }
}
