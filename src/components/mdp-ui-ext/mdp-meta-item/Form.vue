<template>
	<section class="padding">
 			<!--新增界面 Item 数据项定义--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm" > 
				<el-row> 
					<el-col :span="12">
						<el-form-item label="字典代码" prop="itemCode" :rules="[{required:true,message:'请输入字典代码'}]">
							<el-input v-model="editForm.itemCode" placeholder="小写,下横线分割" :disabled="disabledJudge('itemCode')"></el-input>
							<font color="blue">小写,下横线分割，例子: user_address</font>
						</el-form-item> 
					</el-col>
					<el-col :span="12">
				<el-form-item label="字典名称" prop="itemName" :rules="[{required:true,message:'请输入字典名称'}]">
					<el-input v-model="editForm.itemName" placeholder="名称" :disabled="disabledJudge('itemName')"></el-input>
				</el-form-item>  
				</el-col>
				</el-row>
				<el-row> 
					<el-col :span="12">
				<el-form-item label="分类" prop="categoryId" :rules="[{required:true,message:'请选择分类'}]">  
					<mdp-select width="100%" v-model="editForm.categoryId" item-code="categoryId" :disabled="disabledJudge('categoryId')||!!formData.categoryId"/> 
				</el-form-item> 
					</el-col>
					<el-col :span="12">
				<el-form-item label="输入类型" prop="itemType" :rules="[{required:true,message:'请选择类型'}]"> 
					   <mdp-select width="100%" v-model="editForm.itemType" item-code="item_type" :filter-fun="itemTypeFilterFun"></mdp-select>
				</el-form-item> 
				</el-col>
				</el-row>  
				<el-form-item v-if="editForm.itemType=='2'" label="默认值" prop="dvalues">
					<el-input type="number"   v-model="editForm.dvalues"  placeholder="请输入默认值" :disabled="disabledJudge('dvalues')"></el-input>  
				</el-form-item>  
				<el-form-item v-else-if="editForm.itemType=='3'" label="默认日期" prop="dvalues">
					<el-date-picker type="date" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"  v-model="editForm.dvalues"  placeholder="请输入默认日期值" :disabled="disabledJudge('dvalues')"></el-date-picker>  
				</el-form-item>  
				<el-form-item v-else-if="editForm.itemType=='4'" label="默认值" prop="dvalues">
					<mdp-select v-model="editForm.dvalues" :item-code="editForm.itemCode" placeholder="请选择" :disabled="disabledJudge('dvalues')"> 
					</mdp-select>
				</el-form-item> 
				<el-form-item v-else-if="editForm.itemType=='5'" label="默认选项" prop="dvalues">
					<mdp-select v-model="editForm.dvalues" :item-code="editForm.itemCode" placeholder="请选择" :disabled="disabledJudge('dvalues')"> 
					</mdp-select>
				</el-form-item>    
				<el-form-item v-else-if="editForm.itemType=='6'" label="默认文件链接" prop="dvalues"> 
					<el-input v-model="editForm.dvalues" style="width:40%;" placeholder="文件链接地址" :disabled="disabledJudge('dvalues')"></el-input> 
					<el-input v-model="editForm.dnames"  style="width:40%;" placeholder="文件名称或描述" :disabled="disabledJudge('dvalues')"></el-input> 
				</el-form-item>  
				<el-form-item v-else-if="editForm.itemType=='7'" label="默认文件列表" prop="dvalues"> 
					<mdp-select v-model="editForm.dvalues" :item-code="editForm.itemCode" placeholder="请选择" :disabled="disabledJudge('dvalues')"> 
					</mdp-select>
				</el-form-item>   
				<el-form-item v-else-if="editForm.itemType=='8'" label="文本内容" prop="dvalues">
					<el-input type="textarea" rows=8 v-model="editForm.dvalues"  placeholder="文本内容" :disabled="disabledJudge('dvalues')"></el-input>  
				</el-form-item>  
				<el-form-item v-else-if="editForm.itemType=='9'" label="默认图片链接" prop="dvalues">
					<el-input v-model="editForm.dvalues" style="width:40%;" placeholder="图片链接地址" :disabled="disabledJudge('dvalues')"></el-input> 
					<el-input v-model="editForm.dnames"  style="width:40%;" placeholder="图片名称或描述" :disabled="disabledJudge('dvalues')"></el-input> 
				</el-form-item>   
				<el-form-item v-else-if="editForm.itemType=='10'" label="默认图片" prop="dvalues">
					<mdp-select v-model="editForm.dvalues" :item-code="editForm.itemCode" placeholder="请选择" :disabled="disabledJudge('dvalues')"> 
					</mdp-select>
				</el-form-item>   
				
				<el-form-item v-else-if="editForm.itemType=='12'" label="默认视频" prop="dvalues">
					<mdp-select v-model="editForm.dvalues" :item-code="editForm.itemCode" placeholder="请选择" :disabled="disabledJudge('dvalues')"> 
					</mdp-select>
				</el-form-item>   
				<el-form-item v-else-if="editForm.itemType=='13'" label="默认选中" prop="dvalues">
					<el-radio-group v-model="multipleDvalues" placeholder="默认选中" multiple :disabled="disabledJudge('required')">
						<el-radio
						v-for="item in optionList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-radio>
					</el-radio-group>
				</el-form-item> 
				
				<el-form-item v-else-if="editForm.itemType=='14'" label="默认选中" prop="dvalues">
					<el-checkbox-group v-model="multipleDvalues" placeholder="默认选中" :disabled="disabledJudge('required')">
						<el-checkbox
						v-for="(op,opidx) in optionList"
						:key="opidx"
						:label="op.id">
						{{op.name}}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item> 
				<template  v-else>
					<el-row> 
						<el-col :span="12">
							<el-form-item  label="值" prop="dvalues">
								<el-input v-model="editForm.dvalues"  placeholder="值" :disabled="disabledJudge('required')"></el-input> 
							</el-form-item>  
						</el-col>
						<el-col :span="12">
							<el-form-item  label="值名称" prop="dnames">
								<el-input v-model="editForm.dnames"   placeholder="值名称" :disabled="disabledJudge('required')"></el-input> 
							</el-form-item>  
						</el-col>
					</el-row> 
				</template>
 
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="editForm.remark" placeholder="备注" :disabled="disabledJudge('remark')"></el-input>
				</el-form-item>  
				<el-form-item label="" prop="required">
					排序:&nbsp;&nbsp;<el-input type="number" style="width:10%;" v-model="editForm.seq" :min="0" :max="999" :disabled="disabledJudge('required')"></el-input>
					 &nbsp;&nbsp;<el-checkbox v-model="editForm.required" true-label="1" false-label="0" :disabled="disabledJudge('required')">必输项</el-checkbox> 
					 &nbsp;&nbsp;<el-checkbox v-model="editForm.isShow" true-label="1" false-label="0" :disabled="disabledJudge('required')">显示</el-checkbox>  
					&nbsp;&nbsp;长度： <el-input type="number" style="width:10%;" v-model="editForm.itemSize" :min="0" :max="200" :disabled="disabledJudge('required')"></el-input>
					&nbsp;&nbsp;输入提示：<el-input style="width:40%;" v-model="editForm.inputFormat" placeholder="输入提示" :disabled="disabledJudge('required')"></el-input>
				</el-form-item>   
				
				<el-form-item label="扩展字段" prop="extInfos">
					<ext-infos  :un-config="false" v-model="editForm.extInfos" :disabled="disabledJudge('addBtn')"></ext-infos>
				</el-form-item>  
				
			</el-form> 
			<el-row v-if="showBtn!==false" class="footer">
				<el-button @click.native="handleCancel">取消</el-button>
				<el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn')">提交</el-button>   
			</el-row>  
	</section>
</template>

<script>
 	import { mapGetters } from 'vuex'
 	import ExtInfos from '../mdp-ext-infos/Index.vue'
	
	import { MdpFormMixin } from '../../mdp-ui/mixin/MdpFormMixin.js';
	
	export default { 
		mixins:[MdpFormMixin],
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		watch: {
			"editForm.itemCode":function(itemCode){
				if(this.listItemTypeIds.some(k=>k==this.editForm.itemType)){
					this.initOptions(itemCode)
				} 
			}
	    },
		data() {
			return {
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
 				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 数据项定义
				editForm: {
					id:'',itemCode:'',itemName:'',remark:'',categoryId:'',itemSize:'50',itemType:'',branchId:'',deptid:'',cmenu:'',dvalues:'',dnames:'',options:'',inputFormat:'',required:'',seq:'999',table:'',isShow:'',qx:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				//1-普通文本，2-数字，3-日期，4-单选列表，5-多选列表，6-文件，7-图片，8-富文本
				 
				multipleDvalues:[],//多选时的数据存储
				multipleItemTypeIds:['5','7','10','12','14'], 
				listItemTypeIds:['4','5','7','10','12','13','14'],
				apis:{ 
					queryById: this.$mdp.queryItemById,
					add: this.$mdp.addItem,
					edit: this.$mdp.editItem,
					editSomeFields: this.$mdp.editSomeFieldsItem
				},
				options:[],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {  
			initOptions(itemCode){
				this.$mdp.ajaxGetDictOptions(itemCode,{}).then(res=>{
					this.options=res.data.options
				})
			}, 
			/**
			 * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
			 * @param {*} row 当前选中的行
			 * @param {*} fieldName 修改的字段名
			 * @param {*} $event 修改后的值
			 * @param {*} params 将要提交服务器的参数
			 * @returns true/false 返回false ,将取消更新数据库
			 */
			editSomeFieldsCheck(row,fieldName,$event,params){
				if(this.currOpType=='detail'){
					return false;
				}
				params[fieldName]=$event
				return true;
			}, 
			itemTypeFilterFun(o){
				if(this.editForm.categoryId=='sysParams'){
					return !this.listItemTypeIds.some(k=>k==o.id)
				}else{
					return true;
				}
			}
		},//end method
		components: {  
		    //在下面添加其它组件 'item-edit':ItemEdit
			ExtInfos,
		},
		mounted() { 
			 
			
		}//end mounted
	}

</script>

<style scoped>

</style>