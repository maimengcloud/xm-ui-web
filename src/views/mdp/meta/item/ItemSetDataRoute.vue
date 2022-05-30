<template>
	 <item-set-data :item="editForm" :un-ext-infos="unExtInfos" :un-main="unMain" :un-config="unConfig"></item-set-data>
</template>

<!--由菜单跳转到此文件，由菜单指定itemCode,itemName,itemType，unMain,unExtInfos -->

<script>
	import util from '@/common/js/util';//全局公共库
 	import { listItem } from '@/api/mdp/meta/item'; 
	import { mapGetters } from 'vuex'
 	import ItemSetData from './ItemSetData.vue';
	
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		}, 
		watch: {
	       $route(to,from){
			    this.initFromRoute(to)
		   }
			 
	    },
		data() {
			return {
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				unMain:true,
				unExtInfos:true,
				unConfig:true,
				//新增界面数据 数据项定义
				editForm: {
					id:'',itemCode:'',itemName:'',remark:'',categoryId:'',itemSize:'50',itemType:'',branchId:'',deptid:'',cmenu:'',dvalues:'',dnames:'',options:'',inputFormat:'',required:'',seq:'999',table:'',isShow:'',qx:''
				},
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			getItem(itemCode,itemName,itemType){
				listItem({categoryId:'all',itemCode:itemCode}).then(res=>{
					var tips = res.data.tips;
					if(tips && tips.isOk){
						var data=res.data.data
						if(data&&data.length>=1){
							this.editForm=data[0]
						}else{
							this.initEditForm(itemCode,itemName,itemType)
						}
					}else{
						this.$notify({ message:"请求数据不成功", type: 'error' }); 
					}
				})
			},
			initEditForm(itemCode,itemName,itemType){
				this.editForm.itemCode=itemCode
				this.editForm.itemType=itemType
				this.editForm.itemName=itemName
				this.editForm.categoryId="all"
			},
			initFromRoute(to){
				 if(to.query.unMain){
					 this.unMain=to.query.unMain;
				 }else{
					  this.unMain=false
				 }
				 if(to.query.unExtInfos){
					 this.unExtInfos=to.query.unExtInfos;
				 }else{
					 this.unExtInfos=false;
				 }
				 
				 if(to.query.unConfig){
					 this.unConfig=to.query.unConfig;
				 }else{
					 this.unConfig=false
				 }
				if(to.query && to.query.itemCode){
				 var itemCode=to.query.itemCode
				 var itemName=to.query.itemName
				 var itemType=to.query.itemType
				 this.getItem(itemCode,itemName,itemType)
				} 
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {
			ItemSetData,
		    //在下面添加其它组件 'item-edit':ItemEdit
		},
		mounted() {   
			 this.initFromRoute(this.$route)
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>