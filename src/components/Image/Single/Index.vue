<template>
	<section>
	
		<el-col :span="8" >
		    <el-card :body-style="{ padding: '0px' }">
		      <div class="avatar-uploader" @click="showAdd">
		      	<div style="height: 178px;width: 186px;display: flex;">
			       	<img v-if="imageUrl!='' && imageUrl!=undefined" :src="imageUrl" class="avatar">
			       	<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			    </div>
		      </div>
		      <span class="row-span" v-if="showTitle"><slot name="title" ></slot><i class="el-icon-zoom-in" @click="previewImg"></i></span>
		    </el-card>
		</el-col>
		<el-dialog title="裁剪图片" :visible.sync="shearMngVisible" top="0px"  width="1100px"  :lock-scroll="false"  :close-on-click-modal="false" append-to-body> 
		<shear-mng :visible="shearMngVisible" :imgWidth="myWidth" :imgHeight="myHeight" :image="image" :branch-id="branchId" :deptid="deptid" :category-id="image.categoryId" :remark="remark" @cancel="shearMngVisible=false" @upload-success="uploadSuccess"></shear-mng>
		</el-dialog>
		<el-dialog title="选择图片" :visible.sync="addFormVisible"  width="70%" :close-on-click-modal="false" append-to-body>
			<upload-image :branch-id="branchId" :deptid="deptid" :visible="addFormVisible" @cancel="addFormVisible=false" @confirm="handleConfirm"></upload-image>
		</el-dialog>
		<el-dialog :visible.sync="previewVisible" append-to-body>
  			<img width="100%" :src="imageUrl" alt>
		</el-dialog>
		
	</section>
</template>
 
<script>
	import util from '@/common/js/util';//全局公共库
	import UploadImage from '../UploadImage';
	import ShearMng from '../ShearSelectUpload';
	import config from '@/common/config';//config
	
	export default {
		props:['branchId','categoryId','remark','value','imgWidth','imgHeight','deptid','showTitle'],
		watch: {
			'value':function(val){
				this.imageUrl = this.converUrl(val);
			},
			'imgWidth':function(val){
				this.myWidth = val;
			},
			'imgHeight':function(val){
				this.myHeight = val;
			}
	    },	
		data() {
			return {
				addFormVisible:false,
				shearMngVisible:false,
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				image:{categoryId:'123'},
				imageUrl:'', 
				previewVisible:false,
				myWidth:this.imgWidth,
				myHeight:this.imgHeight//80||178
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			showAdd: function () {
				this.addFormVisible = true;
			},
			 handleConfirm(img){
				this.image=Object.assign(img);
				//this.shearMngVisible=true;
				this.uploadSuccess(this.image);
			},
			//上传64图片后，指定回调父组件的方法,一般用于保存该图片的信息到另一张表
			uploadSuccess(parm){
					this.$emit('input',parm.url);
					this.imageUrl = this.converUrl(parm.url);
					this.shearMngVisible=false;
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/			
			converUrl(url){
				if(url==null||url==''||url=='undefined'){
					return url;
				}
		    	 if(!url.indexOf('http')==0 && !url.indexOf('www')==0){
		    		 return config.getArcImagePath()+"/"+url;
		    	 }
		    	 return url;
			},
			previewImg(){
				this.previewVisible=true;
			}
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'image-edit':ImageEdit
			'upload-image':UploadImage,
			'shear-mng':ShearMng
		},
		/* computed:{
			cWidth:function(){
				return this.imgWidth;
			},
			cHeight:function(){
				return this.imgHeight;
			}
		}, */
		mounted() {
			this.imageUrl = this.value;
		}
	}

</script>

<style scoped="scoped">
/*做一个选择上传组件。
1，可选择图片后回归到该组件，进行剪切，然后上传
*/  
.avatar-uploader{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 175px;
    height: 175px;
    line-height: 175px;
    text-align: center;
  }
  .avatar {
    /* width: 178px;
    height: 178px;
    width: width+'px';
    height: height+'px'; */
    max-height: 100%;
   	max-width: 100%;
   	margin: auto;
    display: block;
  }
 /* card图片 */ 
	.time {
	  	font-size: 13px;
	  	color: #999;
	}
	.bottom {
	  	margin-top: 13px;
	  	line-height: 12px;
	}
	.button {
		padding: 0;
		float: right;
	}
	.el-col-8 {
	    width: 210px;
	    margin-right: 10px;
	}
	.el-row{
		padding-left: 70px;
	}
	.row-span{
	   	font-size: 14px;
	  	color: #5a5e66;
	  	text-align: center;
	  	display:block;
	 }
	.row-span:before{
	   	content: '*';
	   	color: #fa5555;
	  	margin-right: 4px;
	 }
	.el-icon-zoom-in:hover{
		color: #0043ff;
	}
	.avatar-uploader img{
		cursor: pointer;  
	    transition: all 0.6s;  
	}
	.avatar-uploader img:hover{  
        transform: scale(1.2);  
    }   
</style>