<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 PushLink 发布关联，管理端客户管理界面只能看到发布到各自平台的字典--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="item_id" prop="itemId">
					<el-input v-model="editForm.itemId" placeholder="item_id"></el-input>
				</el-form-item> 
				<el-form-item label="发布到目标编号" prop="targetId">
					<el-input v-model="editForm.targetId" placeholder="发布到目标编号"></el-input>
				</el-form-item> 
				<el-form-item label="发布时间" prop="ptime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ptime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { dicts } from '@/api/mdp/meta/item';//字典表
	import { addPushLink,editPushLink } from '@/api/mdp/meta/pushLink';
	import { mapGetters } from 'vuex'
	
	export default {
	    components: {
            //PushLinkEdit,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['pushLink','visible'],

		watch: {
	      'pushLink':function( pushLink ) {
	        if(pushLink){
	            this.editForm = pushLink;
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      		this.initData()
	      	}
	      } 
	    },
		data() {
			return {
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: {id:'',itemCode:'',itemName:'',itemType:'',values:'',names:'','options':[{id:'1',name:'男'},{id:'2',name:'女'}]}}
				editFormRules: {
					itemId: [
						//{ required: true, message: 'item_id不能为空', trigger: 'blur' }
					]
				},

				//编辑界面数据  PushLink 发布关联，管理端客户管理界面只能看到发布到各自平台的字典
				editForm: {
					itemId:'',targetId:'',ptime:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交PushLink 发布关联，管理端客户管理界面只能看到发布到各自平台的字典父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							if(this.opType=='edit' || this.editForm.id){
							    editPushLink(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.$emit('submit');//  @submit="afterEditSubmit"
                                    }
                                    this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}else{
							    addPushLink(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.editForm=res.data.data
                                        this.initData()
                                        this.$emit('submit');//  @submit="afterAddSubmit"
                                    }
                                    this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}
						});
					}
				});
			},
			initData: function(){
                if(this.opType=='edit'){

                }else{

                }
            },
            //下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 [{id:'',itemCode:'',itemName:'',itemType:'',values:'',names:'','options':[{id:'1',name:'男'},{id:'2',name:'女'}]}]
            initDicts(categoryId,itemCodes){
                dicts({categoryId:categoryId,itemCodes:itemCodes}).then(res=>{
                    if(res.data.tips.isOk){
                        var data=res.data.data
                        data.forEach(dict=>{
                            if(dict.options){
                                dict.options=JSON.parse(dict.options)
                            }else{
                               dict.options=[]
                            }
                            this.dicts[dict.itemCode]=dict
                        })
                    }
                });
            },
			/**begin 在下面加自定义方法**/

		},//end method
		mounted() {
		    //this.initDicts('all',['sex','gradeLvl']);
		    if(this.pushLink){
		        this.editForm=this.pushLink;
			}
            this.initData()

		}
	}

</script>

<style scoped>

</style>