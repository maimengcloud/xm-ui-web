<template>
	<section>
		<task-mng :assigneeToMe="true" :biz-parent-pkid="bizParentPkid" :biz-pkid="bizPkid" :source="source"></task-mng>
	</section>
</template>

<script>
	import  TaskMng from './Index';//
	
	export default {
		name:'TaskListAssigneeToMe',
		props: ['source',"bizParentPkid","bizPkid"], 
		data() {
			return {
				filters: {
					key: '', 
				},
				 
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 
			
		},//end methods
		components: { 
		    'task-mng':TaskMng
		    //在下面添加其它组件
		},
		mounted() {
			 
		}
	}

</script>

<style scoped>

</style>