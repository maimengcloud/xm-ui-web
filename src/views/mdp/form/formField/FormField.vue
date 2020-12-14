<template>
	<section>
		<el-row class="app-container"> 
		<el-col :span="10"> 
			<draggable id="delDrg"  class="dragArea" :list="delFields" :options="{group:{ name:'g1'}, animation:150}"  :no-transition-on-drag="true" @start="drag=true" @end="drag=false">
				<el-badge :value="selectedFields.length" class="item">
				  <span class="el-dropdown-link">
				   	  将右边表单元素拖拽到方框内   拖拽表单元素可以排序,最多支持15个字段

				   	 <br>
				  </span>
				</el-badge> 
			</draggable>
			<el-form class="drag" label-width="100px" style="width:100%;height:600px;overflow:auto">
				<div style="border:1px dashed #000;padding: 20px;"> 
				  <el-form-item>
				  	<md-input  name="formName" v-model="myFormDef.formName" required :maxlength="80">标题 </md-input>
				  </el-form-item>
				  <el-form-item > 
				   <div v-if="selectedFields.length==0">
					 <span>
				   	 	从右边拖拽属性来此，可添加表单属性 <i class="el-icon-download"></i> 
				 	 </span>
				    </div>
				  </el-form-item>
				<draggable id="sf"  class="dragArea min-height" :list="selectedFields" :options="{group:{ name:'g1'}, animation:150}" @add="add"  :no-transition-on-drag="true" @start="drag=true" @end="drag=false">

					<el-form-item  class="form-item"  v-for="(item,index) in selectedFields" :key="index" :label="item.fieldTitle" :prop="item.fieldIdCamel" :required="item.isRequired=='1'"> 
							<el-input style="width:60%;"  v-if="item.fieldType=='text' && item.extFieldType!='dept'" v-model="dataForm[item.fieldIdCamel]" :label="item.fieldTitle" auto-complete="off" :placeholder="item.placeholder"  clearable  > </el-input>
							<el-input-number   v-if="item.fieldType=='number'" v-model="dataForm[item.fieldIdCamel]" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable :min="1" :max="10" ></el-input-number>
							<el-input style="width:60%;"   v-if="item.fieldType=='amount'" v-model="dataForm[item.fieldIdCamel]" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable></el-input>
							<el-input style="width:60%;"  v-if="item.fieldType=='textarea'"  type="textarea" :rows="2" v-model="dataForm[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请输入内容"></el-input>
							<el-select   v-if="item.fieldType=='select' && item.isMultiple=='0' && item.extFieldType!='user' && item.isFromBaseData=='1'"  v-model="dataForm[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择"  @click="itemClick(item,index)">
							    <el-option  v-for=" option in options2[item.secondCodeRow]" :key="option.optionValue" :label="option.optionName" :value="option.optionValue"> </el-option>
							</el-select>
							  <el-select   v-if="item.fieldType=='select' && item.isMultiple=='0' && item.extFieldType!='user' && item.isFromBaseData=='1' && item.isFromBaseData=='0'"  v-model="dataForm[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择"  @click="itemClick(item,index)">
							     <el-option  v-for=" option in options2[item.fieldIdCamel]" :key="option.optionValue" :label="option.optionName" :value="option.optionValue"> </el-option>
							  </el-select>
							  <el-select   v-if="item.fieldType=='select' && item.isMultiple=='1' && item.extFieldType!='user' && item.isFromBaseData=='1'" multiple v-model="multipleFieldsData[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择"  >
							    <el-option  v-for=" option in options2[item.secondCodeRow]" :key="option.optionValue" :label="option.optionName" :value="option.optionValue"> </el-option>
							     </el-select> 
							<el-select   v-if="item.fieldType=='select' && item.isMultiple=='1' && item.extFieldType!='user' && item.isFromBaseData=='0'" multiple v-model="multipleFieldsData[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择"  >
							     <el-option   v-for=" option in options2[item.fieldIdCamel]" :key="option.optionValue" :label="option.optionName" :value="option.optionValue"> </el-option>
							  </el-select> 
							  <el-select   v-if="item.fieldType=='select' && item.isMultiple=='1' && item.extFieldType=='user'" multiple v-model="multipleFieldsData[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择"  >
							   		<el-option
								      v-for="item in companyEmployees"
								      :key="item.userid"
								      :label="item.username"
								      :value="item.userid">
								      <span style="float: left">{{ item.username }}</span>
					   					  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
								    </el-option>
							  </el-select> 
							  
							  <el-button  v-if="item.fieldType=='select' && item.isMultiple=='1' && item.extFieldType=='user'" icon="el-icon-search" @click="showUserSelectDialog(item.fieldIdCamel)">更多</el-button>
							  <el-select   v-if="item.fieldType=='select' && item.isMultiple=='0' && item.extFieldType=='user'"  v-model="dataForm[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择"  @click="itemClick(item,index)">
							    <el-option
								      v-for="item in companyEmployees"
								      :key="item.userid"
								      :label="item.username"
								      :value="item.userid">
								      <span style="float: left">{{ item.username }}</span>
					   					  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
								    </el-option>
							  </el-select>
							  <el-button  v-if="item.fieldType=='select' && item.isMultiple=='0' && item.extFieldType=='user'" icon="el-icon-search" @click="showUserSelectDialog(item.fieldIdCamel)">更多</el-button>
								 
								<el-radio-group  v-if="item.fieldType=='radio' && item.isFromBaseData=='1'" v-model="dataForm[item.fieldIdCamel]">
									<el-radio  v-for=" option in options2[item.secondCodeRow]" :label="option.optionValue" :key="option.optionValue">{{option.optionName}}</el-radio>
								</el-radio-group>  
								<el-radio-group v-if="item.isFromBaseData=='0' && item.fieldType=='radio'"   v-model="dataForm[item.fieldIdCamel]">
									<el-radio  v-for=" option in options2[item.fieldIdCamel]" :label="option.optionValue" :key="option.optionValue">{{option.optionName}}</el-radio>
								</el-radio-group> 
								<el-checkbox   v-if="item.fieldType=='checkbox' && item.isMultiple=='0'" v-model="dataForm[item.fieldIdCamel]">{{item.fieldTitle}}</el-checkbox>
							  <el-checkbox-group   v-if="item.fieldType=='checkbox' && item.isMultiple=='1' && item.isFromBaseData=='1'"  v-model="multipleFieldsData[item.fieldIdCamel]"> 
							    <el-checkbox  v-for=" option in options2[item.secondCodeRow]" :label="option.optionValue" :key="option.optionValue">{{option.optionName}}</el-checkbox>  
							  </el-checkbox-group>
							  <el-checkbox-group   v-if="item.fieldType=='checkbox' && item.isMultiple=='1' && item.isFromBaseData=='0'"  v-model="multipleFieldsData[item.fieldIdCamel]">  
							    <el-checkbox   v-for=" option in options2[item.fieldIdCamel]" :label="option.optionValue" :key="option.optionValue">{{option.optionName}}</el-checkbox> 
							  </el-checkbox-group>
							<el-time-picker   v-if="item.fieldType=='time'"  v-model="dataForm[item.fieldIdCamel]"  placeholder="任意时间点"> </el-time-picker> 
						    <el-date-picker   v-if="item.fieldType=='date'" v-model="dataForm[item.fieldIdCamel]" align="right" type="date" placeholder="选择日期" > </el-date-picker> 
							<el-date-picker v-if="item.fieldType=='datetime'" v-model="dataForm[item.fieldIdCamel]" type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions"> </el-date-picker>
							
						    <el-date-picker   v-if="item.fieldType=='month'" v-model="dataForm[item.fieldIdCamel]" align="right" type="month" placeholder="选择月份" > </el-date-picker> 
							
						    <el-date-picker   v-if="item.fieldType=='year'" v-model="dataForm[item.fieldIdCamel]" align="right" type="year" placeholder="选择年份" > </el-date-picker> 
						     <dept-tree  v-if="item.extFieldType=='dept' && item.isMultiple=='1'" v-model="dataForm[item.fieldIdCamel]" :branch-id="userInfo.branchId" default-expand-all show-checkbox multiple :expand-on-click-node="false" ref="nodeTree2"></dept-tree> 
						     <dept-tree  v-if="item.extFieldType=='dept' && item.isMultiple!='1'" v-model="dataForm[item.fieldIdCamel]" :branch-id="userInfo.branchId" default-expand-all show-checkbox  :expand-on-click-node="false" ref="nodeTree2"></dept-tree> 
						     <el-button class="set-btn"  type="primary" icon="el-icon-edit" circle @click="itemClick(item,index)"></el-button> 
						     <el-button class="set-btn"  type="danger" icon="el-icon-delete" circle @click="itemDelete(item,index)"></el-button> 
					</el-form-item> 
				</draggable>
				</div>
			</el-form> 
		</el-col>
		<el-col :span="6" >
				<el-popover
				  ref="popover5"
				  placement="left"
				  style="width:250px;"
				  v-model="showPopover">
				  <el-form v-model="addForm" :rules="addFormRules" ref="addForm" label-width="80px" style="width:350px;">
				  	 <el-form-item v-if="addForm.fieldType=='select' || (addForm.fieldType=='checkbox') || (addForm.fieldType=='radio')" label="数据" prop="isFromBaseData">
				  		<el-col :span="20">
				  			<el-input  v-model="metaItemSelected.itemName" :label="metaItemSelected.itemName" @focus="showItemOptionMng" placeholder="点击关联基础数据"> </el-input>
				  		</el-col>  
				  		<el-col :span="4">
				  			<el-button size="mini" type="primary" icon="el-icon-delete" @click="deleteBaseData"></el-button>
				  		</el-col>  
				  	</el-form-item>
				  	<el-form-item label="名称" prop="fieldTitle">
				  		<el-col :span="20">
				  			<el-input  v-model="addForm.fieldTitle" label="属性名称" auto-complete="off"  placeholder="请输入内容"   > </el-input>
				  		</el-col>
				  	</el-form-item>
				  	<el-form-item label="主键" prop="isBizKey" v-if="  (addForm.fieldType!='checkbox') && (addForm.fieldType!='radio') && addForm.isMultiple!='1' && addForm.fieldType!='textarea'" > 
				  			  
								  <el-select   v-model="primaryKeys" multiple label="" clearable  placeholder="请选择">
									 <el-option    label="创建人" key="cuserid" value="cuserid">创建人 </el-option>
									 <el-option    label="创建部门" key="deptid" value="deptid">创建部门 </el-option>
								    <el-option   v-for="option in selectedFields" :label="option.fieldTitle" :key="option.fieldIdCamel" :value="option.fieldIdCamel">{{option.fieldTitle}} </el-option>
								  </el-select>
				  	</el-form-item>
				  	<el-form-item label="必需" prop="isRequired" > 
				  		<el-checkbox v-model="addForm.isRequired" :disabled="addForm.isBizKey=='1'" true-label="1" false-label="0">是否必输</el-checkbox>  
				  	</el-form-item>
				  	<el-form-item label="编码" prop="fieldId">
				  		<el-col :span="20">
				  			<el-input  :disabled="myFormDef.isCreateTable!='1'" v-model="addForm.fieldId" :label="addForm.fieldId" auto-complete="off"  placeholder="请输入内容"   > </el-input>
				  		</el-col>
				  	</el-form-item>
				  	<el-form-item label="编码驼峰命名" prop="fieldIdCamel" v-if="formDef.isCreateTable=='1'">
				  		<el-col :span="20">
				  			<el-input  :disabled="formDef.isCreateTable!='1'" v-model="addForm.fieldIdCamel" :label="addForm.fieldIdCamel" auto-complete="off"  placeholder="请输入内容"   > </el-input>
				  		</el-col>
				  	</el-form-item>
				  	<el-form-item label="变量映射" prop="flowFieldId">
				  		<el-col :span="20">
				  		<el-input  v-model="addForm.flowFieldId" label="变量" auto-complete="off"  placeholder="变量编码"   > </el-input> 
				  	</el-col> 
				  	</el-form-item>
				  	<el-form-item label="长度" prop="fieldLength">
				  		<el-col :span="20">
				  			<el-input   v-model="addForm.fieldLength" :label="addForm.fieldId" auto-complete="off"  placeholder="请输入内容"   > </el-input>
				  	</el-col>
				  	</el-form-item>
				  	<el-form-item label="占位符" prop="placeholder">
				  		<el-col :span="20">
				  			<el-input   v-model="addForm.placeholder" :label="addForm.placeholder" auto-complete="off"  placeholder="请输入内容"   > </el-input>
				  	</el-col> 
				  	</el-form-item>
					<el-form-item v-if="addForm.fieldType=='select' || (addForm.fieldType=='checkbox') || (addForm.fieldType=='radio')" label="默认值" prop="defaultValue">
						<el-col :span="20">
							<el-select v-model="addForm.defaultValue" :label="addForm.fieldTitle" clearable placeholder="请选择">
								<el-option   v-for="option in options2[metaItemSelected.itemCode]" :label="option.optionName" :key="option.optionValue" :value="option.optionValue">{{option.optionName}} </el-option>
							</el-select>
						</el-col> 
				  	</el-form-item>
					<el-form-item v-else label="默认值" prop="defaultValue">
				  		<el-col :span="20">
				  			<el-input   v-model="addForm.defaultValue" :label="addForm.placeholder" auto-complete="off"  placeholder="请输入内容"   > </el-input>
				  	</el-col> 
				  	</el-form-item>
				  	<el-form-item label="多选" prop="isMultiple">
				  		<el-col :span="20">
				  		    <el-checkbox  v-model="addForm.isMultiple" :disabled=" addForm.fieldType!='checkbox' && addForm.fieldType!='select' && addForm.extFieldType!='dept'" true-label="1" false-label="0">多选</el-checkbox>  
				  	</el-col> 
				  	</el-form-item>
				  	<el-form-item label="工作流" prop="isCloneToFlow">
				  		<el-col :span="20">
				  		<el-checkbox v-model="addForm.isCloneToFlow" true-label="1" false-label="0">提交到工作流</el-checkbox> 
				  	</el-col> 
				  	</el-form-item>

				  </el-form>
				  <div style="text-align: right; margin: 0">
				    <el-button size="mini" type="text" @click="showPopover = false">取消</el-button>
				    <el-button type="primary" size="mini" @click="showPopover = false">确定</el-button>
				  </div>
				</el-popover>
		</el-col>
		<el-col :span="10" :offset="4">
			    	<el-form :model="addForm"  label-width="100px"  style="width:100%;height:600px;overflow:auto" :rules="addFormRules" ref="inputAddForm">
						<draggable id="af" class="dragArea min-height"  :options="{group:{ name:'g1', pull:'clone'}, animation:150}"  v-model="inputFields" >
							<el-form-item v-for="(item,index) in inputFields" :key="index" :label="item.fieldTitle" :prop="item.fieldIdCamel">
								<el-input v-if="item.fieldType=='text'" v-model="item.defaultValue" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable > </el-input>
								<el-input-number v-if="item.fieldType=='number'" v-model="item.defaultValue" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable :min="1" :max="10"></el-input-number>
								<el-input v-if="item.fieldType=='amount'" v-model="item.defaultValue" :label="item.fieldTitle" auto-complete="off"  placeholder="请输入内容"  clearable></el-input>
								<el-input v-if="item.fieldType=='textarea'"  type="textarea" :rows="2" v-model="item.defaultValue" :label="item.fieldTitle"  placeholder="请输入内容"></el-input>
 
								  <el-select v-if="item.fieldType=='select' && item.isMultiple!='1'  && item.extFieldType!='user'" v-model="item.defaultValue" :label="item.fieldTitle"  placeholder="请选择">
								    <el-option   v-for="option in options2[item.fieldIdCamel]" :label="option.optionName" :key="option.optionValue" :value="option.optionValue">{{option.optionName}} </el-option>
								  </el-select>
								  <el-select v-if="item.fieldType=='select' && item.isMultiple=='1'  && item.extFieldType!='user' " multiple v-model="multipleFieldsData[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择">
								    <el-option   v-for="option in options2[item.fieldIdCamel]" :label="option.optionName" :key="option.optionValue" :value="option.optionValue">{{option.optionName}} </el-option>
								  </el-select>
 
								  <el-radio-group v-if="item.fieldType=='radio'" v-model="item.defaultValue">
									    <el-radio v-for="option in options2[item.fieldIdCamel]" :label="option.optionValue" :key="option.optionValue">{{option.optionName}}</el-radio> 
									</el-radio-group>
									<el-checkbox v-if="item.fieldType=='checkbox' && item.isMultiple=='0' && options2[item.fieldIdCamel] && options2[item.fieldIdCamel].length>1" :false-label="options2[item.fieldIdCamel][0].optionValue" :true-label="options2[item.fieldIdCamel][1].optionValue">{{item.fieldTitle}}</el-checkbox>
								  <el-checkbox-group v-if="item.fieldType=='checkbox' && item.isMultiple=='1'"  v-model="multipleFieldsData[item.fieldIdCamel]">
								    <el-checkbox v-for="option in options2[item.fieldIdCamel]" :label="option.optionValue" :key="option.optionValue">{{option.optionName}}</el-checkbox>
								  </el-checkbox-group>
 
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
								<el-date-picker v-if="item.fieldType=='datetime'" 
									v-model="item.defaultValue"
									type="datetime"
									placeholder="选择日期时间"
									align="right"
									:picker-options="pickerOptions">
								</el-date-picker>
								
								<el-date-picker v-if="item.fieldType=='month'" 
									v-model="item.defaultValue"
									type="month"
									placeholder="选择月份"
									align="right" >
								</el-date-picker>
								<el-date-picker v-if="item.fieldType=='year'" 
									v-model="item.defaultValue"
									type="year"
									placeholder="选择年份"
									align="right" >
								</el-date-picker>
								 <dept-tree  v-if="item.extFieldType=='dept'" :branch-id="userInfo.branchId" default-expand-all show-checkbox multiple :expand-on-click-node="false" ref="nodeTree"></dept-tree> 
								 <el-select   v-if="item.fieldType=='select' && item.isMultiple=='1' && item.extFieldType=='user'" multiple v-model="multipleFieldsData[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择"  >
							   		<el-option
								      v-for="item in filters.users"
								      :key="item.userid"
								      :label="item.username"
								      :value="item.userid">
								      <span style="float: left">{{ item.username }}</span>
					   					  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
								    </el-option>
							  </el-select> 
							  <el-button  v-if="item.fieldType=='select' && item.isMultiple=='1' && item.extFieldType=='user'" icon="el-icon-search" @click="showUserSelectDialog(item.fieldIdCamel)">更多</el-button>
							  <el-select   v-if="item.fieldType=='select' && item.isMultiple=='0' && item.extFieldType=='user'"  v-model="dataForm[item.fieldIdCamel]" :label="item.fieldTitle"  placeholder="请选择"  @click="itemClick(item,index)">
							    <el-option
								      v-for="item in  filters.users"
								      :key="item.userid"
								      :label="item.username"
								      :value="item.userid">
								      <span style="float: left">{{ item.username }}</span>
					   					  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
								    </el-option>
							  </el-select>
							  <el-button  v-if="item.fieldType=='select' && item.isMultiple=='0' && item.extFieldType=='user'" icon="el-icon-search" @click="showUserSelectDialog(item.fieldIdCamel)">更多</el-button>
							</el-form-item>  
						</draggable>
					</el-form> 
		</el-col> 
		<!--基础数据查询 CodeDetail sys_code_detail界面-->
		<el-dialog title="选择数据组" :visible.sync="itemOptionMngVisible"  width="80%" :modal="false" :close-on-click-modal="false">
			  <item-option-mng :read-only="true"  @cancel="itemOptionMngVisible=false" @checked-item="checkedItem" style="z-index: 0;"></item-option-mng>
		</el-dialog>
		
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
	import { listFormField } from '@/api/mdp/form/formField';
	import draggable from 'vuedraggable'
	import DeptTree from '../../sys/dept/DeptTree';//下拉框数据查询
	import ItemOptionMng from '@/views/mdp/meta/itemOption/itemOptionMng';//基础数据查询
	import { listUser } from '@/api/mdp/sys/user';//下拉框数据查询
	import MDinput from '@/components/MDinput'
	import { mapGetters } from 'vuex'
	
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect'; 

	export default { 
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
		    ])
		},
		props:['visible','formDef','fields','loadFromDb'],
		watch: {
	      'selectedFields':function( selectedFields ) {
			  console.log("selectedFieldsxxxxxxxxxxxxxxxxxxxxxxxxxxx"); 
			  this.setPrimaryKeys();
	      	this.$emit('update:fields', selectedFields)
	      },
	      'formDef':function( formDef ) { 
	    	  this.myFormDef=formDef;
				this.getFormFields(); 
 
	      },
	      'addForm.isBizKey':function( isBizKey ) {   
 			if(isBizKey=='1'){
 				this.addForm.isRequired="1" 
 			}
		  },
		  
	      'myFormDef.formName':function( formName ) { 
	    	  this.$emit('update:formDef', this.myFormDef)
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		if(this.loadFromDb=='0'){
					  this.selectedFields=JSON.parse(JSON.stringify(this.fields))
				}
	      	}
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
				options2:{
					zero:  [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					one:  [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					two:   [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					three: [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					four: [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					five:  [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					six:   [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					seven: [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					eight:  [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					nine:   [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					ten: [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					eleven: [{optionValue:'0',optionName:'否'},{optionValue:'1',optionName:'是'}],
					twelve:  [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					
					thirteen:  [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					
					fourteen:  [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
					
					fifteen:  [{optionValue:'0',optionName:'选项0'},{optionValue:'1',optionName:'选项1'},{optionValue:'2',optionName:'选项2'}],
				}, 
				addLoading: false,
				addFormRules: {
					id: [
						{ required: false, message: '主键', trigger: 'blur' }
					]
				},
				//新增界面数据 表单字段定义
				addForm: {formId:'formId',id:'1',fieldId:'one',fieldIdCamel:'one',fieldTitle:'文本',secondCodeRow:'',fieldType:'text',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
				myFormDef:{id:'',tableName:'',tableOwner:'',isCreateTable:'',formName:'',userid:'',deptid:'',formType:'',isTemplate:'',bizType:'',ctime:'',branchId:''},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				selectedFields:[],
				inputFields:[
					{formId:'formId',id:'1',fieldId:'one',fieldIdCamel:'one',fieldTitle:'文本',secondCodeRow:'',fieldType:'text',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'2',fieldId:'two',fieldIdCamel:'two',fieldTitle:'数字',secondCodeRow:'',fieldType:'number',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'3',fieldId:'three',fieldIdCamel:'three',fieldTitle:'金额',secondCodeRow:'',fieldType:'amount',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'4',fieldId:'four',fieldIdCamel:'four',fieldTitle:'多行文本',secondCodeRow:'',fieldType:'textarea',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},

					{formId:'formId',id:'5',fieldId:'five',fieldIdCamel:'five',fieldTitle:'单选下拉',secondCodeRow:'',fieldType:'select',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'6',fieldId:'six',fieldIdCamel:'six',fieldTitle:'多选下拉',secondCodeRow:'',fieldType:'select',fieldLength:20,defaultValue:'',isMultiple:'1',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},

					{formId:'formId',id:'7',fieldId:'seven',fieldIdCamel:'seven',fieldTitle:'单选',secondCodeRow:'',fieldType:'radio',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'8',fieldId:'eight',fieldIdCamel:'eight',fieldTitle:'单选框',secondCodeRow:'',fieldType:'checkbox',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'9',fieldId:'nine',fieldIdCamel:'nine',fieldTitle:'多选框',secondCodeRow:'',fieldType:'checkbox',fieldLength:20,defaultValue:'',isMultiple:'1',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},

					{formId:'formId',id:'10',fieldId:'ten',fieldIdCamel:'ten',fieldTitle:'时间',secondCodeRow:'',fieldType:'time',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'11',fieldId:'eleven',fieldIdCamel:'eleven',fieldTitle:'日期',secondCodeRow:'',fieldType:'date',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'0',fieldId:'zero',fieldIdCamel:'zero',fieldTitle:'日期时间',secondCodeRow:'',fieldType:'datetime',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入日期时间',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'15',fieldId:'zero',fieldIdCamel:'zero',fieldTitle:'年',secondCodeRow:'',fieldType:'year',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请选中年份',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'16',fieldId:'zero',fieldIdCamel:'zero',fieldTitle:'月',secondCodeRow:'',fieldType:'month',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请选中月份',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},

					{formId:'formId',id:'12',fieldId:'thirteen',fieldIdCamel:'thirteen',fieldTitle:'部门',secondCodeRow:'',fieldType:'text',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'请输入',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'dept',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'13',fieldId:'fourteen',fieldIdCamel:'fourteen',fieldTitle:'员工(多选)',secondCodeRow:'',fieldType:'select',fieldLength:20,defaultValue:'',isMultiple:'1',placeholder:'支持多选',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'user',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'},
					{formId:'formId',id:'14',fieldId:'fifteen',fieldIdCamel:'fifteen',fieldTitle:'员工(单选)',secondCodeRow:'',fieldType:'select',fieldLength:20,defaultValue:'',isMultiple:'0',placeholder:'单选',isRequired:'0',isFromBaseData:'0',remark:'属性',extFieldType:'user',isCloneToFlow:'0',flowFieldId:'',isBizKey:'0'}
				],
				delFields:[],//存放删除的属性
				drag:true, 
				showPopover:false,
				activeName:'first',
				metaItemSelected:{},//选择的基础数据二级分类代码
				itemOptionMngVisible:false,//基础数据弹出框
				fieldIds: [
					{fieldId:'zero',fieldIdCamel:'zero'},
					{fieldId:'one',fieldIdCamel:'one'},
					{fieldId:'two',fieldIdCamel:'two'},
					{fieldId:'three',fieldIdCamel:'three'},
					{fieldId:'four',fieldIdCamel:'four'},
					{fieldId:'five',fieldIdCamel:'five'},
					{fieldId:'six',fieldIdCamel:'six'},
					{fieldId:'seven',fieldIdCamel:'seven'},
					{fieldId:'eight',fieldIdCamel:'eight'},
					{fieldId:'nine',fieldIdCamel:'nine'},
					{fieldId:'ten',fieldIdCamel:'ten'},
					{fieldId:'eleven',fieldIdCamel:'eleven'},
					{fieldId:'twelve',fieldIdCamel:'twelve'},
					{fieldId:'thirteen',fieldIdCamel:'thirteen'},
					{fieldId:'fourteen',fieldIdCamel:'fourteen'},
					{fieldId:'fifteen',fieldIdCamel:'fifteen'}
				],
				//新增界面数据 表单数据表
				dataForm: {
					id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',deptid:'',branchId:''
				},
				multipleFieldsData:{
					zero:[],one:[], two:[], three:[], four:[], five:[], six:[],seven:[], eight:[], nine:[], ten:[], eleven:[], twelve:[],thirteen:[],fourteen:[],fifteen:[]
				},
				companyEmployees:[],
				userSelectVisible:false,
				primaryKeys:[],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
		    itemDelete(item,index){
		    	this.addForm ={}; 
		    	this.showPopover=false; 
		    	this.selectedFields.splice(index, 1);
		    	
		    }, 
		    itemClick(item,index){
		    	this.addForm =item; 
		    	this.showPopover=true; 
		    	
			},
			
	      setPrimaryKeys:function(  ) {   
			  var primaryKeys=this.primaryKeys;
			  var isBizKeyPrefix="";
			  if(primaryKeys.some(i=>i=='cuserid')){
				  isBizKeyPrefix="1"
			  }else{
				   isBizKeyPrefix="0"
			  }
			  
			  if(primaryKeys.some(i=>i=='deptid')){
				  isBizKeyPrefix=isBizKeyPrefix+"1"
			  }else{
				   isBizKeyPrefix=isBizKeyPrefix+"0"
			  }
			  this.selectedFields.forEach(field=>{
					if(primaryKeys.some(key=>field.fieldIdCamel==key)){
						field.isBizKey=isBizKeyPrefix+"1"
					}else{
						field.isBizKey=isBizKeyPrefix+"0"
					}
			  });
	      },
		    add(evt){ 
		    	let item=this.selectedFields[evt.newIndex]; 
				item.isNewAdd='1' 
				this.selectedFields[evt.newIndex]=Object.assign({}, item);
				var noSelectFieldId=this.fieldIds.find(i=>{
					return !this.selectedFields.some(k=>k.fieldId==i.fieldId && k.isNewAdd!='1');
				}) 
				this.selectedFields[evt.newIndex].fieldId=noSelectFieldId.fieldId
				this.selectedFields[evt.newIndex].fieldIdCamel=noSelectFieldId.fieldIdCamel 
				this.selectedFields[evt.newIndex].isNewAdd='0'
		    	this.addForm=this.selectedFields[evt.newIndex]; 
		    	     			    	
		    },
		    //二級分類行被選中
			checkedItem( item, event, column ){
				this.itemOptionMngVisible=false;
				 //params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				listOption([{categoryId:item.categoryId,itemCode: item.itemCode}]).then(res=>{
					console.log(res.data);
					this.options2[item.itemCode]=res.data.data[item.itemCode];
					this.metaItemSelected=item;
					this.addForm.secondCodeRow=item.id;
					this.addForm.isFromBaseData='1';
					this.addForm.fieldTitle=item.itemName;
					//console.log(res.data.data);
				});
				
			}, 
			showItemOptionMng(){
				this.itemOptionMngVisible=true;
			},
			//获取列表 FormField 表单字段定义
			getFormFields() {
				if(this.loadFromDb=='0'){
						
						var secondCodeRows=[];
						var fields=this.fields;
						var primaryKeys=[];
						fields.forEach(item=>{
							if(item.isFromBaseData=='1' && item.secondCodeRow!=''){
								secondCodeRows.push(item.secondCodeRow);
							}
							if(item.isBizKey && item.isBizKey.length==3){
								if(item.isBizKey.charAt(2)=="1"){
									primaryKeys.push(item.fieldIdCamel);
								}
							}
							
						});
						if(fields!=null && fields.length>0){
							var isBizKey=fields[0].isBizKey;
							
							if(isBizKey && isBizKey.length==3){
								if(isBizKey.charAt(0)=="1"){
									primaryKeys.push("cuserid");
								}
								if(isBizKey.charAt(1)=='1'){
									primaryKeys.push("deptid");
								}
							}
						}
						this.primaryKeys=primaryKeys
						if(secondCodeRows.length>0){
							listOptionByItemIds(secondCodeRows).then(res=>{
								
								this.options2=Object.assign(this.options2,res.data.data);
								this.selectedFields = fields;
								console.log('ddddddddddddddddddddd');
								console.log(this.options2);
							});
						} 
					this.selectedFields=JSON.parse(JSON.stringify(fields))
					return ;
				}
				this.addLoading=true;
				if(this.formDef.id==''){
					return;
				}
				let params = {
					formId:this.formDef.id
				};
				listFormField(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						
						//this.itemOptionMngVisible=false;
						var secondCodeRows=[];
						console.log(res.data);
						var fields=res.data.data;
						var primaryKeys=[];
						fields.forEach(item=>{
							if(item.isFromBaseData=='1' && item.secondCodeRow!=''){
								secondCodeRows.push(item.secondCodeRow);
							}
							if(item.isBizKey && item.isBizKey.length==3){
								if(item.isBizKey.charAt(2)=="1"){
									primaryKeys.push(item.fieldIdCamel);
								}
							}
							
						});
						if(fields!=null && fields.length>0){
							var isBizKey=fields[0].isBizKey;
							
							if(isBizKey && isBizKey.length==3){
								if(isBizKey.charAt(0)=="1"){
									primaryKeys.push("cuserid");
								}
								if(isBizKey.charAt(1)=='1'){
									primaryKeys.push("deptid");
								}
							}
						}
						this.primaryKeys=primaryKeys
						if(secondCodeRows.length>0){
							listOptionByItemIds(secondCodeRows).then(res=>{
								
								this.options2=Object.assign(this.options2,res.data.data);
								this.selectedFields = fields;
								console.log('ddddddddddddddddddddd');
								console.log(this.options2);
							});
						}else{
							this.selectedFields = res.data.data;
						}
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.addLoading=false;
				}).catch(() => {
					this.addLoading=false;
				});
			},
			deleteBaseData(){
				this.addForm.isFromDataBase='0';
				this.addForm.secondCodeRow='0';
				this.metaItemSelected={};
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
		    //在下面添加其它组件 'form-field-edit':FormFieldEdit
		    draggable,
		    'dept-tree': DeptTree,
		    'item-option-mng': ItemOptionMng,
		     'md-input':MDinput,UsersSelect
		},
		mounted() {
				this.myFormDef=this.formDef
				this.$nextTick(() => {
					this.getFormFields();
					
	        	}); 
			
			
		}//end mounted
	}

</script>

<style rel="stylesheet/scss" lang="scss" scoped> 
.min-height{
  min-height:300px; 
  }

  
  .set-btn {
    display: none;
    i, span {
      padding: 0 8px;
      font-size: 18px;
      font-weight: 600;
    } 
  }
  
 
  .form-item:hover .set-btn {
    color: #428bca !important;
    display: inline-block;
	margin-left: 20px;
	
  }

</style>