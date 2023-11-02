<template>
 <section>
	<el-popover
			placement="bottom"
			width="500"
			v-model="formVisible"
			trigger="manual" >  <el-form :model="editForm"  label-width="100px"  ref="editForm">

					<el-form-item label="工时进度" prop="mactRate" >
						<el-progress style="width:50%;" :stroke-width="15" :percentage="editForm.mactRate?editForm.mactRate:0"></el-progress>
					</el-form-item>
					<el-form-item label="预估工时" prop="budgetWorkload">
						 {{editForm.budgetWorkload}}&nbsp;小时
					</el-form-item>
					<el-form-item label="实际工时" prop="mactWorkload">
						 {{editForm.mactWorkload}}&nbsp;小时
					</el-form-item>

					<el-form-item label="剩余工时" prop="rworkload">
						 {{editForm.rworkload}}&nbsp;小时
					</el-form-item>

					<el-form-item label="" class="padding">
						<el-button   @click="cancel">关闭</el-button>

					</el-form-item>
				</el-form>
				<el-button title="点击查看工时进度" @click="formVisible=!formVisible"  type="warning" slot="reference" icon="el-icon-search">工时<font style="font-size:14px;"></font></el-button>
		</el-popover>
 </section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库


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
