<style src="../index.css"></style>

<template>
    <div class="vue-calendar" data-index="0">
        <div class="vue-calendar-backdrop" v-show="showCalendar" @click.prevent="calculateResult('cancle')"></div>
        <div class="vue-calendar-content" v-show="showCalendar" transition="vue-component-calendar-content" id="vueCalendarTemplate">
            <div class="vue-calendar-content-title-wrapper" id="topHeight1">
                <div class="text">{{titleText}}</div>
                <div class="btn">
                    <a href="javascript:;" @click.prevent="calculateResult('confirm')">完成</a>
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
                            <li @click.prevent="selectedFunc" v-for="day in item.days" date-sec="{{new Date(day).getTime() || ''}}" :class="{'selected-start': isStartDate == new Date(day).getTime(),
                                    'selected-end': isEndDate == new Date(day).getTime(),
                                    'selected-line': isStartDate < new Date(day).getTime() && new Date(day).getTime() < isEndDate,
                                    'disabled': today > new Date(day).getTime(),
                                    'without-text': withoutText,
                                    'border-radius': borderRadius,
                                    'is-holiday': judgeIsHoliday(day),
                                    'is-work': judgeIsWork(day)
                                }" data-date-format="{{day | convertDateFormatValue}}">
                                <span class="dd">{{day | convertDateFormatDisplay isHoliday isVication}}</span><i></i>
                                <span class="holiday"></span>
                            </li>
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
            isDoubleCheck: { //支持单选或者双选
                type: Boolean,
                default: true
            },
            isHoliday: { //是否显示节日名称
                type: Boolean,
                default: true
            },
            isVication: { //是否显示假期提醒
                type: Boolean,
                default: true
            },
            result: Object
        },
        data() {
            return {
                panel: utils.getAllPanelData(this.maxDate),
                titleText:this.isDoubleCheck ? '请选择入离日期': '请选择日期',
                isStartDate: utils.formatDateConvert(this.startDate),
                isEndDate: utils.formatDateConvert(this.endDate),
                today: utils.getTodaySec(),
                selectBefore: null,
                withoutText: null,
                borderRadius: null,
                judgeIsHoliday: function(day) {
                    return utils.judgeIsHoliday(day)
                },
                judgeIsWork: function(day) {
                    return utils.judgeIsWork(day)
                },
                result: null
            }
        },
        methods: {
            selectedFunc: function(event) {
                var sec = event.currentTarget.getAttribute('date-sec');
                if (sec < this.today) {
                    return;
                }
                if (this.isDoubleCheck) { //支持多选
                    this.isStartDate = sec;
                    this.borderRadius = true;
                    if (this.isEndDate) { //离店日期已经确定
                        this.selectBefore = sec; //中间状态
                        this.isEndDate = null;
                    } else { //离店日期未确定
                        if (this.selectBefore) { //如果中间状态已经有了，说明这一步需要点击离店操作
                            this.isStartDate = this.selectBefore;
                            this.isEndDate = sec;
                            this.borderRadius = false;
                            if (this.isStartDate >= this.isEndDate) { //处理入住和离店的时间先后逻辑
                                this.isStartDate = sec;
                                this.selectBefore = sec;
                                this.isEndDate = null;
                                this.borderRadius = true;
                            }
                        } else { //如果没有中间状态，说明是重新选择入住时间
                            this.isStartDate = sec;
                            this.selectBefore = sec;
                            this.isEndDate = null;
                        }
                    }

                } else { //支持单选
                    this.isStartDate = sec;
                    this.isEndDate = null;
                    this.withoutText = true;
                    this.borderRadius = true;
                }
            },

            calculateResult: function(type){
                this.showCalendar = false;
                var obj = {};
                obj.startDate = this.isStartDate;
                obj.endDate = this.isEndDate;
                var selectedDaysNum = utils.calculateDaysNum(this.isStartDate, this.isEndDate);
                var daysInfo = utils.calculateDaysInfo(this.isStartDate, this.isEndDate)
                obj.selectedInfo = {
                    daysNum: selectedDaysNum,
                    daysInfo: daysInfo
                }
                this.$dispatch(type, obj)
            },

            scrollFunction: function(event){


            }
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
