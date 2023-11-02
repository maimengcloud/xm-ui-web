<template>
	<section class="page-container border padding">
    <el-row class="page-main page-height-75" style="overflow-x: hidden;">
      <el-row style="padding-left: 20px;padding-top: 20px;padding-right: 20px">
        <el-card class="box-card" style="padding-left: 20px;">
          <div slot="header" class="clearfix">
            <span>编辑支付方式</span>
          </div>
          <div>
            <el-form :model="editForm"  label-width="150px" :rules="editFormRules" ref="editForm">
              <el-form-item label="平台编号" prop="platformId" :rules="[{ required:true, message: '平台编号不能为空'}]">
                <el-input disabled style="width: 50%;" v-model="editForm.platformId" placeholder="平台编号"></el-input>
              </el-form-item>
              <el-form-item label="银行名称" prop="bankName">
                <el-input style="width: 50%;" v-model="editForm.bankName" placeholder="银行名称"></el-input>
              </el-form-item>
<!--              <el-form-item label="银行机构码" prop="bankCode">
                <el-input style="width: 50%;" v-model="editForm.bankCode" placeholder="银行机构码"></el-input>
              </el-form-item>-->
              <el-form-item  label="银行卡账户编号" prop="cardAccountId" :rules="[{ required:true, message: '银行卡账户编号不能为空'}]">
                <el-input style="width: 50%;" v-model="editForm.cardAccountId" placeholder="银行卡账户编号"></el-input>
              </el-form-item>
              <el-form-item label="银行卡账户名称" prop="cardAccountName">
                <el-input style="width: 50%;" v-model="editForm.cardAccountName" placeholder="银行卡账户名称"></el-input>
              </el-form-item>
              <el-form-item label="银行分支机构名称" prop="subBankName">
                <el-input style="width: 50%;" v-model="editForm.subBankName" placeholder="银行分支机构名称"></el-input>
              </el-form-item>
<!--              <el-form-item label="分支机构编码" prop="subBankCode">
                <el-input style="width: 50%;" v-model="editForm.subBankCode" placeholder="分支机构编码"></el-input>
              </el-form-item>-->
<!--              <el-form-item label="新增时间" prop="ctime">
                <el-date-picker disabled type="date" placeholder="自动生成时间" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>-->
              <el-form-item label="上次更新时间" prop="ltime">
                <el-date-picker disabled type="date" placeholder="自动生成时间" v-model="editForm.ltime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
<!--              <el-form-item label="操作用户编号" prop="opUserid">
                <el-input v-model="editForm.opUserid" placeholder="操作用户编号"></el-input>
              </el-form-item>
              <el-form-item label="操作用户名称" prop="opUsername">
                <el-input v-model="editForm.opUsername" placeholder="操作用户名称"></el-input>
              </el-form-item>-->
<!--              <el-form-item label="账户状态" prop="status">
                <template>
                  <el-radio v-model="editForm.status" label="0">无效</el-radio>
                  <el-radio v-model="editForm.status" label="1">有效</el-radio>
                </template>
              </el-form-item>-->
              <el-form-item label="账户性质" prop="type">
                <template>
                  <el-select disabled v-model="editForm.type" >
                    <el-option :key="editForm.type" label="平台收款" :value="editForm.type"></el-option>
                  </el-select>
                </template>
              </el-form-item>
              <el-form-item>
                <el-col :span="24" :offset="4">
                  <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
                </el-col>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-row>
    </el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from '@/api/mdp_pub/mdp_config';//全局公共库
	import { listBankAccount,editBankAccount } from '@/api/mdp/plat/bankAccount';
	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				load:{ list: false, edit: false },//查询中...
				sels: [],//列表选中数据
				options:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
        editFormRules: {
          cardAccountId: [
            //{ required: true, message: '银行卡账户编号不能为空', trigger: 'blur' }
          ]
        },
				//编辑bankAccount界面初始化数据
				editForm: {
					bankName:'',bankCode:'',cardAccountId:'',cardAccountName:'',subBankName:'',subBankCode:'',ctime:'',ltime:'',opUserid:'',opUsername:'',status:'',type:'',platformId:''
				},
			}
		},//end data
		methods: {
			//获取列表 BankAccount 平台收付款账户
			getBankAccounts() {
				let params = {
          platform_id:'platform-001',

				};

				this.load.list = true;
				listBankAccount(params).then((res) => {
					let tips=res.data.tips;
					if(tips.isOk){
						this.editForm = res.data.data[0];
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
      //提交修改
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.load.edit=true;
              this.editForm.ltime=util.formatDate(new Date(),"yyyy-MM-dd HH:mm:ss");
              let params = Object.assign({}, this.editForm);
              editBankAccount(params).then((res) => {
                this.load.edit=false
                let tips=res.data.tips; 
                this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
              }).catch( err =>this.load.edit=false);
            });
          }
        });
      },
			/**begin 自定义函数请在下面加**/

			/**end 自定义函数请在上面加**/

		},//end methods
		components: {

		},
		mounted() {
			this.$nextTick(() => {
				this.getBankAccounts();
        	});
		}
	}

</script>

<style scoped>
.col {
  margin-bottom: 20px;
}
</style>
