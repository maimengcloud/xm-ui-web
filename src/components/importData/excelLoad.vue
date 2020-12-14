<template>
  <el-dialog title="Excel导入信息" center :visible="show" @close="cancelExcel" width="60%" top="10vh">
    <div class="pd15">
      <div style="margin-top: 20px;width: 85%">
        <el-form size="mini" label-position="right" label-width="200">
          <el-form-item label="数据文件：">
            <div class="upload-div">
              <el-upload
                ref="uploadFile"
                :action="uploadApi"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                :on-change="readExcel"
                :on-remove="clearFileList"
                :on-success="handleSuccess"
                :auto-upload="false"
              >
                <el-button size="mini" type="primary" slot="trigger" @click="clearFileList">选择文件</el-button>
              </el-upload>
            </div> 
          </el-form-item>
          <el-form-item label="运行结果：">
            <el-input
              v-if="resultType==='text'"
              type="textarea"
              :rows="15"
              v-model="parseExcelResult"
              readonly
              resize="none"
            ></el-input>
            <div
              v-else
              v-html="parseExcelResult"
              style="height: 400px;border:1px solid darkgray;overflow: scroll"
            ></div>
          </el-form-item>
        </el-form>
      </div>
      <div style="width:100%; text-align:center;padding-bottom: 30px;margin-top: 10px;">
        <el-button
          size="mini"
          type="success"
          @click="upload"
          v-loading="load.add"
          :disabled="disabled"
        >上传导入信息</el-button>
        <el-button
          v-if="downloadFunction"
          size="mini"
          type="primary"
          @click="downloadFunction"
        >下载EXCEL模板</el-button>
      </div>
    </div>
  </el-dialog>
</template>



<script>
import XLSX from "xlsx";
import { importantExcel } from "@/api/oa/hr/user/hrUserBaseInfo";

const REGULAR = {
  EXCEL: /(.*)\.(xls|xlsx|XLS|XLSX)$/
};

export default {
  name: "excelImport",
  data() {
    return {
      excelData: [],
      parseExcelResult: "",
      checkExcelSuccess: false,
      loadFile: "",
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      disabled : false
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    resultType: {
      type: String,
      default: "text",
      validator: e => ["text", "html"].includes(e)
    },
    ignore: {
      type: Number,
      default: 0
    },
    downloadFunction: {
      type: Function
    },
    uploadApi: {
      type: String,
      required: true
    },
    uploadData: {
      type: Object,
      default: () => {}
    },
    header: {
      type: Array,
      required: true,
      validator: e => e.length > 0
    },
    validator: {
      type: Function,
      default: () => true
    }
  },
  methods: {
    cancelExcel() {
      this.$emit("update:show", false);
      this.clearFileList();
    },

    upload() {
      if (!this.checkExcelSuccess) return alert("未找到检验正确的EXCEL数据！");
      this.$refs.uploadFile.submit();
      this.load.add = true;
      this.disabled = true;
    },

    readExcel(file, fileList) {
      if (file.status == "success") {
        this.disabled = true;
        return;
      }
      this.disabled = false
    
      if (!REGULAR.EXCEL.test(file.name)) {
        alert("选择的文件格式错误!");
        return this.clearFileList();
      }
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(file.raw);
      fileReader.onload = ev => {
        try {
          let data = ev.target.result,
            header = [],
            workbook = XLSX.read(data, { type: "binary" });
          for (let i = 1; i <= this.header.length; i++) {
            header.push(
              workbook.Sheets[workbook.SheetNames[0]][this.hex(i) + "1"]["h"]
            );
          }
          if (JSON.stringify(header) !== JSON.stringify(this.header)) {
            alert("模板文件头部被改动！解析失败！");
            return this.clearFileList();
          }
          this.excelData = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          if (this.ignore > 0) this.excelData.splice(0, this.ignore);
          this.loadFile = file;
          this.checkExcelData();
        } catch (e) {
          alert("解析EXCEL文件失败" + JSON.stringify(e));
          console.log(e);
        }
      };
    },

    checkExcelData() {
      this.parseExcelResult +=
        this.resultType === "text"
          ? `正在检验EXCEL内容，请稍后...`
          : `<span class="pdl10">正在检验EXCEL内容，请稍后...</span></br>`;
      let hasError = false,
        passCheck = [];
      if (this.excelData.length === 0)
        return (this.parseExcelResult +=
          this.resultType === "text"
            ? `\n\nEXCEL没有内容，解析失败...`
            : `<span class="c-red pdl10">EXCEL没有内容，解析失败...</span></br>`);
      for (let i = 0; i < this.excelData.length; i++) {
        let checkResult = this.validator(this.excelData[i], passCheck, i);
        if (checkResult !== true) {
          console.log( this.resultType, " this.resultType");
          hasError = true;
          this.parseExcelResult +=
            this.resultType === "text"
              ? `\n\n第${i + 1}行有误，${checkResult}`
              : `${checkResult}`;
          break;
        }
        passCheck.push({ ...this.excelData[i] });
        this.parseExcelResult +=
          this.resultType === "text"
            ? `\n第${i + 1}行检验成功！`
            : `<span class="c-green pdl10">第${i + 1}行检验成功！</span></br>`;
      }
      if (hasError)
        return (this.parseExcelResult +=
          this.resultType === "text"
            ? `\n\nEXCEL内容不正确，解析失败...`
            : `<span class="c-red pdl10">EXCEL内容不正确，解析失败..</span></br>`);
      this.checkExcelSuccess = true;
      this.parseExcelResult +=
        this.resultType === "text"
          ? `\n\n已成功解析${this.excelData.length}行（表头和示例行不计入行数）`
          : `<span class="c-green pdl10">已成功解析${this.excelData.length}行（表头和示例行不计入行数）</span></br>`;
      this.parseExcelResult +=
        this.resultType === "text"
          ? `\n\nEXCEL解析成功，请点击上传数据上传...`
          : `<span class="c-green pdl10">EXCEL解析成功，请点击上传数据上传...</span></br>`;
    },

    clearFileList() {
      this.checkExcelSuccess = false;
      this.excelData = [];
      this.parseExcelResult = "";
      this.$refs["uploadFile"].clearFiles();
    },

    hex(num) {
      let arr = [];
      while (num > 0) {
        let remain = num % 26;
        num = parseInt(num / 26);
        if (remain === 0) {
          remain = 26;
          num--;
        }
        arr.push(String.fromCharCode(remain + 64));
      }
      return arr.reverse().join("");
    },

    handleSuccess(res) {
      console.log(JSON.stringify(res));
      if (res.tips.isOk) {
        this.parseExcelResult +=
          "<span >" + res.tips.msg + "</span></br>";
          this.$emit('onSucess', "");
      } else {
        this.parseExcelResult +=
          "<span >" + res.tips.msg + "</span></br>";
      
      }
      this.load.add = false;
    },
    
  }
};
</script>

<style scoped>
.el-icon-document {
  height: 0 !important;
}

.upload-div {
  width: 100%;
  margin-top: 3px;
}

.el-upload.el-upload--text {
  float: left;
}

.el-upload-list.el-upload-list--text {
  float: left;
  width: 70%;
  margin-left: 20px;
}

.el-upload-list__item:first-child {
  margin-top: 5px !important;
}
</style>