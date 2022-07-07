<template>
	<section>
		<el-row v-if="userFocuss.length>0">
	   		<el-tag type="success">已关注</el-tag> <el-button @click="handleDel">取消关注</el-button>
	   </el-row>
	   
	   <el-row v-if="userFocuss.length<=0">
	   		<el-tag type="primary">未关注</el-tag> <el-button @click="saveSubmit">去关注</el-button>
	   </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, listUserFocus,addUserFocus,delUserFocus } from '@/api/mdp/sys/userFocus';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmMyDoFocus',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['pbizId','bizId','focusType','bizName'],

		watch: {  
			bizId(){
				this.searchUserFocuss()
			}
	    },
		data() {
			return { 
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				
				userFocuss:[],
			}//end return
		},//end data
		methods: {

		    ...util,

			 //获取列表 UserFocus 我关注的项目或者任务
			searchUserFocuss() {
				let params = { 
					pbizId:this.pbizId,
					bizId:this.bizId,
					focusType:this.focusType
				};
				 

				this.load.list = true;
				listUserFocus(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.userFocuss = res.data.data; 
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			initData: function(){ 
				this.searchUserFocuss();
            }, 
			//删除userFocus
			handleDel: function ( ) {
				var row=this.userFocuss[0]
				this.load.del=true;
				let params = {  userid:row.userid,  bizId:row.bizId,  pbizId:row.pbizId };
				delUserFocus(params).then((res) => {
					this.load.del=false;
					var tips=res.data.tips;
					if(tips.isOk){
						this.searchUserFocuss();
					}
					this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err  => this.load.del=false ); 
			},
			//新增、编辑提交UserFocus 我关注的项目或者任务父组件监听@submit="afterEditSubmit"
			saveSubmit: function () { 
				this.load.edit=true
				let params = {pbizId:this.pbizId,bizId:this.bizId,focusType:this.focusType,bizName:this.bizName}
				var func=addUserFocus 
				func(params).then((res) => {
					this.load.edit=false
					var tips=res.data.tips;
					
					if(tips.isOk){  
						this.searchUserFocuss()
 						this.$emit('submit');//  @submit="afterAddSubmit"
					}
					this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err =>this.load.edit=false); 
			},
		},//end method
		mounted() {
		    this.$nextTick(() => {
                initDicts(this);
                this.initData() 
            });
		}
	}

</script>

<style scoped>

</style>