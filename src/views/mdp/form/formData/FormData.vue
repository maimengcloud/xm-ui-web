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
			 
			<!--新增界面 FormData 表单数据表--> 
			<el-form :model="editForm"  :label-width="labelWidth()" :show-message="true"    :rules="editFormRules" ref="editForm"> 
				<el-col :span="spanCalc(item)" v-for="(item,index) in formFields" :key="index"> 
					<!--用户-->
					<div  v-if="item.qx=='nr'"></div>
					<el-form-item   v-else-if=" item.extFieldType=='user'"   :label="item.fieldTitle" :prop="item.fieldIdCamel" > 
						<el-select :disabled="item.qx=='r'"   @change="onSelectChange" v-if="item.fieldType=='select' && item.isMultiple=='0'"  v-model="editForm[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择">
										<el-option
										v-for="item in filters.users"
										:key="item.userid"
										:label="item.username"
										:value="item.userid">
										<span style="float: left">{{ item.username }}</span>
											<span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
										</el-option>
						</el-select>
						<el-button  v-if="item.fieldType=='select' && item.isMultiple=='0'" icon="el-icon-search" @click="showUserSelectDialog(item.fieldIdCamel)">更多</el-button>
						<el-select :disabled="item.qx=='r'"   @change="onSelectChange" v-if="item.fieldType=='select' && item.isMultiple=='1' " multiple v-model="multipleFieldsData[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择">
										<el-option
										v-for="item in  filters.users"
										:key="item.userid"
										:label="item.username"
										:value="item.userid">
										<span style="float: left">{{ item.username }}</span>
											<span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
										</el-option>
						</el-select>
						<el-button  v-if="item.fieldType=='select' && item.isMultiple=='1'  && item.isFromBaseData=='1'" icon="el-icon-search" @click="showUserSelectDialog(item.fieldIdCamel)">更多</el-button>
						
					</el-form-item>
					<!--部门-->
					<el-form-item   v-else-if=" item.extFieldType=='deppt'"   :label="item.fieldTitle" :prop="item.fieldIdCamel" > 
						<dept-tree  v-if="item.extFieldType=='dept' && item.isMultiple=='1'" :branch-id="userInfo.branchId" default-expand-all show-checkbox multiple :expand-on-click-node="false" :ref="'dept_'+item.fieldIdCamel"></dept-tree>
						<dept-tree  v-if="item.extFieldType=='dept' && item.isMultiple!='1'" :branch-id="userInfo.branchId" default-expand-all show-checkbox  :expand-on-click-node="false" :ref="'dept_'+item.fieldIdCamel"></dept-tree>  
					</el-form-item>

					<!--下拉框-->
					<el-form-item   v-else-if=" item.fieldType=='select'"   :label="item.fieldTitle" :prop="item.fieldIdCamel" > 
						<el-select :disabled="item.qx=='r'"  @change="onSelectChange"  v-if=" item.isMultiple!='1' && item.isFromBaseData=='1'"  v-model="editForm[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择">
							<el-option  v-for=" option in options2[item.secondCodeRow]" :key="option.optionValue" :label="option.optionName" :value="option.optionValue"> </el-option>
						</el-select>
						<el-select :disabled="item.qx=='r'"   @change="onSelectChange" v-else-if="item.isMultiple=='1' && item.isFromBaseData=='1'" multiple v-model="multipleFieldsData[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择">
							<el-option   v-for=" option in options2[item.secondCodeRow]" :key="option.optionValue" :label="option.optionName" :value="option.optionValue"> </el-option>
						</el-select>
						
						<el-select :disabled="item.qx=='r'"   @change="onSelectChange" v-else-if="item.isMultiple=='1' && item.isFromBaseData!='1'" multiple v-model="multipleFieldsData[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择">
							<el-option   v-for=" option in options2[item.fieldIdCamel]" :key="option.optionValue" :label="option.optionName" :value="option.optionValue"> </el-option>
						</el-select>
						
						<el-select :disabled="item.qx=='r'"   @change="onSelectChange" v-else  v-model="editForm[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择">
							<el-option   v-for=" option in options2[item.fieldIdCamel]" :key="option.optionValue" :label="option.optionName" :value="option.optionValue"> </el-option>
						</el-select>
						<el-time-picker :disabled="item.qx=='r'"   v-if="item.fieldType=='time'"  v-model="editForm[item.fieldIdCamel]"  placeholder="任意时间点"> </el-time-picker> 
						<el-date-picker :disabled="item.qx=='r'"   v-if="item.fieldType=='date'" v-model="editForm[item.fieldIdCamel]" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"> </el-date-picker>
						<el-date-picker :disabled="item.qx=='r'" v-if="item.fieldType=='datetime'" v-model="editForm[item.fieldIdCamel]" type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions"> </el-date-picker>
						
					
					</el-form-item> 

					<!--checkbox-->
					<el-form-item   v-else-if="item.fieldType=='checkbox'"   :label="item.fieldTitle" :prop="item.fieldIdCamel" > 
						<el-checkbox :disabled="item.qx=='r'"  @change="onSelectChange" v-if="item.isMultiple=='0'" v-model="editForm[item.fieldIdCamel]" true-label="1" false-label="0">{{item.fieldTitle}}</el-checkbox>
						<el-checkbox-group   v-else v-model="multipleFieldsData[item.fieldIdCamel]"> 
							<el-checkbox :disabled="item.qx=='r'"    v-for=" option in options2[item.secondCodeRow]" :label="option.optionValue" :key="option.optionValue">{{option.optionName}}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>

					<!--redio-->
					<el-form-item   v-else-if="item.fieldType=='radio'"   :label="item.fieldTitle" :prop="item.fieldIdCamel" >   
						<el-radio-group :disabled="item.qx=='r'" @change="onSelectChange"   v-if="item.isFromBaseData=='1' " v-model="editForm[item.fieldIdCamel]">
							<el-radio   v-for=" option in options2[item.secondCodeRow]" :label="option.optionValue" :key="option.optionValue">{{option.optionName}}</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item   v-else   :label="item.fieldTitle" :prop="item.fieldIdCamel" > 
						<el-input  :disabled="item.qx=='r'" v-if="item.fieldType=='text'"  style="width:99%;" v-model="editForm[item.fieldIdCamel]" :label="item.fieldTitle" auto-complete="off" :placeholder="item.placeholder"  clearable > </el-input>
						<el-input-number :disabled="item.qx=='r'"   v-else-if="item.fieldType=='number'" v-model="editForm[item.fieldIdCamel]" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable ></el-input-number>
						<el-input-number :disabled="item.qx=='r'"   v-else-if="item.fieldType=='amount'" v-model="editForm[item.fieldIdCamel]" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable></el-input-number>
						<el-input :disabled="item.qx=='r'"   v-else-if="item.fieldType=='textarea'"  type="textarea" :rows="2" v-model="editForm[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请输入内容"></el-input>
						<el-time-picker :disabled="item.qx=='r'"   v-else-if="item.fieldType=='time'"  v-model="editForm[item.fieldIdCamel]"  placeholder="任意时间点"> </el-time-picker> 
						<el-date-picker :disabled="item.qx=='r'"   v-else-if="item.fieldType=='date'" v-model="editForm[item.fieldIdCamel]" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"> </el-date-picker>
						<el-date-picker :disabled="item.qx=='r'" v-else-if="item.fieldType=='datetime'" v-model="editForm[item.fieldIdCamel]" type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions"> </el-date-picker>
						<el-date-picker :disabled="item.qx=='r'" v-else-if="item.fieldType=='month'" v-model="editForm[item.fieldIdCamel]" type="month" placeholder="选择月份"></el-date-picker>
						<el-date-picker :disabled="item.qx=='r'" v-else-if="item.fieldType=='year'" v-model="editForm[item.fieldIdCamel]" type="month" placeholder="选择年"></el-date-picker>
					</el-form-item> 
				</el-col>
				<slot>
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>  
						</el-col>
					</el-col> 
				</el-form-item> 
				</slot>
			</el-form>
			
			<el-dialog append-to-body
				title="选择员工"
				:visible.sync="userSelectVisible"
				width="60%">  
				<users-select :select-userids="filters.users?[filters.users.userid]:[]"   @confirm="onUserSelected"></users-select> 
			</el-dialog>  
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库	
	import { listOption,listOptionByItemIds } from '@/api/itemOption';//下拉框数据查询
	import { editFormData } from '@/api/mdp/form/formData';
	import { mapGetters } from 'vuex' 
	import { listUser } from '@/api/mdp/sys/user';//下拉框数据查询
	import DeptTree from '@/views/mdp/sys/dept/DeptTree';//下拉框数据查询
	
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect'; 
	export default { 
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
			]),
			screenWidth:function(){
				return screen.width
			}
		},
		props:['formData','formDef','formFields','submitEvent'],
		watch: {
		  'submitEvent':function(submitEvent) {  
				  this.editSubmit();  
	      },
	      'formData':function( formData ) {
			  if(formData==null){
				  return;
			  }
			   this.editForm = Object.assign({},formData); 
	       
	      },
	      'formFields':function(formFields) { 
				this.$nextTick(() => {
			      	 this.initMultipleFieldsData();
			      	 this.getOptions2();
						this.formFields.forEach(item=>{ 
							if(item.isMultiple!='1' && item.extFieldType!='dept'){
								if(item.isRequired=='1'||item.qx){
									if(item.qx=='frw'){
										this.editFormRules[item.fieldIdCamel]= [{ required: true, message: item.fieldTitle+'不能为空', trigger: 'blur' }]
									}
									/**else if(!item.qx && item.isRequired=='1'){
										this.editFormRules[item.fieldIdCamel]= [{ required: true, message: item.fieldTitle+'不能为空', trigger: 'blur' }]
									}
									**/
									
								}
								
							} 
						});
	          		
	        	});

	      } 
	    },	
		data() {
			return {
				
				filters:{
					users:[]
				},
				pickerOptions: { 
					shortcuts: [{
						text: '今天',
						onClick(picker) {
						picker.$emit('pick', new Date());
						}
					}, {
						text: '昨天',
						onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() - 3600 * 1000 * 24);
						picker.$emit('pick', date);
						}
					}, {
						text: '一周前',
						onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', date);
						}
					}]
					},
				options:{},//下拉选择框的所有静态数据

				editLoading: false,
				editFormRules: {
					zero: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					one: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					two: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					three: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					four: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					five: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					six: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					seven: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					eight: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					nine: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					ten: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					eleven: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					twelve: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					thirteen: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					fourteen: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					fifteen: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					attachmentUrls: [
						{ required: false, message: '主键', trigger: 'blur' }
					],
					attachmentNames: [
						{ required: false, message: '主键', trigger: 'blur' }
					]
				},
				//新增界面数据 表单数据表
				editForm: {
					id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',attachmentUrls:'',attachmentNames:'',flowState:'0'
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				options2:{},
				multipleFieldsData:{
					zero:[], one:[],two:[], three:[], four:[], five:[], six:[], eight:[], nine:[], ten:[], eleven:[], twelve:[],thirteen:[],fourteen:[],fifteen:[],attachmentUrls:[],attachmentNames:[]
				},
				companyEmployees:[],
				
				userSelectVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			 labelWidth:function(){
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
				var span=screen.width>500?12:24
				if(item.fieldType=="textarea"){
					span=24;
				}
				return span;
			},
			//新增提交FormData 表单数据表 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						var checkOk=true;
						this.formFields.forEach(item=>{ 
							if(item.extFieldType=='dept'){
								let deptids=this.$refs['dept_'+item.fieldIdCamel][0].$refs.deptTree.getCheckedKeys(); 
								if(item.isRequired=='1'){
									if(!deptids||deptids.length<=0){
										this.$message({ message: item.fieldTitle+'不能为空', type: 'error' }); 
										checkOk=false;
										return;
									}
								} 
							}
							if(item.isMultiple=='1' && item.extFieldType!='dept'){
								if(item.isRequired=='1'){
									if(!this.multipleFieldsData[item.fieldIdCamel]||this.multipleFieldsData[item.fieldIdCamel].length<=0){
										this.$message({ message: item.fieldTitle+'不能为空', type: 'error' }); 
										checkOk=false;
										return;
									}
								} 
							}
						
						});
						if(checkOk==false){ 
							return false;
						}  
							this.editLoading = true;  
							let params = Object.assign({}, this.editForm); 
							if(params.formId==null || params.formId==''){
								params.formId=this.formDef.id
							}
							params.userid=this.userInfo.userid
							if(!params.branchId){
								params.branchId=this.userInfo.branchId
							}
							if(!params.cuserid){
								params.cuserid=this.userInfo.cuserid
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
							var bizKeys=[];
							if(this.formFields!=null && this.formFields.length>0){
								var isBizKey=this.formFields[0].isBizKey;
								if(isBizKey && isBizKey.length==3){
									if(isBizKey.charAt(0)=="1"){
										 bizKeys.push(params.cuserid);
									} 
									if(isBizKey.charAt(1)=="1"){
										 bizKeys.push(params.deptid);
									} 
								}
							}
							var changeData=false;
							this.formFields.forEach(item=>{
								if(item.fieldType=='date'){
									let da=params[item.fieldIdCamel];
									if(da!==null && da!='' && da instanceof Date){
										var year = da.getFullYear();
									    var month = da.getMonth()+1;
									    var date = da.getDate();
										params[item.fieldIdCamel]=[year,month,date].join('-');
									}else{
										params[item.fieldIdCamel]=da
									}
								}
								if(item.fieldType=='month'){
									let da=params[item.fieldIdCamel];
									if(da!==null && da!='' && da instanceof Date){
										var year = da.getFullYear();
									    var month = da.getMonth()+1;
									    var date = da.getDate();
										params[item.fieldIdCamel]=[year,month].join('-');
									}else{
										params[item.fieldIdCamel]=da
									}
								}
								if(item.fieldType=='year'){
									let da=params[item.fieldIdCamel];
									if(da!==null && da!='' && da instanceof Date){
										var year = da.getFullYear();
									    var month = da.getMonth()+1;
									    var date = da.getDate();
										params[item.fieldIdCamel]=[year].join('-');
									}else{
										params[item.fieldIdCamel]=da
									}
								}
								if(item.extFieldType=='dept'){
									let deptids=this.$refs['dept_'+item.fieldIdCamel][0].$refs.deptTree.getCheckedKeys();  
									params[item.fieldIdCamel]=deptids.join(',');
								}
								if(item.isMultiple=='1' && item.extFieldType!='dept'){ 
									params[item.fieldIdCamel]=this.multipleFieldsData[item.fieldIdCamel].join(',');
								}
								if(item.isBizKey.charAt(2)=="1"){
									bizKeys.push(params[item.fieldIdCamel]);
								}
								if(params[item.fieldIdCamel]!=this.formData[item.fieldIdCamel]){
									params.changeData=true;
								}
							
							});
							if(bizKeys.length==0){
								if(params.id){
									bizKeys.push(params.id);
								}
								
							}
							if(bizKeys.length>0){
								params.bizKey=bizKeys.join(","); 
							}
							
							this.$emit('submit',params);//  @submit="afterAddSubmit" 
							//this.$message({ message: "检查通过2", type: 'success' }); 
							//console.log("params----------"+JSON.stringify(params));
							//return params;
							
							/**
							editFormData(params).then((res) => {
								this.editLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.editLoading = false;
							});
							**/ 
					}
				});
			},
			onSelectChange: function(val){
				this.$refs.editForm.validate();
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			//二級分類行被選中
			getOptions2( ){
				this.dataListVisible=false;
				let secondCodeRows=[];
				let hasUserField=false;
				this.formFields.forEach(item=>{
					if(item.isFromBaseData=='1' && item.secondCodeRow!=''){
						secondCodeRows.push(item.secondCodeRow);
					}
					if(item.extFieldType=='user'){
						hasUserField=true;
					}
				});
				if(secondCodeRows.length>0){
					listOptionByItemIds(secondCodeRows).then(res=>{
						console.log(res.data);
						this.options2=res.data.data;
					});
				}  
				if(hasUserField){
					if(this.companyEmployees.length<=0){
						listUser({branchId:this.userInfo.branchId}).then(res=>{
							this.companyEmployees=res.data.data;
							console.log(res.data.data);
						});
					}
				}
					
			},	
			initMultipleFieldsData(){
				//this.multipleFieldsData=Object.assign({}, {}); 
				this.formFields.forEach(item=>{
					if(item.isMultiple=='1' && item.extFieldType!='dept'){
						if(!this.formData[item.fieldIdCamel] || this.formData[item.fieldIdCamel]==''|| this.formData[item.fieldIdCamel]==null){
							this.multipleFieldsData[item.fieldIdCamel]=[];
						}else{
							this.multipleFieldsData[item.fieldIdCamel]=this.formData[item.fieldIdCamel].split(',');
						} 
					}else if(item.extFieldType=='dept'){
						if(!this.formData[item.fieldIdCamel] || this.formData[item.fieldIdCamel]==null || this.formData[item.fieldIdCamel]==''){
							this.$refs['dept_'+item.fieldIdCamel][0].$refs.deptTree.setCheckedKeys([]);
						}else{
							this.$refs['dept_'+item.fieldIdCamel][0].$refs.deptTree.setCheckedKeys(this.formData[item.fieldIdCamel].split(','));
						}
						
					}
				});
			},
			
			onUserSelected:function(users){
				this.userSelectVisible=false;
				this.filters.users=users;
			},
			showUserSelectDialog:function(fieldIdCamel){
				this.userSelectVisible=true;
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'form-data-edit':FormDataEdit

		    'dept-tree': DeptTree,UsersSelect
		},
		mounted() {
			this.formFields.forEach(item=>{ 
				if(item.isRequired=='1' && item.isMultiple!='1' && item.extFieldType!='dept'){
					this.editFormRules[item.fieldIdCamel]= [{ required: true, message: item.fieldTitle+'不能为空', trigger: 'blur' }]
				} 
				if(item.fieldType=='number'){
					if(item.defaultValue!='' && item.defaultValue!=null){
						this.editForm[item.fieldIdCamel]=parseInt(item.defaultValue)
					}else{
						this.editForm[item.fieldIdCamel]=0;
					}
				} else{
					if(item.defaultValue!='' && item.defaultValue!=null){
						this.editForm[item.fieldIdCamel]=item.defaultValue
					} 
				}
			});
			this.$nextTick(() => {
				this.editForm=Object.assign(this.editForm, this.formData); 
				this.initMultipleFieldsData();
          		this.getOptions2();
          		
        	});
  
			
		}//end mounted
	}

</script>

<style scoped>

</style>