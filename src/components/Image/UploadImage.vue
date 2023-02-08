<template>
<section>
	<el-row v-loading="listLoading">
		<el-col :span="6" class="border"> 
			<category-tree ref="categoryTree" :show-count="false" show-checkbox  :default-expand-all="true" :expand-on-click-node="false"  v-on:check-change="handleLeftCategoryNodeClick"></category-tree> 
		</el-col>
		<el-col :span="18">
			<el-row class="padding-left " style="height:36px;overflow: hidden;">
 					<el-input v-model="filters.key" style="width:40%;" placeholder="按文件名模糊查询"></el-input>
					<el-button @click="searchImages" icon="el-icon-search"></el-button> 
					<el-button type="primary" @click="handleConfirm">确定选择</el-button>
						<el-upload style="height:40px;width:120px;display: inline;margin-bottom: 0px;" :disabled="uploadOptions.categoryId==''||uploadOptions.categoryId==null" class="upload-demo"  :show-file-list="false" :action="uploadAction" :on-change="fileChange" :on-success="handleSuccess" :before-upload="beforeupload" :data="uploadOptions" multiple>
							<el-tooltip class="item" effect="dark" :content="uploadOptions.categoryId==''?'请先选择左边分类':'支持jpg和png,建议大小不超过200KB，超过1M将自动裁剪压缩'" placement="top-start">
								<el-button  icon="el-icon-upload">上传图库</el-button>
								</el-tooltip>
							
						</el-upload>   
						<el-button  type="danger" @click="handelDel" >删除</el-button>  

			</el-row> 
			<el-row class="padding-left">
				<el-col :span="24"  type="flex" class="allImg border padding">
					  <el-col :span="4"  v-for="o in images" style="height:200px;width:200px;" :key="o.id" class="imgBox">
					    <el-card :body-style="{ padding: '0px' }">
					    	
					    	<div style="width:100%;position:relative;" :index="o.url"  v-on:click="selectImg(o)"> 
					    		<div class="blank" v-show="o.show">
					    			<div class="black_blank"></div>
						    		<div class="select_blank"></div>
					    		</div>
					    		<img :src="converUrl(o.url)" class="image">
					    	</div>
					    	<div style="height:18px;width:100%;position:relative;">
					     	 <span>{{o.name}}</span>
					      	</div>
					    </el-card>
					  </el-col>
				</el-col>
			</el-row> 
			<el-pagination  layout="total, sizes, prev,pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
			</el-pagination> 
	    </el-col>	
	</el-row> 
</section>
</template>

<script>
	import { listImage,batchDelImage } from '@/api/mdp/arc/image';
	import config from '@/common/config';//全局公共库import 
	import { listImageCategory,addImageCategory } from '@/api/mdp/arc/imageCategory';
    import  ImageCategoryTree from './ImageCategoryTree'; //树
 	import { mapGetters } from 'vuex'
	 
	
  	export default {
  	computed: {
		    ...mapGetters([
		      'userInfo','token'
		    ])
		},
  	props:['branchId','remark','value','deptid','visible','imgWidth','imgHeight','storedb','multiple'],
  	watch:{
  		'visible':function(visible) {   
	      }
  	},
    data() {
      return {
      	uploadAction: config.getArcImagePath()+"/arc/image/upload", 
        filters: {
					key: ''
				}, 
		images: [],
        categorys: [],//查询结果
        pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					count:false,
					orderFields:['create_date'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
		selectImages: [],	 
		listLoading: false,//查询中...		
		uploadOptions:{branchId:this.branchId,categoryId:'',fileName:'',remark:'',deptid:this.deptid,storedb:true},//当前选择上传图片的类型
		shearMngVisible:false,
		showAddCategoryForm: false,
		categoryName: '',//分类名称
		isPub:'',
		treeId:'',
		isPubs:'', 
      }
    },
    methods:{
    	getImageCategorys(){
    		let params = {
    				//jsessionid: this.jsessionid
				};
    		if(this.branchId){
				params.branchId = this.branchId;
        	}else{
        		this.$message({ message: '请先选择分类，如果分类为空，请联系管理员添加分类', type: 'error' });
        		return;
        	}
				this.listLoading = true;
				listImageCategory(params).then((res) => {
				var ttips=res.data.tips;
					if(ttips.isOk){ 
						this.categorys = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '通讯异常', type: 'error' });
				});
    	}, 
    	// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
		sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getImageCategorys();
		},
		selectImg(image){
			if(image.show==true){
				image.show=false;
				this.selectImages=this.selectImages.filter(i=>i.id!=image.id)
 			}else{
				if(!this.multiple){
					this.images.forEach(i=>{
						if(i.id!=image.id){ 
							i.show=false
						}else{
							i.show=true
							image.show=true
							this.selectImages=[];
							this.selectImages.push(Object.assign(image))
 						}
					});
				}else{ 
					image.show=true 
					this.selectImages.push(Object.assign(image))
 				} 
			}
			
			
			//this.$emit('row-click',row, event, column);
			//this.selectImages=url;
			
		},
		handleSuccess(res,file) {
			//var jsonData = JSON.stringify(res, null, 4);
			var tips= res.tips;
			if(tips.isOk){
				this.$message({ message: '上传成功', type: 'success' });
				this.getImages(); 
			}else{
				if(tips.msg=='该图片不支持'){
				this.$message({ message: '该图片不支持', type: 'info' });
				}else{
				this.$message({ message: '未知异常', type: 'error' });
				}
			}
		
		  },
		  categoryChange(index,indexPath){ 
			  console.log(index);
			 	this.uploadOptions.categoryId = index;
 			 	this.pageInfo.pageNum=1;
				this.pageInfo.total=0;
			  	this.getImages();
		  },
		  beforeupload(file){ 
			  if(this.uploadOptions.categoryId=='' || this.uploadOptions.categoryId==null){
				  	this.$message({ message: "请选择分类", type: "warning" }); 
				  	return false;
				  	}
			    if(file.size<=1024*2024){//1M
			    	this.$message({ message: '小于2M的文件可直接上传图片库', type: 'success' });
			    	return true;
			    }else{
			    	this.$message({ message: '为了良好的客户体验，大于2M的文件需经过裁剪压缩处理', type: 'warning' });
			    	return false;
			    }
			  	
				
			  },
		  fileChange(file, fileList) {
			    var that = this;
			    //this.imageUrl = URL.createObjectURL(file.raw);
			    if(file.raw.size<=1024*1024){//1M
			    	//this.$message({ message: '小于1M的文件可直接上传图片库', type: 'success' });
			    	return true;
					} 
					return true;
				},
				
		  fileChangeForShear(file, fileList) {
			    var that = this;
			    var reader = new FileReader();
 			    reader.readAsDataURL(file.raw); 
			    reader.onload = function(e){ 
			       // this.result // 这个就是base64编码了
 			       let image={
			    		   url:this.result,
			    		   branchId:that.branchId,
			    		   categoryId:that.uploadOptions.categoryId,
			    		   name:file.name,
			    		   fileSuffix:'',
			    		   storedb:'1'//是否将文件信息插入数据库表，以便可以在素材库查询
			       }
			        that.selectImages = image;
			       that.shearMngVisible=true
			    }
			  },
		  getImages() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total
				}; 
				
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					params.key="%"+this.filters.key+"%"
				}else{
					//params.xxx=xxxxx
				}
				if(this.uploadOptions.categoryId!='全部' && this.uploadOptions.categoryId!=''&&this.uploadOptions.categoryId!=null){
					params.categoryId=this.uploadOptions.categoryId;
				}
				//params.jsessionid=this.jsessionid;
				this.listLoading = true;
				if(this.branchId == undefined || this.branchId== ''){
					this.$message({ message: '机构不能为空', type: 'warning' });
					return;
	        	}
				params.branchId = this.branchId;
				this.selectImages=[];
				this.listLoading = true;
				listImage(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						var imagesList=res.data.data;
						this.pageInfo.count=false;
						imagesList.forEach(i=>i.show=false);
						this.images = imagesList;
 						//在获取图片的时候，对url进行转换
						/* this.converUrl(this.images); */
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '通讯异常', type: 'error' });
				});
			},
			converUrl(url){
		    	 if(url!='' && url!=null  && !url.indexOf('http')==0 && !url.indexOf('www')==0){
		    		 return config.getArcImagePath()+"/"+url;
		    	 }
		    	 return url;
			},
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.total=0;
				this.pageInfo.pageNum=1;
				this.getImages();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getImages();
			},
			searchImages(){
				this.pageInfo.total=0;
				this.pageInfo.pageNum=1;
				this.pageInfo.count=true;
				this.getImages();
			},
			handleCancel:function(){
				this.selectImages=[]
				this.$emit('cancel');
			},
			handleConfirm(){
				if(this.images==null || this.images.length==0){
					this.$message({ message: '请选择图片', type: 'error' });
					return
				}
				if(this.selectImages==null || this.selectImages.length==0){
					this.$message({ message: '请选择图片', type: 'error' });
					return
				}
				if(this.multiple){
					this.$emit('confirm',this.selectImages);
				}else{
					this.$emit('confirm',this.selectImages[0]);
				} 
				this.selectImages=[]
				this.$emit('cancel');
			},
			uploadSuccess(image){   
				this.$emit('upload-success',image);
				this.shearMngVisible=false; 
				this.searchImages();
			},
			showAddCategory(){
				this.showAddCategoryForm=true
			},
			handleAddCategoryForm: function(){
				
				let params = {
					//branchId:this.userInfo.branchId,
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count: this.pageInfo.count,
					categoryName:this.categoryName,
					pid:this.treeId,
					branchId:this.branchId,
					isPub:this.isPubs,
					
				};
				if(this.categoryName==''){
					this.$message({ message: '请输入分类名字', type: 'error' });
					return
				}
				addImageCategory(params).then(res=>{
					if(res.data.tips.isOk){
						this.showAddCategoryForm=false
						this.getImageCategorys()
					}else{
						this.$message({ message: res.data.tips.msg, type: 'error' });
					}
				})
			},
			rowClick: function(row, event, column){
 				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			handleLeftCategoryNodeClick( ) { 
				var nodes=this.$refs.categoryTree.$refs.nodeTree.getCheckedNodes();  
				var node=null;
				if(nodes.length>0){ 
					node=nodes[0] 
					this.category=node;
					this.uploadOptions.categoryId=node.id;
				} else{  
					this.uploadOptions.categoryId="";
					this.category=null;
				} 
				this.searchImages();
			},
			handelDel(){
				if(this.selectImages.length==0){
					this.$message({ message:"请选择要删除的图片", type: 'error' });
					return;
				}else{
					batchDelImage(this.selectImages).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.getImages();
						}
						this.$message({ message: res.data.tips.msg, type: tips.isOk==true?'success':'error' });
					})
				}
			}
    },
    components: {
"category-tree": ImageCategoryTree, 
		    //在下面添加其它组件
		}, 
	mounted() { 
				//this.getImageCategorys();   
				this.getImages();
		}
    
  }
</script>

<style>
.uploadImgWindow{
	height: 500px; 
	border: 1px solid #eee;
	text-align: center;
	color: #333;
}
.leftBox{
	height:100%;
	border-right: 1px solid #ccc;
}
.rightBox{
	height:100%;
	overflow:hidden;
}
.allImg{
	height:400px;
	overflow-y :auto;
}
.windowTitle{
    border-bottom: 1px solid #ccc;
    height: 45px;
    line-height: 42px;
    text-align: right;
    padding-right:20px;
    margin-bottom: 2px;
}
.bottomBox{
	text-align:center;
	padding:15px;
}

  .el-row {
   flex-wrap: wrap;
    margin-bottom: 6px;
  }

  ul>li{
  	text-align:left;
  }
  
  .el-row>.imgBox{
  	width:200px;
  	height:200px;
  }
	.blank{
		position:relative;
	}
  .black_blank{
  	position: absolute;
    top: 0;
    left: 0;
	background:rgba(0,0,0,.6);
    width: 100%;
    height: 160px;
    vertical-align: middle;
    display: inline-block;
  } 
  .select_blank{
  	position: absolute;
    top: 0;
    left: 0;
    background: transparent url(../../assets/image/selected_image.png) no-repeat 0 0;
    width: 100%;
    height: 80px;
    vertical-align: top;
    display: inline-block;
    background-position: 50% 70%;
  }
  
  .image {
    max-width: 200px;
    max-height:160px;
  }
  .info{
  	width:100%;
  	padding-top:3px;
  	line-height:20px;
  }	
  .windowTitlefistchild{
    text-align: left;
   	padding-left: 12px;
  }

</style>