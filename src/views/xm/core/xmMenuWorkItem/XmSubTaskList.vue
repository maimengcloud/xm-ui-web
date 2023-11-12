<template>
    <el-row v-show="parentXmMenu.dclass==='3' && xmTasks.length>0">
      <el-row>
        <el-table :data="xmTasks"  :max-height="400" v-loading="load.list" @selection-change="selsChange" @row-click="rowClick">
          <el-table-column type="selection" label="全选"></el-table-column>
          <el-table-column prop="name" label="名称" min-width="350">
                <template slot-scope="scope">
                  <div class="cell-box">
                       <div class="icon" :style="{backgroundColor:  scope.row.ntype==='1'?'#E6A23C':'#1CC7EA'}"><i  style="width:20px;" :class="scope.row.ntype==='1'?'el-icon-time':'el-icon-s-operation'" ></i>
                      </div>
                       <el-link @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit" title="编辑任务" >{{scope.row.sortLevel}}&nbsp;{{scope.row.name}}</el-link>

                    <div class="cell-bar">
                           <el-button @click="copyOne(scope.row,scope.$index)" icon="el-icon-document-copy" circle title="复制一行"></el-button>
                   </div>
                  </div>
                 </template>
              </el-table-column>
              <el-table-column
                label="状态"
                type="taskState"
                width="100"
              >
								<template slot-scope="scope">
										 <mdp-select show-style="tag"  @visible-change="selectVisible(scope.row,$event)" :dict="dicts.taskState"   v-model="scope.row.taskState" placeholder="任务状态"  style="display:block;"  @change="editXmTaskSomeFields(scope.row,'taskState',$event)">
 										 </mdp-select>
 								</template>
              </el-table-column>

            <el-table-column prop="budgetWorkload" label="工时"  width="100">
              <template slot-scope="scope">
                    <div class="cell-text">
                      <span title="实际工时 / 预估工时 " >{{scope.row.actWorkload>0?scope.row.actWorkload:0}}&nbsp;/&nbsp;{{scope.row.budgetWorkload>0?scope.row.budgetWorkload:0}}</span>

                    </div>
                    <span class="cell-bar">
                        <el-button @click="workloadRecord(scope.row)">登记工时</el-button>
                    </span>
              </template>
            </el-table-column>
            <el-table-column prop="rate" label="进度"  width="100">
              <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.rate >= 100 ? 'success' : 'warning'"
                  >
                    {{ (scope.row.rate != null ? scope.row.rate : 0) + "%" }}
                  </el-tag>
              </template>
            </el-table-column>
              <el-table-column
                label="优先级"
                type="level"
                width="100"
              >
								<template slot-scope="scope">
										 <mdp-select show-style="tag"  @visible-change="selectVisible(scope.row,$event)"  :dict="dicts.priority"   v-model="scope.row.level" placeholder="优先级"  style="display:block;"  @change="editXmTaskSomeFields(scope.row,'level',$event)">
 										 </mdp-select>
 								</template>
              </el-table-column>
              <el-table-column
                sortable
                prop="createUsername"
                label="负责人"
                width="120"
                show-overflow-tooltip
              >
								<template slot-scope="scope">
                  <mdp-select-user show-style="tag" @visible-change="selectVisible(scope.row,$event)" v-model="scope.row.createUserid" :init-name="scope.row.createUsername" @change2="editXmTaskSomeFields(scope.row,'creatorUserid',$event)"></mdp-select-user>

								</template>
              </el-table-column>
              <el-table-column
                sortable
                prop="executorUsername"
                label="执行人"
                width="120"
                show-overflow-tooltip
              >
								<template slot-scope="scope">
                  <mdp-select-user show-style="tag"  @visible-change="selectVisible(scope.row,$event)" v-model="scope.row.executorUserid" :init-name="scope.row.executorUsername" @change2="selectExecUserConfirm(scope.row,'executorUserid',$event)"></mdp-select-user>
								</template>
              </el-table-column>
        </el-table>
      </el-row>

    <!--编辑 XmTask xm_task界面-->
    <el-dialog
      title="编辑任务"
      :visible.sync="editFormVisible"
      width="90%"
      top="20px"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-edit
        v-if="editForm && editForm.id"
        :xm-project="{id:editForm.projectId,name:editForm.projectName}"
        :xm-task="editForm"
        :visible="editFormVisible"
        @cancel="editFormVisible = false"
        @submit="afterEditSubmit"
        @edit-fields="afterEditSubmit"
      ></xm-task-edit>
      </el-dialog>
      <el-dialog title="新增任务" :visible.sync="addFormVisible" append-to-body modal-append-to-body>
          <el-form :model="addForm" :rules="addFormRules" ref="addForm">
            <el-form-item label="上级计划" prop="parentTaskname">
              {{addForm.parentTaskname?addForm.parentTaskname:'无上级'}}
									<el-button
										@click="selectParentTaskVisible=true"
										title="选择上级计划"
                    type="text"
										icon="el-icon-upload2"
									> 选择上级计划 </el-button>
            </el-form-item>
            <el-form-item label="任务名称" prop="name">

            <template slot="label">
            <div class="icon" style="background-color:  #1CC7EA;">
              <i class="el-icon-s-operation"></i>
            </div>
              任务名称
          </template>
              <el-input v-model="addForm.name" autocomplete="off" ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
             <el-button  @click="addFormVisible=false">关闭</el-button>
            <el-button type="primary" @click="addXmTask" v-loading="load.edit" :disabled="load.edit">确 定</el-button>
          </div>
      </el-dialog>


      <el-dialog title="选择新的上级计划" append-to-body :visible.sync="selectParentTaskVisible" width="60%" top="20px">
        <xm-phase-select :sel-project="{id:this.linkProjectId,name:''}"   @select="onSelectedParentTask"></xm-phase-select>
      </el-dialog>
      <xm-workload-record-dialog ref="workloadRecordDialog" @submi="afterWorkloadSubmit" @edit-xm-task-some-fields="onEditXmTaskSomeFields" @submit="onWorkloadSubmit"></xm-workload-record-dialog>
    </el-row>
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库

 	import { listXmTask ,addTask,editXmTaskSomeFields,batchDelXmTask } from '@/api/xm/core/xmTask';

	import  XmGroupDialog from '@/views/xm/core/xmGroup/XmGroupDialog';//修改界面
	import { mapGetters } from 'vuex'
import XmWorkloadRecordDialog from '../xmWorkload/XmWorkloadRecordDialog.vue';

	import XmPhaseSelect from "../xmTask/XmPhaseSelect.vue";
	import { addXmTaskExecuser } from '@/api/xm/core/xmTaskExecuser';


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
    'xmTasks':function(){
      this.$emit("tasks-change",this.xmTasks)
    }

  },
  data() {
    return{
      load:{edit:false,list:false,add:false,del:false,},
      xmTasks:[],

      //编辑xmTask界面初始化数据
      editForm: {
        id: "",
        name: "",
        parentTaskid: "",
        parentTaskname: "",
        projectId: "",
        projectName: "",
        level: "",
        sortLevel: "",
        executorUserid: "",
        executorUsername: "",
        preTaskid: "",
        preTaskname: "",
        startTime: "",
        endTime: "",
        milestone: "",
        description: "",
        remarks: "",
        createUserid: "",
        createUsername: "",
        createTime: "",
        rate: "",
        budgetAt: "",
        budgetWorkload: "",
        actAt: "",
        actWorkload: "",
        taskState: "",
        taskType: "",
        taskClass: "",
        toTaskCenter: "",
        actStartTime: "",
        actEndTime: "",
        uniInnerPrice:80,uniOutPrice:100,
      },
      editFormVisible:false,
      addForm:{name:'',parentTaskid:'',parentTaskname:''},
      addFormRules: {
					name: [
						{ required: true, message: '任务名称不能为空', trigger: 'change' },
						{ min: 2, max: 150, message: '任务名称长度在 2 到 150 个字符', trigger: 'change' },//长度
					],
				},
      addFormVisible:false,
      sels:[],
      dicts: {
        priority: [],
        taskType: [],
        planType: [],
        priority: [],
        xmTaskSettleSchemel: [],
        taskState:[],
      }, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      selectParentTaskVisible:false,


    }
  }, //end data
  methods: {
    selectVisible(row,visible){
      if(visible){
        this.rowClick(row)
      }
    },
    //选择行xmTask
    selsChange: function (sels) {
      this.sels = sels;
    },
    getXmTasks(){
      listXmTask({menuId:this.parentXmMenu.menuId}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          this.xmTasks=res.data.data
        }else{
          this.xmTasks=[];
        }
      })
    },
     workloadRecord(row){
       this.editForm=row
       this.$refs.workloadRecordDialog.open(row)
     },
    initData(){
      this.xmTasks=[]
      if(!this.parentXmMenu || !this.parentXmMenu.menuId){
        return;
      }
      var dclass=this.parentXmMenu.dclass;
      if(dclass==='3'){
        this.getXmTasks();
      }
    },
    addXmTask(){
      this.$refs.addForm.validate().then(valid=>{
       var task={...this.addForm,menuId:this.parentXmMenu.menuId,menuName:this.parentXmMenu.menuName,productId:this.parentXmMenu.productId,iterationId:this.parentXmMenu.iterationId,iterationName:this.parentXmMenu.iterationName}
             task.priority='3'
             task.verNum=this.parentXmMenu.sinceVersion;
             task.pverNum=this.parentXmMenu.sinceVersion;
             task.createUserid=this.userInfo.userid
             task.createUsername=this.userInfo.username
             task.qtype="1"
             task.ntype="0"
             task.ptype="0"
             task.id=null;
             task.sortLevel=this.parentXmMenu.seqNo
             task.projectId=this.linkProjectId
             this.load.edit=true;
             addTask(task).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
                   this.xmTasks.push(res.data.data)
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
        })
    },
      showAdd() {
        this.addForm.name=this.parentXmMenu.menuName
        this.addFormVisible=true;
        this.addForm.parentTaskid=''
        this.addForm.parentTaskname=''
    },

    showEdit(row,index){
      this.editForm=row
      this.editFormVisible=true
    },

    afterEditSubmit(row){
      Object.assign(this.editForm,row)
    },
			editXmTaskSomeFields(row,fieldName,$event){
				var params={ids:[row.id]};
				if(this.sels.length>0){
					if(!this.sels.some(k=>k.id==row.id)){
						this.$notify({position:'bottom-left',showClose:true,message:'请操作选中的行或者取消选中的行再操作其它行',type:'warning'})
						return;
					}
					params.ids=this.sels.map(i=>i.id)
				}
				if(fieldName==='menuId'){
					if($event){
						params[fieldName]=$event.menuId;
						params.menuName=$event.menuName
            params.productId=$event.productId
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
				}else if(fieldName==='executorUserid'){
					params.executorUserid=$event.userid
					params.executorUsername=$event.username
				}else if(fieldName==='createUserid'){
					params.createUserid=$event.userid
					params.createUsername=$event.username
				}else{
					params[fieldName]=$event
				}

				editXmTaskSomeFields(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						if(this.sels.length>0){
							 this.sels.forEach(i=>{
								 this.fieldTagVisible=false;
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

    //批量删除xmTask
    batchDel: function () {
      if(this.sels.length==0){
        this.$notify.warning("请先选中要删除的记录")
        return;
      }
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        batchDelXmTask(this.sels)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
							this.getXmTasks()
            }
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    rowClick: function (row) {
      this.editForm = row;
		  this.editFormBak=Object.assign({},this.editForm)
      // this.$emit('row-click',row,);//  @row-click="rowClick"
    },

			formatterPriorityDicts(cellValue){
				if(!cellValue && cellValue!=='0'){
					return []
				}
				var key="priority";
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return [{id:cellValue,name:cellValue,className:'primary'}];
				}
				var list=this.dicts[key].filter(i=>i.id==cellValue)
				if(list.length>0){
					var data= {...list[0],className:'primary'}
					if(data.id=='0'){
						data.className='danger'
					}else if(data.id=='1'){
						data.className='warning'
					}else if(data.id=='2'){
						data.className='success'
					}else if(data.id=='3'){
						data.className='primary'
					}else if(data.id=='4'){
						data.className='info'
					}else{
						data.className='primary'
					}
					return [data];
				}else{
					return [{id:cellValue,name:cellValue,className:'primary'}]
				}

			},
			formatterTaskStateDicts: function(cellValue){
				if(!cellValue && cellValue!=='0'){
					return []
				}
				var key="taskState";
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return [{id:cellValue,name:cellValue,className:'primary'}];
				}
				var list=this.dicts[key].filter(i=>i.id==cellValue)
				if(list.length>0){
					var data= {...list[0],className:'primary'}
					if(data.id=='0'){
						data.className='primary'
					}else if(data.id=='1'){
						data.className='warning'
					}else if(data.id=='2'){
						data.className='success'
					}else if(data.id=='3'){
						data.className='info'
					} else{
						data.className='danger'
					}
					return [data];
				}else{
					return [{id:cellValue,name:cellValue,className:'primary'}]
				}

			},
      afterWorkloadSubmit(xmTask){

      },
      afterEditSubmit(row){
        Object.assign(this.editForm,row)
      },

			onEditXmTaskSomeFields(data){

        Object.assign(this.editForm,data)
				this.$emit('edit-xm-task-some-fields',data);
			},
      onWorkloadSubmit(data){
         Object.assign(this.editForm,data)
        this.$emit('workload-submit',data)
      },
      onSelectedParentTask(task){
        this.addForm.parentTaskid=task.id
        this.addForm.parentTaskname=task.name
        this.selectParentTaskVisible=false
      },

    //查询时选择责任人
    selectExecUserConfirm(row,fieldName,users) {

        var user= users[0];
        var params={}
        params.taskId = row.id;
        params.projectId=row.projectId
        params.projectName=row.projectName
        params.taskName=row.name
        params.quoteStartTime=row.startTime
        params.quoteEndTime=row.endTime
        params.quoteAmount=row.budgetAt
        params.quoteWorkload=row.budgetWorkload
        params.userid=user.userid
        params.username=user.username
        addXmTaskExecuser(params).then(res=>{
          var tips = res.data.tips
          if(tips.isOk){
            row.executorUserid=user.userid
            row.executorUsername=user.username
            row.exeUserids=user.userid
            row.exeUsernames=user.username
          }else{
            row.executorUserid=this.editFormBak.executorUserid
            row.executorUsername=this.editFormBak.executorUsername
            this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:'error'})
          }
        })

    },

			copyOne(row,index){

				var params={...row}
				params.id=null;
				params.createUserid=this.userInfo.userid
				params.createUsername=this.userInfo.username
        params.executorUserid=null
        params.executorUseranme=null
        params.execUserids=null;
        params.execUsername=null;
        params.actWorkload=null;
        params.actAt=null;
        params.efunds=0
				params.name=row.name+'V'
				addTask(params).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){
						var row2=res.data.data
						this.xmTasks.splice(index+1,0,row2)
						this.pageInfo.total=this.pageInfo.total+1
						this.$message.success("复制成功")
					}else{
						this.$message.error(tips.msg)
					}
				})
			}
  }, //end methods
  components: {
    XmWorkloadRecordDialog,XmGroupDialog,'xm-task-edit':()=>import('../xmTask/XmTaskEdit'),XmPhaseSelect,
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
