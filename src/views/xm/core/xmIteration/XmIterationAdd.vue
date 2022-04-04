<template>
	<section class="page-container  padding border">
		<el-row>
			<!--新增界面 XmIteration 迭代定义--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">   
				<el-form-item label="归属产品" prop="productId">  
						<xm-product-select v-if="!xmProduct||!xmProduct.id" ref="xmProductSelect" :auto-select="true" :sel-project="selProject"   @row-click="onProductRowClick" @clear="onProductClearSelect" @close="productSelectVisible=false"></xm-product-select>
 
					<span v-else>{{addForm.productName}}</span>
				</el-form-item>
				<el-form-item label="迭代名称" prop="iterationName">
					<el-input v-model="addForm.iterationName" placeholder="迭代名称" minlength="10"></el-input>
					<font color="blue">格式如下： 上线日期+主题+V版本号 例如： 2021.6.15购书商城V1.0.9 &nbsp;&nbsp;留空，选日期后自动填写迭代名称</font>
				</el-form-item> 
				<el-form-item label="开始时间" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.startTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.endTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="上线时间" prop="onlineTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.onlineTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>   
				<el-form-item label="负责人姓名" prop="adminUsername">
					{{addForm.adminUsername}} <el-button @click="userSelectVisible=true">选择负责人</el-button>
				</el-form-item>  
				<el-form-item label="预算工作量" prop="budgetWorkload">
					<el-input v-model="addForm.budgetWorkload" type="number" style="width:60%;" min="0" placeholder="预算工作量"></el-input> 人时 ，1人工作1日=8人时
				</el-form-item>    
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
		
		<el-drawer append-to-body title="选择员工" :visible.sync="userSelectVisible" size="60%">
        	<users-select :select-userids="[]" @confirm="onUserSelected" ref="usersSelect"></users-select>
      	</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询 
	import { addXmIteration } from '@/api/xm/core/xmIteration';
	import { mapGetters } from 'vuex'	
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";

	import XmProductSelect from '@/views/xm/core/components/XmProductSelect.vue'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmIteration','visible', 'selProject','xmProduct'],
		watch: {
	      'xmIteration':function( xmIteration ) {
	        this.addForm = xmIteration;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){  
				this.addForm.cuserid=this.userInfo.userid
				this.addForm.cusername=this.userInfo.username
				this.addForm.adminUserid=this.userInfo.userid
				this.addForm.adminUsername=this.userInfo.username;
				if(this.xmProduct && this.xmProduct.id){
					
					this.addForm.productId=this.xmProduct.id
					this.addForm.productName=this.xmProduct.productName;
				}
	      	}
	      },
		  'addForm.endTime':function(val){
			  if(!val){
				  return;
			  }
			  var date=val.substr(0,10)
			  date=date.replaceAll('-','');
			  this.addForm.iterationName=date+this.addForm.productName+'V1.0.0'
		  },
		  'addForm.productName':function(val){
			  var date=this.addForm.endTime
			  if(!date){
				  return;
			  }
			  date=date.substr(0,10)
			  date=date.replaceAll('-','');
			  this.addForm.iterationName=date+this.addForm.productName+'V1.0.0'
		  }
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					iterationName: [
						{ required: true, message: '迭代名称不能为空', trigger: 'change' },
						{ min:10, message: '名称长度必须大于10个字符', trigger: 'change' }
					], 
					productId: [
						{ required: true, message: '产品编号不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 迭代定义
				addForm: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',seqNo:'',productName:'',productId:'',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				userSelectVisible:false,
				productSelectVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交XmIteration 迭代定义 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {  
				this.$refs.addForm.validate((valid) => {
					if (valid) {  
						var params={...this.addForm} 
						this.$confirm('确认提交迭代吗？', '提示', {}).then(() => { 
							this.load.add=true 
							addXmIteration(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){ 
									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: "表单验证不通过", type: 'error' }); 
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			
			onUserSelected: function(users) {
				if(users.length>1){
					this.$notify.error("只能选一个人");
					return;
				}
				var user=users[0]
				this.addForm.adminUserid=user.userid
				this.addForm.adminUsername=user.username
				this.userSelectVisible = false;
			},	
			onProductRowClick(product){
				this.addForm.productId=product.id
				this.addForm.productName=product.productName
				this.productSelectVisible=false;
			}, 
			onProductClearSelect(){ 
				this.addForm.productId=''
				this.addForm.productName=''
				this.productSelectVisible=false;
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'xm-iteration-edit':XmIterationEdit
			UsersSelect,XmProductSelect,
		},
		mounted() {

			this.addForm=Object.assign(this.addForm, this.xmIteration);   
			this.addForm.cuserid=this.userInfo.userid
			this.addForm.cusername=this.userInfo.username
			this.addForm.adminUserid=this.userInfo.userid
			this.addForm.adminUsername=this.userInfo.username;
			if(this.xmProduct && this.xmProduct.id){
				
				this.addForm.productId=this.xmProduct.id
				this.addForm.productName=this.xmProduct.productName;
			}
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>