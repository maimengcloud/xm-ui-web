<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container editor-container"
  >
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <el-dialog
      title="选择图片"
      :visible.sync="dialogVisible"
      top="20px"
      width="80%"
      :close-on-click-modal="false"
      append-to-body
      modal-append-to-body
    >
      <upload-image
        :multiple="true"
        :branch-id="userInfo.branchId"
        :dept-id="userInfo.deptid"
        :visible="dialogVisible"
        @cancel="dialogVisible = false"
        @confirm="handleConfirm"
      ></upload-image>
    </el-dialog>
    					<el-upload v-show="false" :disabled="uploadOptions.categoryId==''||uploadOptions.categoryId==null" class="upload-demo"  :show-file-list="false" :action="uploadAction"  :on-success="handleSuccess" :before-upload="beforeupload" :data="uploadOptions" multiple>
						  
						      <el-button   type="primary" :id="tinymceId+'-uploadImageBtn'" >点击上传</el-button>  
					</el-upload>
  </div>
</template>

<script>
import config from "@/common/config"; //全局公共库import
import UploadImage from "@/components/Image/UploadImage";
import { uploadBase64,upload  } from '@/api/mdp/arc/image';
import { mapGetters } from "vuex";
import plugins from "./plugins";
import toolbar from "./toolbar";

export default {
  name: "Tinymce",
  components: { UploadImage },
  props: {
    value: {
      type: String,
      default: "",
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    menubar: {
      type: String,
      default: "file edit insert view format table",
    },
    height: {
      type: Number,
      required: false,
      default: 360,
    },
  },
  data() { 
    var tinymceId="vue-tinymce-" + new Date().getTime() + ((Math.random() * 1000).toFixed(0) + "")
    return {
      uploadAction: config.getArcImagePath()+"/arc/image/upload", 
      uploadBlogAction: config.getArcImagePath()+"/arc/image/upload/base64", 
      uploadOptions:{branchId:'',categoryId:'uploadImm',fileName:'',remark:'',deptid:''},//当前选择上传图片的类型
      imageList: [],
      dialogVisible: false,
      editorHtmlData: this.value,
      tinymceId: tinymceId,
      fullscreen: false,
      languageTypeList: {
        en: "en",
        zh: "zh_CN",
      },
    };
  },
  computed: {
    language() {
      return this.languageTypeList[this.$store.getters.language];
    },
    ...mapGetters(["userInfo"]),
  },
  watch: {
    value(val) {
      if (val == this.editorHtmlData) {
        return;
      }
      this.$nextTick(() =>
        window.tinymce.get(this.tinymceId).setContent(val || "")
      );
    },
    editorHtmlData(val) {
      this.$emit("input", val);
    },
    language() {
      //this.destroyTinymce();
      //this.$nextTick(() => this.initTinymce())
    },
  },
  mounted() {
    this.$nextTick(() => this.initTinymce());
  },
  /**
  activated() {
    this.initTinymce()
	
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
   */
  methods: {
    initTinymce() {  
      const _this = this;
      window.tinymce.init({ 
        language: _this.language,
        selector: `#${_this.tinymceId}`,
        height: _this.height,
        body_class: "panel-body ",
        object_resizing: true, 
        toolbar: _this.toolbar.length > 0 ? _this.toolbar : toolbar,
        menubar: false,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        imagetools_cors_hosts: ["www.qingqinkj.com", "codepen.io","www.maimengcloud.com",'http://localhost:8067','http://localhost:8012'],
        //imagetools_proxy:'localhost:8067',
        default_link_target: "_blank",
        link_title: false,
        convert_urls: false,
        paste_data_images: true,
        fontsize_formats:
          "8pt 10pt 12pt 14pt 18pt 20pt 24pt 28pt 30pt 36pt 38pt 40pt 42pt 46pt 48pt",
        font_formats:
          "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: (editor) => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          editor.on("NodeChange Change KeyUp SetContent", () => {
            _this.editorHtmlData = editor.getContent();
          });
        },
        setup(editor) {
          editor.on("FullscreenStateChanged", (e) => {
            _this.fullscreen = e.state;
          });  
          /**
          editor.addButton('insertImage', {
            text: "插入图片",
            icon: false,
            onclick: function () {  
                document.getElementById(_this.tinymceId+"-uploadImageBtn").click(); 
            },
          });
          **/
          editor.addButton("imageList", {
            text: "图片库",
            icon: false,
            onclick: function () {
              _this.dialogVisible = true;
              _this.$nextTick(() => {
                //document.getElementById("editor-dialog").style.zIndex="100000"
              });
            },
          });
        },
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },
        images_upload_handler(blobInfo, success, failure, progress) {   
          
             const formData = new FormData();   
             formData.append('storedb',false)
             formData.append('file', blobInfo.blob()); 
             formData.append("categoryId",_this.uploadOptions.categoryId) 
             upload(formData).then((res) => {  
              var tips = res.data.tips;
              if(tips.isOk){
                success('http://localhost:8067/api/m1/arc/arc/image/uploadImm/IM1675705794917148.png')
              }else{
                failure(tips.msg)
              }
                
             })
          
         },
      });
      _this.setContent(_this.value);
    },
    destroyTinymce() {
      var tinymce = window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }
      if (tinymce) {
        tinymce.destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    insertImage() {
      let imageList = this.imageList;
      let imageHtml = "";
      (imageList || []).map((item) => {
        imageHtml =
          imageHtml + "<p><img class='image' src='" + item.url + "'></p>";
      });
      if (imageHtml != "") {
        window.tinymce.get(this.tinymceId).insertContent(`${imageHtml}`);
      }
      this.dialogVisible = false;
    },

    handleConfirm(imgs) {
      this.imageList = imgs; //{url:xxx,remark:xxxx}
      this.insertImage();
    },
    imageSuccessCBK(arr) {
      const _this = this;
      arr.forEach((v) => {
        window.tinymce
          .get(_this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`);
      });
    },
    handleSuccess(res,file) {
       this.$nextTick(()=>{
         this.handleConfirm([res.data])
       })
			 
		
		  }, 
		  beforeupload(file){ 
			  if(this.uploadOptions.categoryId=='' || this.uploadOptions.categoryId==null){
				  	this.$message({ message: "请选择分类", type: "warning" }); 
				  	return false;
				  	}
			    if(file.size<=1024*2024){//1M
			    	return true;
			    }else{
			    	this.$message({ message: '为了良好的客户体验，大于2M的文件需经过裁剪压缩处理', type: 'warning' });
			    	return false;
			    }
			  	
				
			  },
  },
};
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
#editor-dialog {
  z-index: 20000 !important;
}
</style> 