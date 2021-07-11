<template>
	<section>
		<el-row class="page-container border padding"> <el-form label-position="top" label-width="80px" :model="addForm" ref="addForm">
				<el-form-item label="正文"> 
					<el-checkbox v-model="qxCodeArr[0]" true-label="1" false-label="0">可看正文</el-checkbox>
					<el-checkbox v-if="qxCodeArr[0]=='1'" v-model="qxCodeArr[1]" true-label="1" false-label="0">可修改正文</el-checkbox> 
				</el-form-item>
				<el-form-item label="附件"> 
					<el-checkbox v-model="qxCodeArr[2]" true-label="1" false-label="0">可看附件</el-checkbox> 
					<el-checkbox v-model="qxCodeArr[3]" true-label="1" false-label="0">可上传附件 </el-checkbox>
					<el-checkbox v-if="qxCodeArr[2]=='1'" v-model="qxCodeArr[4]" true-label="1" false-label="0">可下载附件 </el-checkbox>
				</el-form-item>
				<el-form-item label="时间参数">
					
						<el-checkbox v-model="qxCodeArr[5]" true-label="1" false-label="0">可修改计划完成时间 </el-checkbox>
				</el-form-item>
				<el-form-item label="流程控制">
					
			
					<el-checkbox v-model="qxCodeArr[6]" true-label="1" false-label="0"> 可驳回</el-checkbox>
					
					<el-checkbox v-model="qxCodeArr[7]" true-label="1" false-label="0">可转主办 </el-checkbox>

					<el-checkbox v-model="qxCodeArr[8]" true-label="1" false-label="0">可转发起人 </el-checkbox>

					<el-checkbox v-model="qxCodeArr[9]" true-label="1" false-label="0">可找人代办 </el-checkbox>

					<el-checkbox v-model="qxCodeArr[10]" true-label="1" false-label="0">可委托办理 </el-checkbox> 

				</el-form-item>
				<el-form-item label="字段查看权限">
					  <el-radio-group v-model="qxCodeArr[11]"><!-- 11 字段查看权限-->
						<el-radio label="a1">所有可看</el-radio>
						<el-radio label="a0">所有不可看</el-radio>
						<el-radio label="1">部分可看</el-radio>
					</el-radio-group>
					<!-- 12 可看字段列表竖线分隔-->
					  <el-radio-group v-model="qxCodeArr[13]" v-if="qxCodeArr[11]!='a0'"><!-- 13 字段修改权限-->
						<el-radio v-if="qxCodeArr[11]=='a1'" label="a1">所有可改</el-radio>
						<el-radio v-if="qxCodeArr[11]=='a1' || qxCodeArr[11]=='1' " label="a0">所有不可改</el-radio>
						<el-radio v-if="qxCodeArr[11]=='a1' || qxCodeArr[11]=='1' " label="1">部分可改</el-radio>
					</el-radio-group> 
					<!-- 14 可更新字段列表竖线分隔 如 f1:1|f2:1|f3:0  冒号后的数字0代办不是必须，1代表必须 不配做代表不做处理-->

					  <el-table v-if="qxCodeArr[11]=='1'"
						ref="flowFormFields"
						:data="flowFormFields"
						tooltip-effect="dark"
						style="width: 100%"
						@selection-change="formFieldSelected">
						<el-table-column
							type="index"
							width="40">
						</el-table-column>
						<el-table-column
							prop="fieldTitle"
							label="字段名"
							min-width="120">
							<template slot-scope="scope">{{ scope.row.fieldTitle}}</template>
						</el-table-column>  
						<el-table-column
						prop="qx"
						label="权限"
						min-width="350">
							<template slot-scope="scope">
								<el-radio-group v-model="scope.row.qx"> 
									<el-radio label="rw">可读可写（默认）</el-radio> 
									<el-radio label="nr">不可读</el-radio>
									<el-radio label="r">只读</el-radio> 
									<el-radio label="frw">可读可写必填</el-radio> 
								</el-radio-group> 
							</template>
						</el-table-column> 
					</el-table>
				</el-form-item>
				<el-form-item label="推送通知">
					
					<el-checkbox v-model="qxCodeArr[15]" true-label="1" false-label="0"> 推送任务通知到IM</el-checkbox> 
					<el-checkbox v-model="qxCodeArr[16]" true-label="1" false-label="0"> 推送任务通知到短信</el-checkbox> 
				</el-form-item> 
				
					
				<el-form-item v-if="qxType=='mainQx'" label="其它">
					
					<el-checkbox v-if="qxType=='mainQx'" v-model="qxCodeArr[18]" true-label="1" false-label="0"> 发起流程时可重设权限</el-checkbox> 
					<el-checkbox v-if="qxType=='mainQx'" v-model="qxCodeArr[19]" true-label="1" false-label="0"> 控制子节点权限</el-checkbox>  
				</el-form-item> 
				
				<el-form-item label="">
					
					<el-button @click.native="confirm">确认</el-button> 
					<el-button  @click.native="handleCancel"> 取消</el-button> 
				</el-form-item> 
			</el-form> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	
	import qxutil from '@/common/js/qxutil';//全局公共库 
	import { mapGetters } from 'vuex'
	
	export default { 
		name:'ActQxCodeSet',
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['qxCode','visible','formFields','qxType'],
		watch: {
	      'qxCode':function( qxCode ) {
			   //this.initData();
					
	      },
	      'visible':function(visible) { 
	      	if(visible==false){
			 this.qxCodeArr=[].concat(this.qxCodeArrDefault)
			 this.flowFormFields=[];
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}else{
				  this.initData();
			  }
		  } ,
		  
	      'formFields':function(formFields) {  
			 //this.initData();
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
				sels:[],
				addForm:{one:'',two:''},
				//新增界面数据 mdp_re_procdef_parames
				qxCodeArr:[],
				qxCodeArrDefault:[
					'1',// 索引 0  可看正文 1是 0 否
					'1',// 索引 1  可修改正文 1是 0 否
					'1',// 索引 2  可看附件 1是 0 否
					'1',// 索引 3  可上传附件 1是 0 否
					'1',// 索引 4  可下载附件 1是 0 否
					'1',// 索引 5  可修改计划完成时间 1是 0 否
					'1',// 索引 6  可驳回 1是 0 否
					'1',// 索引 7  可转主办 1是 0 否
					'1',// 索引 8  可转发起人 1是 0 否
					'1',// 索引 9  可找人代办 1是 0 否
					'1',// 索引 10  可委托办理 1是 0 否
					'a1',// 索引 11  字段查看权限 a1全部可看 a0全部不可看 1部分可看
					'1',// 索引 12  暂时不用，取值 1
					'a1',// 索引 13  字段修改权限 a1全部可改 a0全部不可改 1部分可改
					'a1',// 索引 14  权限字段列表竖线分隔 如 f1:r|f2:frw|f3:nr|f4:rw 分别为 f1 只读，f2 读写必填 f3 不可读 f4 可读可写  冒号后的r 代表可读 w代表可写 f代表必填，如frw代表必填且可读可写  全部不配做，则a1代表不配做，默认a1
					'1',// 索引 15  推送任务通知到IM
					'1',// 索引 16  推送任务通知到短信
					'1', // 索引 17  暂时不用，取值 1 
					'1',// 索引18 发起人是否可以重新调整权限 
					'0',//索引19 是否控制流程节点权限
					'1'//索引20 是否总流程权限 1代表流程权限 0代表流程节点权限
					],
				flowFormFields:'',
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: { 
			// 取消按钮点击 父组件监听@cancel="qxCodeArrVisible=false" 监听
			handleCancel:function(){ 
				this.qxCodeArr=[].concat(this.qxCodeArrDefault)
				this.flowFormFields=[]
				this.$emit('cancel');
			},
			//新增提交ProcdefParames mdp_re_procdef_parames 父组件监听@submit="afterAddSubmit"
			confirm: function () {
				 
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							
							console.log("flowFormFields-----------"+JSON.stringify(this.flowFormFields));
							var qxCode= qxutil.flow.formatQxCode(this.qxCodeArr,this.flowFormFields,this.qxType);
							console.log("qxCode-----------"+JSON.stringify(qxCode));
							this.$emit('confirm',qxCode);
						})
			},
			formFieldSelected:function(sels){
				this.sels=sels;
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			initData(){
				
			  this.qxCodeArr=qxutil.flow.parseQxCode(this.qxCode);
			  console.log(this.qxCodeArr);
			  this.flowFormFields=qxutil.flow.parseFormFieldsQx( this.qxCodeArr,this.formFields);
			  
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'procdef-parames-edit':ProcdefParamesEdit
		},
		mounted() {
				this.initData();
		}
	}

</script>

<style scoped>

</style>