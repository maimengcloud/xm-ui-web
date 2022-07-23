<template>
  <section class="padding border">
    <el-row>
      <!--新增界面 XmProduct 产品表-->
      <el-form
        :model="editForm"
        label-width="120px"
        :rules="editFormRules" 
		label-position="top"
        ref="editForm"
      >
        <el-row  v-if="opType !== 'add'" class="padding-top label-font-color">
          <span >产品代号:</span>
          {{ editForm.code }} &nbsp;&nbsp;<span  
            >产品编号:</span
          >
          {{ editForm.id }}
          <el-tooltip
            content="产品代号用于签订合同等甲乙方共享的场景;产品编号为内部编号，用于内部流转,编号生成规则:产品代号+四位随机码 "
            ><i class="el-icon-question"></i
          ></el-tooltip>
        </el-row>   
        <el-form-item prop="productName" label-width="0px" v-if="opType !== 'add'" class="title-box">  
				<el-input  
					v-model="editForm.productName"
					placeholder="产品名称"
					@change="editSomeFields(editForm, 'productName', $event)"
				></el-input>   
        </el-form-item>  
        <el-form-item label="产品名称" prop="productName" v-if="opType === 'add'">  
				<el-input
					v-model="editForm.productName"
					placeholder="产品名称" 
				></el-input>   
        </el-form-item> 
        <el-form-item label="产品代号" prop="code" v-if="opType === 'add'">
          <el-input
            v-model="editForm.code"
            style="width: 200px"
            placeholder="产品代号，不可为空"
          >
          </el-input>
          <el-button @click.native="createProductCode">自动生成</el-button>
          <el-tooltip
            content="产品代号用于签订合同等甲乙方共享的场景;产品编号为内部编号，用于内部流转，生成规则:产品代号+四位随机码 "
            ><i class="el-icon-question"></i
          ></el-tooltip>
        </el-form-item> 
		 <el-form-item label="管理成员">
        <el-row class="padding padding-top">
			
          <el-col :span="8">
            <el-form-item prop="admUserid" label-width="0px">
              <user-field
                label=" 产品总控"
                userid-key="admUserid"
                username-key="admUsername"
                v-model="editForm"
                @change="editSomeFields(editForm, 'admUserid', $event)"
              ></user-field>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="pmUserid" label-width="0px">
              <user-field
                label=" 产品经理"
                userid-key="pmUserid"
                username-key="pmUsername"
                v-model="editForm"
                @change="editSomeFields(editForm, 'pmUserid', $event)"
              ></user-field>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="assUserid" label-width="0px">
              <user-field
                label=" 副经理、助理"
                userid-key="assUserid"
                username-key="assUsername"
                v-model="editForm"
                @change="editSomeFields(editForm, 'assUserid', $event)"
              ></user-field>
            </el-form-item>
          </el-col>
		
        </el-row> 
		</el-form-item> 
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="editForm.remark"
            :rows="10"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 20 }"
            placeholder="备注"
            @change="editSomeFields(editForm, 'remark', $event)"
          ></el-input>
        </el-form-item>
      </el-form>
		
		<el-row v-if="opType==='add'" style="float:right;">
			<el-button type="primary" @click="editSubmit">保存</el-button>
		</el-row> 
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import {
  initDicts,
  addXmProduct,
  editSomeFields,
  createProductCode
} from "@/api/xm/core/xmProduct";
import { mapGetters } from "vuex"; 

export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]),
    calcXmProductPstatusStep() {
      if (this.dicts["xmProductPstatus"]) {
        var index = this.dicts["xmProductPstatus"].findIndex((i) => {
          if (i.id == this.editForm.pstatus) {
            return true;
          } else {
            return false;
          }
        });
        return index + 1;
      } else {
        return 0;
      }
    },
  },
  props: ["xmProduct", "visible", "opType"],
  watch: {
    xmProduct: {
      handler() {
        this.editForm = this.xmProduct;
        this.editFormBak = { ...this.editForm };
      },
      deep: true,
    },
    visible: function (visible) {
      if (visible == true) {
        
        this.initData();
        //从新打开页面时某些数据需要重新加载，可以在这里添加
      }
    },
  },
  data() {
    return {
      dicts: { xmProductPstatus: [] }, //下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load: { list: false, add: false, del: false, edit: false }, //查询中...
      editFormRules: {
        productName: [
          { required: true, message: "产品名称不能为空", trigger: "change" },
          {
            min: 2,
            max: 250,
            message: "名称长度在10-250个字符",
            trigger: "change",
          },
        ],

        id: [
          { required: true, message: "产品编号不能为空", trigger: "change" },
        ],
        code: [
          { required: true, message: "产品代号不能为空", trigger: "change" },
        ],

        pmUserid: [
          { required: true, message: "产品经理不能为空", trigger: "change" },
        ],

        admUserid: [
          { required: true, message: "产品总监不能为空", trigger: "change" },
        ],
        remark: [
          {
            min: 0,
            max: 250,
            message: "备注长度在10-250个字符",
            trigger: "change",
          },
        ],
      },
      //新增界面数据 产品表
      editForm: {
        id: "",
        productName: "",
        branchId: "",
        remark: "",
        version: "",
        pmUserid: "",
        pmUsername: "",
        ctime: "",
        deptid: "",
        pstatus: "",
        startTime: "",
        endTime: "",
        deptName: "",
        admUserid: "",
        admUsername: "",
        assUserid: "",
        assUsername: "",
        bizProcInstId: "",
        bizFlowState: "",
        isTpl: "",
        baselineId: "",
        baseTime: "",
        code: "",
        pbudgetWorkload: "",
        pbudgetAmount: "",
        pmenuBudgetWorkload: "",
        pmenuBudgetAmount: "",
        budgetCtrl: "",
        phaseBudgetCtrl: "",
        phaseActCtrl: "",
        locked: "",
        del: "",
        ltime: "",
      },
      editFormBak: {
        id: "",
        productName: "",
        branchId: "",
        remark: "",
        version: "",
        pmUserid: "",
        pmUsername: "",
        ctime: "",
        deptid: "",
        pstatus: "",
        startTime: "",
        endTime: "",
        deptName: "",
        admUserid: "",
        admUsername: "",
        assUserid: "",
        assUsername: "",
        bizProcInstId: "",
        bizFlowState: "",
        isTpl: "",
        baselineId: "",
        baseTime: "",
        code: "",
        pbudgetWorkload: "",
        pbudgetAmount: "",
        pmenuBudgetWorkload: "",
        pmenuBudgetAmount: "",
        budgetCtrl: "",
        phaseBudgetCtrl: "",
        phaseActCtrl: "",
        locked: "",
        del: "",
        ltime: "",
      },
      userSelectVisible: false,
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/

      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
    handleCancel: function () {
      this.$refs["editForm"].resetFields();
      this.$emit("cancel");
    },
    //新增提交XmProduct 产品表 父组件监听@submit="afterAddSubmit"
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            let params = Object.assign({}, this.editForm);
            params.branchId = this.userInfo.branchId;
            addXmProduct(params)
              .then((res) => {
                this.load.edit = false;
                var tips = res.data.tips;
                if (tips.isOk) {
                  //this.$refs['editForm'].resetFields();
                  this.$emit("submit"); //  @submit="afterAddSubmit"
                }
                this.$notify({
                  position: "bottom-left",
                  showClose: true,
                  message: tips.msg,
                  type: tips.isOk ? "success" : "error",
                });
              })
              .catch((err) => (this.load.edit = false));
          });
        } else {
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: "表单验证不通过，请修改后提交",
            type: "error",
          });
        }
      });
    },  

    editSomeFields(row, fieldName, $event) {
		if(this.opType==='add'){
			return;
		}
      let params = {};
      params["ids"] = [row].map((i) => i.id);
      if (fieldName == "admUserid") {
        params["admUserid"] = $event[0].userid;
        params["admUsername"] = $event[0].username;
      } else if (fieldName == "assUserid") {
        params["assUserid"] = $event[0].userid;
        params["assUsername"] = $event[0].username;
      } else if (fieldName == "pmUserid") {
        params["pmUserid"] = $event[0].userid;
        params["pmUsername"] = $event[0].username;
      } else if (fieldName == "startTime") {
        params["startTime"] = row.startTime;
        params["endTime"] = row.endTime;
      } else {
        params[fieldName] = $event;
      }

      var func = editSomeFields;
      func(params)
        .then((res) => {
          let tips = res.data.tips;
          if (tips.isOk) {
            this.editFormBak = [...this.editForm];
            Object.assign(this.editForm, params);
            this.$emit("edit-fields", params);
          } else {
            Object.assign(this.editForm, this.editFormBak);
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          }
        })
        .catch((e) => Object.assign(this.editForm, this.editFormBak));
    },
	
			
	createProductCode(){ 
		createProductCode({}).then(res=>{
			var tips=res.data.tips;
			if(tips.isOk){  
				this.$set(this.editForm,'code',res.data.data)
			}
			this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
		})
	},
  
			initData(){
				this.editForm=Object.assign(this.editForm,this.xmProduct)
				if(this.opType==='add'){ 
					this.editForm.pmUserid=this.userInfo.userid
					this.editForm.pmUsername=this.userInfo.username
					this.editForm.admUserid=this.userInfo.userid
					this.editForm.admUsername=this.userInfo.username
					this.editForm.assUserid=this.userInfo.userid
					this.editForm.assUsername=this.userInfo.username 
				} 
				this.editFormBak={...this.editForm}
			},
    /**end 在上面加自定义方法**/
  }, //end method
  components: { 
  },
  mounted() { 
    initDicts(this);
    this.initData();
    /**在下面写其它函数***/
  }, //end mounted
};
</script>

<style  lang="scss" scoped> 
 
</style>