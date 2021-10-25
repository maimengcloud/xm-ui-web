<template>
	<section>
	<div class="SpeListOverFlow">
		<draggable v-model="imageLists" :options="{group:'img'}" @start="drag=true" @end="drag=false">
		<el-col :span="8" v-for="(o, index) in imageLists" :key="index">
		    <el-card :body-style="{ padding: '0px' }">
		      <div class="avatar-uploader" @click="selectedImage(index)">
		      	<div style="height: 178px;width: 186px;display: flex;">
			       	<img v-if="getUrl(o)" :src="converUrl(o)" class="avatar">
			       	<i v-else class="el-icon-plus avatar-uploader-icon"></i> 
			     </div>  	
		      </div>
		      <span class="row-span">
		      	<span>{{index+1}}&nbsp;</span>
		      	<span v-if="valueName!=''">{{o[valueName]}}</span><i class="el-icon-zoom-in" @click="previewImg(index)"></i>
		      	 <el-button type="text" class="button" @click="delImg(index)">删除</el-button>
		      </span>
		    </el-card>
		</el-col>
		</draggable>
		<el-col :span="8" v-if="showAdd=='true'">
		    <el-card :body-style="{ padding: '0px' }">
		      <div style="padding: 14px;" class="avatar-uploader" @click="addImg">
			       	<i class="el-icon-plus avatar-uploader-icon"></i>
		      </div>
		    </el-card>
		</el-col>
		<el-dialog title="裁剪图片" :visible.sync="shearMngVisible" top="0px"  width="1100px"  :lock-scroll="false"  :close-on-click-modal="false" append-to-body> 
		<shear-mng :visible="shearMngVisible" :imgWidth="imgWidth" :imgHeight="imgHeight" :image="image" :branch-id="branchId" :deptid="deptid" :category-id="image.categoryId" :remark="remark"  @cancel="shearMngVisible=false" @upload-success="uploadSuccess"></shear-mng>
		</el-dialog>
		<el-dialog title="选择图片" :visible.sync="addFormVisible"  width="70%" :close-on-click-modal="false" append-to-body>
			<upload-image :branch-id="branchId" :dept-id="deptid" :visible="addFormVisible" @cancel="addFormVisible=false" @confirm="handleConfirm"></upload-image>
		</el-dialog>
		<el-dialog :visible.sync="previewVisible" append-to-body>
  			<img width="100%" :src="imageUrl" alt>
		</el-dialog>
		</div>
	</section>
</template>
 
<script>
	import util from '@/common/js/util';//全局公共库
	import UploadImage from '../UploadImage';
	import ShearMng from '../ShearSelectUpload';
	import draggable from 'vuedraggable';
	import config from '@/common/config';//config
	
	export default {
		props:['branchId','categoryId','remark','showAdd','limit','urlName','desName','value','valueName','deptid','imgWidth','imgHeight'],
		watch: {
			'value':function(val){
				this.imageLists = val;
			},
			'imageLists':function(val){
				this.$emit('input',val);
			}
	    },	
		data() {
			return {
				addFormVisible:false,
				shearMngVisible:false,
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				image:{categoryId:''},
				imageUrl:'', 
				previewVisible:false,
				imageLists:[],//存放图片信息的数组 {urlName:,desName:,opflag:add/del/edit,order:}
				selectedImgIndex:this.value.length,
				opflag:'',//add/del/edit
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			selectedImage(index){
				this.selectedImgIndex = index;//注意修改图片url后清空
				this.opflag='edit';
				this.addFormVisible = true;
			},
			 handleConfirm(img){
				this.image=img;
				this.uploadSuccess(this.image)
				console.log(this.image);
				//this.shearMngVisible=true; 
			},
			//上传64图片后，指定回调父组件的方法,一般用于保存该图片的信息到另一张表
			uploadSuccess(parm){
					//商品相册中，过滤添加图片和修改图片,获取图片url添加到该集合的指定url中
				if(this.opflag=='edit'){
					this.imageLists[this.selectedImgIndex][this.urlName] = parm.url;    //该方式修改图片后是否不会立即显示url。
					//this.$emit('input',this.imageLists);
					this.$emit('editImg',this.imageLists[this.selectedImgIndex]);
					this.shearMngVisible=false; 
				}else if(this.opflag=='add'){
					//在此处为添加按钮
						  //获取添加图片的信息,并且添加，删除是同时删除数据
					var g={};
					g[this.urlName]=parm.url;
					if(this.desName!=null&&this.desName!=''&&this.desName!='undefined'){
					g[this.desName]=parm.remark;
					}
					    this.imageLists.push(g);
						this.shearMngVisible=false;
						this.$emit('addImg',g);
						//this.$emit('input',this.imageLists);		
				}
				//商品相册可以修改图片和添加图片
					 /*this.imageUrl = this.converUrl(parm.url);
					this.shearMngVisible=false; */
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/			
			converUrl(o){
		    	 if(!o[this.urlName].indexOf('http')==0 && !o[this.urlName].indexOf('www')==0){
		    		 return config.getArcImagePath()+"/"+o[this.urlName];
		    	 }
		    	 return o[this.urlName];
			},
			getUrl(o){
				if(o[this.urlName]!='' && o[this.urlName]!=undefined){
					return true;
				}
				return false;
			},
			previewImg(index){
				var o=this.imageLists[index];
				this.imageUrl=this.converUrl(o);
				this.previewVisible=true; 
			},
			addImg(){
				if(parseInt(this.limit)<=this.imageLists.length){
					this.$message({ message: "图片数量已经超过", type: 'error' });
					return;
				}
				this.addFormVisible = true;
				this.opflag='add';
			},
			delImg(index){
				this.$confirm('数据将不可恢复,确认删除吗？', '提示', {}).then(() => {
					this.opflag='del';
					this.selectedImgIndex=index;
					this.$emit('delImg',this.imageLists[this.selectedImgIndex]);
					this.imageLists.splice(this.selectedImgIndex,1);
				});
			}
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'image-edit':ImageEdit
			'upload-image':UploadImage,
			'shear-mng':ShearMng,
			draggable
		},
		mounted() {
			this.imageLists = this.value;
		}
	}

</script>

<style scoped="scoped">
/*做个支持多个图片上传，可移动，通用性好的组件
1，imageList的url,获取list遍历，装载list的url
2，addImg方法
*/  
.avatar-uploader{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 208px;
    height: 200px;
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
 .avatar {
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
    .SpeListOverFlow{
    overflow-y: auto;
    max-height: 550px;
  }   
</style>