<template>
	<section class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
			<!--新增界面 Item 数据项定义--> 
			<el-form v-if="!unMain" :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
				 
				<el-form-item v-if="editForm.itemType=='4'||editForm.itemType=='5'" label="选项列表" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="选项列表" ></el-input>
					<font color="blue">请输入列表，一行代表一个,如要指定编号,请用|线分割，比如 <br>
						1|男<br>
						2|女<br> 
					</font>
				</el-form-item>  
				<el-form-item v-else-if="editForm.itemType=='7'" label="文件列表" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="文件列表" ></el-input>
					<font color="blue">请输入文件列表，一行代表一个,比如 <br>
						文件链接地址1|文件描述或者名称1<br>
						文件链接地址2|文件描述或者名称2<br> 
					</font>
				</el-form-item> 
				  
				<el-form-item v-else-if="editForm.itemType=='10'" label="图文列表" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="文件列表" ></el-input>
					<font color="blue">请输入图文列表，一行代表一个,比如 <br>
						图片地址1|图片描述1<br>
						图片地址2|图片描述2<br>
					</font>
				</el-form-item> 
				<el-form-item v-else-if="editForm.itemType=='12'" label="视频列表" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="文件列表" ></el-input>
					<font color="blue">请输入视频列表，一行代表一个,比如 <br>
						视频地址1|视频描述1<br>
						视频地址2|视频描述2<br>
					</font>
				</el-form-item> 
				
				<el-form-item v-else-if="editForm.itemType=='13'" label="单选框" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="选项列表" ></el-input>
					<font color="blue">请输入选项列表，一行代表一个,比如 <br>
						值1|描述1<br>
						值2|描述2<br>
					</font>
				</el-form-item> 
				
				<el-form-item v-else-if="editForm.itemType=='14'" label="多选框" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="选项列表" ></el-input>
					<font color="blue">请输入选项列表，一行代表一个,比如 <br>
						值1|描述1<br>
						值2|描述2<br>
					</font>
				</el-form-item>

			</el-form>
			<ext-infos v-if="!unExtInfos" :un-config="unConfig" v-model="editForm.extInfos"></ext-infos>
		</el-row>
		<el-row  class="page-bottom">
             <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
	    </el-row> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//下拉框数据查询 
	import { listItem,editItem,insertOrUpdateItem } from '@/api/mdp/meta/item'; 
	import { mapGetters } from 'vuex'
	import { listCategory } from '@/api/mdp/meta/category';
	import ExtInfos from '@/components/ExtInfos/Index.vue'
	
	export default { 
		props:['item','unMain','unExtInfos','unConfig'],
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		}, 
		watch: { 
			item(val){
				this.editForm=val;
				this.initOptionNamesByeditForm()
			},
		  optionNames(val){
			  if(!this.optionNames){
				  this.optionList=[]
				  this.editForm.optionList=""
				  return;
			  }
			  var optionsJsonObj=this.optionNames.split("\n").map(i=>{
				  var id="";
				  var name="";
				  if(i.indexOf("|")>0){
					  var is=i.split("|")
					  id=is[0]
					  name=is[1]
					  return {id:id,name:name}
				  }else{
					  var obj=this.optionList.find(obj=>obj.name==i)
						if(obj){
							return obj;
						}else{
							return {id:'',name:i}
						}
				  }
					
				})
				optionsJsonObj.forEach((i,index)=>{
					if(!i.id){
						var id=1;
							while(optionsJsonObj.some(k=>k.id==id+"")){
							id=id+1;
							}
							i.id=id+""
					}
				})
				this.optionList=optionsJsonObj;
				this.editForm.optionList=JSON.stringify(optionsJsonObj);
		  }
	    },
		data() {
			return {
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{meta_push_target:{}},//meta_push_target
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				categorys:[],
				//新增界面数据 数据项定义
				editForm: {
					id:'',itemCode:'',itemName:'',remark:'',categoryId:'',itemSize:'50',itemType:'',branchId:'',deptid:'',cmenu:'',dvalues:'',dnames:'',options:'',inputFormat:'',required:'',seq:'999',table:'',isShow:'',qx:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				//1-普通文本，2-数字，3-日期，4-单选列表，5-多选列表，6-文件，7-图片，8-富文本
				
				itemTypeList:[
					{id:"1",name:"普通文本"},
					{id:"2",name:"数字"},
					{id:"3",name:"日期"},
					{id:"4",name:"单选列表"},
					{id:"5",name:"多选列表"},
					{id:"6",name:"单文件"},
					{id:"7",name:"多文件夹"},
					{id:"8",name:"富文本"},
					{id:"9",name:"单图文"},
					{id:"10",name:"多图文"},
					{id:"11",name:"单视频"},
					{id:"12",name:"多视频"},
					{id:"13",name:"单选radio"},
					{id:"14",name:"多选checkbox"}
				],
				optionList:[],
				optionNames:"",
				multipleDvalues:[],//多选时的数据存储
				multipleItemTypeIds:['5','7','10','12','14'], 
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交Item 数据项定义 父组件监听@submit="aftereditSubmit"
			editSubmit: function () {
				
				this.$refs.editForm.validate((valid) => {
					if (valid) { 
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);  
							if(this.multipleItemTypeIds.some(i=>i==params.itemType)){
								if(this.multipleDvalues!=null && this.multipleDvalues.length>0){
									params.dvalues=this.multipleDvalues.join(",")
								}else{
									params.dvalues=""
								}
							}
							insertOrUpdateItem(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="aftereditSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			getCategorys() {
				let params = {
				 
				}; 
				this.load.list = true;
				listCategory(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){  
						this.categorys = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false; 
				});
			},	
			
			initOptionNamesByeditForm(){
				if(this.editForm.optionList){
					this.optionList=JSON.parse(this.editForm.optionList)
				}
				this.optionNames=this.optionList.map(i=>i.id+"|"+i.name).join("\n")
				if(this.multipleItemTypeIds.some(i=>i==this.editForm.itemType)){
					if(this.editForm.dvalues){
						this.multipleDvalues=this.editForm.dvalues.split(",")
					}else{
						this.multipleDvalues=[];
					}
					
				}
			} 
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			ExtInfos
		    //在下面添加其它组件 'item-edit':ItemEdit
		},
		mounted() {   
			 this.editForm=this.item
			 this.initOptionNamesByeditForm()
			
		}//end mounted
	}

</script>

<style scoped>

</style>