<template>
	<el-row>
		<el-steps :active="1">
		  <el-step title="模型设计" icon="el-icon-edit"></el-step>
		  <el-step title="发布" icon="el-icon-picture"></el-step>
		  <el-step title="业务发起审批" icon="el-icon-picture"></el-step>
		  <el-step title="流程流转" icon="el-icon-picture"></el-step>
		  <el-step title="归档" icon="el-icon-picture"></el-step>
		  <el-step title="历史查阅" icon="el-icon-picture"></el-step>
		</el-steps>
	</el-row>
</template>

<script>
	import config from '../../../common/config.js'; 
	export default {
		data() {
			return {
 
			}
		},
		methods: {
 
		},
		mounted() {
			 

		}
	}

</script>

<style scoped lang="scss">
	 
</style>