/**
 * 获取本周、本季度、本月、上月的开始日期、结束日期
 */
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getFullYear(); //当前年
var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getFullYear();
var lastMonth = lastMonthDate.getMonth();
export default {
	//格式化日期：yyyy-MM-dd
	 formatDate:function(date) {
	    var myyear = date.getFullYear();
	    var mymonth = date.getMonth() + 1;
	    var myweekday = date.getDate();
	    if (mymonth < 10) {
	        mymonth = "0" + mymonth;
	    }
	    if (myweekday < 10) {
	        myweekday = "0" + myweekday;
	    }
	    return (myyear + "-" + mymonth + "-" + myweekday);
	},
	//获得某月的天数
	getMonthDays:function(myMonth) {
	    var monthStartDate = new Date(nowYear, myMonth, 1);
	    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
	    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
	    return days;
	},
	//获得本季度的开始月份
	getQuarterStartMonth:function() {
	    var quarterStartMonth = 0;
	    if (nowMonth < 3) {
	        quarterStartMonth = 0;
	    }
	    if (2 < nowMonth && nowMonth < 6) {
	        quarterStartMonth = 3;
	    }
	    if (5 < nowMonth && nowMonth < 9) {
	        quarterStartMonth = 6;
	    }
	    if (nowMonth > 8) {
	        quarterStartMonth = 9;
	    }
	    return quarterStartMonth;
	},
	//获得本周的开始日期
	getWeekStartDate:function() {
	    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek,0,0,0,0);
	    return weekStartDate;
	},
	//获得本周的结束日期
	getWeekEndDate:function() {
	    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek),23,59,59,999);
	    return weekEndDate;
	},
	//获得上周的开始日期
	getLastWeekStartDate:function() {
	    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7,0,0,0,0);
	    return weekStartDate;
	},
	//获得上周的结束日期
	getLastWeekEndDate:function() {
	    var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1,23,59,59,999);
	    return weekEndDate;
	},
	//获得本月的开始日期
	getMonthStartDate:function() {
	    var monthStartDate = new Date(nowYear, nowMonth, 1,0,0,0,0);
	    return monthStartDate;
	},
	//获得本月的结束日期
	getMonthEndDate:function() {
	    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth),23,59,59,999);
	    return monthEndDate;
	},
	//获得上月开始时间
	getLastMonthStartDate:function() {
	    var lastMonthStartDate = new Date(nowYear, lastMonth, 1,0,0,0,0);
	    return lastMonthStartDate;
	},
	//获得上月结束时间
	getLastMonthEndDate:function() {
	    var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth),23,59,59,999);
	    return lastMonthEndDate;
	},
	//获得本季度的开始日期
	getQuarterStartDate:function() {
	    var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1,0,0,0,0);
	    return quarterStartDate;
	},
	//获得本季度的结束日期
	getQuarterEndDate:function() {
	    var quarterEndMonth = getQuarterStartMonth() + 2;
	    var quarterStartDate = new Date(nowYear, quarterEndMonth,  getMonthDays(quarterEndMonth),23,59,59,999);
	    return quarterStartDate;
	},
	//获得本年开始日期
	getYearStartDate:function() {
	    var yearStartDate = new Date(nowYear, 0, 1,0,0,0,0);
	    return yearStartDate;
	},
	//获得本年的结束日期
	getYearEndDate:function() { 
	    var yearEndDate = new Date(nowYear, 0,  getMonthDays(11),23,59,59,999);
	    return yearEndDate;
	},
	//获得上一年开始日期
	getLastYearStartDate:function() {
	    var yearStartDate = new Date(nowYear-1, 0, 1,0,0,0,0); 
	    return yearStartDate;
	},
	//获得上一年的结束日期
	getLastYearEndDate:function() { 
	    var yearEndDate = new Date(nowYear-1, 11,  getMonthDays(11),23,59,59,999);
	    return yearEndDate;
	},




	// 近一周
	getNearWeekStartDate(){
		let time = [];
		let start = new Date();
		let end = new Date();
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
		time.push(start);
		time.push(end);
		return time;
	},
	//近一个月
	getNearMonthStartDate(){
		let time = [];
		let start = new Date();
		let end = new Date();
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
		time.push(start);
		time.push(end);
		return time;
	},
	//近三个月
	getNearThreeMonthStartDate(){
		let time = [];
		let start = new Date();
		let end = new Date();
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
		time.push(start);
		time.push(end);
		return time;
	},
	//近半年
	getNearHalfYearStartDate(){
		let time = [];
		let start = new Date();
		let end = new Date();
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
		time.push(start);
		time.push(end);
		return time;
	},
	//近一年
	getNearYearStartDate(){
		let time = [];
		let start = new Date();
		let end = new Date();
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
		time.push(start);
		time.push(end);
		return time;
	},
}