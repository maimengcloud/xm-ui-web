<template>
	<section class="padding border">
		 
		<el-row style="padding-left:70px;">
			 <font color="blue" style="text-align:center;">注意：请尽量在评审会阶段把需求明确，进入计划会后，不允许再添加需求进入迭代。原则上需求评审后需求只出不进。</font>
		</el-row>
		<el-row>
			<!--新增界面 XmIteration 迭代定义--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">  
				<el-form-item label="迭代名称" prop="iterationName">
					<el-input v-model="editForm.iterationName" placeholder="迭代名称"  @change="editSomeFields(editForm,'iterationName',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="序号" prop="seqNo">
					<el-input v-model="editForm.seqNo" placeholder="如1.0，2.0，1.1.1等"  @change="editSomeFields(editForm,'seqNo',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="状态" prop="istatus">
					
					<el-select v-model="editForm.istatus" @change="editSomeFields(editForm,'istatus',$event)">
					<el-option v-for="(item,index) in dicts['iterationStatus']" :key="index" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item> 
				<el-form-item label="起止时间" prop="startTime">
					<date-range :auto-default="false" start-key="startTime" end-key="endTime" v-model="editForm" placeholder="选择日期"   value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" @change="editSomeFields(editForm,'startTime',$event)"></date-range>
				</el-form-item>  
				<el-form-item label="上线时间" prop="onlineTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.onlineTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" @change="editSomeFields(editForm,'onlineTime',$event)"></el-date-picker>
				</el-form-item>   
				<el-form-item label="负责人姓名" prop="adminUsername">
					{{editForm.adminUsername}} <el-button type="text" @click="userSelectVisible=true">选择负责人</el-button>
				</el-form-item>  
				<el-form-item label="预算工作量" prop="budgetWorkload">
					<el-input v-model="editForm.budgetWorkload" type="number" min="0" style="width:60%;" placeholder="预算工作量" @change="editSomeFields(editForm,'budgetWorkload',$event)"></el-input> 人时 ，1人工作1日=8人时
				</el-form-item>     
			</el-form>
		</el-row>
		
		<el-drawer append-to-body title="选择员工" :visible.sync="userSelectVisible" size="60%">
        	<users-select v-if="userSelectVisible" :select-userids="[]" @confirm="onUserSelected" ref="usersSelect"></users-select>
      	</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	import { initDicts,editXmIteration,editSomeFieldsXmIteration } from '@/api/xm/core/xmIteration';
	import { mapGetters } from 'vuex'	
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";

	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),
			calcIterationCurrStep(){
				var istatus= this.dicts.iterationStatus
				if(!istatus){
					return 1;
				}else{
					var status=istatus.findIndex(i=>this.editForm.iphase==i.id)
					if(status>=0){
						return status+1;
					}else{
						return 1;
					}
				}
			} 
		},
		props:['xmIteration','visible'],
		watch: {
			'xmIteration':{
				handler(){
					this.editForm=Object.assign(this.editForm, this.xmIteration);
					this.editFormBak={...this.editForm}
				},
				deep:true,
			}, 
	      'visible':function(visible) { 
	      	if(visible==true){ 
	      	}
	      } 
	    },
		data() {
			return {
				dicts:{iterationStatus:[]},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: { 
					iterationName: [
						{ required: true, message: '迭代名称不能为空', trigger: 'change' },
						{ min:10,max:250, message: '名称长度在10-250个字符', trigger: 'change' }
					],
					seqNo: [
						{ required: true, message: '序号不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 迭代定义,
				editForm: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',seqNo:'',istatus:'',cuserid:'',cusername:'',remark:'',iphase:'',isTpl:'',productId:''
				},
				editFormBak: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',seqNo:'',istatus:'',cuserid:'',cusername:'',remark:'',iphase:'',isTpl:'',productId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				userSelectVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			}, 
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			
			onUserSelected: function(users) {   
				if(users.length>1){
					this.$notify.error("只能选一个人");
					return;
				}
				var user=users[0] 
				this.editSomeFields(this.editForm,'adminUserid',user)
				this.userSelectVisible = false;
			},	

            editSomeFields(row,fieldName,$event){ 
                let params={};
                params['ids']=[row].map(i=>i.id)
				if(fieldName=='adminUserid'){
					params['adminUserid']=$event.userid 
					params['adminUsername']=$event.username
				}else if(fieldName=='startTime'){
					params['startTime']=row.startTime
					params['endTime']=row.endTime
				}else{
					params[fieldName]=$event
				}
                
                var func = editSomeFieldsXmIteration
                func(params).then(res=>{
                  let tips = res.data.tips;
                  if(tips.isOk){
                    this.editFormBak=[...this.editForm]
					Object.assign(this.editForm,params)
					this.$emit('edit-fields',params)
                  }else{
                    Object.assign(this.editForm,this.editFormBak)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
            },
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'xm-iteration-edit':XmIterationEdit
			UsersSelect
		},
		mounted() { 
			this.$nextTick(()=>{
				initDicts(this)
				this.editForm=Object.assign(this.editForm, this.xmIteration);   
				this.editFormBak={...this.editForm}
			})
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>