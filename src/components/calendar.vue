<style src="../index.css"></style>
<template>
    <div class="vue-calendar" data-index="0" >
        <div class="vue-calendar-backdrop" v-show="showCalendar" @click.prevent="showCalendar=false"></div>
        <div class="vue-calendar-content" v-show="showCalendar" transition="vue-component-calendar-content" id="vueCalendarTemplate">
            <div class="vue-calendar-content-title-wrapper" id="topHeight1">
                <div class="text">选择入离日期</div>
                <div class="btn">
                    <a href="javascript:;" @click.prevent="showCalendar=false">完成</a>
                </div>
            </div>
            <div class="week-bar" id="topHeight2">
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
            <div class="vue-calendar-date-wrapper" id="scrollPanel" @scroll="scrollFunction" style="position: relative;top:0px;">
                <div v-for="(index,item) in panel" data-index="{{index}}">
                    <div class="month-bar" v-bind:class="{'first-month-bar':index==0}" id="topHeight3">{{item.month}}</div>
                    <div class="month-list" v-bind:class="{'first-day-panel':index==0}">
                        <ul>
                            <li
                                @click.prevent="selectedFunc"
                                v-for="day in item.days"
                                date-sec="{{new Date(day).getTime() || ''}}"
                                :class="{'selected-start': isStartDate == new Date(day).getTime(),
                                    'selected-end': isEndDate == new Date(day).getTime(),
                                    'selected-line': isStartDate < new Date(day).getTime() && new Date(day).getTime() < isEndDate,
                                    'disabled': today > new Date(day).getTime(),
                                    'without-text': withoutText,
                                    'border-radius': borderRadius
                                }"
                                data-date-format="{{day | convertDateFormatValue}}"
                                ><span>{{day | convertDateFormatDisplay}}</span><i></i></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var utils = require('../lib/utils');
var events = require('../lib/events');
export default {
    props: {
        showCalendar: {
            type: Boolean,
            default: false,
            twoWay: true
        },
        startMonth: Date, //日历面板从哪个月开始，与isCompleteMonth互斥
        maxDate: String, //允许操作的最大日期
        startDate: String, //开始日期
        endDate: String, //结束日期
        isDoubleCheck: {
            type: Boolean,
            default: true
        }, //支持单选或者双选
        isHoliday: Boolean, //是否显示节日名称
        isVacation: Boolean, //是否显示假期提醒
    },
    data() {
        // var today = utils.dateFormat('yyyy-MM-dd', new Date());
        return {
            panel: utils.getAllPanelData(this.maxDate),
            isStartDate: utils.formatDateConvert(this.startDate),
            isEndDate: utils.formatDateConvert(this.endDate),
            today: utils.getTodaySec(),
            selectBefore: null,
            withoutText: null,
            borderRadius: null
        }
    },
    methods: {
        selectedFunc: function(event) {
            var sec = event.currentTarget.getAttribute('date-sec');
            if(sec < this.today){
                return;
            }
            if(this.isDoubleCheck){
                this.isStartDate = sec;
                this.borderRadius = true;
                if(this.isEndDate){
                    this.selectBefore = sec;
                    this.isEndDate = null;

                }else{
                    if(this.selectBefore){
                        this.isStartDate = this.selectBefore;
                        this.isEndDate = sec;
                        this.borderRadius = false;
                        if(this.isStartDate >= this.isEndDate ){
                            this.isStartDate = sec;
                            this.selectBefore = sec;
                            this.isEndDate = null;
                            this.borderRadius = true;
                        }
                    }else{
                        this.isStartDate = sec;
                        this.selectBefore = sec;
                        this.isEndDate = null;
                    }
                }
            }else{
                this.isStartDate = sec;
                this.isEndDate = null;
                this.withoutText = true;
            }
        }
    },
    events: {

    },
    ready() {
        var CAL = {
            init: function() {
                events().init(); //事件初始化
            }
        }
        CAL.init();
    }
}
</script>
