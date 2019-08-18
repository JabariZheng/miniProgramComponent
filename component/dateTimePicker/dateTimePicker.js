// component/dateTimePicker/dateTimePicker.js

/**
 * @method change 选择器change的时候触发事件
 * @param { string } mode 选择器类型
 * @param { array } selected 选择的原始数据（json格式：label-显示文本，value-int类型数据）
 * @param { string } _desc 选择对应位置数据的解释文本
 */
Component({
  /**
   * 组件的属性列表
   * @param { string } mode 组件类型
   * @param { string } value 回填的时间
   */
  properties: {
    mode: {
      type: 'string',
      value: 'time', //time-年月日时分 datetime-时间段 
    },
    value: {
      type: 'string',
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    timesRange: [], // 选择器数据
    timePickerValue: [], // 原始选择器-选中下标
    timePickerSelected: [], // 最终选择的数据
    timePickerText: '', // 展示时间文本
    isLeapYear: false, // 是否为闰年
    selectYear: '', // 选中的年
    selectMonth: '', // 选中的月
    selectDay: '', // 选中的天
    selectStartHour: '', // 选中的开始-时
    selectStartMinute: '', // 选中的开始-分
    selectEndtHour: '', // 选中的结束-时
    selectEndtMinute: '', // 选中的结束-分
  },

  /**
   * 组件的方法列表
   */
  methods: {

    timePickerChange: function (e) {
      const { timesRange } = this.data;
      let { timePickerSelected, timePickerText } = this.data;
      let select_index = e.detail.value;
      select_index.forEach((element, index) => {
        timePickerSelected[index] = timesRange[index][element];
      });
      timePickerSelected.map(item => item.label).forEach(ele => {
        timePickerText += ele;
      })
      this.setData({
        timePickerValue: e.detail.value,
        timePickerText: timePickerText,
        timePicker: e.detail.value,
        timePickerSelected: timePickerSelected
      }, function () {
        const { mode, timePickerSelected } = this.data;
        let _triggerData = {
          mode: mode,
          selected: timePickerSelected
        };
        if (mode == 'time') {
          _triggerData._desc = "[年，月，日，时，分]";
        };
        if (mode == 'datetime') {
          _triggerData._desc = "[年，月，日，时，分，-，时，分]";
        };
        this.triggerEvent('change', _triggerData, {});
      })
    },

    /**
     * 时间组件 单列change
     * @param {*} e 
     */
    timePickerColumnChange: function (e) {
      let { timesRange } = this.data;
      let { selectYear, isLeapYear, selectMonth, selectDay, selectStartHour, selectStartMinute, selectEndtHour, selectEndtMinute } = this.data;
      let changeColumn = e.detail.column; // 变化的列数
      switch (changeColumn) {
        case 0:
          // 年
          selectYear = timesRange[e.detail.column][e.detail.value].value;
          isLeapYear = this.compute_leapYear(selectYear);
          break;
        case 1:
          // 月
          selectMonth = timesRange[e.detail.column][e.detail.value].value;
          let dayResult = [];
          if (selectMonth % 2 == 1) {
            // 大月
            dayResult = this.set_dayRange(31);
          } else {
            // 小月
            dayResult = this.set_dayRange(30);
          };
          if (selectMonth == 2) {
            if (isLeapYear) {
              // 闰年2月 29天
              dayResult = this.set_dayRange(29);
            } else {
              // 平年2月 28天
              dayResult = this.set_dayRange(28);
            }
          };
          if (selectMonth == 8) {
            // 8月大月
            dayResult = this.set_dayRange(31);
          };
          timesRange[2] = dayResult;
          break;
        case 2:
          // 日
          selectDay = timesRange[e.detail.column][e.detail.value].value;
          break;
        case 3:
          // 开始-时
          selectStartHour = timesRange[e.detail.column][e.detail.value].value;
          break;
        case 4:
          // 开始-分
          selectStartMinute = timesRange[e.detail.column][e.detail.value].value;
          break;
        case 5:
          // 分隔符
          return;
          break;
        case 6:
          // 结束-时
          selectEndtHour = timesRange[e.detail.column][e.detail.value].value;
          break;
        case 7:
          // 结束-秒
          selectEndtMinute = timesRange[e.detail.column][e.detail.value].value;
          break;
        default:
          break;
      };
      // console.log(selectYear + " " + selectMonth + " " + selectDay + " " + selectStartHour + " " + selectStartMinute + " " + selectEndtHour + " " + selectEndtMinute);
      this.setData({
        selectYear: selectYear,
        selectMonth: selectMonth,
        selectDay: selectDay,
        selectStartHour: selectStartHour,
        selectStartMinute: selectStartMinute,
        selectEndtHour: selectEndtHour,
        selectEndtMinute: selectEndtMinute,
        timesRange: timesRange,
        isLeapYear: isLeapYear,
      })
    },

    /* 计算是否为闰年 */
    compute_leapYear: function (year) {
      let isLeapYear = false;
      if ((year % 4 == 0 & year % 100 != 0) || (year % 400 == 0)) {
        isLeapYear = true;
      } else {
        isLeapYear = false;
      };
      // console.log(year + "是" + (isLeapYear ? '闰年' : '平年'));
      return isLeapYear;
    },

    /* get 10 years later */
    set_yearsRange: function () {
      let years_range = [];
      const { selectYear } = this.data;
      for (let i = (selectYear - 1); i < (selectYear + 10); i++) {
        years_range.push({
          label: (i + 1) + "年",
          value: i + 1
        });
      };
      return years_range;
    },

    /* get month */
    set_monthRange: function () {
      let month_range = [];
      for (let i = 0; i <= 12; i++) {
        month_range.push({
          label: (i + 1) + "月",
          value: i + 1
        });
      };
      return month_range;
    },

    /* get day */
    set_dayRange: function (daysMax) {
      let day_range = [];
      for (let i = 0; i < daysMax; i++) {
        day_range.push({
          label: (i + 1) + "日",
          value: i + 1
        })
      };
      return day_range;
    },

    /* get start hour */
    set_startHourRange: function () {
      let hour_range = [];
      for (let i = 0; i < 24; i++) {
        hour_range.push({
          label: i < 10 ? ("0" + i + "时") : i + "时",
          value: i
        });
      };
      return hour_range;
    },

    /* get start minuts */
    set_startMinuteRange: function () {
      let minute_range = [];
      for (let i = 0; i < 60; i++) {
        minute_range.push({
          label: i < 10 ? ("0" + i + "分") : (i + "分"),
          value: i
        });
      };
      return minute_range;
    },

    /* get end hour */
    set_endHourRange: function () {
      let hour_range = [];
      for (let i = 0; i < 24; i++) {
        hour_range.push({
          label: i < 10 ? ("0" + i + "时") : i + "时",
          value: i
        });
      }
      return hour_range;
    },

    /* get end minuts */
    set_endMinuteRange: function () {
      let minute_range = [];
      for (let i = 0; i < 60; i++) {
        minute_range.push({
          label: i < 10 ? ("0" + i + "分") : (i + "分"),
          value: i
        });
      }
      return minute_range;
    },
  },

  /**
   * 组件的生命周期
   */
  created: function () {
  },
  attached: function () {

    // 处理是够有回填的时间
    // if (this.data.value != "") {
    //   const { value } = this.data;
    //   let _splitYear = value.split("年");
    //   let _splitMonth = _splitYear[1].split("月");
    //   let _splitDay = _splitMonth[1].split("日");
    //   let _splitStartHour = _splitDay[1].split(":");
    //   let _splitStartMinute = _splitStartHour[1].split("-");
    //   if (this.data.mode == "datetime") {

    //   }
    //   console.log(this.data.value);
    //   console.log(_splitYear)
    //   console.log(_splitMonth)
    //   console.log(_splitDay)
    //   console.log(_splitStartHour)
    //   console.log(_splitStartMinute)
    // }

    let { selectYear } = this.data;
    selectYear = new Date().getFullYear();
    this.setData({
      selectYear: selectYear
    }, function () {
      this.setData({
        isLeapYear: this.compute_leapYear(this.data.selectYear)
      });
    })
  },
  ready: function () {
    let { timesRange } = this.data;
    console.log(this.data.mode)
    if (this.data.mode == 'time') {
      // [年，月，日，时，分]
      timesRange = [[], [], [], [], []];
      timesRange[0] = this.set_yearsRange();
      timesRange[1] = this.set_monthRange();
      timesRange[2] = this.set_dayRange(31);
      timesRange[3] = this.set_startHourRange();
      timesRange[4] = this.set_startMinuteRange();
    };
    if (this.data.mode == 'datetime') {
      // [年，月，日，时，分，-，时，分]
      timesRange = [[], [], [], [], [], [], [], []];
      timesRange[0] = this.set_yearsRange();
      timesRange[1] = this.set_monthRange();
      timesRange[2] = this.set_dayRange(31);
      timesRange[3] = this.set_startHourRange();
      timesRange[4] = this.set_startMinuteRange();
      timesRange[5] = [{ label: '-', value: 0 }];
      timesRange[6] = this.set_endHourRange();
      timesRange[7] = this.set_endMinuteRange();
    };
    this.setData({
      timesRange: timesRange
    });
  },
  detached: function () {
  },
})
