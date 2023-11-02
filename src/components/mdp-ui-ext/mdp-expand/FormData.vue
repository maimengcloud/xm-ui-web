<template>
	<section>
		<el-row v-if="fields.length>0"> 
 			<!--新增界面 FormData 表单数据表--> 
			<el-form :model="editForm" :label-width="labelWidthCpd" :label-position="labelPosition" :show-message="true" :rules="editFormRules" ref="editForm"> 
				<el-col :span="spanCalc(item)" v-for="(item,index) in fields" :key="index">  
					 <mdp-form-data-item v-if="isExtInfosCpd" v-model="editForm[camelDataField+'2']" :field="item"></mdp-form-data-item>      
					 <mdp-form-data-item v-else v-model="editForm" :field="item"></mdp-form-data-item>    
				</el-col>
			</el-form> 
		</el-row>
		
		<slot>
			<el-row class="footer"> 
				<el-button @click.native="handleCancel">关闭</el-button>  
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>   
			</el-row> 
		</slot>  
	</section>
</template>

<script> 
	import { mapGetters } from 'vuex'  
	import MdpFormDataItem from './FormDataItem.vue'
	
import treeTool from '@/components/mdp-ui/js/treeTool.js'
	/**
	 * 表单数据填单
	 */
	export default { 
	    computed: {
		    ...mapGetters([
		      'userInfo','roles','myDepts'
			]),
			labelWidthCpd:function(){
				if(this.labelWidth){
					return this.labelWidth
				}
				return this.labelWidthCalc();
			},
			fieldsCpd:function(){
				var formFields=this.formFields?this.formFields:[]
				formFields.forEach(k=>{			//权限控制
					this.initFieldQx(k)  
				})
				return formFields
			},
			
			isExtInfosCpd(){ 
				return this.formDef?this.formDef.dataType=='2':false
			},
			camelDataField(){
				if(this.formDef){
					return this.$mdp.toCamel(this.formDef.dataField)
				}else{
					return 'extInfos2'
				}
				
			},
		},
		props:{
			
			visible:{type:Boolean,default:false},
			value:{type:Object,default:null},
			formDef:{type:Object,default:null},
			formFields:{type:Array,default:null}, 
			labelWidth:{type:String,default:null},			
			labelPosition:{type:String,default:null}, 
			span:{
				type:Number,
				default:24
			}
		},
		watch: {
			value:function(){
				this.initData()
			}, 
			'formFields':function(formFields) {  
				this.initByFormFields()
			},  
	    },	
		data() {
			return {
				
				filters:{
					users:[]
				},
				pickerOptions: this.$mdp.getPickerOptions(),

				editLoading: false,
				editFormRules: {
					 
				},
				//新增界面数据 表单数据表
				editForm: {
  				},  
				//最原始的数据，用于与最新的editForm比较，获得修改日志
				editFormBak:null,
				fields:[],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			labelWidthCalc:function(){
				if (screen.width <=375){
					return "80px"
				}else  if (screen.width <= 500){
						return "80px"
				}else if (screen.width<=1024){
						return "100px"
				}else {
						return "120px"
				}
			} , 
			spanCalc:function(item){
				 
				if(item.span){ 
					return item.span;
				}
				return this.span;
			}, 
			//新增提交FormData 表单数据表 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) { 
						debugger
							this.editLoading = true;  
							let params = Object.assign({}, this.editForm);  
							if(this.isExtInfosCpd){
								var extInfos=[]
								var extInfos2=this.editForm[this.camelDataField+"2"]
								Object.keys(extInfos2).forEach(k=>{
									var key=k
									var extInfo={id:key,value:extInfos2[k]}
									extInfos.push(extInfo) 
								})
								delete params[this.camelDataField+"2"]
								params[this.camelDataField]=JSON.stringify(extInfos)
							}
							if(params.formId==null || params.formId==''){
								params.formId=this.formDef.id
							}
							params.userid=this.userInfo.userid
							if(!params.branchId){
								params.branchId=this.userInfo.branchId
							}
							if(!params.cuserid){
								params.cuserid=this.userInfo.userid
							}
							
							if(!params.cusername){
								params.cusername=this.userInfo.username
							} 
							if(!params.deptid){
								params.deptid=this.userInfo.deptid
							} 
							if(!params.deptName){
								params.deptName=this.userInfo.deptName
							}   
							this.$emit('input',params)
							this.$emit('submit',params);//  @submit="afterAddSubmit"  
					}
				}); 
			}, 
			/**end 在上面加自定义方法**/
			onFieldChange(val,field){ 
				if(!this.editFormBak){
					this.editFormBak={...this.value}
				}  
 				this.$nextTick(()=>{
					this.$refs.editForm.validateField([field.fieldIdCamel])
				})
				this.$nextTick(()=>{
					this.$emit('input',this.editForm)
					this.$emit('change',this.editForm,this.getChangeLogs())
				})
				
			},
			initByFormFields(){ 
				this.initData();
				this.formFields.forEach(item=>{ 
					if(item.isRequired=='1' ){
						this.editFormRules[item.fieldIdCamel]=[{ required: true, message: item.fieldTitle+'不能为空', trigger: 'blur' }] 
 					}   
					this.initFieldQx(item) 
				});
				this.fields=treeTool.translateDataToTree(this.formFields,'pid','id') 
				this.$nextTick(()=>{
					this.$refs['editForm'].clearValidate();
				}) 
				
				
			},
			initFieldQx(item){ 
				
				var myUserid=this.userInfo.userid
				var myDeptids=this.myDepts?this.myDepts.map(d=>d.deptid):[]
				var myRoleids=this.roles?this.roles.map(r=>r.roleid):[]
				var myDataLvl=this.userInfo.maxDataLvl
				if(item.fieldQx){ 
					
					item.nr=false
					item.ne=false
					var fieldQx=JSON.parse(item.fieldQx)
					if(!fieldQx.othQuery){
						item.nr=false
					}else if(fieldQx.othQuery=='0'){
						item.nr=true
						item.ne=true
					}else if(fieldQx.othQuery=='1'){
						if(item.qryMinLvl && myDataLvl<item.qryMinLvl){
							item.nr=true
							item.ne=true
						}else{
							var qryUserids=fieldQx.qryUserids?fieldQx.qryUserids.split(","):[]
							var qryDeptids=fieldQx.qryDeptids?fieldQx.qryDeptids.split(","):[]
							var qryRoleids=fieldQx.qryRoleids?fieldQx.qryRoleids.split(","):[] 
							if(qryUserids.some(u=>u==myUserid)){
								item.nr=false
							}
							 if(qryDeptids.some(u=>u==myDeptids.some(d=>d==u))){
								item.nr=false
							}
							if(qryRoleids.some(r=>myRoleids.some(mr=>mr==r))){
								item.nr=false
							}
							
							var nqUserids=fieldQx.nqUserids?fieldQx.nqUserids.split(","):[]
							var nqDeptids=fieldQx.nqDeptids?fieldQx.nqDeptids.split(","):[]
							var nqRoleids=fieldQx.nqRoleids?fieldQx.nqRoleids.split(","):[] 
							if(nqUserids.some(u=>u==myUserid)){
								item.nr=true
								item.ne=true
							}else if(nqDeptids.some(d=>myDeptids.some(k=>k==d))){
								item.nr=true
								item.ne=true
							}else if(nqRoleids.some(r=>myRoleids.some(mr=>mr==r))){
								item.nr=true
								item.ne=true
							}
						}
						
					}
					if(item.editMinLvl && myDataLvl<item.editMinLvl){
 						item.ne=true
					}else{
						if(!fieldQx.othEdit){
							item.ne=false
						}else if(fieldQx.othEdit=='0'){ 
							item.ne=true
						}else if(fieldQx.othEdit=='1'){
							var editUserids=fieldQx.editUserids?fieldQx.editUserids.split(","):[]
							var editDeptids=fieldQx.editDeptids?fieldQx.editDeptids.split(","):[]
							var editRoleids=fieldQx.editRoleids?fieldQx.editRoleids.split(","):[] 
							if(editUserids.some(u=>u==myUserid)){
								item.ne=false
							}
							if(editDeptids.some(d=>myDeptids.some(k=>k==d))){
								item.ne=false
							}
							if(editRoleids.some(r=>myRoleids.some(mr=>mr==r))){
								item.ne=false
							}
							
							var neUserids=fieldQx.neUserids?fieldQx.neUserids.split(","):[]
							var neDeptids=fieldQx.neDeptids?fieldQx.neDeptids.split(","):[]
							var neRoleids=fieldQx.neRoleids?fieldQx.neRoleids.split(","):[] 
							if(neUserids.some(u=>u==myUserid)){ 
								item.ne=true
							}else if(neDeptids.some(d=>myDeptids.some(k=>k==d))){ 
								item.ne=true
							}else if(neRoleids.some(r=>myRoleids.some(mr=>mr==r))){ 
								item.ne=true
							}
						}
					}

				}else{
					item.nr=false
					item.ne=false
				}
				this.$set(item,'nr',item.nr)
				this.$set(item,'ne',item.ne)

			},
			//[log1,log2],其中log1={fieldId:'字段编号',oldVal:'原值',currVal:'修改后的值',fieldTitle:'字段名称'}
			getChangeLogs(){ 
				if(this.editFormBak==null){
					return null
				}else{
					var keys=Object.keys(this.editForm)
					var changeLogs=[]
					keys.forEach(key=>{
						var field=this.formFields.find(k=>k.fieldIdCamel==key)
						if(field){
							var oldVal=this.editFormBak[key]
							var currVal=this.editForm[key] 
							var log={}
							if((currVal!=oldVal && ( currVal || oldVal ))){
								if(!oldVal && currVal=='0'){

								}else{
									log={fieldId:field.fieldIdCamel,fieldTitle:field.fieldTitle,oldVal:oldVal,currVal:currVal}
									changeLogs.push(log)
								}
								
							}
							
						}
					})
					return changeLogs;
				}
			},
			initData(){
				
				if(this.value){
					this.editForm=Object.assign({},this.value)
				}else{
					this.editForm={}
				}
			}
		},//end method
		components: {   
			MdpFormDataItem,
		},
		mounted() {    
			this.initData(); 
			this.$nextTick(()=>{
				this.initByFormFields(); 
			})
			
			
			
  
			
		}//end mounted
	}

</script>

<style scoped>

</style>