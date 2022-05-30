<template>
	<section class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
			<!--新增界面 Item 数据项定义--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
				<el-row> 
					<el-col :span="12" v-if="!simple">
				<el-form-item label="字典代码" prop="itemCode" :rules="[{required:true,message:'请输入字典代码'}]">
					<el-input readonly v-model="editForm.itemCode" placeholder="小写,下横线分割" ></el-input>
					<font color="blue">小写,下横线分割，例子: user_address</font>
				</el-form-item> 
				</el-col>
					<el-col :span="12">
				<el-form-item label="字典名称" prop="itemName" :rules="[{required:true,message:'请输入字典名称'}]">
					<el-input v-if="!simple" v-model="editForm.itemName" placeholder="名称" ></el-input>
					<div>{{editForm.itemName}}</div> 
				</el-form-item>  
				</el-col>
				</el-row>
				<el-row v-if="!simple"> 
					<el-col :span="12">
				<el-form-item label="分类" prop="categoryId" :rules="[{required:true,message:'请选择分类'}]">  
					<el-select :disabled="!!item.categoryId" v-model="editForm.categoryId" placeholder="请选择分类">
						<el-option
						v-for="item in categorys"
						:key="item.id"
						:label="item.categoryName"
						:value="item.id">
						</el-option>
					</el-select>  
				</el-form-item> 
					</el-col>
					<el-col :span="12">
				<el-form-item label="输入类型" prop="itemType" :rules="[{required:true,message:'请选择类型'}]"> 
					  <el-select v-model="editForm.itemType" placeholder="请选择">
						<el-option
						v-for="item in itemTypeList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item> 
				</el-col>
				</el-row>
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
				<el-form-item v-if="editForm.itemType=='2'" label="默认值" prop="dvalues">
					<el-input type="number"   v-model="editForm.dvalues"  placeholder="请输入默认值" ></el-input>  
				</el-form-item>  
				<el-form-item v-else-if="editForm.itemType=='3'" label="默认日期" prop="dvalues">
					<el-date-picker type="date"   v-model="editForm.dvalues"  placeholder="请输入默认日期值" ></el-date-picker>  
				</el-form-item>  
				<el-form-item v-else-if="editForm.itemType=='4'" label="默认值" prop="dvalues">
					<el-select v-model="editForm.dvalues" placeholder="请选择">
						<el-option
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item> 
				<el-form-item v-else-if="editForm.itemType=='5'" label="默认选项" prop="dvalues">
					<el-select v-model="multipleDvalues" placeholder="请选择默认选项" multiple>
						<el-option
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>    
				<el-form-item v-else-if="editForm.itemType=='6'" label="默认文件链接" prop="dvalues"> 
					<el-input v-model="editForm.dvalues" style="width:40%;" placeholder="文件链接地址" ></el-input> 
					<el-input v-model="editForm.dnames"  style="width:40%;" placeholder="文件名称或描述" ></el-input> 
				</el-form-item>  
				<el-form-item v-else-if="editForm.itemType=='7'" label="默认文件列表" prop="dvalues">
					<el-select v-model="multipleDvalues" placeholder="请选择" multiple>
						<el-option
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>   
				<el-form-item v-else-if="editForm.itemType=='8'" label="文本内容" prop="dvalues">
					<el-input type="textarea" rows=8 v-model="editForm.dvalues"  placeholder="文本内容" ></el-input>  
				</el-form-item>  
				<el-form-item v-else-if="editForm.itemType=='9'" label="默认图片链接" prop="dvalues">
					<el-input v-model="editForm.dvalues" style="width:40%;" placeholder="图片链接地址" ></el-input> 
					<el-input v-model="editForm.dnames"  style="width:40%;" placeholder="图片名称或描述" ></el-input> 
				</el-form-item>   
				<el-form-item v-else-if="editForm.itemType=='10'" label="默认图片" prop="dvalues">
					<el-select v-model="multipleDvalues" placeholder="请选择" multiple>
						<el-option
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>   
				
				<el-form-item v-else-if="editForm.itemType=='12'" label="默认视频" prop="dvalues">
					<el-select v-model="multipleDvalues" placeholder="请选择默认视频" multiple>
						<el-option
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>   
				<el-form-item v-else-if="editForm.itemType=='13'" label="默认选中" prop="dvalues">
					<el-radio-group v-model="multipleDvalues" placeholder="默认选中" multiple>
						<el-radio
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-radio>
					</el-radio-group>
				</el-form-item> 
				
				<el-form-item v-else-if="editForm.itemType=='14'" label="默认选中" prop="dvalues">
					<el-checkbox-group v-model="multipleDvalues" placeholder="默认选中">
						<el-checkbox
						v-for="(op,opidx) in optionList"
						:key="opidx"
						:label="op.id">
						{{op.name}}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item> 
				<el-form-item v-else label="值" prop="dvalues">
					<el-input v-model="editForm.dvalues" style="width:40%;" placeholder="值" ></el-input> 
					<el-input v-model="editForm.dnames"  style="width:40%;" placeholder="值名称" ></el-input> 
				</el-form-item>  
				 
				<el-form-item label="备注" prop="remark" v-if="!simple">
					<el-input v-model="editForm.remark" placeholder="备注" ></el-input>
				</el-form-item>  
				<el-form-item v-else label="备注" prop="remark">
					<font>{{editForm.remark}}</font>
				</el-form-item>
				<el-form-item label="" prop="required" v-if="!simple">
					排序:&nbsp;&nbsp;<el-input type="number" style="width:10%;" v-model="editForm.seq" :min="0" :max="999"></el-input>
					 &nbsp;&nbsp;<el-checkbox v-model="editForm.required" true-label="1" false-label="0">必输项</el-checkbox> 
					 &nbsp;&nbsp;<el-checkbox v-model="editForm.isShow" true-label="1" false-label="0">显示</el-checkbox>  
					&nbsp;&nbsp;长度： <el-input type="number" style="width:10%;" v-model="editForm.itemSize" :min="0" :max="200"></el-input>
					&nbsp;&nbsp;输入提示：<el-input style="width:30%;" v-model="editForm.inputFormat" placeholder="输入提示" ></el-input>
				</el-form-item>   
			</el-form>
		</el-row>
		<el-row  class="page-bottom bottom-fixed">
            <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button> 
            <el-button v-if="!simple" v-loading="load.edit" type="primary" @click.native="categorySelectVisible=true" :disabled="load.edit==true">复制到新的分类下</el-button>
			<el-button v-if="!simple" v-loading="load.edit" type="primary" @click.native="metaPushTargetAppsVisible=true" :disabled="load.edit==true">发布</el-button>

	    </el-row>

		<el-dialog  append-to-body 
			title="请选中目标分类"
			:visible.sync="categorySelectVisible"
			width="30%" >
			<el-select v-model="checkCategoryId" placeholder="请选择分类">
				<el-option
				v-for="item in categorys"
				:key="item.id"
				:label="item.categoryName"
				:value="item.id">
				</el-option>
			</el-select>  
			<span slot="footer" class="dialog-footer">
				<el-button @click="categorySelectVisible = false">取 消</el-button>
				<el-button type="primary" @click="doCopyToNewCategory">确 定</el-button>
			</span>
		</el-dialog>
		

		<el-dialog  append-to-body 
			title="请选中目标应用"
			:visible.sync="metaPushTargetAppsVisible"
			width="30%" >
			<el-select v-model="checkMetaPushTargetApps" placeholder="请选择目标应用" multiple>
				<el-option
				v-for="item in dicts['meta_push_target']"
				:key="item.id"
				:label="item.name"
				:value="item.id">
				</el-option>
			</el-select>  
			<span slot="footer" class="dialog-footer">
				<el-button @click="metaPushTargetAppsVisible = false">取 消</el-button>
				<el-button type="primary" @click="doPushToTargetApps">确 定</el-button>
			</span>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//下拉框数据查询 
	import { editItem,copyToNewCategory } from '@/api/mdp/meta/item';
	import { listPushLink,pushToTargetApps } from '@/api/mdp/meta/pushLink';
	import { mapGetters } from 'vuex'
	import { listCategory } from '@/api/mdp/meta/category';
	
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['item','visible','simple'],
		watch: {
	      'item':function( item ) {
	        this.editForm = item;
			this.optionNames=""
			this.initOptionNamesByeditForm()
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      },
		  metaPushTargetAppsVisible(val){
			  if(val==true){
				  listPushLink({itemId:this.editForm.id}).then(res=>{
					  this.checkMetaPushTargetApps=res.data.data.map(k=>k.targetId)
				  })
			  }
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
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
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
				categorySelectVisible:false,
				checkCategoryId:'',
				metaPushTargetAppsVisible:false,
				checkMetaPushTargetApps:[],
				metaPushTargetApps:[],
				
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
							editItem(params).then((res) => {
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
			},
			doCopyToNewCategory(){
				if(!this.checkCategoryId){
					this.$notify({ message: "请选中目标分类", type: 'error' });
					return;
				}
				var params={
					id:this.editForm.id,
					categoryId:this.checkCategoryId
				}
				this.load.edit=true
				copyToNewCategory(params).then(res=>{
					this.categorySelectVisible=false;
					this.load.edit=false;
					var tips = res.data.tips;
					this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch(e=>this.load.edit=false)
				
			},
			doPushToTargetApps(){
				
				var params={
					itemId:this.editForm.id,
					targetIds:this.checkMetaPushTargetApps
				}
				this.load.edit=true
				pushToTargetApps(params).then(res=>{
					this.metaPushTargetAppsVisible=false;
					this.load.edit=false;
					var tips = res.data.tips;
					this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch(e=>this.load.edit=false)
				
			}, 
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'item-edit':ItemEdit
		},
		mounted() { 
			initSimpleDicts('all',['meta_push_target']).then(res=>this.dicts=res.data.data);
			this.getCategorys();
			this.editForm=Object.assign(this.editForm, this.item);  
			this.optionNames="" 
			this.initOptionNamesByeditForm()
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>