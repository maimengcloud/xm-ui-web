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
		      <span class="row-span" style="justify-content:center;align-items:center;display:flex;">
		      	<span>{{index+1}},&nbsp;</span>		      	
		      	<span v-show="!!desName" style="height: 35px;">{{o[desName]}}</span> 
				  	<el-popover
						placement="top"
						width="800"
						trigger="click">
						 <el-row class="padding-top"> 
								图片标题：<el-input style="width:90%;" v-model="o[desName]" clearable></el-input>   
						 </el-row>  
						 <el-row class="padding-top">  
								跳转链接：<el-input  style="width:90%;" v-model="o[valueName]" clearable></el-input>  
						 </el-row> 
						 
						 <el-row class="padding-top">  
								扩展信息：<el-input  style="width:90%;" v-model="o['ext']" clearable></el-input>  
						 </el-row> 
						<el-button type="text" slot="reference">编辑</el-button>
					</el-popover>
		      	<i class="el-icon-zoom-in" @click="previewImg(index)"></i>		      	 
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
			<upload-image  :multiple="true" :branch-id="branchId" :dept-id="deptid" :visible="addFormVisible" @cancel="addFormVisible=false" @confirm="handleConfirm"></upload-image>
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
			value(val){
				this.imageLists=val
			},
			imageLists(val){
				this.$emit("input",val)
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
				imageEditVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			selectedImage(index){
				this.selectedImgIndex = index;//注意修改图片url后清空
				this.image=this.imageLists[index]
				this.opflag='edit';
				this.addFormVisible = true;
			},
			 handleConfirm(imgs){ 
				 this.selectedImgIndex=0 
				 this.image=imgs[0] 
				 this.imageLists=imgs.map(i=>{
					 var img= {  ...i  }
					 img[this.urlName]=i.url
					 img[this.desName]=i.remark
					 img[this.valueName]=i.url
					 return img;
				 })
				//this.shearMngVisible=true; 
			},
			//上传64图片后，指定回调父组件的方法,一般用于保存该图片的信息到另一张表
			uploadSuccess(parms){
					
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
				this.$confirm('确认删除吗？', '提示', {}).then(() => {
					this.opflag='del';
					this.selectedImgIndex=index;
					let returnDate = this.imageLists[this.selectedImgIndex];
					this.imageLists.splice(this.selectedImgIndex,1);
					this.$emit('delImg',returnDate);
					
				});
			},
			showEditImage(img,index){
				this.image=img;
				this.imageEditVisible=true;
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
	/* .row-span:before{
	   	content: '*';
	   	color: #fa5555;
	  	margin-right: 4px;
	 } */
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