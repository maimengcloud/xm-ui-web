<template> 
 <section>  
	<el-popover 
			placement="bottom"
			width="500"
			v-model="formVisible"
			trigger="manual" >  <el-form :model="editForm"  label-width="100px"  ref="editForm"> 
					<el-form-item label="汇总方式" prop="calcType"> 
						<el-radio   v-model="editForm.calcType"  label="3" placeholder="下级往上级汇总" :disabled="editForm.ntype==='0'">下往上</el-radio>
						<el-radio   v-model="editForm.calcType"  label="1" placeholder="由任务汇总" :disabled="editForm.ntype==='1'">任务汇总</el-radio> 
						<el-radio   v-model="editForm.calcType"  label="2" placeholder="手工填报" :disabled="editForm.ntype==='1'">手工填报</el-radio>
					</el-form-item> 
						
					<el-form-item label="当前进度" prop="mactRate" >
						<el-progress style="width:50%;" :stroke-width="15" :percentage="editForm.mactRate?editForm.mactRate:0"></el-progress>
					</el-form-item>  
					<el-form-item label="预估工期" prop="budgetHours">
						<el-input-number :disabled="editForm.calcType!=='2' && editForm.ntype==='1'" style="width:200px;"  v-model="editForm.budgetHours"  :precision="2" :step="8" :min="0" placeholder="预计工期(小时)"></el-input-number>&nbsp;h
					</el-form-item> 
					<el-form-item label="预估工时" prop="budgetWorkload">
						<el-input-number :disabled="editForm.calcType!=='2' && editForm.ntype==='1'" style="width:200px;"  v-model="editForm.budgetWorkload" :precision="2" :step="8" :min="0" placeholder="预计工时(人时)"></el-input-number>  &nbsp;h
					</el-form-item> 
					<el-form-item label="实际工时" prop="mactWorkload">
						<el-input-number :disabled="editForm.calcType!=='2' && editForm.ntype==='1'" style="width:200px;"  v-model="editForm.mactWorkload" :precision="2" :step="8" :min="0" placeholder="实际工时(人时)"></el-input-number>  &nbsp;h
					</el-form-item> 
					<font color="blue" style="font-size:10px;">控制规则:
						<br>下级往上汇总：指工时数据按 &nbsp;用户故事->特性->史诗 &nbsp;这样的汇总关系将数据逐级往上汇总。
						<br>由任务汇总： 指用户故事的工时数据由任务汇总。
						<br>手工填报：  指用户故事的工时数据来自手工填报，无论是否关联了任务，都不从任务汇总。
					</font>
					
					<el-form-item label="" class="padding">
						<el-button   type="text" @click="cancel">关闭</el-button>
						<el-button :disabled="editForm.calcType!=='2' && editForm.ntype==='1'" type="primary" @click="submit">确认</el-button>
					</el-form-item> 
				</el-form> 
				<el-button title="点击填写工时" @click="formVisible=true"  type="warning" slot="reference" icon="el-icon-edit"><font style="font-size:14px;"></font></el-button> 
		</el-popover> 
 </section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  

	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]), 
		},
		props:['menu'],
		watch:{ 
			menu(){
				this.editForm={...this.menu}
			},
			 'editForm.mactWorkload':function(val,oldVal){
				 if(!this.editForm.budgetWorkload){
					 return;
				 }
				 if(val==0||!val){
					 return;
				 }
				 this.editForm.mactRate=Math.round(val/this.editForm.budgetWorkload*100)
				 if( this.editForm.mactRate>100){
					 this.editForm.mactRate=100;
				 }
			 },
			  'editForm.budgetWorkload':function(val,oldVal){
				 if(!this.editForm.mactWorkload){
					 return;
				 }
				 if(val==0||!val){
					 return;
				 }
				 this.editForm.mactRate=Math.round(this.editForm.mactWorkload/val*100)
				 if( this.editForm.mactRate>100){
					 this.editForm.mactRate=100;
				 }
			 }
		},
		data() { 
			return {  
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'1',mmUserid:'',mmUsername:'',ntype:'0',childrenCnt:0,sinceVersion:'',
						proposerId:'',proposerName:'',dlvl:'',dtype:'',priority:'',source:'',calcType:'1',mactWorkload:0,mactAmount:0,mactRate:0
				},
				formVisible:false,
			}
		},//end data
		methods: {
			cancel(){
				this.formVisible=false;
				this.$emit("cancel")
			},
			 submit(){
				 var params={mactRate:this.editForm.mactRate,menuId:this.editForm.menuId,mactWorkload:this.editForm.mactWorkload,budgetWorkload:this.editForm.budgetWorkload,budgetHours:this.editForm.budgetHours,calcType:this.editForm.calcType}
				 this.$emit("submit",params);
				 this.formVisible=false;
			 }
		},//end methods
		components: { 
		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {   
				this.editForm={...this.menu}
        	});
           
		}
	}

</script>

<style   lang="scss" scoped> 
</style>
