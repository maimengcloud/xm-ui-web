  

	import Driver from 'driver.js';
	import 'driver.js/dist/driver.min.css';  
  import guiderData from './guiderData'

  var driver = new Driver({
    className: 'driver-popover',
    doneBtnText: '知道了', // 结束按钮的文字
    allowClose: false, // 是否可以通过点击遮罩层关闭指引
    stageBackground: '#ffffff', // 突出显示元素的背景颜色
    nextBtnText: '下一步', // 下一步按钮的文字
    prevBtnText: '上一步', // 上一步按钮的文字
    closeBtnText: '关闭', // 关闭按钮的文字
    keyboardControl: false, // 是否允许键盘操控
    xCloseButton: true, // 将关闭按钮作为X放在弹出
    onReset: (Element) => {  
    }, 
  }); 
 

export default { 
  initDriver:function(guiderName){
    var driver = new Driver({
      className: 'driver-popover',
      doneBtnText: '知道了', // 结束按钮的文字
      allowClose: false, // 是否可以通过点击遮罩层关闭指引
      stageBackground: '#ffffff', // 突出显示元素的背景颜色
      nextBtnText: '下一步', // 下一步按钮的文字
      prevBtnText: '上一步', // 上一步按钮的文字
      closeBtnText: '永远关闭', // 关闭按钮的文字
      keyboardControl: false, // 是否允许键盘操控
      xCloseButton: true, // 将关闭按钮作为X放在弹出
      onReset: (e) => {    
        var event= window.event; 
        if(event){
          var target=event.target; 
          if(target && target.className=='driver-close-btn'){
            localStorage.setItem("guider-"+guiderName,"1"); 
          }
        } 
      }
    }); 
    return driver;
  },
  startBySteps: function(steps) {   
     driver.defineSteps(steps);
     driver.start();
  },    
 
  startByName: function(guiderName,forceDisplayWhileClosed) {    
    var localExists=localStorage.getItem('guider-'+guiderName)
    if(localExists=='1' && !forceDisplayWhileClosed){
      return;
    }
    var driver2=this.initDriver(guiderName);
    var steps=guiderData.getSteps(guiderName);
    driver2.defineSteps(steps); 
    driver2.start();   
  },
}
