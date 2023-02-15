<template>
	<xm-question-mng class="padding-left padding-right" :sel-project="projectInfo"></xm-question-mng>
</template>

<script>
	import util from '@/common/js/util';//全局公共库

	import config from '@/common/config';//全局公共库
	 
	import  XmQuestionMng from './XmQuestionMng';//修改界面
	import { mapGetters } from 'vuex' 

	export default {
		computed: {
			...mapGetters([
				'userInfo','roles','projectInfo'
			]),
		}, 
		 
		data() {
			 
			return {
				 

			}

		},//end data
		methods: {
			 

		},//end methods
		components: {
			 XmQuestionMng
		},
		mounted() {
			 
		}
	}

</script>

<style lang="scss" scoped>
 
</style>
