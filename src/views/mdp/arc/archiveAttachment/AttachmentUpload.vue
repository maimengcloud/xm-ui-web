<template>
  <section>
    <el-row>
      <!--工具条1-->
      <!--如果有更多工具条,放开此注释
			<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;">
				<el-col :span="4">
				</el-col>
			</el-col>
      -->

      <!--新增界面 Archive 档案信息表-->
      <el-drawer
        title="图片预览"
        size="50%"
        :visible.sync="showPreviewImage"
        :with-header="false"
        append-to-body
      >
        <div style="width:100%;max-height:800px;overflow:auto;">
          <el-image
            v-for="image in previewOnlineUrls"
            :key="image.url"
            :fit="'contain'"
            :src="image.url"
          ></el-image>
        </div>
      </el-drawer>
      <el-drawer
        title="图片预览"
        size="50%"
        :visible.sync="showOnePreviewImage"
        :with-header="false"
        append-to-body
      >
        <div v-if="image!=null" style="width:100%;max-height:800px;overflow:auto;">
          <el-image :fit="'contain'" :src="image.url"></el-image>
        </div>
      </el-drawer>
      <el-col :span="18">
        <el-upload
          class="upload-demo"
          :action="uploadAction"
          :data="uploadParams"
          multiple
          :limit="limit"
          :list-type="listType"
          :on-change="handleChange"
          :before-remove="beforeRemove"
          :on-remove="handleRemove"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :before-upload="handleBeforeUpload"
          :on-success="handleSuccess"
          :file-list="fileList"
          :disabled="isDisabled"
        >
          <el-button type="text" :class="{ change: isDisabled }">上传附件</el-button>
        </el-upload>
      </el-col>
      <el-col :span="6" style="padding-right: 50px;">
        <el-button
          @click="handleOnlinePeview"
          :disabled="previewOnlineUrls.length<=0"
        >预览{{previewOnlineUrls.length}}张图</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import config from "@/common/config"; //全局公共库import
import {
  listArchiveAttachment,
  delArchiveAttachment
} from "@/api/mdp/arc/archiveAttachment";

export default {
  props: [
    "branchId",
    "deptid",
    "archiveId",
    "categoryId",
    "listType",
    "limit",
    "eliminate",
    "isDisabled"
  ],
  watch: {
    archiveId: function(archiveId) {
      var that = this;
      this.$nextTick(_ => {
        this.fileList = [];
        listArchiveAttachment({ archiveId: this.archiveId }).then(res => {
          var files = res.data.data;
          if (files && files.length > 0) {
            files.forEach(i => {
              i.name = i.name;
              that.fileList.push(i);
            });
          }
        });
      });
    },
    eliminate: function(eliminate) {
      if (eliminate == true) {
        this.fileList = [];
      }
    }
  },
  computed: {
    uploadParams() {
      return {
        categoryId: this.categoryId,
        archiveId: this.archiveId,
        branchId: this.branchId,
        deptid: this.deptid
      };
    },
    previewOnlineUrls() {
      var previewOnlineUrls = this.fileList.filter(i => {
        var re = /^.*\.(?:png|jpg|bmp|gif|jpeg)$/;
        if (re.test(i.name)) {
          return true;
        } else {
          return false;
        }
      });
      previewOnlineUrls.forEach(i => {
        i.url =
          config.getArcFileUploadBasePath() + "/" + i.url + "?name=" + i.name;
      });
      console.log(
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx00000000000000000000000000000000000"
      );
      console.log(JSON.stringify(previewOnlineUrls));
      return previewOnlineUrls;
    }
  },
  data() {
    return {
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      uploadAction: config.getArcFileUploadBasePath() + "/mdp/arc/file/upload",
      fileList: [],
      showPreviewImage: false,
      showOnePreviewImage: false,
      image: null
      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    /**begin 在下面加自定义方法,记得补上面的一个逗号**/
    handleOnlinePeview(val) {
      this.showPreviewImage = !this.showPreviewImage;
    },
    //begin 上传附件
    handleSuccess(res, file) {
      if (res.tips.isOk) {
        file = Object.assign(file, res.data);
        this.fileList.push(res.data);
        this.$emit('getCarFrontImageUrl',res.data.url)
        this.$emit('getCarBackImageUrl',res.data.url)
        this.$emit('getCarInnerImageUrl',res.data.url)
        this.$emit('uploadSuccess',file)
      } else {
        this.$message.warning(res.tips.msg);
        return false;
      }
    },
    handleRemove(file, fileList) {
      if (!file.id || file.id == null || file.id == "") {
        return true;
      }

      delArchiveAttachment(file)
        .then(res => {
          if (res.data.tips.isOk) {
            var index = -1;
            for (var i = 0; i < this.fileList.length; i++) {
              if (this.fileList[i].name == file.name) {
                index = i;
              }
            }
            if (index >= 0) {
              this.fileList.splice(index, 1);
            }
            this.$emit("on-remove", file, this.fileList);
          } else {
            this.$message.error(res.data.tips.msg);
          }
        })
        .catch(() => {
          this.$message.warning("删除失败");
        });
    },
    handlePreview(file) {
      let relativePath = file.relativePath;
      console.log("relativePath" + relativePath);
      let name = file.name;
      var attachmentPreviewUrl =
        config.getArcFileUploadBasePath() + "/" + file.url + "?name=" + name;
      var re = /^.*\.(?:png|jpg|bmp|gif|jpeg)$/;
      if (re.test(name)) {
        this.image = Object.assign({}, file);
        this.image.url = attachmentPreviewUrl;
        this.showOnePreviewImage = true;
        return;
      }

      this.showOnePreviewImage = false;
      window.open(attachmentPreviewUrl, "_blank");
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        "当前限制选择" +
          this.limit +
          " 个文件，本次选择了" +
          files.length +
          " 个文件，共选择了 " +
          (files.length + fileList.length) +
          " 个文件"
      );
    },
    beforeRemove(file, fileList) {
      console.log(file);
      var canDel = false;
      this.fileList.forEach(item => {
        if (item.name == file.name) {
          if (item.canDel == "1") {
            canDel = true;
            return;
          }
        }
      });
      if (canDel == false && file.id && file.id != null && file.id != "") {
        this.$message.warning(file.name + "设置了不允许删除");
        return false;
      } else if (
        canDel == true &&
        file.id &&
        file.id != null &&
        file.id != ""
      ) {
        return this.$confirm("确定移除" + file.name + "？");
      } else {
        return true;
      }
    },
    handleBeforeUpload(file) {
      let files = this.fileList.filter(i => i.name == file.name);
      if (files.length > 0) {
        this.$message({ message: "文件已经存在", type: "warning" });
        return false;
      } else {
        if (file.size > 1024 * 1024 * 4) {
          //4M
          this.$message({
            message:
              "文件大小为" +
              file.size / (1024 * 1024) +
              "M,大于4M，不允许上传。",
            type: "warning"
          });
          return false;
        }
        this.uploadParams.archiveId = this.archiveId;
        this.uploadParams.categoryId = this.categoryId;
        return true;
      }
    },
    handleChange(file, fileList2) {
      this.$emit("on-change", file, this.fileList);
    }
    //end upload
    /**end 在上面加自定义方法**/
  }, //end method
  components: {
    //在下面添加其它组件 'archive-edit':ArchiveEdit
  },
  mounted() {
    if (!this.archiveId) {
      return;
    }
    
    listArchiveAttachment({ archiveId: this.archiveId }).then(res => {
      var files = res.data.data;
      files.forEach(i => (i.name = i.name));
      this.fileList = files;
    });
    /**在下面写其它函数***/
  } //end mounted
};
</script>

<style scoped>

.change{
  color: rgb(204, 207, 214);
  cursor: none;
}

</style>