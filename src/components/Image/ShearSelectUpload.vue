<template>
	<el-row> 
		<el-col :span=20>
			<div id="boxDiv" :class="boxSize">
					<vue-cropper 
						ref="cropper"
						:img="option.img"
						:outputSize="option.size"
						:outputType="option.outputType"
						:info="true"
						:full="option.full"
						:canMove="option.canMove"
						:canMoveBox="option.canMoveBox"
						:fixedBox="option.fixedBox"
						:original="option.original" 
						:autoCrop="option.autoCrop"
						:autoCropWidth="option.autoCropWidth"
						:autoCropHeight="option.autoCropHeight"
						@img-load="imgLoad"
					></vue-cropper> 
			</div>
		</el-col>
		<el-col :span=4>
			<el-row>
				<el-col :span=24>
					<label>等比缩放裁剪边框 </label>
					<br>
					<el-button icon="el-icon-circle-plus-outline" circle @click="plusCjbk"></el-button><el-button icon="el-icon-remove-outline" circle @click="reduceCjbk"></el-button>
					<br>
					<el-button  @click="recoveryCjbk">恢复{{defaultImgWidth +' X '+ defaultImgHeight}}</el-button>
				</el-col>
				
				<el-col  :span=24>
					<br>
					<label>调整画布大小</label>
					<br>
					<el-button  @click="changeCanvasSize('s1')">800 X 600</el-button>
					<br>
					<el-button  @click="changeCanvasSize('s2')">800 X 700</el-button>
					<br>
					<el-button  @click="changeCanvasSize('s3')">800 X 800</el-button>
				</el-col>
				
			</el-row>
		</el-col>
				<div class="test-button">
					<!-- <el-button class="bu_bg"  type="primary" @click="startCrop" v-if="!crap">开始剪切</el-button>
					<el-button class="bu_bg"  type="primary" @click="stopCrop" v-else>停止剪切</el-button> -->
					<el-tooltip class="item" effect="dark" content="清除裁剪后，可以移动图片" placement="top-start">
				     <el-button class="bu_bg" v-if="crap==true"  type="primary" @click="clearCrop">清除裁剪</el-button>
				    </el-tooltip>
				    <el-tooltip class="item" effect="dark" content="为了良好的客户体验，app图片建议控制在50Kb左右，宽400，高300上限，如果是兼容pc的图片，建议宽800，高600为上线" placement="top-start">
				     <el-button class="bu_bg" v-if="crap==false"  type="primary" @click="startCrop">开始裁剪</el-button> 
				    </el-tooltip>
					<el-button class="bu_bg"  type="primary" @click="rotateLeft">左旋</el-button>
					<el-button class="bu_bg"  type="primary" @click="rotateRight">右旋</el-button>
					<!-- <el-button class="bu_bg"  type="primary" @click="finish('base64')">浏览(base64)</el-button>
					<el-button class="bu_bg"  type="primary" @click="finish('blob')">浏览(blob)</el-button> -->
					<el-button class="bu_bg"  type="primary" @click="upload('base64')">完成并上传图片</el-button> 
					<el-tag> 有时候由于网络原因，加载图片会需要3-5秒钟,请耐心等候 </el-tag>  
				</div>
	</el-row>
</template>
	
<script>
//import vueCropper from 'vue-cropper'
import config from '@/common/config';//全局公共库import 
import { uploadBase64 } from '@/api/mdp/arc/image'; 
import screenfull from 'screenfull'

export default {
  props:['branchId','image','categoryId','remark','imgWidth','imgHeight','deptid','visible','storedb','fullscreen'],
  watch:{
	  'imgWidth':function(val){
			this.option.autoCropWidth = val;
		},
		'imgHeight':function(val){
			this.option.autoCropHeight = val;
		},
		'visible':function(val){
			if(val==true){  
		        
			}
		},
		'image':function(image) {
	        this.selectImg = image;
	        this.option.img=this.converUrl(image.url);
	        this.option.autoCropWidth=this.defaultImgWidth
			this.option.autoCropHeight=this.defaultImgHeight
			//this.imgLoading=true		        
	        //this.$refs.cropper.reload()
	    }
  },
  data: function () {
    return { 
				model: false,
				modelSrc: '',
			  	crap: false,
				previews: {},
				lists: [
					{
						/* img: 'http://ofyaji162.bkt.clouddn.com/touxiang.jpg' */
					},
					{
						/* img: 'https://o90cnn3g2.qnssl.com/0C3ABE8D05322EAC3120DDB11F9D1F72.png' */
					}
				],
				boxSize:"s1",
				option: {
					img: '',
					size: 1,
					full: false,
					outputType: 'png',
					canMove: true,
					fixedBox: false,
					original: false,
					canMoveBox: true,
					autoCrop: true,
					autoCropWidth: this.imgWidth,
					autoCropHeight: this.imgHeight,
				},
				downImg: '#',
				selectImg:{categoryId:''}, 
				imgLoading: false
	    }
	  },
	methods: {
		converUrl(url){
	    	 if(url!='' && url!=null && !url.indexOf('http')==0 && !url.indexOf('www')==0  && !url.indexOf('data:image/')==0){
	    		 return config.getArcImagePath()+"/"+url;
	    	 }
	    	 return url;
		},
		changeImg () {
			this.option.img = this.lists[~~(Math.random() * this.lists.length)].img
		},
		startCrop (reload) {
			// start 
			this.crap = true
			if(this.imgWidth== undefined ){
				this.option.autoCropWidth=600
			}else{
				this.option.autoCropWidth=this.imgWidth
			}
			if(this.imgHeight== undefined ){
				this.option.autoCropHeight=600
			}else{
				this.option.autoCropHeight=this.imgHeight 
			} 
			this.$refs.cropper.startCrop()
			if(reload!=false){
				this.$refs.cropper.reload()
			}
			
		},
		stopCrop () {
			//  stop
			this.crap = false
			this.$refs.cropper.stopCrop()
		},
		clearCrop () {
			// clear
			this.$refs.cropper.clearCrop()
			this.stopCrop ()
		},
		refreshCrop () {
			// clear
			this.$refs.cropper.refresh()
		},
		changeScale (num) {
			num = num || 1
			this.$refs.cropper.changeScale(num)
		},
		rotateLeft () {
			this.$refs.cropper.rotateLeft()
		},
		rotateRight () {
			this.$refs.cropper.rotateRight()
		},
		finish (type) {
			// 输出
			// var test = window.open('about:blank')
			// test.document.body.innerHTML = '图片生成中..'
			if (type === 'blob') {
				this.$refs.cropper.getCropBlob((data) => {
					var img = window.URL.createObjectURL(data)
					this.model = true
					this.modelSrc = img
				})
			} else {
				this.$refs.cropper.getCropData((data) => {
					this.model = true
					this.modelSrc = data
				})
			}
		},
		//调整画布大小
		changeCanvasSize(val){
			this.boxSize=val
		},
		// 实时预览函数
		realTime (data) {
			this.previews = data
		},
		plusCjbk(){ 
			if(this.crap==false){
				this.$message({ message: "请先开始裁剪", type: "warning" });
				return;
			} 
			if(this.option.autoCropWidth+this.defaultImgHeight*0.1>800){
				this.$message({ message: "不能再放大", type: "warning" });
				return;
			}
			if(this.option.autoCropHeight+this.defaultImgHeight*0.1>800){
				this.$message({ message: "不能再放大", type: "warning" });
				return;
			}

			this.option.autoCropWidth=this.option.autoCropWidth+this.defaultImgWidth*0.1
			this.option.autoCropHeight=this.option.autoCropHeight+this.defaultImgHeight*0.1 
			this.$refs.cropper.reload()
		}, 
		reduceCjbk(){
			if(this.crap==false){
				this.$message({ message: "请先开始裁剪", type: "warning" });
				return;
			}
			 
			if(this.option.autoCropWidth-this.defaultImgWidth*0.1<=0){
				this.$message({ message: "不能再缩小", type: "warning" });
				return;
			}
			if(this.option.autoCropHeight-this.defaultImgHeight*0.1<=0){
				this.$message({ message: "不能再缩小", type: "warning" });
				return;
			}
			this.option.autoCropWidth=this.option.autoCropWidth-this.defaultImgWidth*0.1
			this.option.autoCropHeight=this.option.autoCropHeight-this.defaultImgHeight*0.1  
			this.$refs.cropper.reload()
		},
		recoveryCjbk(){
			if(this.crap==false){
				this.$message({ message: "请先开始裁剪", type: "warning" });
				return;
			}
			 
			 
			this.option.autoCropWidth=this.defaultImgWidth
			this.option.autoCropHeight=this.defaultImgHeight 
			this.$refs.cropper.reload()
		},
		finish2 (type) {
			this.$refs.cropper2.getCropData((data) => {
				this.model = true
				this.modelSrc = data
			})
		},
		finish3 (type) {
			this.$refs.cropper3.getCropData((data) => {
				this.model = true
				this.modelSrc = data
			})
		},
		upload (type) {
			// event.preventDefault()
			/* var aLink = document.createElement('a')
			aLink.download = 'demo' */
			// 输出
			var params={branchId:this.branchId ,categoryId: this.categoryId, fileData: '',  remark: this.remark,name:'',deptid:this.deptid}
			if(this.storedb){
				params.storedb=this.storedb
			}else{
				if(this.selectImg.storedb){
					params.storedb=this.selectImg.storedb
				}
			}
			//var parm= this.$options.computed.uploadParams();
			if(params.categoryId==''||params.categoryId==undefined){
				this.$message({ message: "分类不能为空", type: "warning" });
				return;
			}
			if (type === 'blob') {
				this.$refs.cropper.getCropBlob((data) => {
					/* this.downImg = window.URL.createObjectURL(data)
					aLink.href = window.URL.createObjectURL(data)
					aLink.click() */
					alert("请上传64base");
				})
			} else {
				this.$refs.cropper.getCropData((data) => {
					params.fileData=data;
					var baseStr=data.substring(data.indexOf('base64,')+'base64,'.length);
					var eqTagIndex=baseStr.indexOf("=");
					baseStr=eqTagIndex!=-1?baseStr.substring(0,eqTagIndex):baseStr;
					var strLen=baseStr.length;
					var fileSize=parseInt((strLen-(strLen/8)*2)/1024);
					if(fileSize>110 && fileSize<1100){
						this.$confirm('图片大小为'+fileSize+'kb,超出建议值, 是否继续?', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					        	params.name=this.selectImg.name+this.selectImg.fileSuffix; 
								uploadBase64(params).then(res=>{
							        	 if(res.data.tips.isOk){
							        		//返回触发父组件的方法
							        		//this.clearCrop ();
							        		var image = res.data.data;
							        		//this.refreshCrop ();
							        		this.$emit('upload-success',image);
							        	}else{
							        		this.$message({ message: "上传错误", type: "warning" });
							        	}  
							        }).catch(()=>{
							        	this.$message.warning("上传失败");
							        });
					        }).catch(() => {
					          this.$message({
					            type: 'info',
					            message: '已取消'
					          });          
					        });
					}else{
						if(fileSize<=110){
							params.name=this.selectImg.name+this.selectImg.fileSuffix; 
							uploadBase64(params).then(res=>{
						        	 if(res.data.tips.isOk){
						        		//返回触发父组件的方法
						        		//this.clearCrop ();
						        		var image = res.data.data;
						        		//this.refreshCrop ();
						        		this.$emit('upload-success',image);
						        	}else{
						        		this.$message({ message: "上传错误", type: "warning" });
						        	}  
						        }).catch(()=>{
						        	this.$message.warning("上传失败");
						        });
						}else{
							this.$message({ message: "图片太大,不允许上传，请重新裁剪后上传", type: "warning" });
						}
						
					} 
					
				        //this.$emit('getInfo',this.params);
					/* this.downImg = data
					aLink.href = data
					aLink.click() */
				});
			}
		},
		imgLoad(info){
			this.imgLoading=false
			if(info=='success'){
				this.$message({ message: "加载图片成功", type: "success" });
			}else{
				this.$message({ message: "加载图片失败", type: "error" });
			}
			
		},
		uploadImg (e, num) {
			//上传图片
			// this.option.img
			var file = e.target.files[0]
			if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
				 alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
				 return false
			 }
			var reader = new FileReader()
			reader.onload = (e) => {
				let data
				if (typeof e.target.result === 'object') {
					// 把Array Buffer转化为blob 如果是base64不需要
					data = window.URL.createObjectURL(new Blob([e.target.result]))
				} else {
					data = e.target.result
				}
				if (num === 1) {
					this.option.img = data
				} else if (num === 2) {
					this.example2.img = data
				}
			}
			// 转化为base64
			// reader.readAsDataURL(file)
			// 转化为blob
			reader.readAsArrayBuffer(file)
		},
		fuselect(){
			this.$emit('confirmSelect');
		},
		imgLoad (msg) {
			console.log(msg)
		},
		handleSuccess(res,file) {
			//var jsonData = JSON.stringify(res, null, 4);
			//alert(jsonData);
			/* var tips= res.tips;
			if(tips.isOk){
				this.$message({ message: '上传成功', type: 'info' });
				
			}else{
				if(tips.msg=='该图片不支持'){
				this.$message({ message: '该图片不支持', type: 'info' });
				}else{
				this.$message({ message: '未知异常', type: 'info' });
				}
			} */
		
		  } 
	},
	components: {
		//'vue-cropper':vueCropper,
	},
	mounted () {
		//this.changeImg()
		// hljs.configure({useBR: true})
		/* var list = [].slice.call(document.querySelectorAll('pre code'))
		list.forEach((val, index) => {
		  hljs.highlightBlock(val)
		}) */
        this.selectImg = this.image;
        this.option.img=this.converUrl(this.image.url);
        this.startCrop(false);
        this.imgLoading=true		        
	},
	 computed:{ 
		 defaultImgWidth: function(){
				let defaultImgWidth=600;
				if(this.imgWidth== undefined ){
					defaultImgWidth=600
				}else{
					defaultImgWidth=this.imgWidth
				}
				return defaultImgWidth;
		 },
		 defaultImgHeight: function(){ 
				let defaultImgHeight=600; 
				if(this.imgHeight== undefined ){
					defaultImgHeight=600
				}else{
					defaultImgHeight=this.imgHeight 
				} 
				return defaultImgHeight;
		 }
	}
}
</script>

<style>
  * {
	  margin: 0;
		padding: 0;
	}

	.content {
		margin: auto;
		max-width: 1200px;
		margin-bottom: 100px;
	}

	.test-button {
		padding-top: 30px;
		clear: both;
		display: flex;
		flex-wrap: wrap;
	}

	.btn {
		display: inline-block;
		line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c0ccda;
    color: #1f2d3d;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin:20px 10px 0px 0px;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    transition: all .2s ease;
		text-decoration: none;
		user-select: none;
	}

	.des {
		line-height: 30px;
	}

	.show-info {
		margin-bottom: 50px;
		text-align: left;
	}

	.show-info h2 {
		line-height: 50px;
	}

	/*.title, .title:hover, .title-focus, .title:visited {
		color: black;
	}*/


	
	.s1 {
	  height: 600px;
	  width:800px;
	  float: left;
	}
	.s2 {
	  height: 700px;
	  width:800px;
	  float: left;
	}
	.s3 {
	  height: 800px;
	  width:800px;
	  float: left;
	}
	.app {
	  height: 300px;
	  width:400px;
	  float: left;
	}
	.show-preview{
		float: left;
	}

	.model {
		position: fixed;
		z-index: 10;
		width: 100vw;
		height: 100vh;
		overflow: auto;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.8);
	}

	.model-show {
		display: flex;
	    justify-content: center;
	    align-items: center;
		width: 100vw;
		height: 100vh;
	}

	.model img {
		display: block;
		margin: auto;
		max-width: 80%;
		user-select: none;
		background-position: 0px 0px, 10px 10px;
		background-size: 20px 20px;
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
	}

	.c-item {
		display: block;
		padding: 10px 0;
		user-select: none;
	}
	.bu_bg{
	    color: #ffffff;
    background-color: #50c0fe;
    border-color: #50c0fe;
        height: 32px;
            margin-left: 10px;
	}


</style>
