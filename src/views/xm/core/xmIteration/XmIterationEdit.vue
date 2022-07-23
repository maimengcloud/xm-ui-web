<template>
	<section class="padding border"> 
		<el-row>
			<!--新增界面 XmIteration 迭代定义--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm" label-position="left">  
				<el-row class="label-font-color"> <span v-if="opType!=='add'">迭代编号：{{editForm.id}} &nbsp;&nbsp;</span>归属产品：{{editForm.productName?editForm.productName:editForm.productId}}</el-row>
				<el-form-item label="迭代名称" prop="iterationName">
					<el-input v-model="editForm.iterationName" placeholder="迭代名称 选择上线日期后会自动生成名字"  @change="editSomeFields(editForm,'iterationName',$event)"></el-input>

				</el-form-item> 
				<el-form-item label="序号" prop="seqNo" v-if="opType!=='add'">
					<el-input v-model="editForm.seqNo" placeholder="如1.0，2.0，1.1.1等"  @change="editSomeFields(editForm,'seqNo',$event)"></el-input>
				</el-form-item> 
				<el-row>
					 
					<el-col :span="12"> 
						<el-form-item prop="onlineTime" label-width="0px">
							<date-field label="上线时间"  type="date" placeholder="选择日期" v-model="editForm.onlineTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" @change="editSomeFields(editForm,'onlineTime',$event)"></date-field>
						</el-form-item>   
					</el-col>
					<el-col :span="12"> 
				
						<el-form-item prop="startTime"  label-width="0px">
							<date-range-field label="起止时间" :auto-default="false" start-key="startTime" end-key="endTime" v-model="editForm" placeholder="选择日期"   value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" @change="editSomeFields(editForm,'startTime',$event)"></date-range-field>
						</el-form-item>  
					</el-col>
				</el-row>   
				<el-row>
					<el-col :span="12"> 
						<el-form-item prop="adminUserid" label-width="0px">
							<xm-user-field label="负责人姓名" v-model="editForm" userid-key="adminUserid" username-key="adminUsername"  @change="editSomeFields(editForm,'adminUserid',$event)"></xm-user-field>
						</el-form-item>   
					</el-col>
					<el-col :span="12">
						<el-form-item  prop="istatus" label-width="0px">
							<dict-field label="状态" :dict="dicts['iterationStatus']" v-model="editForm.istatus" @change="editSomeFields(editForm,'istatus',$event)"></dict-field>
							
						</el-form-item> 
					</el-col> 
				</el-row>   
			</el-form>
		</el-row> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	import { initDicts,editXmIteration,editSomeFieldsXmIteration } from '@/api/xm/core/xmIteration';
	import { mapGetters } from 'vuex'	
 
	import XmUserField from "@/views/xm/core/components/XmUserField";
	
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
		props:['xmIteration','visible','opType','xmProduct'],
		watch: {
			'xmIteration':{
				handler(){
					 this.initData();
				},
				deep:true,
			}, 
	      'visible':function(visible) { 
	      	if(visible==true){ 
				this.initData();
	      	}
	      },
		  'editForm.onlineTime':function(val){
			  if(!val){
				  return;
			  }
			  if(this.opType!=='add'){
				return;
			  }
			  var date=val.substr(0,10)
			  date=date.replaceAll('-','');
			  this.editForm.iterationName=date+(this.editForm.productName?this.editForm.productName:'-请修改-')+'V1.0.0'
		  },
		  'editForm.productName':function(val){
			  var date=this.editForm.onlineTime
			  if(!date){
				  return;
			  }
			  
			  if(this.opType!=='add'){
				return;
			  }
			  date=date.substr(0,10)
			  date=date.replaceAll('-','');
			  this.editForm.iterationName=date+(this.editForm.productName?this.editForm.productName:'-请修改-')+'V1.0.0'
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
				if(this.opType==='add'){
					return;
				}
                let params={};
                params['ids']=[row].map(i=>i.id)
				if(fieldName=='adminUserid'){
					params['adminUserid']=$event[0].userid 
					params['adminUsername']=$event[0].username
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
			initData(){ 
				this.editForm=Object.assign(this.editForm, this.xmIteration);   
				if(this.opType==='add'){
					this.editForm.cuserid=this.userInfo.userid
					this.editForm.cusername=this.userInfo.username
					this.editForm.adminUserid=this.userInfo.userid
					this.editForm.adminUsername=this.userInfo.username;
					if(this.xmProduct && this.xmProduct.id){ 
						this.editForm.productId=this.xmProduct.id
						this.editForm.productName=this.xmProduct.productName;
					} 
				} 
				this.editFormBak={...this.editForm}
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'xm-iteration-edit':XmIterationEdit
			XmUserField
		},
		mounted() { 
			this.$nextTick(()=>{
				initDicts(this)
				this.initData()
				
			})
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>