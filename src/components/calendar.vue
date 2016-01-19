<style src="../index.css"></style>
<template>
    <div class="vue-calendar" data-index="0">
        <div class="vue-calendar-backdrop" v-show="showCalendar" @click.prevent="showCalendar=false"></div>
        <div class="vue-calendar-content" v-show="showCalendar" transition="vue-component-calendar-content">
            <div class="vue-calendar-content-title-wrapper">
                <div class="text">选择入离日期</div>
                <div class="btn">
                    <a href="javascript:;" @click.prevent="showCalendar=false">完成</a>
                </div>
            </div>
            <div class="week-bar">
                <ul>
                    <li class="weekend">日</li>
                    <li>一</li>
                    <li>二</li>
                    <li>三</li>
                    <li>四</li>
                    <li>五</li>
                    <li class="weekend">六</li>
                </ul>
            </div>
            <div class="vue-calendar-date-wrapper" id="scrollPanel" @scroll="scrollFunction">
                <div v-for="(index,item) in panel" data-index="{{index}}">
                    <div class="month-bar" v-bind:class="{'first-month-bar':index==0}">{{item.month}}</div>
                    <div class="month-list" v-bind:class="{'first-day-panel':index==0}">
                        <ul>
                            <li @click.prevent="selectedFunc" v-for="day in item.days" v-bind:class="{'selected':isSelected == '{{day | convertDateFormatValue}}' }" data-value="{{day | convertDateFormatValue}}" >{{day | convertDateFormatDisplay}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var utils = require('../lib/utils');
// var events = require('../lib/events');
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
        return {
            months: utils.getCurrentMonthTableData(),
            panel: utils.getAllPanelData(this.maxDate),
            isSelected: false
        }
    },
    methods: {
        scrollFunction: function(event) {

        },
        selectedFunc: function(event) {
            this.isSelected = event.currentTarget.getAttribute('data-value');
        }
    },
    events: {

    },
    ready() {
        var CAL = {
            init: function() {
                // events().init(); //事件初始化
            }
        }
        CAL.init();
    }
}
</script>
