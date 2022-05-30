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
		<el-col :span="10"> 
			<draggable id="delDrg"  class="dragArea" :list="delFields" :options="{group:{ name:'g1'}, animation:150}"  style="min-height:1000"  :no-transition-on-drag="true" @start="drag=true" @end="drag=false">
				<el-badge :value="delFields.length" class="item">
				  <span class="el-dropdown-link">
				   	 回收站<i class="el-icon-delete el-icon--right"></i>
				  </span>
				</el-badge>
				<h1>
					{{formDef==null?'表单名':formDef.formName}}
					<el-badge :value="selectedFields.length" class="item">
					  <span class="el-dropdown-link">
					  	 属性
					  </span>
					</el-badge>
				</h1>
			</draggable>
			<el-form class="drag" label-width="120px">
				<el-form-item >
				
				<div v-if="selectedFields.length==0">
					 <span>
				   	 	从右边拖拽属性来此 <i class="el-icon-download"></i> 
				 	 </span>
				  </div>
				  </el-form-item>
				<draggable id="sf"  class="dragArea min-height" :list="selectedFields" :options="{group:{ name:'g1'}, animation:150}" @add="add" style="min-height:1000"  :no-transition-on-drag="true" @start="drag=true" @end="drag=false">

					<el-form-item   v-for="(item,index) in selectedFields" :key="index" :label="item.fieldTitle" :prop="item.fieldId">
						<div  @click="itemClick(item,index)">
						<el-input  v-if="item.fieldType=='text'" v-model="item.defaultValue" :label="item.fieldTitle" auto-complete="off" :placeholder="item.placeholder"  clearable > </el-input>
						<el-input-number   v-if="item.fieldType=='number'" v-model="item.defaultValue" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable :min="1" :max="10" label="描述文字"></el-input-number>
						<el-input   v-if="item.fieldType=='amount'" v-model="item.defaultValue" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable></el-input>
						<el-input   v-if="item.fieldType=='textarea'"  type="textarea" :rows="2" v-model="item.defaultValue" :label="item.fieldTitle"  placeholder="请输入内容"></el-input>
						<el-select   v-if="item.fieldType=='select'" :multiple="item.isMultiple=='1'?true:false" v-model="item.defaultValue" :label="item.fieldTitle"  placeholder="请选择">
						    <el-option 
						      key="xxxx1"
						      label="数据项1-等你设置"
						      value="xxxx">
						    </el-option>
						     <el-option 
						      key="xxxx2"
						      label="数据项2-等你设置"
						      value="xxxx2">
						    </el-option>
						  </el-select>
						<el-radio-group   v-if="item.fieldType=='radio'" v-model="item.defaultValue">
							    <el-radio :label="3">备选项</el-radio>
							    <el-radio :label="6">备选项</el-radio>
							    <el-radio :label="9">备选项</el-radio>
							</el-radio-group>
							<el-checkbox   v-if="item.fieldType=='checkbox' && item.isMultiple=='0'" v-model="item.defaultValue">备选项</el-checkbox>
						  <el-checkbox-group   v-if="item.fieldType=='checkbox' && item.isMultiple=='1'"  v-model="item.defaultValue">
						    <el-checkbox label="复选框 A"></el-checkbox>
						    <el-checkbox label="复选框 B"></el-checkbox>
						    <el-checkbox label="复选框 C"></el-checkbox>
						  </el-checkbox-group>
						<el-time-picker   v-if="item.fieldType=='time'"  v-model="item.defaultValue"
						    :picker-options="{
						      selectableRange: '18:30:00 - 20:30:00'
						    }"
						    placeholder="任意时间点">
						  </el-time-picker> 
					    <el-date-picker   v-if="item.fieldType=='date'" v-model="item.defaultValue"
					      align="right"
					      type="date"
					      placeholder="选择日期"
					      :picker-options="pickerOptions1">
					    </el-date-picker>
					    <dept-tree   v-if="item.extFieldType=='dept' " v-model="item.defaultValue" root-deptid='' default-expand-all :expand-on-click-node="deptTree.expandOnClickNode" :refresh="deptTree.refreshTree" v-on:nodeClick="handleLeftDeptNodeClick" :indent="deptTree.indent" multiple="false"></dept-tree> 
						</div>
					</el-form-item> 
				</draggable>
			</el-form> 
		</el-col>
		<el-col :span="4" >
				<el-popover
				  ref="popover5"
				  placement="right"
				  v-model="showPopover">
				  <el-form v-model="addForm" :rules="addFormRules" ref="addForm">
				  	 <el-form-item v-if="addForm.fieldType=='select' || (addForm.fieldType=='checkbox') || (addForm.fieldType=='radio')" label="基础数据" :prop="addForm.isFromBaseData">
				  		<el-col :span="14">
				  			<el-input  v-model="codeSecondSelected.dtcodeName" :label="codeSecondSelected.dtcodeName" @focus="showItemOptionMng" placeholder="点击关联基础数据"> </el-input>
				  		</el-col>  
				  	</el-form-item>
				  	<el-form-item label="名称" :prop="addForm.fieldTitle">
				  		<el-col :span="14">
				  			<el-input  v-model="addForm.fieldTitle" label="属性名称" auto-complete="off"  placeholder="请输入内容"   > </el-input>
				  		</el-col>
				  	</el-form-item>
				  	<el-form-item label="编码" :prop="addForm.fieldId">
				  		<el-col :span="14">
				  			<el-input   v-model="addForm.fieldId" :label="addForm.fieldId" auto-complete="off"  placeholder="请输入内容"   > </el-input>
				  		</el-col>
				  	</el-form-item>
				  	<el-form-item label="长度" :prop="addForm.fieldLength">
				  		<el-col :span="14">
				  			<el-input   v-model="addForm.fieldLength" :label="addForm.fieldId" auto-complete="off"  placeholder="请输入内容"   > </el-input>
				  	</el-col>
				  	</el-form-item>
				  	<el-form-item label="占位符" :prop="addForm.placeholder">
				  		<el-col :span="14">
				  			<el-input   v-model="addForm.placeholder" :label="addForm.placeholder" auto-complete="off"  placeholder="请输入内容"   > </el-input>
				  	</el-col> 
				  	</el-form-item>
				  	<el-form-item label="必需" :prop="addForm.placeholder">
				  		<el-col :span="14">
				  			<el-input   v-model="addForm.placeholder" :label="addForm.placeholder" auto-complete="off"  placeholder="请输入内容"   > </el-input>
				  	</el-col> 
				  	</el-form-item>

				  </el-form>
				  <div style="text-align: right; margin: 0">
				    <el-button  type="text" @click="showPopover = false">取消</el-button>
				    <el-button type="primary"  @click="showPopover = false">确定</el-button>
				  </div>
				</el-popover>
		</el-col>
		<el-col :span="10" :offset="2"> 
		<!--新增界面 FormField 表单字段定义--> 
			<el-tabs v-model="activeName">
			    <el-tab-pane label="输入框" name="first">
			    	<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="inputAddForm">
						<draggable id="af" class="dragArea min-height"  :options="{group:{ name:'g1', pull:'clone'}, animation:150}"  v-model="inputFields" >
							<el-form-item v-for="(item,index) in inputFields" :key="index" :label="item.fieldTitle" :prop="item.fieldId">
								<el-input v-if="item.fieldType=='text'" v-model="item.defaultValue" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable > </el-input>
								<el-input-number v-if="item.fieldType=='number'" v-model="item.defaultValue" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable :min="1" :max="10" label="描述文字"></el-input-number>
								<el-input v-if="item.fieldType=='amount'" v-model="item.defaultValue" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable></el-input>
								<el-input v-if="item.fieldType=='textarea'"  type="textarea" :rows="2" v-model="item.defaultValue" :label="item.fieldTitle"  placeholder="请输入内容"></el-input>
							</el-form-item> 
						</draggable>
					</el-form>
			    </el-tab-pane>
			    <el-tab-pane label="下拉列表" name="second">
			    	<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="selectAddForm">
						<draggable id="af" class="dragArea min-height"  :options="{group:{ name:'g1', pull:'clone'}, animation:150}"  v-model="selectFields" >
							<el-form-item v-for="(item,index) in selectFields" :key="item.fieldId" :label="item.fieldTitle" :prop="item.fieldId">
								  <el-select v-if="item.fieldType=='select'" :multiple="item.isMultiple=='1'?true:false" v-model="item.defaultValue" :label="item.fieldTitle"  placeholder="请选择">
								    <el-option 
								      key="xxxx1"
								      label="数据项1-等你设置"
								      value="xxxx">
								    </el-option>
								     <el-option 
								      key="xxxx2"
								      label="数据项2-等你设置"
								      value="xxxx2">
								    </el-option>
								  </el-select>
							</el-form-item> 
						</draggable>
					</el-form>
			    </el-tab-pane>
			    <el-tab-pane label="单选、多选框" name="third">
			    	<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="checkboxAddForm">
						<draggable id="af" class="dragArea min-height"  :options="{group:{ name:'g1', pull:'clone'}, animation:150}"  v-model="checkboxFields" >
							<el-form-item v-for="(item,index) in checkboxFields" :key="item.fieldId" :label="item.fieldTitle" :prop="item.fieldId">
								  <el-radio-group v-if="item.fieldType=='radio'" v-model="item.defaultValue">
									    <el-radio :label="3">备选项</el-radio>
									    <el-radio :label="6">备选项</el-radio>
									    <el-radio :label="9">备选项</el-radio>
									</el-radio-group>
									<el-checkbox v-if="item.fieldType=='checkbox' && item.isMultiple=='0'" v-model="item.defaultValue">备选项</el-checkbox>
								  <el-checkbox-group v-if="item.fieldType=='checkbox' && item.isMultiple=='1'"  v-model="item.defaultValue">
								    <el-checkbox label="复选框 A"></el-checkbox>
								    <el-checkbox label="复选框 B"></el-checkbox>
								    <el-checkbox label="复选框 C"></el-checkbox>
								  </el-checkbox-group>
							</el-form-item> 
						</draggable>
					</el-form>
			    </el-tab-pane>
			    <el-tab-pane label="日期时间" name="fourth">
			    	<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="datetimeAddForm">
						<draggable id="af" class="dragArea min-height"  :options="{group:{ name:'g1', pull:'clone'}, animation:150}"  v-model="datetimeFields" >
							<el-form-item v-for="(item,index) in datetimeFields" :key="item.fieldId" :label="item.fieldTitle" :prop="item.fieldId">
								<el-time-picker v-if="item.fieldType=='time'"  v-model="item.defaultValue"
								    :picker-options="{
								      selectableRange: '18:30:00 - 20:30:00'
								    }"
								    placeholder="任意时间点">
								  </el-time-picker> 
							    <el-date-picker v-if="item.fieldType=='date'" v-model="item.defaultValue"
							      align="right"
							      type="date"
							      placeholder="选择日期"
							      >
							    </el-date-picker> 
							</el-form-item> 
						</draggable>
					</el-form>
			    </el-tab-pane>
			    <el-tab-pane label="业务组件" name="five">
			    	<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="bizAddForm">
						<draggable id="af" class="dragArea min-height"  :options="{group:{ name:'g1', pull:'clone'}, animation:150}" v-model="bizFields" >
							<el-form-item v-for="(item,index) in bizFields" :key="item.fieldId" :label="item.fieldTitle" :prop="item.fieldId">
								<dept-tree v-if="item.fieldType=='text' && item.extFieldType=='dept'" v-model="item.defaultValue" root-deptid='' default-expand-all :expand-on-click-node="deptTree.expandOnClickNode" :refresh="deptTree.refreshTree" v-on:nodeClick="handleLeftDeptNodeClick" :indent="deptTree.indent" multiple="false"></dept-tree> 
							</el-form-item> 
						</draggable>
					</el-form>
			    </el-tab-pane>
			  </el-tabs>
		</el-col>
		<!--基础数据查询 CodeDetail sys_code_detail界面-->
		<el-dialog title="选择数据组" :visible.sync="itemOptionMngVisible"  width="80%" :modal="false" :close-on-click-modal="false">
			  <item-option-mng :read-only="true"  @cancel="itemOptionMngVisible=false" @checked-item="checkedItem" style="z-index: 0;"></item-option-mng>
		</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
	import { addFormField } from '../../../../api/mdp/form/formField';
	import draggable from 'vuedraggable'
	import DeptTree from '../../sys/dept/DeptTree';//下拉框数据查询
	import ItemOptionMng from '@/views/mdp/meta/itemOption/itemOptionMng';//基础数据查询
	
	export default {
		props:['visible','formDef','fields'],
		watch: {
	      'selectedFields':function( selectedFields ) {
	      	console.log("selectedFieldsxxxxxxxxxxxxxxxxxxxxxxxxxxx"); 
	      	this.$emit('update:fields', selectedFields)
	      },
	      'formDef':function( formDef ) {
	        this.formDef = formDef;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				addLoading: false,
				addFormRules: {
					id: [
						//{ required: true, message: '主键', trigger: 'blur' }
					]
				},
				//新增界面数据 表单字段定义
				addForm: {
					formId:'formId',id:'1',fieldId:'one',fieldIdCamel:'one',fieldTitle:'属性名称',secondCodeRow:'',fieldType:'text',fieldLength:'20',defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'1',isFromBaseData:'0',fieldIdCamel:'',remark:'属性',extFieldType:'',isCloneToFlow:'',flowFieldId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				selectedFields:[
				
				],
				inputFields:[
					{formId:'formId',id:'1',fieldId:'one',fieldIdCamel:'one',fieldTitle:'文本',secondCodeRow:'',fieldType:'text',fieldLength:'20',defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'1',isFromBaseData:'0',fieldIdCamel:'',remark:'属性',extFieldType:''},
					{formId:'formId',id:'2',fieldId:'two',fieldIdCamel:'two',fieldTitle:'数字',secondCodeRow:'',fieldType:'number',fieldLength:'20',defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'1',isFromBaseData:'0',fieldIdCamel:'',remark:'属性',extFieldType:''},
					{formId:'formId',id:'3',fieldId:'three',fieldIdCamel:'three',fieldTitle:'金额',secondCodeRow:'',fieldType:'amount',fieldLength:'20',defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'1',isFromBaseData:'0',fieldIdCamel:'',remark:'属性',extFieldType:''},
					{formId:'formId',id:'4',fieldId:'four',fieldIdCamel:'four',fieldTitle:'多行文本',secondCodeRow:'',fieldType:'textarea',fieldLength:'20',defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'1',isFromBaseData:'0',fieldIdCamel:'',remark:'属性',extFieldType:''}
				],
				selectFields:[
					{formId:'formId',id:'5',fieldId:'five',fieldIdCamel:'five',fieldTitle:'单选下拉',secondCodeRow:'',fieldType:'select',fieldLength:'20',defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'1',isFromBaseData:'1',fieldIdCamel:'',remark:'属性',extFieldType:''},
					{formId:'formId',id:'6',fieldId:'six',fieldIdCamel:'six',fieldTitle:'多选下拉',secondCodeRow:'',fieldType:'select',fieldLength:'20',defaultValue:'',isMultiple:'1',placeholder:'请输入',isRequired:'1',isFromBaseData:'1',fieldIdCamel:'',remark:'属性',extFieldType:''}
				],
				checkboxFields:[
					{formId:'formId',id:'7',fieldId:'seven',fieldIdCamel:'seven',fieldTitle:'单选',secondCodeRow:'',fieldType:'radio',fieldLength:'20',defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'1',isFromBaseData:'1',fieldIdCamel:'',remark:'属性',extFieldType:''},
					{formId:'formId',id:'8',fieldId:'eight',fieldIdCamel:'eight',fieldTitle:'单选框',secondCodeRow:'',fieldType:'checkbox',fieldLength:'20',defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'1',isFromBaseData:'1',fieldIdCamel:'',remark:'属性',extFieldType:''},
					{formId:'formId',id:'9',fieldId:'nine',fieldIdCamel:'nine',fieldTitle:'多选框',secondCodeRow:'',fieldType:'checkbox',fieldLength:'20',defaultValue:'',isMultiple:'1',placeholder:'请输入',isRequired:'1',isFromBaseData:'1',fieldIdCamel:'',remark:'属性',extFieldType:''}
				],
				datetimeFields:[ 
					{formId:'formId',id:'10',fieldId:'ten',fieldIdCamel:'ten',fieldTitle:'时间',secondCodeRow:'',fieldType:'time',fieldLength:'20',defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'1',isFromBaseData:'1',fieldIdCamel:'',remark:'属性',extFieldType:''},
					{formId:'formId',id:'11',fieldId:'eleven',fieldIdCamel:'eleven',fieldTitle:'日期',secondCodeRow:'',fieldType:'date',fieldLength:'20',defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'1',isFromBaseData:'1',fieldIdCamel:'',remark:'属性',extFieldType:''}
				],
				bizFields:[
					{formId:'formId',id:'10',fieldId:'twelve',fieldIdCamel:'twelve',fieldTitle:'部门',secondCodeRow:'',fieldType:'text',fieldLength:'20',defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'1',isFromBaseData:'1',fieldIdCamel:'',remark:'属性',extFieldType:'dept'}
				],
				delFields:[],//存放删除的属性
				drag:true,
				deptTree:{//部门树相关参数设置
					deptNodeSelected:{},//部门树被选中的节点数据	
					expandOnClickNode:false, //单击是否展开/收缩
					indent:8,//缩进
					refreshTree:false//是否刷新
				},
				showPopover:false,
				activeName:'first',
				codeSecondSelected:{},//选择的基础数据二级分类代码
				itemOptionMngVisible:false,//基础数据弹出框
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交FormField 表单字段定义 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 
							let params = Object.assign({}, this.addForm); 
							addFormField(params).then((res) => {
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.addLoading = false;
							});
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			handleLeftDeptNodeClick(data, node,comp) {
				this.deptTree.deptNodeSelected=data;
				this.pageInfo.total=0;
				this.pageInfo.pageNum=1;
				this.getDepts();
		    },
		    itemClick(item,index){
		    	this.showPopover=true;
		    	this.addForm =item; 
		    	
		    	
		    },

		    add(evt){
		    	console.log(evt); 
		    	let item=this.selectedFields[evt.newIndex];
		    	this.selectedFields[evt.newIndex]=Object.assign({}, item);
		    	     			    	
		    },
		    //二級分類行被選中
			codeSecondSelectClick( codeSecond, event, column ){
				this.itemOptionMngVisible=false;
				this.codeSecondSelected=codeSecond;
				this.addForm.secondCodeRow=codeSecond.secondCodeRow;
			},
			showItemOptionMng(){
				this.itemOptionMngVisible=true;
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'form-field-edit':FormFieldEdit
		    draggable,
		    'dept-tree': DeptTree,
		    'item-option-mng': ItemOptionMng
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.formField);
			//加载下拉列表 如有需要去掉注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>
.min-height{
  min-height:300px;
  }

</style>