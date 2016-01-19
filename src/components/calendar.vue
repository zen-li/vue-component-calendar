<style src="../index.css"></style>
<template>
    <div class="vue-calendar">
        <div class="vue-calendar-backdrop" v-show="showCalendar" @click.prevent="showCalendar=false"></div>
        <div class="vue-calendar-content" v-show="showCalendar" transition="vue-component-calendar-content">
            <div class="vue-calendar-content-title-wrapper">
                <div class="text">选择入离日期</div>
                <a href="javascript:;" @click.prevent="showCalendar=false">完成</a>
            </div>
            <div class="week-bar">
                <ul>
                    <li>日</li>
                    <li>一</li>
                    <li>二</li>
                    <li>三</li>
                    <li>四</li>
                    <li>五</li>
                    <li>六</li>
                </ul>
            </div>
            <div class="vue-calendar-date-wrapper">
                <div class="month-bar">{{panel()}}</div>
                <div class="month-list">
                    <ul>
                        <li v-for="item in months">{{item | convertDateFormat}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var utils = require('../lib/utils');

export default {
    props: {
        showCalendar: {
            type: Boolean,
            default: false,
            twoWay: true
        },
        maxDate: String, //允许操作的最大日期
        startDate: String, //开始日期
        endDate: String, //结束日期
        isHoliday: Boolean, //是否显示节日名称
        isVacation: Boolean, //是否显示假期提醒
        isSameDate: Boolean, //是否允许开始日期和结束日期相同
    },
    data() {
        console.log(this.maxDate)
        return {
            months: utils.getCurrentMonthTableData(),
            panel:utils.getAllPanelData(this.maxDate)
        }
    },
    methods: {},
    events: {

    }
}
</script>
