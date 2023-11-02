<template>
	<section> 
		<el-row>
			<el-form>
				<el-form-item label="可读字段" prop="read"> 
					<mdp-select :multiple="true" v-model="myFormFieldsJson.read" :options="fields" :plusOptions="plusOptions" :props="{id:'fieldId',name:'fieldTitle'}" split=","></mdp-select>
				</el-form-item>
				<el-form-item label="可写字段" prop="edit">
					<mdp-select :multiple="true" v-model="myFormFieldsJson.edit" :options="fields" :plusOptions="plusOptions" :props="{id:'fieldId',name:'fieldTitle'}" split=","></mdp-select>
				</el-form-item>
				
				<el-form-item label="不可读字段" prop="unread">
					<mdp-select :multiple="true" v-model="myFormFieldsJson.unread" :options="fields" :plusOptions="plusOptions" :props="{id:'fieldId',name:'fieldTitle'}" split=","></mdp-select>
				</el-form-item>
				<el-form-item label="不可写字段" prop="unedit">
					<mdp-select :multiple="true" v-model="myFormFieldsJson.unedit" :options="fields" :plusOptions="plusOptions" :props="{id:'fieldId',name:'fieldTitle'}" split=","></mdp-select>
				</el-form-item>
			</el-form>
		</el-row> 
		<el-row class="footer">
			<el-button  @click="handleCancel">关闭</el-button>
			<el-button type="primary" @click="save">提交</el-button>
		</el-row>
	</section>
</template>

<script>
 	import { mapGetters } from 'vuex'
	
 	import { listFormField } from '@/api/mdp/lcode/formField';

	export default { 
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
		    ])
		},
		props:['formId','visible','formFieldsJson'],
		watch: {
	       
	      'visible':function(visible) { 
	      	if(visible==true){ 
				this.init();
				this.getFields()
	      	}
	      } 
	    },	
		data() {
			return { 
				addLoading: false,
				myFormFieldsJson:{
					read:'all',// all 、 字段列表逗号分割
					edit:'all', // all 、 字段列表逗号分割
					unedit:'', //禁止更新 all 、  字段列表逗号分割
					unread:'', // all 、 具体字段
				},
				plusOptions:[{id:'all',name:'全部'},{id:'',name:'不判断'}],
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				fields:[]//表单的所有属性
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			init(){
				;
				if(this.formFieldsJson){
					if( typeof this.formFieldsJson == "string"){
						this.myFormFieldsJson=JSON.parse(this.formFieldsJson)
					}else {
						this.myFormFieldsJson={...this.formFieldsJson}
					}
				}else{
					this.myFormFieldsJson={...this.myFormFieldsJsonInit}
				}
			},
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			}, 
			//新增提交FormDef 表单定义 父组件监听@submit="afterAddSubmit"
			save: function () {  
				this.$emit('submit',this.myFormFieldsJson);//  @submit="afterAddSubmit" 
						 
			},
			getFields(){
				if(!this.formId){
					this.formDef={}
					this.fields=[]
					return;
				}
				listFormField({formId:this.formId}).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){
						this.formDef=res.data.data.formDef
						this.fields=res.data.data.formFields
					}else{
						this.formDef={}
						this.fields=[]
					}
				})
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {    
		    
		},
		mounted() {
			this.myFormFieldsJsonInit={...this.myFormFieldsJson}
			this.getFields()
			this.init();
			
		}//end mounted
	}

</script>

<style scoped>

</style>