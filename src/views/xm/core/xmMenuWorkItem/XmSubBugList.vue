<template>
    <el-row v-show="parentXmMenu.dclass==='3' && xmBugs.length>0">
      <el-row>
        <el-table :data="xmBugs" :max-height="400" @selection-change="selsChange" @row-click="rowClick">
          <el-table-column type="selection" label="全选"></el-table-column>
          <el-table-column prop="name" label="名称" min-width="350px">
              <template slot-scope="scope">
					<div class="cell-box">
                       <div class="icon" :style="{backgroundColor:  '#F56C6C'}">
						<i  style="width:20px;" class="el-icon-warning" ></i>
                      </div>
					  <el-link @click="showEdit( scope.row,scope.$index)"  title="编辑任务">{{scope.row.sortLevel}}&nbsp;{{scope.row.name}}</el-link>



                    <div class="cell-bar">
                           <el-button @click="copyOne(scope.row,scope.$index)" icon="el-icon-document-copy" circle title="复制一行"></el-button>
                   </div>
                  </div>
			  </template>
            </el-table-column>

					<el-table-column prop="bugStatus" label="状态"  width="100">
						<template slot-scope="scope">
										 <mdp-select show-style="tag" @visible-change="selectVisible(scope.row,$event)" item-code="bugStatus"    v-model="scope.row.bugStatus" placeholder="类型"  style="display:block;"  @change="editXmQuestionSomeFields(scope.row,'bugStatus',$event)">
 										 </mdp-select>
						</template>
					</el-table-column>

					<el-table-column prop="budgetWorkload" label="工时"  width="100">
						<template slot-scope="scope">
									<div class="cell-text">
										 {{scope.row.budgetWorkload}}&nbsp;/&nbsp;{{scope.row.actWorkload}}
									</div>
									<span class="cell-bar">
										  <el-button @click="workloadRecord('actWorkload',scope.row)">登记工时</el-button>
									</span>
						</template>
					</el-table-column>
					<el-table-column prop="priority" label="优先级"  width="100">
						<template slot-scope="scope">
										 <mdp-select show-style="tag" @visible-change="selectVisible(scope.row,$event)" item-code="priority"    v-model="scope.row.priority" placeholder="优先级"  style="display:block;"  @change="editXmQuestionSomeFields(scope.row,'priority',$event)">
 										 </mdp-select>
						</template>
					</el-table-column>
					<el-table-column prop="solution" label="解决方案"  width="100">
						<template slot-scope="scope">
										 <mdp-select show-style="tag" @visible-change="selectVisible(scope.row,$event)" item-code="bugSolution"   v-model="scope.row.solution" placeholder="类型"  style="display:block;"  @change="editXmQuestionSomeFields(scope.row,'solution',$event)">
 										 </mdp-select>
						</template>
					</el-table-column>
					<el-table-column prop="handlerUsername" label="负责人"  width="100" show-overflow-tooltip>
						<template slot-scope="scope">
								<mdp-select-user show-style="tag" @visible-change="selectVisible(scope.row,$event)" v-model="scope.row.handlerUserid" :init-name="scope.row.handlerUsername" @change="editXmTaskSomeFields(scope.row,'handlerUserid',$event)"></mdp-select-user>

						</template>
					</el-table-column>
        </el-table>
      </el-row>
      <xm-group-dialog ref="xmGroupDialog" :sel-project=" {id:linkProjectId} " :is-select-single-user="1" @user-confirm="onUserConfirm"></xm-group-dialog>
	        <el-dialog :title="'新增缺陷'" :visible.sync="addFormVisible" append-to-body modal-append-to-body>
          <el-form :model="addForm" :rules="addFormRules" ref="addForm">
            <el-form-item  prop="name">
				<template slot="label">
				<div class="icon" style="background-color: #F56C6C;">
					<i class="el-icon-warning"></i>
					</div>
					缺陷名称
			</template>
              <el-input v-model="addForm.name" autocomplete="off" ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addFormVisible = false">关 闭</el-button>
            <el-button type="primary" @click="addXmBug" v-loading="load.edit" :disabled="load.edit">确 定</el-button>
          </div>
      </el-dialog>
		<!--编辑 XmQuestion xm_question界面-->
		<el-dialog  title="编辑缺陷"   :visible.sync="editFormVisible"   width="90%"  top="20px"  :close-on-click-modal="false" append-to-body>
				<xm-question-edit :sel-project=" {id:editForm.projectId,name:editForm.projectName} " :xm-question="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" @edit-fields="afterEditSubmit"></xm-question-edit>
		</el-dialog>
    </el-row>
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库

 	import { listXmQuestion ,addXmQuestion,batchDelXmQuestion,editXmQuestionSomeFields} from '@/api/xm/core/xmQuestion';

	import XmGroupDialog from '../xmGroup/XmGroupDialog';
	import { mapGetters } from 'vuex'


export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]),

			calcMenuLabel(){
				var params={label:'工作项',icon:'',color:''};
				if(this.parentXmMenu.dclass==='0'){
					params={label:'史诗',icon:'el-icon-s-promotion',color:'rgb(255, 153, 51)'};
				}else if(this.parentXmMenu.dclass==='1'){
					params={label:'特性',icon:'el-icon-s-flag',color:'rgb(0, 153, 51)'};
				}else if(this.parentXmMenu.dclass==='2'){
					params={label:'故事',icon:'el-icon-document',color:' rgb(79, 140, 255)'};
				}
				return params;
			},
  },
  props: [
    'parentXmMenu','linkProjectId'
  ],
  watch: {
    'parentXmMenu':function(){
      this.initData();
    },
    'xmBugs':function(){
      this.$emit("bugs-change",this.xmBugs)
    }

  },
  data() {
    return{
      load:{edit:false,list:false,add:false,del:false,},
      xmBugs:[],
		editForm: {
			id:'',name:'',projectId:'',projectName:'',taskId:'',taskName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',processTime:'',receiptMessage:'',receiptTime:'',description:'',createUserid:'',createUsername:'',createTime:'',bugStatus:'',receiptMessage:'',
			iterationId:'',iterationName:'',productId:'',
			qtype:'',
			attachment: [],
			repRate:'',
			verNum:'',
			bugReason:'',
		},
	  addForm:{name:''},
	  editFormVisible:false,
	  addFormVisible:false,
	  addFormRules:{
		  name:[
			  {required:true,message:'名称不能为空',trigger:'change'},
			  { min: 5, max: 250, message: '名称长度在 5 到 250 个字符', trigger: 'change' },//长度
		  ]
	  },
      sels:[],
      dicts:{
					priority:[],
					bugSeverity:[],
					bugSolution:[],
					bugStatus:[],
					bugType:[],
				},

    }
  }, //end data
  methods: {
    ...util,
    selectVisible(row,visible){
      if(visible){
        this.rowClick(row)
      }
    },
			showGroupUsers:function(userType,row){
 				this.$refs.xmGroupDialog.open({data:row,action:userType})
			},
			rowClick: function(row, event, column){
				this.editForm=row;
				this.editFormBak=Object.assign({},this.editForm)
			},
			//选择行xmQuestion
			selsChange: function (sels) {
				this.sels = sels;
			},
    getXmBugs(){
      listXmQuestion({menuId:this.parentXmMenu.menuId}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          this.xmBugs=res.data.data
        }else{
          this.xmBugs=[];
        }
      })
    },
     afterEditSubmit(row){
		Object.assign(this.editForm,row)
	 },
    initData(){
      this.xmBugs=[]
      if(!this.parentXmMenu || !this.parentXmMenu.menuId){
        return;
      }
      var dclass=this.parentXmMenu.dclass;
      if(dclass==='3'){
        this.getXmBugs();
      }
    },
    addXmBug(){
		this.$refs.addForm.validate().then(res=>{
       var question={menuId:this.parentXmMenu.menuId,menuName:this.parentXmMenu.menuName,productId:this.parentXmMenu.productId,iterationId:this.parentXmMenu.iterationId,iterationName:this.parentXmMenu.iterationName}
             question.priority='3'
             question.verNum=this.parentXmMenu.sinceVersion;
             question.pverNum=this.parentXmMenu.sinceVersion;
             question.askUserid=this.userInfo.userid
             question.askUsername=this.userInfo.username
             question.qtype="1"
             question.id=null;
             question.name=this.addForm.name
             question.projectId=this.linkProjectId
             question.bugStatus="1"
			 this.load.edit=true;
             addXmQuestion(question).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
                   this.xmBugs.push(res.data.data)
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
		})
    },
      showAdd() {
          this.addFormVisible=true;
    },

			batchDel: function () {
				if(this.sels.length<=0){
					this.$notify({position:'bottom-left',showClose:true,message:"请选择要删除的缺陷", type: "error"});
					return ;
				}
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmQuestion(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.getXmBugs();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},

			editXmQuestionSomeFields(row,fieldName,$event){

				var params={ids:[row.id]};
				if(this.sels.length>0){
					if(!this.sels.some(k=>k.id==row.id)){
						this.$notify({position:'bottom-left',showClose:true,message:'请操作选中的行或者取消选中的行再操作其它行',type:'warning'})
						return;
					}
					params.ids=this.sels.map(i=>i.id)
				}
				if(fieldName==='handlerUserid'){
					if($event){
						params[fieldName]=$event.userid;
						params.handlerUsername=$event.username
					}else{
						return;
					}
				}else if(fieldName==='tagIds'){
					if($event){
						params[fieldName]=$event.map(i=>i.tagId).join(",");
						params.tagNames=$event.map(i=>i.tagName).join(",");
					}else{
						return;
					}
				}else if(fieldName==='workload'){
					params={...params,...$event}
				}else if(fieldName==='projectId'){
					params.projectId=$event.id
				}else if(fieldName==='productId'){
					params.productId=$event.id
				}else{
					params[fieldName]=$event
				}

				editXmQuestionSomeFields(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						if(this.sels.length>0){
							 this.sels.forEach(i=>{
								Object.assign(i,params)
							 })
						}else{
							Object.assign(row,params)
						}
						Object.assign(this.editFormBak,this.editForm)
					}else{
						Object.assign(this.editForm,this.editFormBak)
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				})
			},

			showEdit(row,index){
				this.editForm=row
				this.editFormVisible=true
			},

			onUserConfirm:function(groupUsers,option){
				 if(option.action=='editHandlerUserid'){
					 this.editXmQuestionSomeFields(option.data,"handlerUserid",groupUsers)
					 return;
				}
 				this.getXmBugs();

			},
			copyOne(row,index){

				var params={...row}
				params.id=null;
				params.createUserid=this.userInfo.userid
				params.createUsername=this.userInfo.username
				params.bugStatus="1"
				params.name=row.name+'V'
				addXmQuestion(params).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){
						var row2=res.data.data
						this.xmBugs.splice(index+1,0,row2)
						//this.pageInfo.total=this.pageInfo.total+1
						this.$message.success("复制成功")
					}else{
						this.$message.error(tips.msg)
					}
				})
			}
  }, //end methods
  components: {
    XmGroupDialog,'xm-question-edit':()=>import('../xmQuestion/XmQuestionEdit'),
  },
  mounted() {
    this.initData();
  },
};
</script>

<style lang="less" scoped>
    .my-cell-bar{
    display: none;
  }

.el-table__row td:hover{
	.my-cell-bar{
    width:90%;
    padding-right:0px;
		display: inline-block;
	}
  .my-cell-text{
    display:none;
  }
}
</style>
