<template> 
	<el-select v-model="iterationId" placeholder="迭代" @focus="focus" :clearable="clearable">
		<el-option v-for="(item,index) in xmIterations" :label="item.iterationName" :value="item.id" :key="index" ></el-option>
	</el-select>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmIteration,listXmIterationWithState, delXmIteration, batchDelXmIteration,loadTasksToXmIterationState } from '@/api/xm/core/xmIteration';
  
	const map={};

	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]), 
		},
		props:[ 'clearable', 'value', 'productId','linkProjectId','autoSelect'],
		watch:{ 
			productId:function(){
				this.initData();
			},
			
			linkProjectId:function(){
				this.initData();
			},
			value(){
				this.iterationId=value;
			},
			iterationId(){
				this.$emit("input",this.iterationId)
				if(!this.iterationId){
					this.$emit("change",null)
					return;
				}
				var iteration=this.xmIterations.find(i=>i.id==this.iterationId)
				this.$emit("change",iteration)
			}
		},
		data() { 
			return {
				load:{list:false,},
				 iterationId:null,
				 xmIterations:null,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			focus(){
				if(!this.xmIterations){
					this.initData()
				}
			},
			 
			searchXmIterations(){ 
				 this.getXmIterations();
			},
			//获取列表 XmIteration 迭代定义
			getXmIterations() {
				 var params={};
				 if(this.productId){
					 params.productId=this.productId
				 }
				 if(this.linkProjectId){
					 params.linkProjectId=this.linkProjectId
				 }
				this.load.list = true;
				listXmIterationWithState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.xmIterations = res.data.data;
						if(this.productId){
							map['pd'+this.productId]=res.data.data
						}else{
							map['pj'+this.linkProjectId]=res.data.data
						}
						
						if(this.autoSelect===true&&this.xmIterations.length>0){ 
							var row=this.xmIterations[0];  
							this.iterationId=row.id
						}
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			}, 
			initData(){
				if(this.productId){ 
					var xmIterations=map['pd'+this.productId]
					if(!xmIterations){ 
						this.getXmIterations();
					}else{
						this.xmIterations=xmIterations;
					}
				}else{
					if(this.linkProjectId){
						var xmIterations=map['pj'+this.linkProjectId]
						if(!xmIterations){ 
							this.getXmIterations();
						}else{
							this.xmIterations=xmIterations;
						}
					}
				}
			}
		},//end methods
		components: { 
		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {  
				//this.initData();
        	});
           
		}
	}

</script>

<style   lang="scss" scoped> 
</style>
