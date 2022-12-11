<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmMenuComment 档案评论表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="评论人" prop="userid">
					<el-input v-model="editForm.userid" placeholder="评论人" :maxlength="50" @change="editSomeFields(editForm,'userid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="评论人姓名" prop="username">
					<el-input v-model="editForm.username" placeholder="评论人姓名" :maxlength="50" @change="editSomeFields(editForm,'username',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="星级" prop="star">
					<el-input v-model="editForm.star" placeholder="星级" :maxlength="1" @change="editSomeFields(editForm,'star',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="时间" prop="cdate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.cdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="需求编号" prop="menuId">
					<el-input v-model="editForm.menuId" placeholder="需求编号" :maxlength="50" @change="editSomeFields(editForm,'menuId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="上级评论" prop="pid">
					<el-input v-model="editForm.pid" placeholder="上级评论" :maxlength="50" @change="editSomeFields(editForm,'pid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="点赞数量" prop="ups">
					<el-input v-model="editForm.ups" placeholder="点赞数量" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="是否显示0否1是" prop="isShow">
					<el-input v-model="editForm.isShow" placeholder="是否显示0否1是" :maxlength="1" @change="editSomeFields(editForm,'isShow',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="回复用户编号" prop="toUserid">
					<el-input v-model="editForm.toUserid" placeholder="回复用户编号" :maxlength="50" @change="editSomeFields(editForm,'toUserid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="回复用户名" prop="toUsername">
					<el-input v-model="editForm.toUsername" placeholder="回复用户名" :maxlength="50" @change="editSomeFields(editForm,'toUsername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="层级0,1,2,3,4" prop="lvl">
					<el-input v-model="editForm.lvl" placeholder="层级0,1,2,3,4" :maxlength="1" @change="editSomeFields(editForm,'lvl',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="评论内容" prop="context">
					<el-input v-model="editForm.context" placeholder="评论内容" :maxlength="65535" @change="editSomeFields(editForm,'context',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="ip地址" prop="ip">
					<el-input v-model="editForm.ip" placeholder="ip地址" :maxlength="50" @change="editSomeFields(editForm,'ip',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="城市编号" prop="cityId">
					<el-input v-model="editForm.cityId" placeholder="城市编号" :maxlength="50" @change="editSomeFields(editForm,'cityId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="城市名称" prop="cityName">
					<el-input v-model="editForm.cityName" placeholder="城市名称" :maxlength="50" @change="editSomeFields(editForm,'cityName',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="状态0未审核，1已审核，3审核不通过" prop="status">
					<el-input v-model="editForm.status" placeholder="状态0未审核，1已审核，3审核不通过" :maxlength="1" @change="editSomeFields(editForm,'status',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="儿子节点数量" prop="childNums">
					<el-input-number v-model="editForm.childNums" :min="0" :max="200"></el-input-number>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row v-if="opType=='add'" class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addXmMenuComment,editXmMenuComment,editSomeFieldsXmMenuComment } from '@/api/xm/core/xmMenuComment';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmMenuCommentEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmMenuComment','visible','opType'],

		watch: {
	      'xmMenuComment':function( xmMenuComment ) {
	        if(xmMenuComment){
	            this.editForm = {...xmMenuComment};
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
 	      		this.initData()
	      	}
	      } 
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',userid:'',username:'',star:'',cdate:'',menuId:'',pid:'',ups:'',isShow:'',toUserid:'',toUsername:'',lvl:'',context:'',branchId:'',ip:'',cityId:'',cityName:'',status:'',childNums:''
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmMenuComment 档案评论表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmMenuComment
							if(this.currOpType=='edit'){
							    func=editXmMenuComment
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.data.tips;
                                if(tips.isOk){
                                    this.editForm=res.data.data
                                    this.initData()
                                    this.currOpType="edit";
                                    this.$emit('submit');//  @submit="afterAddSubmit"
                                }
                                this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmMenuComment){
                    this.editForm = Object.assign({},this.xmMenuComment);
                }

                if(this.opType=='edit'){

                }else{

                }
                this.editFormBak={...this.editForm}
            },

            editSomeFields(row,fieldName,$event){
                if(this.opType=='add'){
                    return;
                }
                let params={};
                params['ids']=[row].map(i=>i.id)
                params[fieldName]=$event
                var func = editSomeFieldsXmMenuComment
                func(params).then(res=>{
                  let tips = res.data.tips;
                  if(tips.isOk){
                    this.editFormBak=[...this.editForm]
                  }else{
                    Object.assign(this.editForm,this.editFormBak)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
            },
		},//end method
		mounted() {
		    this.$nextTick(() => {
                initDicts(this);
                this.initData()
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style scoped>

</style>