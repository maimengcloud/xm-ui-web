<template>
	 <item-form v-if="editForm.itemCode" :visible="true" :form-data="editForm" :sub-op-type="subOpType" :un-ext-infos="unExtInfos" :un-main="unMain" :un-config="unConfig"/>
</template>

<!--由菜单跳转到此文件，由菜单指定itemCode,itemName,categoryId，unMain,unExtInfos -->

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
 	import { listItem } from '@/api/mdp/meta/item'; 
	import { mapGetters } from 'vuex'
 	import ItemForm from './Form.vue';
	
	
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
				subOpType:'add',
				unMain:true,
				unExtInfos:true,
				unConfig:true,
				//新增界面数据 数据项定义
				editForm: {
					id:'',itemCode:'',itemName:'',remark:'',itemType:'',itemSize:'50',categoryId:'',branchId:'',deptid:'',cmenu:'',dvalues:'',dnames:'',options:'',inputFormat:'',required:'',seq:'999',table:'',isShow:'',qx:''
				},
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			getItem(itemCode,itemName,categoryId){
				listItem({categoryId:categoryId,itemCode:itemCode}).then(res=>{
					var tips = res.data.tips;
					if(tips && tips.isOk){
						var data=res.data.data
						if(data&&data.length>=1){
							this.subOpType='edit'
							this.editForm=data[0]
						}else{
							this.subOpType='add'
							this.initEditForm(itemCode,itemName,categoryId)
						}
					}else{
						this.$notify({ message:"请求数据不成功", type: 'error' }); 
					}
				})
			},
			initEditForm(itemCode,itemName,categoryId){
				this.editForm.itemCode=itemCode 
				this.editForm.itemName=itemName
				this.editForm.categoryId=categoryId
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
				 var itemCode=''
				 var itemName=''
				 var categoryId='sysParams'
				if(to.query){ 
				 itemName=to.query.itemName||''
				 categoryId=to.query.categoryId||'sysParams'
				 itemCode=to.query.itemCode||''
				} 
				if(to.params && to.params.itemCode){
					itemCode=to.params.itemCode 
				} 
				if(itemCode){
					this.getItem(itemCode,itemName,categoryId)
				}
				
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {
			ItemForm,
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