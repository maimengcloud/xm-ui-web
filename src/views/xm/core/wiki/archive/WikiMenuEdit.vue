<template>
	<section>  
		<el-row v-loading="load.list">
			<el-col :span="24">
			<!--新增界面 Archive 档案信息表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">  
				<el-form-item label="" label-width="0px"> 
					<vue-ueditor :key="editForm.id" class="rich-context" v-model="editForm.archiveContext"></vue-ueditor>  
				</el-form-item> 
			</el-form>
			<el-row  class="padding">
 				<el-button @click="saveSubmit()" type="primary" v-if="editForm.archiveContext!=editFormBak.archiveContext">保存</el-button>
			</el-row>
			</el-col> 
		</el-row>
	</section>
</template>

<script>
 
	import util from '@/common/js/util';//全局公共库
	import seq from '@/common/js/sequence';//全局公共库
	import config from '@/common/config';//全局公共库import 
	import {initDicts, addArchive,editArchive, getOneArchive,editSomeFieldsArchive,listArchive  } from '@/api/mdp/arc/archive';
  	import { mapGetters } from 'vuex'  
	import VueUeditor from '@/components/Tinymce/index';
 	
 	 
	export default {
		
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['xmMenu'],
		watch: {
	      'xmMenu.menuId':function( menuId ) { 
				this.initData(); 
	      } 
	    },	
		data() {
			return {
				currOpType:'add',
				dicts:{categoryType:[]},//下拉选择框的所有静态数据
				load:{ list:false, open:false, close:false, publish:false, unPublish:false, del:false,draft:false, edit:false },
				editFormRules: {
					archiveTitle: [
						{ required: true, message: '标题不能为空', trigger: 'blur' }
					],
					archiveContext: [
						{ required: true, message: '内容不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 档案信息表 
				editForm: {
					id:'',tagNames:'',deptid:'',userid:'',isShare:'',url:'',archiveAbstract:'',archiveContext:'',archiveTitle:'',archivingUserid:'',isFromArchiving:'',archivingDate:'',createDate:'',authorUserid:'',authorName:'',canDel:'',canEdit:'',canRead:'',bizKey:'',encryptType:'',canComment:'',status:'',isStorageDir:'',branchId:'',titleImgUrl:'',type:'',duration:'',tagIds:'',archiveType:'',imageUrls:'',linkArchives:'',readNums:'',commentNums:'',linkAds:'',linkUsers:'',extInfos:'',praiseSum:'',isHot:'',isMain:'',openComment:'',opDate:'',seqNo:'',pbizKey:'',ctime:''
				},
				
				editFormInit: {
					id:'',tagNames:'',deptid:'',userid:'',isShare:'',url:'',archiveAbstract:'',archiveContext:'',archiveTitle:'',archivingUserid:'',isFromArchiving:'',archivingDate:'',createDate:'',authorUserid:'',authorName:'',canDel:'',canEdit:'',canRead:'',bizKey:'',encryptType:'',canComment:'',status:'',isStorageDir:'',branchId:'',titleImgUrl:'',type:'',duration:'',tagIds:'',archiveType:'',imageUrls:'',linkArchives:'',readNums:'',commentNums:'',linkAds:'',linkUsers:'',extInfos:'',praiseSum:'',isHot:'',isMain:'',openComment:'',opDate:'',seqNo:'',pbizKey:'',ctime:''
				},
				editFormBak: {
					id:'',tagNames:'',deptid:'',userid:'',isShare:'',url:'',archiveAbstract:'',archiveContext:'',archiveTitle:'',archivingUserid:'',isFromArchiving:'',archivingDate:'',createDate:'',authorUserid:'',authorName:'',canDel:'',canEdit:'',canRead:'',bizKey:'',encryptType:'',canComment:'',status:'',isStorageDir:'',branchId:'',titleImgUrl:'',type:'',duration:'',tagIds:'',archiveType:'',imageUrls:'',linkArchives:'',readNums:'',commentNums:'',linkAds:'',linkUsers:'',extInfos:'',praiseSum:'',isHot:'',isMain:'',openComment:'',opDate:'',seqNo:'',pbizKey:'',ctime:''
				}, 
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			saveSubmit(){
				if(this.currOpType=='add'){
					this.addSubmit()
				}else{
					this.editSomeFields(this.editForm,'archiveContext',this.editForm.archiveContext);
				}
			},

			addSubmit(){  
				var addParmas={archive:{...this.editForm},categoryId:this.xmMenu.productId}
				addParmas.archive.id=this.xmMenu.menuId
				addParmas.archive.archiveTitle=this.xmMenu.menuName
				addParmas.archive.bizKey=this.xmMenu.menuId
				addParmas.archive.pbizKey=this.xmMenu.productId
				addParmas.archive.archiveType='0'
				addArchive(addParmas).then((res) => {
					this.load.edit = false; 
					var tips=res.data.tips;
					if(tips.isOk){
						this.$emit('submit');//  @submit="aftereditSubmit"
						Object.assign(this.editForm,res.data.data)
						this.editFormBak={...this.editForm}
						this.currOpType="edit"
					}
					
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch(() => {
					this.load.edit = false;
				});
			},
			 
			getArchvieDetail(){
				this.load.list=true
				getOneArchive({id:this.xmMenu.menuId}).then(res=>{
					this.load.list=false
					if(res.data.tips.isOk){
						if(res.data.data && res.data.data.id){
							this.currOpType='edit'
							this.editForm=res.data.data
							this.editFormBak={...this.editForm}
						}else{
							this.currOpType='add'
							Object.assign(this.editForm,this.editFormInit) 
							this.editFormBak={...this.editForm}
						}
						
					}
					
				})
			},
			editSomeFields(row,fieldName,$event){
				if(this.currOpType==='add'){
					return;
				}
				let params={ids:[row.id]}; 
				params[fieldName]=$event
				var func = editSomeFieldsArchive
				func(params).then(res=>{
				let tips = res.data.tips;
				if(tips.isOk){ 
					this.editFormBak={...this.editForm}
					this.$emit('edit-some-fields',this.editForm)
				}else{
					Object.assign(this.editForm,this.editFormBak)
					this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
				}
				}).catch((e)=>Object.assign(this.editForm,this.editFormBak))
			},
			initData(){
				this.getArchvieDetail();
			}
		},//end method
		components: {   
			 VueUeditor
		},
		mounted() { 
			  
			this.$nextTick(() => {
				initDicts(this);
				this.initData()   
			});
			  
			//this.getCategorys(); 
			
		}//end mounted
	}

</script>

<style scoped>

.box{
	padding-top:10px;
	margin-right: 10px;
	margin-left: 10px;
}
.btn-bar{
	align-items: center;
	text-align: center;
}
</style>