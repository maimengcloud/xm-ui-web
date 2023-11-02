<template>
	<section v-adaptive>
 
				  <el-form v-model="field" :rules="fieldRules" ref="field" label-width="80px">
				  	 <el-form-item v-if="(field.typ=='select' || (field.typ=='checkbox') || (field.typ=='radio')) && !field.extType" label="数据" prop="isDict">
 				  			<el-input  v-model="field.dict"  @focus="$refs['itemDialog'].open(field)" placeholder="点击关联基础数据">
								<template slot="append"> 
									<el-button  type="primary" icon="el-icon-delete" @click="deleteBaseData"></el-button>
										</template> 
								
							</el-input>
 				  	</el-form-item>
				  	<el-form-item label="名称" prop="title">
 				  			<el-input  v-model="field.title" label="属性名称" auto-complete="off"  placeholder="请输入内容"   > </el-input>
 				  	</el-form-item> 
				  	<el-form-item label="编码" prop="id" >
						<el-popover  
								placement="top-start"
								width="400"
								:open-delay="700"
								trigger="hover">
									<div>
										编码规则： 举例 客户姓名 cust_name <br>
									</div> 
									<el-input slot="reference" v-model="field.id" auto-complete="off"  placeholder="请输入内容"  @change="onIdChange" @click.native="oldId=field.id"> 
										<template slot="append"> 
												<el-button class="el-icon-question"></el-button>  
										</template> 
									</el-input>
							
							</el-popover> 
 				  	</el-form-item>  
					<el-form-item>
 							<el-checkbox v-model="field.bkey" true-label="1" false-label="0" @change="onBkeyChange">主键</el-checkbox>   
  							<el-checkbox v-model="field.req" :disabled="field.bkey=='1'" true-label="1" false-label="0">必输</el-checkbox>  
 						 
								<el-checkbox  v-model="field.mul" :disabled=" field.typ!='checkbox' && field.typ!='select' && field.extType!='dept'" true-label="1" false-label="0">多选</el-checkbox>  
 						
 								<el-checkbox  v-model="field.ronly" true-label="1" false-label="0">只读</el-checkbox>  
								<el-checkbox  v-model="field.hidden" true-label="1" false-label="0">隐藏</el-checkbox>  

 					</el-form-item>
				  	
				  	<el-form-item label="长度" prop="len">
 								<el-input   v-model="field.len" auto-complete="off"  placeholder="请输入内容"   > </el-input>
 					</el-form-item>
				  	<el-form-item label="栅格宽度" prop="span" v-if="parentField && (parentField.extType=='row' || parentField.extType=='tabs')">
 				  			<el-input type="number" :max="24"  v-model="field.span" auto-complete="off"  placeholder="上级是row的情况下设定span"   > </el-input>
 				  	</el-form-item>
					
				  	<el-form-item label="tab列表" prop="gname" v-if="field.extType=='tabs'" title="输入新的名字直接增加tab页,删除名字直接删除tab页">
 				  			<el-input v-model="field.gname" auto-complete="off"  placeholder="tab名称,逗号分割多个"> </el-input> 
 				  	</el-form-item> 
				  	<el-form-item label="归属tab" prop="gname" v-else-if="parentField && parentField.extType=='tabs' && parentField.gname">
 				  			<mdp-select v-model="field.gname" auto-complete="off"  placeholder="归属tab" :plus-options="parentField.gname.split(',').map(t=>{return {id:t,name:t}})"> </mdp-select>
 				  	</el-form-item>
				  	<el-form-item label="占位符" prop="hol">
 				  			<el-input   v-model="field.hol" auto-complete="off"  placeholder="请输入内容"   > </el-input>
 				  	</el-form-item>
					<el-form-item v-if="field.typ=='select' || (field.typ=='checkbox') || (field.typ=='radio')" label="默认值" prop="dval">
 							<mdp-select :item-code="field.dict" v-model="field.dval"  clearable placeholder="请选择"/> 
 				  	</el-form-item>
					<el-form-item v-else label="默认值" prop="dval">
 				  			<el-input   v-model="field.dval" auto-complete="off"  placeholder="请输入内容"   > </el-input>
 				  	</el-form-item>
				  	<el-form-item label="权限" prop="qx">
						<el-button @click="$refs['qxDialog'].open(field)">字段权限设置</el-button>
				  	</el-form-item> 
				  	<el-form-item label="css class" prop="clazz">
						<el-input   v-model="field.clazz" auto-complete="off"  placeholder="请输入内容css class名称,空格分割多个"   > </el-input> 
				  	</el-form-item>
				  	<el-form-item label="css style" prop="styleObj">
						<el-popover  
									placement="top-start"
									width="400"
									trigger="hover">
									<el-row>
										<el-input type="textarea" rows="10" v-model="field.styleObj" auto-complete="off"  placeholder='请输入json 对象 如 {"maxHeight":"100px","maxWidth":"100px"}'   > </el-input>
									</el-row>
									<el-row>注意：所有属性及值都要【""】，如下 {"maxHeight":"100px","maxWidth":"100px"}</el-row>
 									<el-button slot="reference">css 样式</el-button> 
								</el-popover>

				  	</el-form-item>
				  	<el-form-item label="展示风格" prop="showStyle">
				  		<el-row type="flex">
							<el-radio v-model="field.showStyle" label="origin">原生-origin</el-radio> 
							
							<el-radio v-model="field.showStyle" label="tag">标签-tag</el-radio> 
							
							<el-radio v-model="field.showStyle" label="x">综合-x</el-radio> 
				  		</el-row> 
				  	</el-form-item> 
				  	<el-form-item label="校验规则" prop="vrules"> 
							  <el-popover  
									placement="top-start"
									width="400"
									trigger="hover">
									<el-input type="textarea" rows="4" v-model="field.vrules" auto-complete="off"  placeholder='请输入json 对象 如 [{required:true,message:"此项必填",trigger:"change"}]'   > </el-input>

 									<el-button slot="reference">校验规则</el-button> 
								</el-popover> 
				  	</el-form-item>
 					<mdp-ext-infos label-width="80px" v-if="componentsExtInfosCfg[field.typ] && componentsExtInfosCfg[field.typ].length>0" v-model="extInfos" :cfg-disabled="true"></mdp-ext-infos> 

 
				  </el-form>
				  <el-row class="footer">
				    <el-button  type="text" @click="handleCancel">关闭</el-button>
				    <el-button type="primary"  @click="handleConfirm">确定</el-button>
				  </el-row>
				 
		<!--基础数据查询 CodeDetail sys_code_detail界面-->
		<mdp-dialog ref="itemDialog" title="选择数据组" width="80%" :modal="false">
			<template v-slot="{visible,data,dialog}">
				<mdp-meta-item  :visible="visible" sub-op-type="select" @select="(item)=>{ 
					data.dict=item.itemCode
					data.title=item.itemName
					dialog.close()
				}"></mdp-meta-item>
			</template> 
		</mdp-dialog>  
		<mdp-dialog ref="qxDialog" title="权限配置" width="80%" :modal="false">
			<template v-slot="{visible,data,dialog}">
				<field-qx-set :visible="visible" v-model="data.qx" :title="data.title" @close="dialog.close()" @submit="onQxSetChange"/> 
			</template> 
		</mdp-dialog>      
	</section>
</template>

<script> 
	 import FieldQxSet from './FieldQxSet.vue';

	 import { mapGetters } from 'vuex' 
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
			value:{
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
			parentField:{
				type:Object,
				default:function(){
					return {}
				}
			},
			
			hasChild:{
				type:Function,
				default:function(){
					return null;
				}
			},
		},
		watch: { 
	       value:{
				deep:true,
				handler:function(){ 
					this.field=this.value  
				}
		   },
		   "value.extInfos":function(v){
				this.setExtInfos();
		   }
	    },	
		data() {
			return {
				oldId:'',
				field:{},
				primaryKeys:[], 
				fieldRules: {
					id: [
						//{ required: false, message: '主键', trigger: 'blur' }
					]
				},
				componentsExtInfosCfg:{
					select:[
						{id:'plusOptions',value:'',name:'选项'}, 
					],
					date:[
						{id:'format',value:'yyyy-MM-dd',name:'显示格式'}, 
						{id:'valueFormat',value:'yyyy-MM-dd HH:mm:ss',name:'值格式'}, 
					],
					daterange:[
						{id:'format',value:'yyyy-MM-dd',name:'显示格式'}, 
						{id:'valueFormat',value:'yyyy-MM-dd HH:mm:ss',name:'值格式'}, 
						{id:'startKey',value:'startTime',name:'开始key'}, 
						{id:'endKey',value:'endTime',name:'结束key'},  
					],
					textarea:[
						{id:'rows',value:'4',name:'行数'},   
					],
					number:[
						{id:'min',value:'',name:'最小值'},  
						{id:'max',value:'',name:'最大值'},  
						{id:'step',value:'',name:'最大值'},  
						{id:'precision',value:'',name:'数值精度'},  
						{id:'controls',value:'1',name:'使用控制'},  
						{id:'controlsPosition',value:'right',name:'按钮位置	'},   
					],

				},
				extInfos:[],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="fieldVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
				this.$emit('close');
			},
		    handleConfirm(){
				this.field.extInfos=JSON.stringify(this.extInfos.filter(k=>!k.value))
				this.$emit('input',this.field)
				this.$emit('change',this.field)
				this.$emit('change2',this.field) 
			},
			deleteBaseData(){
				this.field.isDict='0';
				this.field.dict=''; 
			},  
			onQxSetChange(){
				this.handleConfirm()
				this.$refs['qxDialog'].close();
			},
			onBkeyChange(v){
				this.$emit('bkey-change',this.field)
			},
			onIdChange(v){ 
				
				if(!v||v.length==0){
					this.$notify.error('编码不能为空')
					return;
				}
				if(v.indexOf(".")>=0){
					if(v.indexOf('ext_infos.')!=0){
						this.$notify.error('编码格式错误，前缀只支持【空前缀、ext_infos.】两种')
						return;
					}
				}
				var id=v.toLocaleLowerCase();
				this.field.isNewAdd=true
				if(this.hasChild(id)){
					this.field.id=this.oldId
					this.$notify.error('编码【'+id+'】已存在，请换个编码')
						return;
				}
				this.field.isNewAdd=false
				this.field.id=id;
				this.field.idCamel=this.$mdp.toCamel(this.field.id)
				this.$emit('id-change',this.field)
			},
			setExtInfos(){  
				var cfgs=[]
				var x= this.componentsExtInfosCfg[this.field.typ]
 				var extInfos=this.field.extInfos?JSON.parse(this.field.extInfos):[]
				if(x && x.length>0){
					x.forEach(k=>{
						var cfg=extInfos.find(c=>c.id==k.id)
						if(cfg){
							cfgs.push(cfg)
						}else{
							cfgs.push({...k})
						}
					})
				}else{
					cfgs=extInfos
				}
				this.extInfos=cfgs
			}, 
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {   
			 FieldQxSet
		},
		mounted() {
			
			this.field=this.value 
			this.setExtInfos();
			 
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