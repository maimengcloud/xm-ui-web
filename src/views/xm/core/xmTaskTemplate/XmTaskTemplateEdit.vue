<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<!--新增界面 XmTaskTemplate xm_task--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
				<el-form-item label="任务名称" prop="name">
					<el-input v-model="editForm.name" placeholder="任务名称" ></el-input>
				</el-form-item>
				<el-form-item label="排序号" prop="sortLevel">
					<el-input v-model="editForm.sortLevel" placeholder="如1.0或者1.1.2等" ></el-input>
				</el-form-item>
				<el-form-item  label="计划类型" prop="planType"> 
					<el-select v-model=" editForm.planType">
						<el-option v-for="i in this.options.planType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item  label="任务类型" prop="taskType"> 
					<el-select v-model=" editForm.taskType">
						<el-option v-for="i in this.options.taskType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="skill" label="技能要求">
					<el-button class="useredit-icon" type="text" @click.stop="showSkill()" icon="el-icon-circle-plus-outline">增加</el-button>
					<el-tag class="fs-ft" style="margin-right:10px" v-for="(item,i) in taskSkills" :key="i">{{item.skillName}}</el-tag>
				</el-form-item>
				<el-form-item label="前置任务名称">
					<el-select clearable style="width:100%;" placeholder="前置任务" v-model="preTask" @change="changePreTask" value-key="id">
						<el-option
							no-data-text="暂无可选前置任务"
							v-for="(item,i) in preTaskList"
							:key="i"
							:label="item.name"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item> 
				<el-form-item label="任务级别" prop="level">
					<el-radio-group v-model="editForm.level">
						<el-radio v-for="i in levelList" :label="i.key" :key="i.key">{{i.value}}</el-radio> 
					</el-radio-group> 
				</el-form-item> 
				<el-form-item label="里程碑" prop="milestone">
					<el-checkbox v-model="editForm.milestone" :true-label="1" :false-label="0">标记为里程碑</el-checkbox>
				</el-form-item> 
				<el-form-item label="任务描述" prop="description">
					<el-input type="textarea" :row="3" v-model="editForm.description" placeholder="任务描述" ></el-input>
				</el-form-item> 
				<el-form-item label="预算工时" prop="budgetWorkload">
					<el-input  type="number" min="0" v-model="editForm.budgetWorkload" placeholder="预算工时" ></el-input>
				</el-form-item> 
				<el-form-item label="预算金额" prop="budgetCost">
					<el-input type="number" min="0" v-model="editForm.budgetCost" placeholder="预算金额" ></el-input>
				</el-form-item> 
				<el-form-item label="任务状态" prop="taskState">
					<el-radio-group v-model="editForm.taskState">
						<el-radio label="0">待领取</el-radio>
						<el-radio label="1">已领取执行中</el-radio>
						<el-radio label="2">已完工</el-radio>
						<el-radio label="3">已结算</el-radio>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="是否外包" prop="taskOut">
					<el-radio-group v-model="editForm.taskOut">
						<el-radio label="0">不可外包</el-radio>
						<el-radio label="1">可外包</el-radio>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="是否结算" prop="taskClass">
					<el-radio-group v-model="editForm.taskClass">
						<el-radio label="0">不需结算</el-radio>
						<el-radio label="1">需结算</el-radio>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="发布到任务大厅" prop="toTaskCenter">
					<el-radio-group v-model="editForm.toTaskCenter">
						<el-radio label="0">否</el-radio>
						<el-radio label="1">是</el-radio>
					</el-radio-group>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row> 

		<!-- <el-drawer append-to-body :title="'技能要求'" :visible.sync="skillVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
			<xm-skill-mng :visible="skillVisible" :task-id="editForm.id" @cancel="skillVisible=false" @getSkill="getSkill"></xm-skill-mng>
		</el-drawer> -->

		<el-drawer append-to-body title="新增技能" :visible.sync="skillVisible" size="50%"    :close-on-click-modal="false">
			<skill-mng :task-skills="taskSkills" :jump="true" @select-confirm="onTaskSkillsSelected"></skill-mng>
		</el-drawer>

	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import {editXmTaskTemplate } from '@/api/xm/core/xmTaskTemplate';
	import { mapGetters } from 'vuex';
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import {sn} from '@/common/js/sequence';
	import xmSkillMng from '../xmTaskSkill/XmTaskSkillMng';
	import skillMng from "@/views/xm/core/skill/skillMng";
	import {batchAddSkill } from '@/api/xm/core/xmTaskSkill';
	
	export default { 
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),
			//任务工时
			TaskTime() {
			const s = new Date(this.editForm.startTime);
			const sy = s.getFullYear();
			const sm = s.getMonth();
			const sd = s.getDate();
			const e = new Date(this.editForm.endTime);
			const ey = e.getFullYear();
			const em = e.getMonth();
			const ed = e.getDate();
			let len = (new Date(ey,em,ed) - new Date(sy,sm,sd))/(24*3600*1000) + 1;
			return len;
			},
			//获取项目任务，作为前置任务列表
			preTaskList() {
				return []
			}, 
		},
		props:['xmTaskTemplate','visible'],
		watch: {
			'xmTaskTemplate':function(  xmTaskTemplate ) {  
			},
			'visible':function(visible) { 
				this.fileVisible = visible;
				if(visible==true){
					this.editForm = this.xmTaskTemplate;
					//从新打开页面时某些数据需要重新加载，可以在这里添加
				}
			},
		},
		data() { 
			return {
				levelList:[{key:'H',value:"高"},{key:'M',value:"中"},{key:'L',value:"低"}],
				options:{  
					planType:[],
					taskType:[],
				},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					name: [
						{ required: true, message: '任务名称不能为空', trigger: 'blur' }
					],
					planType: [
						//{ required: true, message: '请选择计划类型', trigger: 'blur' }
					],
					taskType: [
						{ required: true, message: '请选择任务类型', trigger: 'blur' }
					],
					taskClass: [
						{ required: true, message: '请选择是否结算', trigger: 'blur' }
					],
					toTaskCenter: [
						{ required: true, message: '请选择是否发布', trigger: 'blur' }
					],      
					sortLevel: [
						{ required: true, message: '排序号不能为空', trigger: 'blur' }
					],   
					// execuser:[{
					// 	validator: validateExec, trigger: 'blur'
					// }],
				},
				//新增界面数据 xm_task
				editForm: {
					 id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',rate:'',budgetCost:'',budgetWorkload:'',taskState:'',taskType:'',taskClass:'',toTaskCenter:'',projectPhaseId:'',projectPhaseName:'',taskSkillNames:'',taskSkillIds:'',taskOut:'',planType:'',settleSchemel:'',menuId:'',menuName:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				preTask:{},
				fileVisible: false, 

				skillVisible: false,
				taskSkills: [],

				taskTypeList: [{key:'0',value:"售前方案"},{key:'1',value:"投标"},{key:'2',value:"需求"},{key:'3',value:"设计"},{key:'4',value:"开发"},{key:'5',value:"测试"},{key:'6',value:"验收"},{key:'7',value:"部署"},{key:'8',value:"运维"}],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			 
			changePreTask(val){
				this.editForm.preTaskid = val.id;
				this.editForm.preTaskname = val.name;
			},
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmTaskTemplate xm_task 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							let params = Object.assign({}, this.editForm); 
							if(this.taskSkills){
								params.taskSkillNames=this.taskSkills.map(i=>i.skillName).join(",")
								params.taskSkillIds=this.taskSkills.map(i=>i.skillId).join(",")
							}
							
							editXmTaskTemplate(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
						});
					}
				});
			},
			onChange : function(file,fileList){
				let list = [];
				if(fileList != null && fileList.length > 0){
					fileList.forEach( (item)=>{
						let fileOne = {
							id: item.id,
							name: item.name,
							editr: item.url,
							type: item.fileSuffix,
							remark: item.remark,
						}
						list.push(fileOne);
					} );
					this.editForm.attachment = list;
					console.log(list);
				}
			}, 
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			handleAdd() { 
			},

			showSkill(){  
				this.skillVisible = true;
			},

			onTaskSkillsSelected(skills) { 
				this.taskSkills = skills;
				this.skillVisible=false;
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: { 
			'upload': AttachmentUpload,
			xmSkillMng,
			skillMng,
			//在下面添加其它组件 'xm-task-edit':XmTaskEdit
		},
		mounted() {
			console.log("taskAdd_mount");
			this.fileVisible = this.visible;
			this.editForm=Object.assign(this.editForm, this.xmTaskTemplate);
			//this.editForm.id = sn();
			listOption([{categoryId:'all',itemCode:'planType'},{categoryId:'all',itemCode:'taskType'}]).then(res=>{
				this.options=res.data.data;
			})
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>
.el-form-item{
	margin-bottom: 15px;
}
.el-form-item__content{
	margin-left: 0;
}
</style>