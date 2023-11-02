<template>
	<section >   
		<pre>
			<code>{{code}}</code>
		</pre>
		
		<pre>
			<code>
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js'; 
export default {
	mixin:[MdpFormMixin], 
	data(){
		editForm:{}
	},
	method:{
		initCurrData(){ 

		}, 
	}
}
			</code>
		</pre>
	</section>
</template>

<script>   
 import treeTool from '@/components/mdp-ui/js/treeTool.js'
export default { 
	computed: { 
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
	},
	watch: {  
		formFields(){
			this.createSource();
		} 
	},	
	data() {

		var options={
				list: [{name:'选项0'},{name:'选项1'},{name:'选项2'}],
				yesOrNo: [{name:'否'},{name:'是'}], 
			}
		return { 
			source:'',
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
			fields:[],
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
			extInfosList:[],
			extInfosMap:{},
			code:'',
			/**end 在上面加自定义属性**/
		}//end return
	},//end data
	methods: {
		// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
		handleCancel:function(){
			this.$emit('cancel');
		},  
		createSource(){ 
			this.fields=this.formFields
			 var sourceStr=`<el-form :model="editForm" ref="editForm">\n\t${this.createSubSource(1,this.fields)}\n</el-form>` 
			 this.code=sourceStr;
 		},
		
		createSubSource(lvl,children){
			 
			
			if(!children || children.length==0){
				return "";
			}  
			var lvlt=this.getTabByLvl(lvl)
			var lvlt1=this.getTabByLvl(lvl+1)
			var srcList=[]
			children.forEach((field,idx)=>{ 
				var sourceStr=""
				var extInfosMap=this.getExtInfosMap(field);
				var hasChild=field.children&&field.children.length>0;  
				var styleObj=(field.styleObj!=null && field.styleObj.length>0)?":style=\""+field.styleObj+"\"":"";
				if(field.extType=='row'){
					var subSrc=hasChild?this.rowChildSrc(lvl+1,field):"";  
					sourceStr=`<el-row>\n${lvlt1}${subSrc}\n${lvlt}</el-row>` 
				}else if(field.extType=='card'){ 
					var header=`<div slot="header" class="clearfix"><span>${field.title}</span></div>`
					var subSrc=hasChild?this.rowChildSrc(lvl+2,field):"";  
					sourceStr=`<card>\n${lvlt1}${header}\n${lvlt1}<el-row>\n${lvlt1}\t${subSrc}\n${lvlt1}</el-row>\n${lvlt}</card>`
				}else if(field.extType=='tabs'){ 
					var subSrc=hasChild?this.tabsChildSrc(lvl+1,field):"";  
					sourceStr=`<el-tabs>\n${lvlt1}${subSrc}\n${lvlt}</el-tabs>` 
				}else{
					var fieldSrc=""
					var showStyle=`${field.showStyle?"show-style=\""+field.showStyle+"\"":""}`
					if(field.extType=='user'){
						fieldSrc=`<mdp-select-user ${showStyle} :disabled="${field.ronly=='1'}" :multiple="${field.mul=='1'}" v-model="editForm.${field.idCamel}"  label="${field.title}"  placeholder="${field.hol||field.title}"  split=","></mdp-select-user>`
					}else if(field.extType=='dept'){
						fieldSrc=`<mdp-select-dept ${showStyle} :disabled="${field.ronly=='1'}" :multiple="${field.mul=='1'}" v-model="editForm.${field.idCamel}" :show-checkbox="${field.mul=='1'}"  label="${field.title}"  placeholder="${field.hol||field.title}"  split=","></mdp-select-dept>`

					}else if(field.extType=='tag'){
						fieldSrc=`<mdp-select-tag ${showStyle} :disabled="${field.ronly=='1'}" :multiple="${field.mul=='1'}" v-model="editForm.${field.idCamel}"  label="${field.title}"  placeholder="${field.hol||field.title}"  split=","></mdp-select-tag>`

					}else  if( ['select','radio','checkbox'].some(k=>k==field.typ)){
						
						var plusOptions=""
						if(extInfosMap['plusOptions']){
							plusOptions=`:plus-options="${extInfosMap['plusOptions']}"`
						} 
						fieldSrc=`<mdp-select ${plusOptions} show-type="${field.typ}" ${showStyle} :disabled="${field.ronly=='1'}" :multiple="${field.mul=='1'}" v-model="editForm.${field.idCamel}"  label="${field.title}"  placeholder="${field.hol||field.title}"  split=","></mdp-select>`

 					}else  if(field.extType=='html'){ 
						if(field.ronly=='1'){
							fieldSrc=`<div v-html="${field.dval||'无'}"></div>`
						}else{ 
						fieldSrc=`<el-popover placement="top-start"	width="400"	trigger="hover"><el-input  type="textarea" rows="4" v-model="editForm.${field.idCamel}"></el-input><div slot="reference"  v-html="editForm.${field.idCamel}||${field.dval}||'无'"></div></el-popover>`
						}
					}else  if(field.extType=='link'){
						if(field.ronly=='1'){
							fieldSrc=`<el-link slot="reference" :href="editForm.${field.idCamel}" target="_blank">{{ editForm.${field.idCamel}||${field.dval}||'无' }}</el-link>`
						}else{ 
						fieldSrc=`<el-popover
								placement="top-start"
								width="400"
								trigger="hover">
								<el-input  type="textarea" rows="4" v-model="editForm.${field.idCamel}"></el-input>
								<el-link slot="reference" :href="editForm.${field.idCamel}" target="_blank">{{ editForm.${field.idCamel}||${field.dval}||'无' }}</el-link> 
							</el-popover>`
						}
					}else  if(field.extType=='image'){
						if(field.ronly=='1'){
							fieldSrc=`<el-image ${styleObj}
										:src="editForm.${field.idCamel}||${field.dval}"
										fit="contain" >
									</el-image>`
						}else{ 
						fieldSrc=`<el-popover
								placement="top-start"
								width="400"
								trigger="hover">
								<el-button  @click="$refs['imageDialog'].open({formData:editForm,prop:'${field.idCamel}'})">上传图片</el-button>  
								<el-image slot="reference" ${styleObj}
									:src="editForm.${field.idCamel}||${field.dval}"
									fit="contain" >
								</el-image>
							</el-popover>`
						}
					}else  if(field.extType=='att'){
						if(field.ronly=='1'){
							fieldSrc=`<el-link :href="editForm.${field.idCamel}" target="_blank">{{ editForm.${field.idCamel}||${field.dval}||'无' }}</el-link>`
						}else{ 
						fieldSrc=`<el-popover
								placement="top-start"
								width="400"
								trigger="hover">
								<el-button  @click="$refs['attDialog'].open({formData:showData,field:field})">上传附件</el-button> 
								<el-link slot="reference" :href="editForm.${field.idCamel}" target="_blank">{{ editForm.${field.idCamel}||${field.dval}||'无' }}</el-link> 
							</el-popover>`
						}
					}else  if(field.typ=='text'){
						fieldSrc=`<mdp-input ${showStyle}  :disabled="${field.ronly=='1'}" ${styleObj} v-model="editForm.${field.idCamel}"  label="${field.title}"  placeholder="${field.hol||field.title}"  :clearable="${field.clear!='0'}" > </mdp-input>`

					}else  if(field.typ=='number'){
						fieldSrc=`<mdp-number ${showStyle}  :disabled="${field.ronly=='1'}" ${styleObj} v-model="editForm.${field.idCamel}"  label="${field.title}"  placeholder="${field.hol||field.title}"  :clearable="${field.clear!='0'}" > </mdp-number>`

					}else  if(field.typ=='amount'){
						fieldSrc=`<mdp-number ${showStyle}  :disabled="${field.ronly=='1'}" ${styleObj} v-model="editForm.${field.idCamel}"  label="${field.title}"  placeholder="${field.hol||field.title}"  :clearable="${field.clear!='0'}" > </mdp-number>`
					}else  if(field.typ=='textarea'){
						fieldSrc=`<mdp-input ${showStyle} type="textarea" :rows="${extInfosMap.rows}" :disabled="${field.ronly=='1'}" ${styleObj} v-model="editForm.${field.idCamel}"  label="${field.title}"  placeholder="${field.hol||field.title}"  :clearable="${field.clear!='0'}" > </mdp-input>`

					}else  if(field.typ=='time'){
						fieldSrc=`<el-time-picker :disabled="${field.ronly=='1'}" ${styleObj} v-model="editForm.${field.idCamel}"  label="${field.title}"  placeholder="${field.hol||field.title}"  :clearable="${field.clear!='0'}" > </el-time-picker>`
					}else  if(field.typ=='date'){
						fieldSrc=`<mdp-date ${showStyle} :disabled="${field.ronly=='1'}" ${styleObj} v-model="editForm.${field.idCamel}" align="right" type="date" value-format="${extInfosMap.valueFormat||'yyyy-MM-dd HH:mm:ss'}" format="${extInfosMap.format||'yyyy-MM-dd'}" placeholder="${field.hol||'选择日期'}"> </mdp-date>`

					}else  if(field.typ=='datetime'){
						fieldSrc=`<mdp-date ${showStyle} :disabled="${field.ronly=='1'}" ${styleObj} v-model="editForm.${field.idCamel}" align="right" type="datetime" value-format="${extInfosMap.valueFormat||'yyyy-MM-dd HH:mm:ss'}" format="${extInfosMap.format||'yyyy-MM-dd HH:mm:ss'}" placeholder="${field.hol||'选择日期时间'}"> </mdp-date>`

					}else  if(field.typ=='month'){
						fieldSrc=`<mdp-date ${showStyle} :disabled="${field.ronly=='1'}" ${styleObj} v-model="editForm.${field.idCamel}" align="right" type="month" value-format="${extInfosMap.valueFormat||'yyyy-MM'}" format="${extInfosMap.format||'yyyy-MM'}" placeholder="${field.hol||'选择月份'}"> </mdp-date>`
					}else  if(field.typ=='year'){
						fieldSrc=`<mdp-date ${showStyle} :disabled="${field.ronly=='1'}" ${styleObj} v-model="editForm.${field.idCamel}" align="right" type="year" value-format="${extInfosMap.valueFormat||'yyyy'}" format="${extInfosMap.format||'yyyy'}" placeholder="${field.hol||'选择年份'}"> </mdp-date>`

					}else  if(field.typ=='daterange'){
						fieldSrc=`<mdp-date-range :show-style="field.showStyle" :disabled="${field.ronly=='1'}" ${styleObj} :value="editForm[${field.idCamel}]?editForm[${field.idCamel}].split(','):[]" align="right" type="daterange" value-format="${extInfosMap.valueFormat||'yyyy-MM-dd'}" format="${extInfosMap.format||'yyyy-MM-dd'}" placeholder="${field.hol||'选择起止时间'}" @change="(vs)=>editForm[${field.idCamel}]=vs.join(',')"> </mdp-date-range> `	
					}
					var vrules=field.vrules?JSON.parse(field.vrules):[]
					if(field.req=='1'){
						if(!vrules.some(k=>'required' in k)){
							vrules.push({required:true,message:"此项必填",trigger:"change"})
						}
					}
					sourceStr=`<el-form-item label="${field.title}" prop="${field.idCamel}" :rules="${JSON.stringify(vrules)}">\n${lvlt1}${fieldSrc}\n${lvlt}</el-form-item>`
				}
				if(sourceStr){
					srcList.push(sourceStr)
				}
				
			}) 
			return srcList.join(`\n${lvlt}`);
		},
		rowChildSrc(lvl,field){
			var srcList=[] 
			var lvlt=this.getTabByLvl(lvl)
			var lvlt1=this.getTabByLvl(lvl+1)
			if(field.children && field.children.length>0){
				field.children.forEach(k=>{
					var span=k.span?k.span:24
					var src=`<el-col :span="${span}">\n${lvlt1}${this.createSubSource(lvl+1,[k])}\n${lvlt}</el-col>`
					srcList.push(src)
				})
				return srcList.join("\n"+lvlt) 
			}else{
				return "";
			}
			
		},
		
		tabsChildSrc(lvl,field){
			var srcList=[]
			if(!field.gname || field.gname.length==0){
				return ""
			}	 
			var lvlt=this.getTabByLvl(lvl)
			var lvlt1=this.getTabByLvl(lvl+1)
			var tabList=field.gname.split(",")
			tabList.forEach(tab=>{
				var childs=field.children.filter(f=>f.gname==tab||!f.gname)
				var subSrc=childs&&childs.length>0?this.rowChildSrc(lvl+1,{children:childs}):"" 
				var src=`<el-tab-pane name="${tab}">\n${lvlt1}<el-row>\n${lvlt1}\t${subSrc}\n${lvlt1}</el-row>\n${lvlt}</el-tab-pane>`
				srcList.push(src)
			})
			return srcList.join("\n"+lvlt) 
		},
		getTabByLvl(lvl){
			var str=""
			for(var i=0;i<lvl;i++){
				str=str+"\t"
			}
			return str
		},
		getExtInfosMap(field){   
 			var extInfosList=field.extInfos?JSON.parse(field.extInfos):[]
 			var extInfosMap={}
			extInfosList.forEach(k=>{
				extInfosMap[k.id]=k.value
			}) 
			return extInfosMap;
		}, 
	},//end method
	components: {    
	},
	mounted() { 
		this.createSource(); 
		
	}//end mounted
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped> 
 
</style>