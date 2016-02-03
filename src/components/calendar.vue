<style src="../index.css"></style>

<template>
    <div class="vue-calendar" data-index="0">
        <div class="vue-calendar-backdrop" v-show="showCalendar" @click.prevent="calculateResult('vue-calendar-cancle')"></div>
        <div class="vue-calendar-content" v-show="showCalendar" transition="vue-component-calendar-content" id="vueCalendarTemplate">
            <div class="vue-calendar-content-title-wrapper" id="topHeight1">
                <div class="text">{{titleText}}</div>
                <div class="vue-component-calendar-complete-button">
                    <a href="javascript:;" @click.prevent="calculateResult('vue-calendar-confirm')">完成</a>
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
            <div class="month-bar-fixed" id="fixedBarEle">
                {{fixedMonthbar}}
            </div>
            <div id="scrollPanelWrapper">
                <div class="vue-calendar-date-wrapper" id="scrollPanel">
                    <div v-for="item in panel" track-by="$index" data-index="{{$index}}" class="month-panel">
                        <div class="month-bar" id="monthBar-{{$index}}" :class="{'first-month-bar': $index == 0}">{{item.month}}</div>
                        <div class="month-list">
                            <ul>
                                <li @click.prevent="selectedFunc" v-for="day in item.days" track-by="$index" date-sec="{{new Date(day).getTime() || ''}}" :class="{'selected-start': isStartDate == new Date(day).getTime(),
                                            'selected-end': isEndDate == new Date(day).getTime(),
                                            'selected-line': isStartDate < new Date(day).getTime() && new Date(day).getTime() < isEndDate,
                                            'disabled': today > new Date(day).getTime() || new Date(day).getTime() > lastDay,
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
    </div>
    <vue-component-tips></vue-component-tips>
</template>

<script>
    var utils = require('../lib/utils');
    var iScroll = require('../lib/iscroll').iScroll;
    var vueComTips = require('@hfe/vue-component-tips');

    var myScroll;
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
            }
        },
        data() {
            return {
                fixedMonthbar: utils.getFirstMonthName(this.maxDate),
                panel: utils.getAllPanelData(this.maxDate),
                titleText: this.isDoubleCheck ? '请选择入离日期' : '请选择日期',
                isStartDate: utils.formatDateConvert(this.startDate),
                isEndDate: utils.formatDateConvert(this.endDate),
                today: utils.getTodaySec(),
                lastDay: utils.getLastDaySec(this.maxDate),
                selectBefore: null,
                withoutText: null,
                borderRadius: null,
                judgeIsHoliday: function(day) {
                    return utils.judgeIsHoliday(day)
                },
                judgeIsWork: function(day) {
                    return utils.judgeIsWork(day)
                },
                panelState: 0,
                items: null,
                currentIndex: -1,
                headerHeight:0,
                targets: document.querySelectorAll(".month-bar")


            }
        },
        methods: {
            /**
             * 日历点选后的状态管理，管理所有的点击状态
             * @param  {Object} $event click event
             * @return {Void}
             */
            selectedFunc: function($event) {
                var t = this;
                var styleName = $event.currentTarget.getAttribute('class') || "";
                if (styleName.indexOf('disabled') > -1) {
                    return;
                }
                var sec = Number($event.currentTarget.getAttribute('date-sec'));
                var text;
                if (t.isDoubleCheck) { //支持多选
                    t.isStartDate = sec;
                    t.borderRadius = true;
                    text = '请选择离店日期'
                    if (t.isEndDate) { //离店日期已经确定
                        t.selectBefore = sec; //中间状态
                        t.isEndDate = null;
                    } else { //离店日期未确定
                        if (t.selectBefore) { //如果中间状态已经有了，说明这一步需要点击离店操作
                            t.isStartDate = t.selectBefore;
                            t.isEndDate = sec;
                            t.borderRadius = false;
                            text = '共选择'+ utils.calculateDaysNum(t.isStartDate,t.isEndDate) + '天';
                            if (t.isStartDate >= t.isEndDate) { //处理入住和离店的时间先后逻辑
                                t.isStartDate = sec;
                                t.selectBefore = sec;
                                t.isEndDate = null;
                                t.borderRadius = true;
                                text = '请选择离店日期';
                            }
                        } else { //如果没有中间状态，说明是重新选择入住时间
                            t.isStartDate = sec;
                            t.selectBefore = sec;
                            t.isEndDate = null;
                            text = '请选择离店日期';
                        }
                    }
                    t.createTips(t, text);
                } else { //支持单选
                    t.isStartDate = sec;
                    t.isEndDate = null;
                    t.withoutText = true;
                    t.borderRadius = true;
                }
            },

            /**
             * 点击取消或者完成来触发该方法，计算结果并返回
             * @param  {String} type 'vue-calendar-confirm','vue-calendar-cancle'两种方法
             * @return {Object}
             */
            calculateResult: function(type) {
                var obj = {};
                obj.startDate = Number(this.isStartDate);
                obj.endDate = Number(this.isEndDate);

                if (type == 'vue-calendar-cancle') {
                    this.showCalendar = false;
                }
                //如果双选的时候，开始时间和结束时间必须都有
                //如果是单选则不需要验证
                if (this.isStartDate && this.isEndDate && this.isDoubleCheck || !this.isDoubleCheck) {
                    this.showCalendar = false;

                    var selectedDaysNum = utils.calculateDaysNum(this.isStartDate, this.isEndDate);
                    var daysInfo = utils.calculateDaysInfo(this.isStartDate, this.isEndDate)
                    obj.selectedInfo = {
                        daysNum: selectedDaysNum,
                        daysInfo: daysInfo
                    }
                    this.$dispatch(type, obj);
                } else {
                    this.$dispatch(type, {
                        "status": -1,
                        "msg": "you need selected two dates."
                    });
                }
            },
            createTips: function (instance, text) {
                // above/below 气泡的位置 可不传，默认为above
                instance.$broadcast('vue-tips-create', text, 'above');
            },

        },
        components:{
            'vue-component-tips':vueComTips
        },
        ready() {
            var self = this;
            var CAL = {
                init: function() {
                    this.renderUI();
                    this.bindUI();
                },

                renderUI: function() {
                    this.calScrollHeight();
                    this.renderScrollWithIscroll();
                },

                bindUI: function() {
                    var that = this;
                    self.$watch('showCalendar', function(val) {
                        if (val) {
                            that.calScrollHeight();
                            window.setTimeout(function() {
                                myScroll && myScroll.destroy();
                                that.renderScrollWithIscroll();
                            }, 100);
                        }
                    })
                },

                calScrollHeight: function(type) { //计算滚动区域的高度
                    var doc = document;
                    var cal = doc.getElementById('vueCalendarTemplate').clientHeight,
                        ele1 = doc.getElementById('topHeight1').clientHeight,
                        ele2 = doc.getElementById('topHeight2').clientHeight,
                        ele3 = doc.getElementById('fixedBarEle').clientHeight,
                        height = cal - ele1 - ele2;
                    doc.getElementById('scrollPanelWrapper').style.height = height + 'px';
                    self.targets = document.querySelectorAll(".month-bar")
                },

                renderScrollWithIscroll: function() { //滚动使用iScroll渲染
                    var months = document.getElementsByClassName('month-panel').length;
                    var panelHeightArray = [];
                    for (var i = 0; i < months; i++) {
                        panelHeightArray.push(document.getElementsByClassName('month-panel')[i].clientHeight);
                    }

                    var panelAbsPosi = [];
                    var tmpArr = [];

                    for (var i = 0; i < panelHeightArray.length; i++) {
                        tmpArr.push(panelHeightArray[i])
                        panelAbsPosi[i] = tmpArr.reduce(function(a, b) {
                            return a + b;
                        });
                    }

                    var canlendarScroll = new iScroll('scrollPanelWrapper', {
                        zoom: false,
                        snap: false,
                        onScrollMove: function(event) {
                            var that = this;
                            utils.scrollWithIscroll(self, panelAbsPosi, that);
                        }
                    });
                    myScroll = canlendarScroll;
                }
            }
            CAL.init();
        }
    }
</script>
