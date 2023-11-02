<template>
	<section>
		 <el-row v-if="params && params.bizKey">
			 <procdef-index :visible="params.bizKey" ref="procdefListForBizStart" :biz-key="params.bizKey" sub-op-type="select" include-procdef="1" @select="onSelect"></procdef-index>
		</el-row>
		<el-row>
			<mdp-dialog ref="startDialog" title="发起流程">
				<template v-slot="{visible,data,dialog}">
				<procinst-parames-start-set :procdef="data.procdef" :visible="visible" :params="data.params"
					@cancel="dialog.close();closeTab()"></procinst-parames-start-set>
				</template>
          </mdp-dialog>
		</el-row>
	</section>
</template>

<script> 
	import ProcinstParamesStartSet from "../../ru/procinstParames/ProcinstParamesStartSet";

	import ProcdefIndex from '@/views/mdp/workflow/re/procdef/Index';//全局公共库  
	import { mapGetters } from 'vuex'  
	export default {
		name:'ProcdefListForBizStart',
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ]), 
		},
		watch:{
			$route(to,from){ 
				this.dataInit();
			}
		},
		data() {
			return {  
				params:null,
				/** 
				params:{
					mainTitle:'',
					mainContext:'',
					bizUrl:'',//前端跳转  //自带参数，建议只带主键
					bizKey:'',//用于选中流程模型并原样输出到restUrl
					restUrl:'',//后端接口同步
					formId:'',//form 表单编号
					formDataId:'',//form表单对应的数据
					extVars:{ //不用提交给工作流的变量池 
					},
					flowVars:{//提交进流程实例变量的变量池,flowVars所有变量将post方式推送回restUrl指定的地址

					}

				}
				*/
			} 
		},//end data
		methods: {
			 
			  closeTab(){ 
				  var key="ProcdefListForBizStart"
				  this.$store.dispatch('delVisitedViews', this.$route)
				  localStorage.removeItem(key)
				  this.$router.back(-1);
			  },
			  dataInit(){ 
				  
				  this.$nextTick(()=>{
					  var key="ProcdefListForBizStart"
						if(this.$route.query && this.$route.query.params){
							let paramsJsonStr=this.$route.query.params; 
							let params= JSON.parse(decodeURIComponent(paramsJsonStr))
							this.params=params;
							localStorage.setItem(key,JSON.stringify(params))
							/** 传过来的参数格式
							let extVars={formDataIds:[row.id],formId:row.formId}
							let jsonExtVars=JSON.stringify(extVars); 
							let params={ 
									mainContext:'',
									mainTitle:'',
									bizUrl:process.env.BASE_API+config.getFormContext()+'/#/mdp/form/formData/FormDataMng?extVars='+jsonExtVars,
									extVars:extVars
							}
							let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
							this.$router.push({path:'/mdp/workflow/ru/execution/ExecutionMngForFormData',query:{params:jsonParmas}});
							*/
							
						}else if(this.$route.params && this.$route.params.mainTitle){
							this.params=this.$route.params;
							var paramsJsonStr=JSON.stringify(this.$route.params);
							localStorage.setItem(key,paramsJsonStr)
						}else{
							var paramsJsonStr=localStorage.getItem(key);
							if(paramsJsonStr){
								this.params=JSON.parse(paramsJsonStr);
							} 
						}  
				  })
				  
			  },
			  onSelect(procdef){
				this.$refs['startDialog'].open({procdef:procdef,params:this.params})
			  }
			
		},//end methods
		components: {  
			ProcdefIndex,ProcinstParamesStartSet
		},
		activated:function(){  
			//this.dataInit();
		},
		mounted() { 
			 this.dataInit();
			
		}
	}

</script>

<style scoped> 
</style>