<template>
	<section @click.alt.stop="showPopover=(sample==true?false:!showPopover)" :class="{'form-field':true,'select':showPopover}"> 
		<el-row v-if="field.extType=='row'" :gutter="gutter">     
			<template v-if="sample==true">
				<el-col @click.ctrl.native.stop="doChildDelete(child,idx,field.children)" v-for="child,idx in field.children" :key="idx" :span="calcSpan(child,field)">
					<mdp-form-field :find-not-in-child="findNotInChild" @bkey-change="onBkeyChange" :has-child="hasChild" :parent-field="field" :gutter="gutter" :span="span" v-if="child" :value="child" @change="(v)=>onChildChange(child,v)" @delete="onChildDelete" :sample="sample"></mdp-form-field>
				</el-col> 
			</template>
			<draggable  v-else-if="field.children && field.children.length>0" @add="onAdd" v-model="field.children" :options="{group:{ name:'g1', pull:'clone'}, animation:150}"> 
				<el-col @click.ctrl.native.stop="doChildDelete(child,idx,field.children)" v-for="child,idx in field.children" :key="idx" :span="calcSpan(child,field)">
						<mdp-form-field :find-not-in-child="findNotInChild" @bkey-change="onBkeyChange" :has-child="hasChild" :parent-field="field" :gutter="gutter" :span="span" v-if="child" :value="child" @change="(v)=>onChildChange(child,v)" @delete="onChildDelete"></mdp-form-field>
				</el-col> 
			</draggable>   
		</el-row>  
		<el-card v-else-if="field.extType=='card'" :gutter="gutter"> 
			<div slot="header" class="clearfix">
				<span>{{ field.title }}</span>
			</div>    
			<template v-if="sample==true">
				<el-row :gutter="gutter"> 
					<el-col @click.ctrl.native.stop="doChildDelete(child,idx,field.children)" v-for="child,idx in field.children" :key="idx" :span="calcSpan(child,field)">
						<mdp-form-field :find-not-in-child="findNotInChild" :has-child="hasChild" :parent-field="field" :gutter="gutter" :span="span" v-if="child" :value="child" @change="(v)=>onChildChange(child,v)" @delete="onChildDelete" :sample="sample"></mdp-form-field>
					</el-col> 
				</el-row>
			</template>
			<el-row :gutter="gutter" v-else-if="field.children && field.children.length>0"> 
				<draggable   @add="onAdd" v-model="field.children" :options="{group:{ name:'g1', pull:'clone'}, animation:150}"> 
					<el-col @click.ctrl.native.stop="doChildDelete(child,idx,field.children)" v-for="child,idx in field.children" :key="idx" :span="calcSpan(child,field)">
							<mdp-form-field :find-not-in-child="findNotInChild" :has-child="hasChild" :parent-field="field" :gutter="gutter" :span="span" v-if="child" :value="child" @change="(v)=>onChildChange(child,v)" @delete="onChildDelete"></mdp-form-field>
					</el-col> 
				</draggable>  
			</el-row> 
		</el-card> 
		<el-tabs v-else-if="field.extType=='tabs'" v-model="showData[field.idCamel]">     
			<template v-if="sample==true">
				<el-tab-pane :label="tab" v-for=" tab,tidx in tabListCpd" :key="tidx" :name="tab">
					<el-row :gutter="gutter"> 
						<el-col @click.ctrl.native.stop="doChildDelete(child,idx,field.children)" v-for="child,idx in field.children.filter(c=>c.gname==tab)" :key="idx" :span="calcSpan(child,field)">
								<mdp-form-field :find-not-in-child="findNotInChild" :has-child="hasChild" :parent-field="field" :gutter="gutter" :span="span" v-if="child" :value="child" @change="(v)=>onChildChange(child,v)" @delete="onChildDelete"></mdp-form-field>
						</el-col> 
					</el-row> 
				</el-tab-pane>
			</template>
			<el-tab-pane :label="tab" v-else v-for=" tab,tidx in tabListCpd" :key="tidx" :name="tab">
				<el-row :gutter="gutter"> 
					<draggable @add="onAdd" v-model="field.children" :options="{group:{ name:'g1', pull:'clone'}, animation:150}"> 
						<el-col v-if="!field.children.some(c=>c.gname==tab||!c.gname)" style="height:100px">
							<div>拖拽组件到此</div>
						</el-col>
						<el-col v-else @click.ctrl.native.stop="doChildDelete(child,idx,field.children)" v-for="child,idx in field.children.filter(c=>c.gname==tab||!c.gname)" :key="idx" :span="calcSpan(child,field)">
								<mdp-form-field :find-not-in-child="findNotInChild" :has-child="hasChild" :parent-field="field" :gutter="gutter" :span="span" v-if="child" :value="child" @change="(v)=>onChildChange(child,v)" @delete="onChildDelete"></mdp-form-field>
						</el-col> 
					</draggable>  
				</el-row> 
			</el-tab-pane>
			
		</el-tabs> 
		<el-form-item  v-else  :label="field.showStyle=='x'?'':field.title" :prop="field.idCamel" :rules="[{ required: field.req=='1', message: '该项必填', trigger: 'change' }]"> 
			<div  v-if="field.qx=='nr'"></div>
			 
		<!--用户-->
			<mdp-select-user v-else-if=" field.extType=='user'" :show-style="field.showStyle" :disabled="field.qx=='r'|| field.ronly=='1'" :multiple="field.mul=='1'" v-model="showData[field.idCamel]"  :label="field.title"  :placeholder="field.remark"  split=",">			 
			</mdp-select-user>  
		<!--部门-->
			<mdp-selecct-dept v-else-if=" field.extType=='deppt'" :show-style="field.showStyle" :branch-id="userInfo.branchId" :show-checkbox="field.mul=='1'" :multiple="field.mul=='1'" split=","></mdp-selecct-dept>

		<!--标签-->
			<mdp-select-tag  v-else-if=" field.extType=='tag'" :show-style="field.showStyle" :disabled="field.qx=='r'|| field.ronly=='1'" :multiple="field.mul=='1'" v-model="showData[field.idCamel]"  :label="field.title"  :placeholder="field.remark"  split=",">			 
			</mdp-select-tag>  
		<!--下拉框-->
			<mdp-select v-else-if=" ['select','radio','checkbox'].some(k=>k==field.typ)"  :show-style="field.showStyle" :plus-options="sample?field.plusOptions:[]" :disabled="field.qx=='r' || field.ronly=='1'" :show-type="field.typ"  :item-code="field.dict" :multiple="field.mul=='1'" v-model="showData[field.idCamel]"  :label="field.title"  :placeholder="field.remark" split=",">			 
			</mdp-select>
		<!--html-->
			<el-popover v-else-if=" field.extType=='html'"
				placement="top-start"
				width="400"
				trigger="hover">
				<el-input  type="textarea" rows="4" v-model="showData[field.idCamel]" v-if="field.ronly!='1'"></el-input>
				<div slot="reference"  v-html="showData[field.idCamel]||field.dval||'无'"></div>
			</el-popover>
		<!--link 链接-->
			<el-popover v-else-if=" field.extType=='link'"
				placement="top-start"
				width="400"
				trigger="hover">
				<el-input v-model="showData[field.idCamel]" v-if="field.ronly!='1'"></el-input>
				<el-link slot="reference" :href="showData[field.idCamel]" target="_blank">{{ showData[field.idCamel]||field.title }}</el-link> 
			</el-popover>
		<!--image-->
			<el-popover v-else-if=" field.extType=='image'"
				placement="top-start" 
				trigger="hover">
				<el-button  @click="$refs['imageDialog'].open({formData:showData,field:field})" v-if="field.ronly!='1'">上传图片</el-button>  
				<el-image slot="reference" :style="parseFieldStyleObj()||{maxHeight:'100px',maxWidth:'100px'}"
					:src="showData[field.idCamel]"
					fit="contain" >
				</el-image>
			</el-popover>
		<!--att 附件-->
			<el-popover v-else-if=" field.extType=='att'"
				placement="top-start" 
				trigger="hover">
				<el-button  @click="$refs['attDialog'].open({formData:showData,field:field})" v-if="field.ronly!='1'">上传附件</el-button> 
				<el-link slot="reference" :href="showData[field.idCamel]" target="_blank">{{ showData[field.idCamel]||field.title }}</el-link> 
			</el-popover>
		<!--其它类型-->
			<mdp-input :show-style="field.showStyle"  :disabled="field.qx=='r'||field.ronly=='1'" v-else-if="field.typ=='text'"  :style="styleObjCpd" v-model="showData[field.idCamel]"  :label="field.title" auto-complete="off" :placeholder="field.remark"  clearable > </mdp-input>
			<mdp-number :show-style="field.showStyle" :disabled="field.qx=='r'||field.ronly=='1'"   v-else-if="field.typ=='number'" :style="styleObjCpd" v-model="showData[field.idCamel]"  :label="field.title" auto-complete="off"  placeholder="请输入内容"  clearable ></mdp-number>
			<mdp-number :show-style="field.showStyle" :disabled="field.qx=='r'||field.ronly=='1'"   v-else-if="field.typ=='amount'" :style="styleObjCpd" v-model="showData[field.idCamel]"  :label="field.title" auto-complete="off"  placeholder="请输入内容"  clearable></mdp-number>
			<mdp-input :show-style="field.showStyle" :disabled="field.qx=='r'||field.ronly=='1'"   v-else-if="field.typ=='textarea'" :style="styleObjCpd"  type="textarea" :rows="2" v-model="showData[field.idCamel]"  :label="field.title"  placeholder="请输入内容"></mdp-input>
			<el-time-picker :show-style="field.showStyle" :disabled="field.qx=='r'||field.ronly=='1'"   v-else-if="field.typ=='time'" :style="styleObjCpd"  v-model="showData[field.idCamel]"  placeholder="任意时间点"> </el-time-picker> 
			<mdp-date :show-style="field.showStyle" :disabled="field.qx=='r'||field.ronly=='1'"   v-else-if="field.typ=='date'" :style="styleObjCpd" v-model="showData[field.idCamel]" align="right" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions"> </mdp-date>
			<mdp-date :show-style="field.showStyle" :disabled="field.qx=='r'||field.ronly=='1'" v-else-if="field.typ=='datetime'" :style="styleObjCpd" v-model="showData[field.idCamel]" type="datetime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" align="right" :picker-options="pickerOptions"> </mdp-date>
			<mdp-date :show-style="field.showStyle" :disabled="field.qx=='r'||field.ronly=='1'" v-else-if="field.typ=='month'" :style="styleObjCpd" v-model="showData[field.idCamel]" type="month" value-format="yyyy-MM" format="yyyy-MM" placeholder="选择月份"></mdp-date>
			<mdp-date :show-style="field.showStyle" :disabled="field.qx=='r'||field.ronly=='1'" v-else-if="field.typ=='year'" :style="styleObjCpd" v-model="showData[field.idCamel]" type="month" value-format="yyyy" format="yyyy" placeholder="选择年"></mdp-date>
			<mdp-date-range :show-style="field.showStyle" :disabled="field.qx=='r'||field.ronly=='1'"   v-else-if="field.typ=='daterange'" :style="styleObjCpd" :value="showData[field.idCamel]?showData[field.idCamel].split(','):[]" align="right" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions"
				@change="(vs)=>showData[field.idCamel]=vs.join(',')"
			> </mdp-date-range>  	
		</el-form-item>      
		<mdp-dialog ref="imageDialog" title="选择图片" width="80%" :modal="false">
			<template v-slot="{visible,data,dialog}">
				<mdp-select-image v-if="visible" :visible="visible" @select="(imgs)=>{ 
					if(data.field.mul=='1'){ 
						$set(data.formData,data.field.idCamel,imgs&&imgs.length>0?imgs.map(i=>i.url).join(','):null) 
					}else{
						$set(data.formData,data.field.idCamel,imgs&&imgs.length>0?imgs[0].url:null) 
					}
					dialog.close();
				}"></mdp-select-image>
			</template> 
		</mdp-dialog>  
		<mdp-dialog ref="attDialog" title="选择文件" width="80%" :modal="false">
			<template v-slot="{visible,data,dialog}">
				<mdp-select-att v-if="visible" :visible="visible" :multiple="data.field.mul=='1'" @select="(imgs)=>{
					if(data.field.mul=='1'){ 
						$set(data.formData,data.field.idCamel,imgs&&imgs.length>0?imgs.map(i=>i.url).join(','):null) 
					}else{
						$set(data.formData,data.field.idCamel,imgs&&imgs.length>0?imgs[0].url:null) 
					}  
					 dialog.close();
				}" split=","></mdp-select-att>
			</template> 
		</mdp-dialog>  
		
		<el-drawer :visible.sync="showPopover" append-to-body :modal="false">
				<mdp-form-field-cfg @bkey-change="onBkeyChange" :has-child="hasChild" :parent-field="parentField" :form-def="formDef" :value="field" :visible="showPopover" @change="onFieldCfgChange" @close="showPopover=false"></mdp-form-field-cfg>
			</el-drawer>
	</section>
</template>

<script>
 	import draggable from 'vuedraggable'  
	import { mapGetters } from 'vuex' 
	import MdpFormFieldCfg from './FieldCfg.vue'
	export default { 
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ]),
			tabListCpd(){
				if(!this.field.gname){
					return []
				}
				return this.field.gname.split(",")
			},
			styleObjCpd(){
				return this.parseFieldStyleObj();
			}
		}, 
		props:{
			visible:{
				type:Boolean,
				default:false,
			}, 
			value:{
				type:Object,
				default:function(){
					return {}
				}
			},
			
			parentField:{
				type:Object,
				default:function(){
					return {}
				}
			},
			formDef:{
				type:Object,
				default:function(){
					return {}
				}
			},
			span:{
				type:Number,
				default:12,
			},
			gutter:{
				type:Number,
				default:0
			}, 
			sample:{
				type:Boolean,
				default:false
			},
			hasChild:{
				type:Function,
				default:function(){
					return null;
				}
			},
			findNotInChild:{
				type:Function,
				default:function(){
					return (excludeId)=>{
						return null;
					};
				}
			}
		},
		watch: { 
	       
			value:{
				deep:true,
				immediate:true,
				handler:function(){ 
					this.field=this.value
					if(this.field.extType=='tabs'){
						if(this.field.gname){
							this.showData[this.field.idCamel]=this.field.gname.split(",")[0]
						}
						
					}
				}
		   }
	    },	
		data() {
			return {
				 field:{},
				 showData:{},
				 pickerOptions:this.$mdp.getPickerOptions(),
				 showPopover:false, 
				fieldRules: {
					id: [
						//{ required: false, message: '主键', trigger: 'blur' }
					]
				},
				options:{  
					list: [{id:'0',name:'选项0'},{id:'1',name:'选项1'},{id:'2',name:'选项2'}],
					yesOrNo: [{id:'0',name:'否'},{id:'1',name:'是'}], 
				}, 
				select:false,
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
		    fieldDelete(field){
		    	this.field ={}; 
		    	this.showPopover=false; 
				this.$emit('delete',field) 
		    }, 
		    fieldClick(field){
		    	this.showPopover=true; 
			}, 
			 
			deleteBaseData(){
				this.field.isDict='0';
				this.field.dict=''; 
			},  
			 
			onChildChange(child,$event){
				Object.assign(child,$event) 
				this.$emit('input',this.field)
				this.$emit('change',this.field)
				this.$emit('change2',this.field)
			},
			onFieldCfgChange(field){
				this.showPopover=false
				Object.assign(this.field,field)
				this.$emit('input',this.field)
				this.$emit('change',this.field)
				this.$emit('change2',this.field)
			},
			onChildDelete(child,idx,children){
				this.$emit('delete',child,idx,children)
			},
			doChildDelete(child,idx,children){
				children.splice(idx,1)
				this.$emit('delete',child,idx,children)
			},
			calcSpan(child,parent){ 
				if(child.span>0){
					return child.span
				}else{
					return this.span
				}  
			},
			
			onAdd(evt){  
				
				let item=this.field.children[evt.newIndex];  
				item.isNewAdd=true
				var item2=JSON.parse(JSON.stringify(item)) 
				var noSelectFieldId=this.findNotInChild()
				
				if(!noSelectFieldId){
					var id=this.$mdp.createSeqNo('ext_infos.').toLocaleLowerCase();
					noSelectFieldId={id:id,idCamel:id}
				}
				item2.id=noSelectFieldId.id 
				item2.idCamel=noSelectFieldId.idCamel  
				delete item2.isNewAdd
				this.$set(this.field.children,evt.newIndex,item2) 
				//this.field.children[evt.newIndex]=itme2
				if(item2.children && item2.children.length>0){
					this.onAddWithChildren(item2.children)
				}

			},
			
			onAddWithChildren(children){   
				var that=this;
				children.forEach((c,idx)=>{  
					c.isNewAdd=true  
					var noSelectFieldId=that.findNotInChild()
					if(!noSelectFieldId){
						var id=this.$mdp.createSeqNo('ext_infos.').toLocaleLowerCase();
						noSelectFieldId={id:id,idCamel:id}
					}
					c.id=noSelectFieldId.id 
					c.idCamel=noSelectFieldId.idCamel  
					delete c.isNewAdd 
				}) 						
			},
			onBkeyChange(field){
				this.$emit('bkey-change',field)
			},
			parseFieldStyleObj(){
				if(this.field.styleObj && this.field.styleObj.indexOf("{")>=0 && this.field.styleObj.indexOf("}")>0){
					return JSON.parse(this.field.styleObj)
				}else{
					return {}
				}
			}
			
		},//end method
		components: {  
 		    draggable, 
			"mdp-form-field": ()=>import('@/views/mdp/lcode/formField/Field.vue'), 
			MdpFormFieldCfg
		},
		mounted() {
		 
			
		}//end mounted
	}

</script>

<style rel="stylesheet/scss" lang="scss" scoped> 
.min-height{
  min-height:300px; 
  }

  
  .set-btn {
	z-index: 1000;
    display: none;
  } 
 
  .form-field:hover  {  
	border: 1px dashed #0000ff; /* 蓝色虚线边框 */ 
	.set-btn{ 
		z-index: 1000;
		display: inline-block; 
	} 
  }  
  .select  {  
	border: 1px dashed #0000ff; /* 蓝色虚线边框 */  
  }  
</style>