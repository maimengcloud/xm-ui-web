<template>
	<div>
        <quill-editor  style="width:100%;" v-model="content"
                      :options="editorOption"
                      :id="id"
                      ref="myTextEditor"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)">
          <div :id="id+'_toolbar'" slot="toolbar">
            <!-- Add a bold button -->
            <button class="ql-bold">Bold</button>
            <button class="ql-italic">Italic</button>
            <button class="ql-underline">Underline</button>
            <button class="ql-strike">Strike</button> 
            <button class="ql-header" value="1"></button>
            <button class="ql-header" value="2"></button>
            <button class="ql-header" value="3"></button> 
            <button class="ql-indent" value="+1"></button>
            <button class="ql-indent" value="-1"></button> 
            <button class="ql-direction" value="rtl"></button> 
            <!-- Add font size dropdown -->
            <select class="ql-size ql-picker">
              <option value="small"></option>
              <!-- Note a missing, thus falsy value, is used to reset to default -->
              <option selected></option>
              <option value="large"></option>
              <option value="huge"></option>
            </select>
            <select class="ql-font">
              <option selected="selected"></option>
              <option value="serif"></option>
              <option value="monospace"></option>
            </select>
            <select class="ql-color"> 
            </select>
            <select class="ql-background"> 
            </select>
            <!-- Add subscript and superscript buttons -->
            <button class="ql-script" value="sub"></button>
            <button class="ql-script" value="super"></button> 
            <button class="ql-link">链接</button> 
            <button class="ql-video">视频</button>
            <!-- You can also add your own -->
            <button id="custom-button-img" @click="mateImageButtonClick" style="width:80px;">图片库</button>
            <el-upload ref="uploadFromFile"  :action="uploadAction+'?userToken='+token"   :on-change="fileChange" :accept="'image/*'" multiple :on-success="uploadSuccess" :on-error="handleUploadError" :show-file-list="false" :before-upload="beforeupload" :data="uploadOptions">
              <el-button  type="text">本地图片</el-button>
            </el-upload>
          </div>
        </quill-editor>
        
        <el-dialog title="裁剪图片" :visible.sync="shearMngVisible" top="0px"  width="1100px"  :lock-scroll="false"  :close-on-click-modal="false" append-to-body> 
        	<div slot="title">为了良好的客户体验，app图片建议控制在50Kb左右，宽400，高300上限，<br>如果是兼容pc的图片，建议宽800，高600为上限</div>
		<shear-mng :imgWidth="myWidth" :imgHeight="myHeight" :image="image" :fullscreen.sync="fullscreen" :branch-id="uploadOptions.branchId" :category-id="image.categoryId" :remark="uploadOptions.remark" @cancel="shearMngVisible=false" @upload-success="uploadSuccess"></shear-mng>
		</el-dialog>
		<el-dialog title="选择图片" :visible.sync="addFormVisible"  width="90%" top="0px" :close-on-click-modal="false" append-to-body>
			<upload-image :branch-id="branchId" :multiple="true" :visible="addFormVisible" @cancel="addFormVisible=false" @confirm="handleConfirm"></upload-image>
		</el-dialog>
		
	</div>
</template>

<script>
  import hljs from 'highlight.js'
//require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import  {quillEditor,Quill} from 'vue-quill-editor'
  import { ImageDrop } from 'quill-image-drop-module'
  import ImageResize from 'quill-image-resize-module'
   
  Quill.register('modules/imageDrop', ImageDrop)
  Quill.register('modules/imageResize', ImageResize)
  
  	import util from '@/common/js/util';//全局公共库
	import UploadImage from '@/components/Image/UploadImage';
	import ShearMng from '@/components/Image/ShearSelectUpload';
	import config from '@/common/config';//config 
  import { mapGetters } from 'vuex'
  
  export default {
	props:['branchId','categoryId','deptid','remark','value','imgWidth','imgHeight','id'],
	watch: {
		'value':function(val){
			this.content = val;
		},
		'content':function(content){
			this.$emit('input',content)
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
        name: '03-example',
        content: "请填写内容/上传图片/视频等",
        editorOption: {
          modules: { 
              toolbar: '#'+this.id+'_toolbar',
                history: {
                    delay: 1000,
                    maxStack: 50,
                    userOnly: false
                },
                imageDrop: true,
                imageResize: { 
                  modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                }
          }
        },
        fullscreen:false,
        addFormVisible:false,
        shearMngVisible:false,
        /**begin 在下面加自定义属性,记得补上面的一个逗号**/
        image:{categoryId:'123'},
        uploadOptions:{branchId:this.branchId,categoryId:this.categoryId,fileName:'',remark:'',deptid:this.deptid},//当前选择上传图片的类型
        previewVisible:false,
        myWidth:this.imgWidth,
        myHeight:this.imgHeight,//80||178
        currentEditorIndex:0,//记录当前编辑器的选中位置，用于插入图片等
        uploadAction:config.getArcImagePath()+"/arc/image/upload",
      }
    },
    components: {
    	quillEditor,
		'upload-image':UploadImage,
		'shear-mng':ShearMng
      },
    computed: {
      	...mapGetters([
		      'userInfo','token'
		    ]),
      contentCode() {
        return hljs.highlightAuto(this.content).value
      },
      editor() {
          return this.$refs.myTextEditor.quill
      }
    },
    methods: {
      onEditorBlur(editor) {
        //console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        //console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        console.log('editor ready!', editor)
        this.content = this.value
      },
      imageButtonClick(ev) {
    	  var oEvent = ev || event;
    	  oEvent.preventDefault(); 
    	  let addImgRange = this.editor.getSelection()
    	  if(addImgRange==null){
    		  this.currentEditorIndex=0
    	  }else{
    		  this.currentEditorIndex=addImgRange.index;
    	  }
    	 
    	  this.addFormVisible=true;
    	  return false;
      },
      mateImageButtonClick(ev) {
    	  var oEvent = ev || event;
    	  oEvent.preventDefault(); 
    	  let addImgRange = this.editor.getSelection()
    	  if(addImgRange==null){
    		  this.currentEditorIndex=0
    	  }else{
    		  this.currentEditorIndex=addImgRange.index;
    	  }
    	 
    	  this.addFormVisible=true;
    	  return false;
      },
		 handleConfirm(imgs){ 
            const range = this.editor.getSelection();
            var editorPosition=this.currentEditorIndex;
            if(range!=null){
              editorPosition=range.index;
            }
            imgs.forEach(i=>{ 
              this.editor.insertEmbed(editorPosition, 'image', i.url, Quill.sources.USER) 
              editorPosition=editorPosition+1;
            })

		        this.currentEditorIndex=editorPosition;
			//this.shearMngVisible=true;
		},
		//上传64图片后，指定回调父组件的方法,一般用于保存该图片的信息到另一张表
		uploadSuccess(res){
          const range = this.editor.getSelection();
            var editorPosition=this.currentEditorIndex;
            if(range!=null){
              editorPosition=range.index;
            }
          
        this.editor.insertEmbed(editorPosition, 'image',  res.data.url, Quill.sources.USER) 
        this.currentEditorIndex=editorPosition+1;
				this.shearMngVisible=false;
				
				
       	/* }); */
			//this.$emit('cancel');
			
    },
    
			handleUploadError : function(err, file, fileList){
				this.$message({ message: "文件上传失败，请检查文件是否过大，建议图片文件控制在500K内", type: "warning" }); 
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
		}, 
		  beforeupload(file){
			return true;
		 },
		  fileChange(file, fileList) {
			    var that = this;
			    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
			    console.log(file)
			    if(file.raw.type.indexOf('image')<0){
			    	this.$message({ message: "请选择图片文件", type: "warning" }); 
			    	return false;
			    }
			    return true; 
			  }
    },
    mounted() { 
		this.myWidth=this.imgWidth?this.imgWidth:400,
		this.myHeight=this.imgHeight?this.imgHeight:300
				console.log(this.$refs.uploadFromFile);
				var that=this;
			     const imgHandler= function(isImage) {
			    	  console.log(isImage)
			          let addImgRange = that.editor.getSelection()
			          that.currentEditorIndex=addImgRange.index;
			          if (isImage) {
			        	  that.$refs.uploadFromFile.$el.querySelector(".el-upload input").click()
			          }  
			       }	
			     console.log(this.editor)
		this.editor.getModule("toolbar").addHandler("image", imgHandler)
     }
  }
</script>

<style lang="scss">
  .quill-editor,
  .quill-code {
    width: 50%;
    float: left;
  }
  .quill-code {
    height: auto;
    border: none;
    > .title {
      border: 1px solid #ccc;
      border-left: none;
      height: 3em;
      line-height: 3em;
      text-indent: 1rem;
      font-weight: bold;
    }
    > code {
      width: 100%;
      margin: 0;
      padding: 1rem;
      border: 1px solid #ccc;
      border-top: none;
      border-left: none;
      border-radius: 0;
      height: 30rem;
      overflow-y: auto;
    }
  }
  .quill-editor{ 
    p {
      >img {
        float: left;
        display: block;
      }
    } 
  }
</style>