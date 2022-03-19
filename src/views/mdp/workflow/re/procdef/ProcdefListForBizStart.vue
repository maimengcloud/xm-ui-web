<template>
	<section>
		 <el-row>
			 <procdef-list-for-simple-start ref="procdefListForStart"  :params="filters.params" @closeTab="closeTab"></procdef-list-for-simple-start>
		</el-row>
	</section>
</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库  
	
	import ProcdefListForSimpleStart from '@/views/mdp/workflow/re/procdef/ProcdefListForSimpleStart';//全局公共库  
	import { mapGetters } from 'vuex' 
	if(!Vue.component("procdef-list-for-simple-start")){
	
		Vue.component('procdef-list-for-simple-start',ProcdefListForSimpleStart)
		Vue.use(ProcdefListForSimpleStart);
	}
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
				filters: { 
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
				}, 
				/**end 自定义属性请在上面加 请加备注**/
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
				  debugger;
				  this.$nextTick(()=>{
					  var key="ProcdefListForBizStart"
						if(this.$route.query && this.$route.query.params){
							let paramsJsonStr=this.$route.query.params; 
							let params= JSON.parse(decodeURIComponent(paramsJsonStr))
							this.filters.params=params;
							localStorage.setItem(key,JSON.stringify(params))
							/** 传过来的参数格式
							let extVars={formDataIds:[row.id],formId:row.formId}
							let jsonExtVars=JSON.stringify(extVars); 
							let params={ 
									mainContext:'',
									mainTitle:'',
									bizUrl:process.env.BASE_API+config.getFormBasePath()+'/#/mdp/form/formData/FormDataMng?extVars='+jsonExtVars,
									extVars:extVars
							}
							let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
							this.$router.push({path:'/mdp/workflow/ru/execution/ExecutionMngForFormData',query:{params:jsonParmas}});
							*/
							
						}else if(this.$route.params && this.$route.params.mainTitle){
							this.filters.params=this.$route.params;
							var paramsJsonStr=JSON.stringify(this.$route.params);
							localStorage.setItem(key,paramsJsonStr)
						}else{
							var paramsJsonStr=localStorage.getItem(key);
							if(paramsJsonStr){
								this.filters.params=JSON.parse(paramsJsonStr);
							} 
						}  
				  })
				  
			  }
			
		},//end methods
		components: {  
			//在下面添加其它组件 
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

  
.filters-show {
	margin-left: 20px;
	margin-top: 10px;
	margin-bottom: 0px;
}
.filters-label { 
	font-size: 14px;
	color:black;
	font-weight: bold;
}
</style>