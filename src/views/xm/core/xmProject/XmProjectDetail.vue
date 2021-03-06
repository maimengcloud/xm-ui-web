<template>
	<section>
		<el-row class="xm-detail" v-loading.lock="load.edit || load.list"> 
			<xm-project-edit :sel-project="selProject" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-edit> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { mapGetters } from 'vuex'
	import { listXmProject } from '@/api/xm/core/xmProject';
	import  XmProjectEdit from './XmProjectEdit';//修改界面

	export default { 
		props: ["selProject"],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]), 
		},
		data() {
			return {
				 load:{ list: false, edit: false, del: false, add: false },//查询中...
				/**end 自定义属性请在上面加 请加备注**/
				editFormVisible:true,
			}
		},//end data
		methods: { 
			//显示新增界面 XmProject xm_project
			afterEditSubmit(params){ 
				this.editFormVisible=true;
				this.$emit("submit",params);
			},
			/**end 自定义函数请在上面加**/
		},//end methods
		components: { 
			//在下面添加其它组件
			XmProjectEdit,
		},
		mounted() {   
		}
	}

</script>

<style scoped>
.xm-detail{
	width: 100%;
}
.title-bar{
	padding:0 10px;
	height: 50px;
	background: #fafbfc;
	line-height: 50px;
}
.title-bar>button{
	float:right;
	margin:7px 10px;
}
.fs-ft{
	font-size: 14px !important;
}
.xm-detail .el-form-item{
	padding: 0 10px;
}
/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>