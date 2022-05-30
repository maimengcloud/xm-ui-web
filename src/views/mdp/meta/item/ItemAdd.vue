<template>
	<section class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
			<!--新增界面 Item 数据项定义--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm"> 
				<el-row> 
					<el-col :span="12" v-if="!simple">
				<el-form-item label="字典代码" prop="itemCode" :rules="[{required:true,message:'请输入字典代码'}]">
					<el-input v-model="addForm.itemCode" placeholder="小写,下横线分割" ></el-input>
					<font color="blue">小写,下横线分割，例子: user_address</font>
				</el-form-item> 
				</el-col>
					<el-col :span="12">
				<el-form-item label="字典名称" prop="itemName" :rules="[{required:true,message:'请输入字典名称'}]">
					<el-input v-if="!simple" v-model="addForm.itemName" placeholder="名称" ></el-input>
					<div>{{addForm.itemName}}</div> 
				</el-form-item>  
				</el-col>
				</el-row>
				<el-row v-if="!simple"> 
					<el-col :span="12">
				<el-form-item label="分类" prop="categoryId" :rules="[{required:true,message:'请选择分类'}]">  
					<el-select   v-model="addForm.categoryId" placeholder="请选择分类">
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
				<el-form-item label="类型" prop="itemType" :rules="[{required:true,message:'请选择类型'}]"> 
					  <el-select v-model="addForm.itemType" placeholder="请选择">
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
				<el-form-item v-if="addForm.itemType=='4'||addForm.itemType=='5'" label="选项列表" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="选项列表" ></el-input>
					<font color="blue">请输入列表，一行代表一个,如要指定编号,请用|线分割，比如 <br>
						1|男<br>
						2|女<br> 
					</font>
				</el-form-item>  
				<el-form-item v-else-if="addForm.itemType=='7'" label="文件列表" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="文件列表" ></el-input>
					<font color="blue">请输入文件列表，一行代表一个,比如 <br>
						文件链接地址1|文件描述或者名称1<br>
						文件链接地址2|文件描述或者名称2<br> 
					</font>
				</el-form-item> 
				  
				<el-form-item v-else-if="addForm.itemType=='10'" label="图文列表" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="文件列表" ></el-input>
					<font color="blue">请输入图文列表，一行代表一个,比如 <br>
						图片地址1|图片描述1<br>
						图片地址2|图片描述2<br>
					</font>
				</el-form-item> 
				<el-form-item v-else-if="addForm.itemType=='12'" label="视频列表" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="文件列表" ></el-input>
					<font color="blue">请输入视频列表，一行代表一个,比如 <br>
						视频地址1|视频描述1<br>
						视频地址2|视频描述2<br>
					</font>
				</el-form-item> 
				
				<el-form-item v-else-if="addForm.itemType=='13'" label="单选框" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="选项列表" ></el-input>
					<font color="blue">请输入选项列表，一行代表一个,比如 <br>
						值1|描述1<br>
						值2|描述2<br>
					</font>
				</el-form-item> 
				
				<el-form-item v-else-if="addForm.itemType=='14'" label="多选框" prop="optionList">
					<el-input type="textarea" rows=8 v-model="optionNames" placeholder="选项列表" ></el-input>
					<font color="blue">请输入选项列表，一行代表一个,比如 <br>
						值1|描述1<br>
						值2|描述2<br>
					</font>
				</el-form-item>  
				<el-form-item v-if="addForm.itemType=='2'" label="默认值" prop="dvalues">
					<el-input type="number"   v-model="addForm.dvalues"  placeholder="请输入默认值" ></el-input>  
				</el-form-item>  
				<el-form-item v-else-if="addForm.itemType=='3'" label="默认日期" prop="dvalues">
					<el-date-picker type="date"   v-model="addForm.dvalues"  placeholder="请输入默认日期值" ></el-date-picker>  
				</el-form-item>  
				<el-form-item v-else-if="addForm.itemType=='4'" label="默认值" prop="dvalues">
					<el-select v-model="addForm.dvalues" placeholder="请选择">
						<el-option
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item> 
				<el-form-item v-else-if="addForm.itemType=='5'" label="默认选项" prop="dvalues">
					<el-select v-model="multipleDvalues" placeholder="请选择默认选项" multiple>
						<el-option
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>    
				<el-form-item v-else-if="addForm.itemType=='6'" label="默认文件链接" prop="dvalues"> 
					<el-input v-model="addForm.dvalues" style="width:40%;" placeholder="文件链接地址" ></el-input> 
					<el-input v-model="addForm.dnames"  style="width:40%;" placeholder="文件名称或描述" ></el-input> 
				</el-form-item>  
				<el-form-item v-else-if="addForm.itemType=='7'" label="默认文件列表" prop="dvalues">
					<el-select v-model="multipleDvalues" placeholder="请选择" multiple>
						<el-option
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>   
				<el-form-item v-else-if="addForm.itemType=='8'" label="文本内容" prop="dvalues">
					<el-input type="textarea" rows=8 v-model="addForm.dvalues"  placeholder="文本内容" ></el-input>  
				</el-form-item>  
				<el-form-item v-else-if="addForm.itemType=='9'" label="默认图片链接" prop="dvalues">
					<el-input v-model="addForm.dvalues" style="width:40%;" placeholder="图片链接地址" ></el-input> 
					<el-input v-model="addForm.dnames"  style="width:40%;" placeholder="图片名称或描述" ></el-input> 
				</el-form-item>   
				<el-form-item v-else-if="addForm.itemType=='10'" label="默认图片" prop="dvalues">
					<el-select v-model="multipleDvalues" placeholder="请选择" multiple>
						<el-option
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>   
				
				<el-form-item v-else-if="addForm.itemType=='12'" label="默认视频" prop="dvalues">
					<el-select v-model="multipleDvalues" placeholder="请选择默认视频" multiple>
						<el-option
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>   
				<el-form-item v-else-if="addForm.itemType=='13'" label="默认选中" prop="dvalues">
					<el-radio-group v-model="multipleDvalues" placeholder="默认选中" multiple>
						<el-radio
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-radio>
					</el-radio-group>
				</el-form-item> 
				
				<el-form-item v-else-if="addForm.itemType=='14'" label="默认选中" prop="dvalues">
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
					<el-input v-model="addForm.dvalues" style="width:40%;" placeholder="值" ></el-input> 
					<el-input v-model="addForm.dnames"  style="width:40%;" placeholder="值名称" ></el-input> 
				</el-form-item>  
				 
				<el-form-item label="备注" prop="remark" v-if="!simple">
					<el-input v-model="addForm.remark" placeholder="备注" ></el-input>
				</el-form-item>  
				<el-form-item v-else label="备注" prop="remark">
					<font>{{addForm.remark}}</font>
				</el-form-item>
				<el-form-item label="" prop="required" v-if="!simple">
					排序:&nbsp;&nbsp;<el-input type="number" style="width:10%;" v-model="addForm.seq" :min="0" :max="999"></el-input>
					 &nbsp;&nbsp;<el-checkbox v-model="addForm.required" true-label="1" false-label="0">必输项</el-checkbox> 
					 &nbsp;&nbsp;<el-checkbox v-model="addForm.isShow" true-label="1" false-label="0">显示</el-checkbox>  
					&nbsp;&nbsp;长度： <el-input type="number" style="width:10%;" v-model="addForm.itemSize" :min="0" :max="200"></el-input>
					&nbsp;&nbsp;输入提示：<el-input style="width:30%;" v-model="addForm.inputFormat" placeholder="输入提示" ></el-input>
				</el-form-item>   
			</el-form>
		</el-row>
		<el-row  class="page-bottom bottom-fixed">
            <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { getDicts } from '@/api/mdp/meta/item';//下拉框数据查询 
	import { addItem } from '@/api/mdp/meta/item';
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
	        this.addForm = item;
			this.optionNames=""
			this.initOptionNamesByaddForm()
	      },
	      'visible':function(visible) { 
	      	if(visible==true){ 
				this.addForm = this.item;
				this.optionNames=""
				this.initOptionNamesByaddForm()
	      	}
	      },
		  optionNames(val){
			  if(!this.optionNames){
				  this.optionList=[]
				  this.addForm.optionList=""
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
				this.addForm.optionList=JSON.stringify(optionsJsonObj);
		  }
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				categorys:[],
				//新增界面数据 数据项定义
				addForm: {
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
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交Item 数据项定义 父组件监听@submit="afteraddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) { 
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm);  
							if(this.multipleItemTypeIds.some(i=>i==params.itemType)){
								if(this.multipleDvalues!=null && this.multipleDvalues.length>0){
									params.dvalues=this.multipleDvalues.join(",")
								}else{
									params.dvalues=""
								}
							}
							addItem(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afteraddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
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
			
			initOptionNamesByaddForm(){
				if(this.addForm.optionList){
					this.optionList=JSON.parse(this.addForm.optionList)
				}
				this.optionNames=this.optionList.map(i=>i.id+"|"+i.name).join("\n")
				if(this.multipleItemTypeIds.some(i=>i==this.addForm.itemType)){
					if(this.addForm.dvalues){
						this.multipleDvalues=this.addForm.dvalues.split(",")
					}else{
						this.multipleDvalues=[];
					}
					
				}
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'item-add':Itemadd
		},
		mounted() {
			this.getCategorys();
			this.addForm=Object.assign(this.addForm, this.item);  
			this.optionNames="" 
			this.initOptionNamesByaddForm()
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>