<template>
	 <item-set-data :item="editForm" :un-ext-infos="unExtInfos" :un-main="unMain" :un-config="unConfig"></item-set-data>
</template>
<!--每个itemCode一个文件 -->
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
	       
			 
	    },
		data() {
			return {
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				unMain:false,
				unExtInfos:false,
				unConfig:false,
				//新增界面数据 数据项定义
				editForm: {
					id:'',itemCode:'',itemName:'',remark:'',categoryId:'',itemSize:'50',itemType:'',branchId:'',deptid:'',cmenu:'',dvalues:'',dnames:'',options:'',inputFormat:'',required:'',seq:'999',table:'',isShow:'',qx:''
				},
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			getItem(category,itemCode){
				listItem({categoryId:category,itemCode:itemCode}).then(res=>{
					var tips = res.data.tips;
					if(tips && tips.isOk){
						var data=res.data.data
						if(data&&data.length>=1){
							this.editForm=data[0]
						}else{
							this.initEditForm(itemCode)
						}
					}else{
						this.$notify({ message:"请求数据不成功", type: 'error' }); 
					}
				})
			},
			/**
			 * 固定的参数在此设置
			 */
			initEditForm(itemCode){
				this.editForm.itemCode=itemCode
				this.editForm.categoryId="sysParam"
				this.editForm.itemType="1";//待补充
				this.editForm.itemName=""//待补充
				var extInfos=[]
				extInfos.push({id:'id1(待修改)',name:'名称1(待修改)',value:'',type:'1'})
				extInfos.push({id:'id2(待修改)',name:'名称2(待修改)',value:'',type:'1'})
				extInfos.push({id:'id3(待修改)',name:'名称3(待修改)',value:'',type:'1'})
				extInfos.push({id:'id4(待修改)',name:'名称4(待修改)',value:'',type:'1'})
				this.editForm.extInfos=JSON.stringify(extInfos)
			},
			 
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {
			ItemSetData,
		    //在下面添加其它组件 'item-edit':ItemEdit
		},
		mounted() {   
			 this.getItem("itemTest001")
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>