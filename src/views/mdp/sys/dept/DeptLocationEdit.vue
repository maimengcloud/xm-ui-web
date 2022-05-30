<template>
	<section> 
			   <el-form ref="addFormFinal" label-position="left" :model="value" label-width="80px">
			   <div class="form_context">
			       <div>
			          <el-form-item label="地址">
						  <el-row>
							  <el-col :span="4">
							      <el-input placeholder="省"  style="width:100%;" v-model="value[province]" :disabled="true"></el-input>
							  </el-col>
							  <el-col :span="4">
							      <el-input placeholder="市"  style="width:100%;" v-model="value[city]" :disabled="true"></el-input>
							  </el-col>
							  <el-col :span="4">
							      <el-input placeholder="区"  style="width:100%;" v-model="value[district]" :disabled="true"></el-input>
							  </el-col>
							  <el-col :span="12">
							      <el-input ref="focusInput" placeholder="请输入地址"  style="width:100%;"  v-model="value[address]" :disabled="addressDisable"></el-input>
							  </el-col>
						   </el-row>
						   <el-row>
							  <el-col :span="8">
							      <el-input placeholder="输入地点关键词搜索，可多个关键字" id="suggestId" v-model="searchText"></el-input>
							  </el-col>
							  <el-col :span="3">
							      <el-button  plain @click="searchPoi">搜索</el-button>
							  </el-col>
							  <el-col :span="13">
							      <div v-if="showPointNewText">找不到合适地址？<span class="point_new" @click="pointResultDept(lng,lat)">标注新地址</span></div>
							  </el-col>
						   </el-row>
				      </el-form-item>
				      <el-form-item label="定位">
				           <el-row>
							  <el-col :span="18">
							      <div id="map"></div>
							  </el-col>
							  <el-col :span="6">
							      <div id="r-result">
							         <div v-if="!showPointNew&&poiList.length<=0">无搜索结果</div>
							         <div v-if="!showPointNew" @click="selectedAddress(item,index)" v-for="(item,index) in poiList" :key="index" v-bind:class="item.selectedAdd?'one_address one_bg':'one_address'">
							               <div>
								              <span class="sign">{{index+1}}</span>
								              <span style="color: #495eff;">{{item.title}}</span>
								           </div>
								           <div>地址：{{item.address}}</div>
								           <div>电话：{{item.phoneNumber}}</div>
							         </div>
							         <div v-if="showPointNew" style="text-align: center;">
							              <div>是否使用此位置作为地址的定位？</div>
							              <el-button size="medium" type="primary" @click="surePointNewShop">确定</el-button>
							         </div>
							      </div>
							  </el-col>
							</el-row>
				      </el-form-item>
			       </div>      
			       <div class="bottomdiv">
				      <!-- <el-button  style="width: 119px;" type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
				      <el-button  style="width: 119px;" type="danger" @click.native="delSubmit" :loading="delLoading">删除</el-button> -->
				      <!-- 定义俩个插槽 -->
				      <slot></slot>
				   </div>
			   </div>
			   </el-form>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库 
	import {MP} from '../../../../common/js/map';
	import Vue from 'vue';
	import {addAndEditDeptLocation,getDeptLocation,delDeptLocation} from '../../../../api/mdp/sys/deptLocation';
	
	//value为双向绑定的对象,其中需要地址信息和经纬度的数据，作用就是接收提交的数据，展示数据，改变提交的数据
	export default {
		props:	{'value':{type:Object,required:true},
			  	'province':{type:String,required: true},
				'city':{type:String,required: true},
				'district':{type:String,required: true},
				'address':{type:String,required: true},
				'longitude':{type:String,required: true},
				'latitude':{type:String,required: true},
				'deptid':{type:String,required: true},
		},
		watch: {
	      'value':function(val){
			  console.log("000");
			  //this.value = Object.assign(this.addForm,val);
			  this.map.clearOverlays();
			  this.searchText='';
			  this.showPointNew=false;
			  this.showPointNewText=false;
			  this.poiList=[];
			  this.$refs['addFormFinal'].resetFields();
	    	  if(val[this.longitude]!=undefined&&val[this.longitude]!=null&&val[this.longitude]!=""){
	    	  this.pointResultDept(val[this.longitude],val[this.latitude]);
	    	  }
	      }
	    },	
		data() {
			return {
				options:{
				  categories:[]
				},//下拉选择框的所有静态数据
				addLoading: false,
				delLoading:false,
				searchText:'',
				addForm: {
					deptid:'',longitude:'',latitude:'',address:'',province:'',city:'',district:''
				},
				addFormFinal:{},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				imgList:[],
				map:{},
				localSearch:{},
				poiList:[],//搜索出来的地址
				showPointNew:false,
				showPointNewText:false,
				lng:113.275,//初始化的经纬度113.275,23.117
				lat:23.117,
				addressDisable:true,//地址描述是否不可修改
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {			
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/	    
		    initMap(){
		    	MP("q0GgIhNs7nDkY7FvFpGCcsrQrSp23I7R").then( BMap => {
		            this.map = new BMap.Map("map",{enableMapClick:false});            // 创建Map实例
		            var point = new BMap.Point(this.lng,this.lat); // 创建点坐标
		            this.map.centerAndZoom(point,15);
		            this.map.enableScrollWheelZoom();
		            
		            var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
		            var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
		            this.map.addControl(top_left_control);        
			        this.map.addControl(top_left_navigation); 
					var that=this;
					var options = {      
					    onSearchComplete: function(results){      
					        if (local.getStatus() == BMAP_STATUS_SUCCESS){      
					            // 判断状态是否正确      
					            //console.log(results);
					            that.poiList=results.Br;
					            that.map.clearOverlays();
					            for(var i=0;i<that.poiList.length;i++){
					               that.createMarker(that.poiList[i],i);
					            }
					        }      
					    },
					    pageCapacity:30   
					 };      
					var local = new BMap.LocalSearch(this.map, options);    
					this.localSearch=local;
		          })
		    },
		    searchPoi(){
		       if(this.searchText!=''){
		          this.showPointNew=false;
				  this.showPointNewText=true;
				  this.poiList=[];
		          this.localSearch.search(this.searchText);
		       }
		    },
		    createMarker(row,index){
		        var point = new BMap.Point(row.point.lng,row.point.lat);
				var marker = new BMap.Marker(point);  // 创建标注
				var label = new BMap.Label(index+1); //文本
				label.setStyle({ color : "red", fontSize : "12px" });
				marker.setLabel(label);
				var opts = {
				  width : 200,     // 信息窗口宽度
				  height: 100,     // 信息窗口高度
				  title : row.title , // 信息窗口标题
				  enableMessage:true,//设置允许信息窗发送短息
				  message:""
				}
				var that=this;
				var infoWindow = new BMap.InfoWindow("地址："+row.address, opts);  // 创建信息窗口对象 
				marker.addEventListener("click", function(){          
					that.map.openInfoWindow(infoWindow,point); //开启信息窗口
				});
				this.map.addOverlay(marker);              // 将标注添加到地图中
		    },
		    selectedAddress(row,index){
		         
		       this.addressDisable=true;
		       //展示文字信息
		       var point = new BMap.Point(row.point.lng,row.point.lat);
		       var opts = {
				  width : 200,     // 信息窗口宽度
				  height: 100,     // 信息窗口高度
				  title : row.title , // 信息窗口标题
				  enableMessage:true,//设置允许信息窗发送短息
				  message:""
				}
				var infoWindow = new BMap.InfoWindow("地址："+row.address, opts);  // 创建信息窗口对象 
				this.map.openInfoWindow(infoWindow,point); //开启信息窗口
		       //数据
		       this.lng=row.point.lng;
			   this.lat=row.point.lat;
		       for(var i=0;i<this.poiList.length;i++){
		          this.poiList[i].selectedAdd=false;
			   }
			   this.poiList[index].selectedAdd=true;
		       this.getLocationFun(row.point.lng,row.point.lat);
		       this.value[this.address]=row.address.substring(row.address.indexOf("区")+1,row.address.length);
		       this.value[this.longitude]=row.point.lng;
			   this.value[this.latitude]=row.point.lat;
			   if(this.value[this.address]!=null&&this.value[this.address]!=''&&this.value[this.address]!='undefined'){
				   //this.$emit('input',this.value);
			   this.$notify({ message:'选择成功，请保存！', type: 'success' });
			   }else{
				   this.$notify({ message:'地址获取失败！请重新选择', type: 'warning' });
			   }
		    },
		    
		    //根据经纬度获取地址信息
		    getLocationFun(lng,lat){
		       // 创建地理编码实例      
				var myGeo = new BMap.Geocoder();      
				// 根据坐标得到地址描述   
				var that=this;
				myGeo.getLocation(new BMap.Point(lng,lat), function(result){      
				    if (result){      
				       that.value[that.city]=result.addressComponents.city;
				       that.value[that.province]=result.addressComponents.province;
				       that.value[that.district]=result.addressComponents.district;
				    }else{
				       that.$message({ message:'地址解析出错！', type: 'warning' }); 
				    }  
				});
		    },
		    //查询画点
		    pointResultDept(lng,lat){
		         this.map.clearOverlays();
		        var point = new BMap.Point(lng,lat);
				var marker = new BMap.Marker(point);  // 创建标注
				var that=this;
				var opts = {
				  width : 300,     // 信息窗口宽度
				  height: 10,     // 信息窗口高度
				  title :"需要编辑，请搜索或者拖拽标注！" , // 信息窗口标题
				  enableMessage:true,//设置允许信息窗发送短息
				  message:""
				}
				var infoWindow1 = new BMap.InfoWindow("", opts);  // 创建信息窗口对象 
				//var infoWindow2 = new BMap.InfoWindow("地址："+that.addForm.address, { width : 300,height: 10,enableMessage:true,message:""});  // 创建信息窗口对象 
				this.map.openInfoWindow(infoWindow1,point); //开启信息窗口
				marker.enableDragging();
				//开始拖拽时。隐藏信息窗口
				marker.addEventListener("dragstart", function(){          
					that.map.closeInfoWindow();
				});
				//拖拽结束
				marker.addEventListener("dragend", function(type){          
					that.value[that.longitude]=type.point.lng;
					that.value[that.latitude]=type.point.lat;
					that.value[that.address]='';
					that.showPointNew=true;
				});
				/* marker.addEventListener("click", function(){          
					that.map.openInfoWindow(infoWindow2,point); //开启信息窗口
				}); */
				this.map.addOverlay(marker);
		    },
		    //确定标注新的门店
		    surePointNewShop(){
		        this.addressDisable=false;
		        this.getLocationFun(this.value[this.longitude],this.value[this.latitude]);
		        this.$notify({ message:'定位成功！请填写地址信息', type: 'success' });
		        this.$nextTick(function () {
		        this.$refs.focusInput.focus();
		        })
		    },
		    toMng(){
		       self.location='/#/mallm/shop/shopLocation/ShopLocationMng';
		    },  
		/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'shop-location-edit':ShopLocationEdit
		    //'rich-editor':RichEditor,
		   // 'third-map':ThirdMap,
		},
		mounted() {
			this.$nextTick(function () {
			   this.initMap();
            })
            
			//加载下拉列表 如有需要去掉注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>
	#map{
	    width: 100%;height:396px;margin:0;font-family:"微软雅黑";
	}
	#r-result{
	    height:396px;
	    overflow: scroll;
	    overflow-x: visible;
	    padding: 10px;
	    border: 1px solid #e0e0e0;
	}
	.sign{
	   color: #fbfbfb;
	    background-color: #0d2b90;
	    padding: 3px 7px;
	    border-radius: 21px;
	}
	.one_address{
	    border-bottom: 1px solid #cecece;
        line-height: 26px;
        margin-bottom: 7px;
	}
	.one_bg{
	   background-color: #e7f1ff;
	}
    .content{
        position:absolute; 
        width:100%; 
        background-color:#f6f8f9;
        left:0; 
        top:0;
    }
    .smallContent{
        padding: 30px 128px;
    }
    .bigtitle{
       font-size: 26px;
    }
    .main_title{
       color: #44b549;
    }
    .second_tile{
       color: #9a9a9a;
    }
    .titlediv{
       padding: 26px 0px 40px;
    }
    .form_context{
       margin-bottom: 30px;
       background-color: #fff;
       -moz-border-radius: 3px;
       -webkit-border-radius: 3px;
       box-shadow: 0 1px 5px 0 rgba(0,0,0,0.05);
       padding: 40px;
    }
    .form_title{
        font-size: 14px;
	    height: 32px;
	    line-height: 32px;
	    border-bottom: 1px solid #e7e7eb;
	    margin-bottom: 25px;
	    font-weight: normal;
    }
    .form_intro{
        color: #8d8d8d;
	    margin-left: 1em;
	    font-weight: normal;
    }
    .shuomingtext{
      color: #8b8e8e;
      line-height: 24px;
   }
   .shuomingtext_red{
      color: #e25b5b;
      line-height: 24px;
   }
   .bottomdiv{
      border-top: 1px solid #e7e7eb;
      padding-top: 20px;
      text-align: center;
   }
   .point_new{
      color: #4c81af;
      cursor: pointer;
   }
</style>