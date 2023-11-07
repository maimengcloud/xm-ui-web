<template>
	<section>
		<el-row class="border padding"> 
		<el-col :span="16"> 
			<draggable id="delDrg"  class="dragArea" :list="delFields" :options="{group:{ name:'g1'}, animation:150}"  :no-transition-on-drag="true" @start="drag=true" @end="drag=false">
				<el-row type="flex" style="margin-bottom:5px;"> 
					
 					<el-badge :value="selectedFields.length">
						<span style="align:center;margin-top:50px;">
							<slot name="setBtn">
							</slot>&nbsp;将右边组件拖拽到方框内&nbsp;【删除】:ctrl+鼠标点击组件&nbsp;【配置】：alt+鼠标点击组件
							
						</span>
					</el-badge>   
				</el-row>  
			</draggable>
			<el-form class="drag" label-width="100px" v-adaptive style="width:100%;height:100px;overflow:auto" ref="showDataRef">
				<div style="border:1px dashed #000;padding: 20px;"> 
					<slot name="formName">
						<el-input  label="标题" v-model="myFormDef.formName" required  width="100%" placeholder="标题"> 
						</el-input>
					</slot>
 				  	
 				  <el-form-item > 
				   <div v-if="selectedFields.length==0">
					 <span>
				   	 	从右边拖拽属性来此，可添加表单属性 <i class="el-icon-download"></i> 
				 	 </span>
				    </div>
				  </el-form-item>
				  <el-row>
					<draggable id="sf"  class="dragArea min-height" v-model="selectedFields" :options="{group:{ name:'g1'}, animation:150}" @add="onAdd"  :no-transition-on-drag="true" @start="drag=true" @end="drag=false">

							<el-col v-for="(item,index) in selectedFields" @click.ctrl.native="doChildDelete(item,index,selectedFields)" :key="index" :span="calcSpan(item)">
 								<mdp-form-field @bkey-change="onBkeyChange" :find-not-in-child="findNotInChild" :has-child="hasChild"  :gutter="0" :span="24" :value="item" @change="(v)=>Object.assign(item,v)"></mdp-form-field> 
							</el-col> 
					</draggable>
					</el-row>
				</div>
			</el-form> 
		</el-col>  
		<el-col :span="8">
			    	<el-form :model="addForm"  label-width="100px" v-adaptive  style="width:100%;height:100px;overflow:auto" :rules="addFormRules" ref="inputAddForm">
						<el-form-item label="字段来源" title="该组件能够快速初始化一系列已定义的列">   
							<el-row type="flex">
								<el-button type="primary" @click="$refs['dbFormDialog'].open()" title="自动读取表格的列作为该表单的字段" >数据库表</el-button> 
								<el-button type="success" @click="$refs['aiFormDialog'].open()" title="ai输出了表格列信息，黏贴到此组件即可以解析出列信息作为该表单字段">AI输出</el-button> 
								<el-button type="warning" @click="$refs['apiFormDialog'].open()" title="api输出的结果如果是json,可以根据第一条数据结果解析出字段编码，手动加上中文注释即可">API输出</el-button> 
								<el-button type="primary" @click="$refs['itemDialog'].open()" title="自动读取数据字典中的下拉列表作为该表单的字段信息">数据字典</el-button> 
							</el-row>
						</el-form-item> 
						<el-row>  
							<draggable id="af" :sort="false" class="dragArea" @start="onTplStart"  :options="{group:{ name:'g1', pull:'clone'}, animation:150}"  v-model="sampleFields"  :move="onMove">

									<el-col v-for="(item,index) in sampleFields" :key="index" :span="calcSpan(item)">
										<mdp-form-field  :gutter="0" :span="24" :value="item" :sample="true"></mdp-form-field> 
									</el-col>
								
							</draggable>
						</el-row> 
					</el-form> 
		</el-col>  
		
		</el-row>
		<mdp-dialog ref="dbFormDialog">
			<el-form :model="dbForm" ref="dbFormRef">
				<el-form-item label="数据源" :rules="{required:true,message:'此项必输',trigger:'blur'}" prop="owner">
					<mdp-select v-model="dbForm.owner" :load-fun="dataSourceList" ></mdp-select>
				</el-form-item>
				<el-form-item label="表名" :rules="{required:true,message:'此项必输',trigger:'blur'}" prop="tableName">
					<el-input v-model="dbForm.tableName"></el-input>
				</el-form-item>
			</el-form> 
			<el-row slot="footer">
				<el-button @click="$refs['dbFormDialog'].close()">关闭</el-button>
				<el-button type="primary" @click="initFormFieldsByTable">确定</el-button>
			</el-row>
		</mdp-dialog>
		<mdp-dialog ref="aiFormDialog">
			<el-form :model="aiForm" ref="aiFormRef"> 
				<el-form-item label="列信息" :rules="{required:true,message:'此项必输',trigger:'blur'}" prop="columnListStr">
					请从Ai输出的表格配置信息中复制黏贴到此
					<el-input rows="20" type="textarea" v-model="aiForm.columnListStr"></el-input>
				</el-form-item>
			</el-form>  
			<el-row slot="footer">
				<el-button @click="$refs['aiFormDialog'].close()">关闭</el-button>
				<el-button type="primary" @click="initFormFieldsByAiTable">确定</el-button>
			</el-row>
		</mdp-dialog>
		<mdp-dialog ref="apiFormDialog">
			<el-form :model="apiForm" ref="apiFormRef">
				<el-form-item label="api地址" prop="url" :rules="{required:true,message:'此项必输',trigger:'blur'}">
					<el-input v-model="apiForm.url" placeholder="如 http://127.0.0.1:8015/sys/user/list?userid=xxxx"></el-input>
				</el-form-item>
				<el-form-item label="请求方式" prop="method" :rules="{required:true,message:'此项必输',trigger:'blur'}">
					<mdp-select item-code="request_method" v-model="apiForm.method" placeholder="如 get/post/"></mdp-select>
				</el-form-item>
				<el-form-item label="请求参数" prop="params">
					<el-input type="textarea" :rows="10" v-model="apiForm.params"  placeholder='如 { userid:"xxxx" }'></el-input>
				</el-form-item> 
				
				<el-form-item label="授权信息" prop="header">
					<el-checkbox v-model="apiForm.useMyLoginToken">使用本系统登陆的token</el-checkbox>
					<el-input v-if="apiForm.useMyLoginToken==false" type="textarea" :rows="10" v-model="apiForm.header" placeholder='格式 如 {Authorization:"Bearer jwtTokenXXadkfdfdadfd"}'></el-input>
				</el-form-item> 
				
				<el-form-item label="取数函数JS" prop="parseDataFunc">
					<el-input type="textarea" :rows="10" v-model="apiForm.parseDataFunc"  placeholder="请求结果，默认取res.data.data的数据，如果返回结构不一致，请在此用js写取值逻辑"></el-input>
				</el-form-item> 
				
				<el-form-item  label="例子">
						if(res.data.tips.isOk){<br/>
						&nbsp;&nbsp;return res.data.data;<br/>
						}else{<br/>
						&nbsp;&nbsp;return null;<br/>
						}<br/> 
				</el-form-item>
			</el-form> 
			<el-row slot="footer">
				<el-button @click="$refs['apiFormDialog'].close()">关闭</el-button>
				<el-button type="primary" @click="initFormFieldsByApi">确定</el-button>
			</el-row>
		</mdp-dialog>
		<mdp-dialog ref="itemDialog" title="选择数据组" width="80%" :modal="false">
			<template v-slot="{visible,data,dialog}">
				<mdp-meta-item  :visible="visible" sub-op-type="select" @select="(item)=>{
					dialog.close();
					initFormFieldsByItemCode(item)
				}"></mdp-meta-item>
			</template> 
		</mdp-dialog>  
	</section>
</template>

<script>
import axios from '@/utils/request'
import axiosNoAuth from '@/utils/requestNoAuth' 
import { getToken} from '@/utils/auth'

import {dataSourceList} from '@/api/mdp/lcode/dev'
import draggable from 'vuedraggable'  
import { mapGetters } from 'vuex'
import MdpFormField from './Field.vue'
import {listTableColumn} from '@/api/mdp/lcode/FormField.js'
import treeTool from '@/components/mdp-ui/js/treeTool.js'
export default { 
	computed: {
		...mapGetters([
			'userInfo'
		])
	}, 
	props:{
		visible:{
			type:Boolean,
			default:false,
		},
		formDef:{
			type:Object,
			default:null,
		},
		formFields:{
			type:Array,
			default:[]
		}, 
		span:{
			type:Number,
			default:12,
		}
	},
	watch: { 
		'formDef':function( formDef ) { 
		if(formDef==this.myFormDef){
			return;
		}
		this.myFormDef=formDef; 
		},
		'addForm.bkey':function( bkey ) {   
		if(bkey=='1'){
			this.addForm.req="1" 
		}
		},
		'visible':function(visible) { 
		if(visible==true){ 
			
			this.selectedFields=treeTool.translateDataToTree(this.formFields,'pid','id') 
			this.setPrimaryKeys();
			this.$nextTick(()=>{
				this.$refs.showDataRef.clearValidate();
			})
		}
		} 
	},	
	data() {
		var options={
				list: [{name:'选项0'},{name:'选项1'},{name:'选项2'}],
				yesOrNo: [{name:'否'},{name:'是'}], 
			}
		return { 
			dbForm:{
				owner:'',//数据库用户
				tableName:'',
			},
			aiForm:{
				columnListStr:'',//表格配置信息黏贴
			}, 
			apiForm:{
				url:'',
				method:'GET',
				params:'',
				headers:'',//{Authorization:"Bearer jwtTokenXXadkfdfdadfd"}
				useMyLoginToken:true,
				parseDataFunc:'',
			},
			filters:{
				users:[]
			},
			pickerOptions:this.$mdp.getPickerOptions(),
			options:options, 
			
			load:{list: false,},
			addFormRules: {
				id: [
					{ required: false, message: '主键', trigger: 'blur' }
				]
			},
			addForm: {formId:'formId',showStyle:'origin',id:'one',idCamel:'one',title:'文本',typ:'text',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',dict:'',gname:'',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
			myFormDef:{tableName:'',tableOwner:'',isCreateTable:'',formName:'',userid:'',deptid:'',formType:'',isTemplate:'',bizType:'',ctime:'',branchId:''},
			selectedFields:[],
			sampleFields:[
				{formId:'formId',showStyle:'origin',id:'one',idCamel:'one',title:'输入框',dict:'',gname:'',typ:'text',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'多行输入框',dict:'',gname:'',typ:'textarea',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'four1',idCamel:'four1',title:'html',dict:'',gname:'',typ:'text',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'html',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'four2',idCamel:'four2',title:'图片',dict:'',gname:'',typ:'image',len:24,span:24,dval:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'image',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'four3',idCamel:'four3',title:'文件',dict:'',gname:'',typ:'att',len:24,span:24,dval:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'att',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'four4',idCamel:'four4',title:'链接',dict:'',gname:'',typ:'link',len:24,span:24,dval:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'link',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},

				{formId:'formId',showStyle:'origin',id:'two',idCamel:'two',title:'数字',dict:'',gname:'',typ:'number',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'three',idCamel:'three',title:'金额',dict:'',gname:'',typ:'amount',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},

				{formId:'formId',showStyle:'origin',id:'five',idCamel:'five',title:'单选下拉',dict:'',gname:'',plusOptions:options.list,typ:'select',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'six',idCamel:'six',title:'多选下拉',dict:'',gname:'',plusOptions:options.list,typ:'select',len:24,span:24,dval:'',mul:'1',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},

				{formId:'formId',showStyle:'origin',id:'seven',idCamel:'seven',title:'单选',dict:'',gname:'',plusOptions:options.yesOrNo,typ:'radio',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'eight',idCamel:'eight',title:'单选框',dict:'',gname:'',plusOptions:options.list,typ:'checkbox',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'nine',idCamel:'nine',title:'多选框',dict:'',gname:'',plusOptions:options.list,typ:'checkbox',len:24,span:24,dval:'',mul:'1',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},

				{formId:'formId',showStyle:'origin',id:'ten',idCamel:'ten',title:'时间',dict:'',gname:'',typ:'time',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'eleven',idCamel:'eleven',title:'日期',dict:'',gname:'',typ:'date',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'twelve',idCamel:'twelve',title:'日期时间',dict:'',gname:'',typ:'datetime',len:24,span:24,dval:'',mul:'0',hol:'请输入日期时间',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'thirteen',idCamel:'thirteen',title:'年',dict:'',gname:'',typ:'year',len:24,span:24,dval:'',mul:'0',hol:'请选中年份',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'fourteen',idCamel:'fourteen',title:'月',dict:'',gname:'',typ:'month',len:24,span:24,dval:'',mul:'0',hol:'请选中月份',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',id:'141',showStyle:'origin',id:'fourteen1',idCamel:'fourteen1',title:'日期区间',dict:'',gname:'',typ:'daterange',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},

				{formId:'formId',showStyle:'origin',id:'fifteen',idCamel:'fifteen',title:'部门',dict:'',gname:'',typ:'select',len:24,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'dept',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'seventeen',idCamel:'seventeen',title:'员工',dict:'',gname:'',typ:'select',len:24,span:24,dval:'',mul:'1',hol:'支持多选',req:'0',remark:'属性',extType:'user',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'nineteen',idCamel:'nineteen',title:'标签',dict:'',gname:'',typ:'select',len:24,span:24,dval:'',mul:'1',hol:'多选标签',req:'0',remark:'属性',extType:'tag',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
				{formId:'formId',showStyle:'origin',id:'twenty_one',idCamel:'twentyOne',title:'布局-行',dict:'',gname:'',typ:'row',len:24,span:24,dval:'',mul:'1',hol:'行',req:'0',remark:'属性',extType:'row',toFlow:'0',bkey:'0',qx:'',isNewAdd:true,
					children:[
						{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'布局-列1',dict:'',gname:'',typ:'text',len:12,span:12,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
						{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'布局-列2',dict:'',gname:'',typ:'text',len:12,span:12,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
						{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'布局-列1',dict:'',gname:'',typ:'text',len:12,span:12,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
						{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'布局-列2',dict:'',gname:'',typ:'text',len:12,span:12,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
					]
				},
				{formId:'formId',showStyle:'origin',id:'twenty_two',idCamel:'twentyTwo',title:'卡片',dict:'',gname:'',typ:'card',len:24,span:24,dval:'',mul:'1',hol:'行',req:'0',remark:'属性',extType:'card',toFlow:'0',bkey:'0',qx:'',isNewAdd:true,
					children:[
						{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'卡片-列1',dict:'',gname:'',typ:'text',len:12,span:12,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
						{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'卡片-列2',dict:'',gname:'',typ:'text',len:12,span:12,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
  					]
				},
				{formId:'formId',showStyle:'origin',id:'twenty_three',idCamel:'twentyThree',title:'tabs',dict:'',gname:'tab1,tab2',typ:'tabs',len:24,span:24,dval:'',mul:'1',hol:'行',req:'0',remark:'属性',extType:'tabs',toFlow:'0',bkey:'0',qx:'',isNewAdd:true,
					children:[
						{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'tab1-列1',dict:'',gname:'tab1',typ:'text',len:12,span:12,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
						{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'tab1-列2',dict:'',gname:'tab1',typ:'text',len:12,span:12,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
						{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'tab2-列1',dict:'',gname:'tab2',typ:'text',len:12,span:12,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
						{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'tab2-列2',dict:'',gname:'tab2',typ:'text',len:12,span:12,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},
					]
				}

			], 
			delFields:[],//存放删除的属性
			drag:true, 
			showPopover:false,
			activeName:'first',
			metaItemSelected:{},//选择的基础数据二级分类代码
			itemOptionMngVisible:false,//基础数据弹出框
			fieldIds: [
				{id:'zero',idCamel:'zero'},
				{id:'one',idCamel:'one'},
				{id:'two',idCamel:'two'},
				{id:'three',idCamel:'three'},
				{id:'four',idCamel:'four'},
				{id:'five',idCamel:'five'},
				{id:'six',idCamel:'six'},
				{id:'seven',idCamel:'seven'},
				{id:'eight',idCamel:'eight'},
				{id:'nine',idCamel:'nine'},
				{id:'ten',idCamel:'ten'},
				{id:'eleven',idCamel:'eleven'},
				{id:'twelve',idCamel:'twelve'},
				{id:'thirteen',idCamel:'thirteen'},
				{id:'fourteen',idCamel:'fourteen'},
				{id:'fifteen',idCamel:'fifteen'}
			],
			//新增界面数据 表单数据表
			showData: {
				id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',sixteen:'',seventeen:'',eighteen:'',nineteen:'',twenty:'',deptid:'',branchId:''
			}, 
			sampleData:{
				id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',sixteen:'',seventeen:'',eighteen:'',nineteen:'',twenty:'',deptid:'',branchId:''
			},
			primaryKeys:[],
			defaultField:{formId:'formId',showStyle:'origin',id:'four',idCamel:'four',title:'布局-列1',dict:'',gname:'',typ:'text',len:12,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true},

			/**end 在上面加自定义属性**/
		}//end return
	},//end data
	methods: {
		dataSourceList,
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
		
		setPrimaryKeys:function() {   
			if(!this.formDef.pks || this.formDef.pks.length==0){
				this.primaryKeys=[]
			}else{
				this.primaryKeys=this.formDef.pks.split(",")
			}
			 
			 var allFields=this.getFieldList();
			 allFields.forEach(f=>{
				if(this.primaryKeys.some(k=>k==f.id)){
					f.bkey="1"
				}else{
					f.bkey="0"
				}
			 })
		},
		onTplStart(evt){ 
		},
		onAdd(evt){   
			
			let item=this.selectedFields[evt.newIndex];  
			var item2=JSON.parse(JSON.stringify(item)) 
			item.isNewAdd=true
			var noSelectFieldId=this.fieldIds.find(i=>{
				return !this.hasChild(i.id);
			}) 
			if(!noSelectFieldId){ 
				var id=this.$mdp.createSeqNo('ext_infos.').toLocaleLowerCase();
				noSelectFieldId={id:id,idCamel:id} 
			}
			
			item2.id=noSelectFieldId.id 
			item2.idCamel=noSelectFieldId.idCamel  
			item2.isNewAdd=false;
			this.selectedFields[evt.newIndex]=item2;
			this.addForm=item2; 
			if(item2.children && item2.children.length>0){
				this.onAddWithChildren(item2.children)
			}
									
		},
			
		onAddWithChildren(children){   
			
			children.forEach((c,idx)=>{  
				c.isNewAdd=true 
				var noSelectFieldId=this.findNotInChild()
				
				if(!noSelectFieldId){
					var id=this.$mdp.createSeqNo('ext_infos.').toLocaleLowerCase();
					noSelectFieldId={id:id,idCamel:id}
				}
				c.id=noSelectFieldId.id 
				c.idCamel=noSelectFieldId.idCamel  
				delete c.isNewAdd 
			}) 						
		},
		deleteBaseData(){ 
			this.addForm.dict=''; 
		},   
		calcSpan(child){
			if(child.span>0){
				return child.span
			}else{
				return this.span
			} 
		},
				//move回调方法
		onMove(e,originalEvent){ 
			//不允许拖拽 
			if (e.draggedContext.element.id == '22') return false;
			return true;
		},  
		initFormFieldsByTable(){
			this.$refs['dbFormRef'].validate(valid=>{
				if(valid==false){
					this.$notify.error('表单验证不通过')
					return;
				}else{
					var params={owner:this.dbForm.owner,tableName:this.dbForm.tableName}
					listTableColumn(params).then(res=>{
						var tips = res.data.tips
						if(tips.isOk){
							var columns=res.data.data
							columns.forEach(c=>{ 
								var field=this.transColumnToField(c)
								if(field){ 
									this.selectedFields.push(field)
								}
							})
							this.$refs['dbFormDialog'].close()
						}else{
							this.$notify.error(tips.msg)
						}
					})
				}
			}) 
			
		},
		initFormFieldsByAiTable(){
			this.$refs['aiFormRef'].validate(valid=>{
				if(valid==false){
					this.$notify.error('表单验证不通过')
					return;
				}else{
					var columnListStr=this.aiForm.columnListStr
					var datas=columnListStr.split("\n") 
					var columns=datas[0].split("\t")
					var columnIdIdx=columns.findIndex(k=>k.indexOf('列名')>=0)
					var columnTypeIdx=columns.findIndex(k=>k.indexOf('数据类型')>=0)
					var columnRemarkIdx=columns.findIndex(k=>k.indexOf('描述')>=0)
					var columList=datas.slice(1); 
					columList.forEach(k=>{
						var c=k.split("\t")
						var field={formId:'formId',id:c[columnIdIdx],showStyle:'origin',id:c[columnIdIdx],idCamel:c[columnIdIdx],title:c[columnRemarkIdx],dict:'',gname:'',typ:'text',len:12,span:24,dval:'',mul:'0',hol:'请输入',req:'0',remark:'属性',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true}
						var noSelectFieldId=this.fieldIds.find(i=>{
							return !this.selectedFields.some(k=>k.id==i.id);
						}) 
						if(!noSelectFieldId){
							return null;
						}
						field.id=noSelectFieldId.id
						this.selectedFields.push(field)
					}) 
				}
			}) 
			
			
		},
		initFormFieldsByItemCode(item){ 
			if(!item || !item.itemCode){
				this.$notify.error('请选择数据字典')
				return;
			} 
			this.$mdp.ajaxGetDictOptions(item.itemCode,{}).then(res=>{
				var tips = res.tips
				if(tips.isOk){
					var options=res.data.options
					options.forEach(o=>{ 
						var field=this.transOptionToField(o)
						if(field){ 
							this.selectedFields.push(field)
						} 
					})
					this.$refs['itemDialog'].close();
				}else{
					this.$notify.error(tips.msg)
				}
			})
		},
		initFormFieldsByApi(){
			this.$refs['apiFormRef'].validate(valid=>{
				if(valid==false){
					this.$notify.error('表单验证不通过')
					return;
				}else{
					var axiosParams=this.apiFormToAxiosParams(this.apiForm);
					var axiosFun=axios
					if(this.apiForm.useMyLoginToken==false){
						var axiosFun=axiosNoAuth;
					} 
					axiosFun(axiosParams).then(res=>{ 
						var datas=null;
						if(this.apiForm.parseDataFunc){
							var func=new Function('res',apiForm.parseDataFunc)
							datas=func(res)
						}else{
							datas=res.data.data;
						}
						if(datas && datas.length>0){
							Object.keys(datas[0]).forEach(k=>{
								var field={formId:'formId',id:k,showStyle:'origin',id:k,idCamel:k,title:k,dict:'',gname:'',typ:'text',len:12,span:24,dval:'',mul:'0',hol:'请输入'+k,req:'0',remark:'',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true}
								var noSelectFieldId=this.fieldIds.find(i=>{
									return !this.selectedFields.some(k=>k.id==i.id);
								}) 
								if(!noSelectFieldId){
									return;
								}
								field.id=noSelectFieldId.id 
								this.selectedFields.push(field)
							})
							this.$notify({position:'bottom-left',showClose:true,message:'成功',type: 'success'})  
							this.$refs['apiFormDialog'].close();
						}else{
							this.$notify({position:'bottom-left',showClose:true,message:'失败',type: 'error'}) 

						} 
					})
				}
			}) 

			
			
			
			
		},
		transColumnToField(o){
			var field={formId:'formId',id:o.columnName,showStyle:'origin',id:o.columnName,idCamel:o.camelsColumnName,title:o.chinaName,dict:'',gname:'',typ:'text',len:12,span:24,dval:'',mul:'0',hol:'请输入'+o.chinaName,req:'0',remark:'',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true}
			var noSelectFieldId=this.fieldIds.find(i=>{
				return !this.selectedFields.some(k=>k.id==i.id);
			}) 
			if(!noSelectFieldId){
				return null;
			}
			field.id=noSelectFieldId.id
			return field;
		},
		transOptionToField(o){
			var field={formId:'formId',id:o.id,showStyle:'origin',id:o.id,idCamel:o.id,title:o.name,dict:'',gname:'',typ:'text',len:12,span:24,dval:'',mul:'0',hol:'请输入'+o.name,req:'0',remark:'',extType:'',toFlow:'0',bkey:'0',qx:'',isNewAdd:true}
			var noSelectFieldId=this.fieldIds.find(i=>{
				return !this.selectedFields.some(k=>k.id==i.id);
			}) 
			
			if(!noSelectFieldId){
				return null;
			}
			field.id=noSelectFieldId.id 
			return field;
		},
		
		apiFormToAxiosParams(apiForm){
		var axiosObj={url:apiForm.url,method:apiForm.method,headers:{}}

		//参数处理 
		if(apiForm.params && apiForm.params.indexOf('{')>=0){
			axiosObj.params=JSON.parse(apiForm.params)
		} 

		//header处理
		if(apiForm.useMyLoginToken==true){ 
			axiosObj.headers['Authorization'] = 'Bearer '+getToken()
		}else if(apiForm.headers && apiForm.headers.indexOf("{")>=0){ 
			axiosObj.headers=JSON.parse(apiForm.headers)
		}else {
			axiosObj.headers={}
		} 
		return axiosObj
	},
	doChildDelete(child,idx,children){ 
		children.splice(idx,1)
		this.$emit('delete',child,idx,children)
	}, 
	onBkeyChange(field){
		this.$emit('bkey-change',field)
		if(field.bkey=='1'){//设为主键
			 if(!this.primaryKeys.some(k=>k==field.id)){
				this.primaryKeys.push(field.id)
				this.formDef.pks=this.primaryKeys.join(",")
			 }
		}else{//取消主键 
			var idx=this.primaryKeys.findIndex(k=>k==field.id)
			if(idx>=0){
				this.primaryKeys.splice(idx,1) 
				this.formDef.pks=this.primaryKeys.join(",")
			} 
		}
	},
	hasChild(id){
		
		return this.hasMyChild(id,this.selectedFields)
	},
	hasMyChild(id,children){
		
		if(!children||children.length==0){
			return false;
		}else{
			 if(children.some(c=>c.id==id && c.isNewAdd!=true)){
				return true
			 }else{
				for(var i=0;i<children.length;i++){
					var childs=children[i].children
					var has= this.hasMyChild(id,childs)
					if(has){
						return true;
					}else{
						continue;
					}
				}
				return false;
			 }
		}
	},
	findNotInChild(){
		return this.fieldIds.find(i=>{
			return !this.hasChild(i.id);
		})  
	},
	getMyFieldList(list,children){
		if(children && children.length>0){
			children.forEach(k=>{
				if(['card','tabs','row'].some(t=>t==k.extType)){
					k.req='0'
					k.bkey='0'
				}
				if(k.children && k.children.length>0){
					var childs=k.children
					childs.forEach(c=>c.pid=k.id)
					list.push(k)
					this.getMyFieldList(list,childs)
				}else{
					list.push(k)
				}
			})
		}
		
	},
	getFieldList(){
		var list=[]
		this.getMyFieldList(list,this.selectedFields)
		return list;
	},
	getMaxFields(){
		return this.fieldIds.length
	}
	},//end method
	components: {  
		//在下面添加其它组件 'form-field-edit':FormFieldEdit
		draggable, MdpFormField
	},
	mounted() {
		
		this.myFormDef=this.formDef
		if(this.formFields){
			this.selectedFields=treeTool.translateDataToTree(this.formFields,'pid','id')
		}else{
			this.selectedFields=[]
		}
		this.setPrimaryKeys();
		
	}//end mounted
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped> 
.min-height{
  min-height:300px; 
  }

  
  .set-btn {
    display: none;
  }
  
 
  .form-item:hover .set-btn { 
    display: inline-block; 
  }

</style>