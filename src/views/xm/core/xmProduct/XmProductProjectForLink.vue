<template>
	<section>
		<el-row v-if="selProject!=null">  
			<el-button icon="el-icon-zoom-out" @click="doDelXmProductProjectLink">
				将项目<strong>{{selProject.name}}</strong>与产品<strong>{{xmProduct.productName}}</strong>脱钩
			</el-button>
		</el-row> 
		<el-row v-else>
			<xm-project-for-link :xm-product="xmProduct"></xm-project-for-link>
		</el-row>
	</section> 

</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import config from "@/common/config"; //全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProject,  } from '@/api/xm/core/xmProject';  
	import { mapGetters } from 'vuex'  
	import XmProjectForLink from '../xmProject/XmProjectForLink.vue';
	import { delXmProductProjectLink, batchDelXmProductProjectLink } from '@/api/xm/core/xmProductProjectLink';


	export default {  
		props:['xmProduct','selProject'],
		computed: {
			...mapGetters([
				'userInfo','roles'
			]), 
		}, 
		data() {
			return { 
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 doDelXmProductProjectLink(){
				 
				var xmProduct=this.xmProduct;
				var selProject=this.selProject;
				this.$confirm('确认将产品【'+xmProduct.productName+'】与项目【'+selProject.projectName+'】进行脱钩吗？脱钩后，项目试图中将看不到该产品信息', '提示', {
					type: 'warning'
				}).then(()=>{
					var params={productId:xmProduct.id,projectId:selProject.id}
					delXmProductProjectLink(params).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.$notify({showClose: true, message: "脱钩成功", type: 'success' });
						}
					});
				})
				 
			 }
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {
			XmProjectForLink,
			 
		    //在下面添加其它组件
		},
		mounted() { 
			 
		}
	}

</script>

<style scoped> 
</style>