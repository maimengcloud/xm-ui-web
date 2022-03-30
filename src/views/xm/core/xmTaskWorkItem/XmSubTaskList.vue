<template>
    <el-row  v-show="xmTasks.length>0">
      <el-row> 
        <span style="float:right;">
          <el-button @click="batchDel" type="danger" icon="el-icon-delete" plain></el-button>
        </span>
      </el-row>
      <el-row>
        <el-table :data="xmTasks"  :max-height="400" v-loading="load.list" @selection-change="selsChange" @row-click="rowClick">
          <el-table-column type="selection" label="全选"></el-table-column>
          <el-table-column prop="name" label="名称"> 
                <template slot-scope="scope">
                  <div    class="icon" :style="{backgroundColor:  scope.row.ntype==='1'?'#E6A23C':'#409EFF'}">
									<i :class="scope.row.ntype==='1'?'el-icon-odometer':'el-icon-s-operation'" ></i>
									</div>  {{scope.row.name}}
                </template>
          </el-table-column>
              <el-table-column
                label="状态"
                type="taskState"
                width="100"
              >  
								<template slot-scope="scope">
									<div class="cell-text">
										<el-button style="display:block;" :type="item.className" plain round v-for="(item,index) in formatterTaskStateDicts(scope.row.taskState)" :key="index">{{item.name}}</el-button>
									</div>
									<span class="cell-bar">
										 <el-select  v-model="scope.row.taskState" placeholder="任务状态"  style="display:block;"  @change="editXmTaskSomeFields(scope.row,'taskState',$event)">
												<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.taskState" :key="index"></el-option>
										 </el-select>
									</span>
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
              
              <el-table-column
                label="优先级"
                type="level"
                width="100"
              >  
								<template slot-scope="scope">
									<div class="cell-text">
										<el-button style="display:block;" :type="item.className" plain round v-for="(item,index) in formatterPriorityDicts(scope.row.level)" :key="index">{{item.name}}</el-button>
									</div>
									<span class="cell-bar">
										 <el-select  v-model="scope.row.level" placeholder="优先级"  style="display:block;"  @change="editXmTaskSomeFields(scope.row,'level',$event)">
												<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.priority" :key="index"></el-option>
										 </el-select>
									</span>
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
									<div class="cell-text">
										{{scope.row.createUsername}}
									</div>
									<span class="cell-bar">
										 <el-button @click="$refs.xmGroupDialog.open({data:scope.row,action:'createUserid'})">选负责人</el-button>
									</span>
								</template>
              </el-table-column>
        </el-table> 
      </el-row>
      <el-dialog :title="ntype==='0'?'新增任务':'新增计划'" :visible.sync="addFormVisible" append-to-body modal-append-to-body>
          <el-form :model="editForm" :rules="addFormRules">
            <el-form-item label="任务名称">
              
                <template slot="label">
                  <div    class="icon" :style="{backgroundColor:   ntype==='1'?'#E6A23C':'#409EFF'}">
									<i :class=" ntype==='1'?'el-icon-odometer':'el-icon-s-operation'" ></i>
									</div>  {{ntype==='1'?'计划名称':'任务名称'}}
                </template>
              <el-input v-model="addForm.name" autocomplete="off" ></el-input>
            </el-form-item> 
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addXmTask">确 定</el-button>
          </div>
      </el-dialog>
 			<xm-group-dialog ref="xmGroupDialog" :isSelectSingleUser="true" :sel-project="linkProjectId?{id:linkProjectId}:null" :xm-product="parentXmTask?{id:parentXmTask.productId}:null" @user-confirm="selectCreateUserConfirm">
			</xm-group-dialog>  
      <xm-task-workload-record-dialog ref="workloadRecordDialog" @submi="afterWorkloadSubmit" @edit-xm-task-some-fields="onEditXmTaskSomeFields" @submit="onWorkloadSubmit"></xm-task-workload-record-dialog>
    </el-row> 
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
 import { initSimpleDicts } from '@/api/mdp/meta/item'; //下拉框数据查询 
 	import { listXmTask ,addTask,editXmTaskSomeFields,batchDelXmTask } from '@/api/xm/core/xmTask';

	import  XmGroupDialog from '@/views/xm/core/xmGroup/XmGroupDialog';//修改界面
	import { mapGetters } from 'vuex'
import XmTaskWorkloadRecordDialog from '../xmTaskWorkload/XmTaskWorkloadRecordDialog.vue';

export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]), 
    
			calcMenuLabel(){ 
				var params={label:'工作项',icon:'',color:''};
				if(this.parentXmTask.dclass==='0'){
					params={label:'史诗',icon:'el-icon-s-promotion',color:'rgb(255, 153, 51)'};
				}else if(this.parentXmTask.dclass==='1'){
					params={label:'特性',icon:'el-icon-s-flag',color:'rgb(0, 153, 51)'};
				}else if(this.parentXmTask.dclass==='2'){
					params={label:'故事',icon:'el-icon-document',color:' rgb(79, 140, 255)'};
				} 
				return params;
			},  
  },
  props: [ 
    'parentXmTask','linkProjectId'
  ],
  watch: { 
    'parentXmTask.id':function(){
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
      editForm:{},
      addForm:{name:''},
      addFormRules:{
					name: [
						{ required: true, message: '任务名称不能为空', trigger: 'change' }
					],
      },
      sels:[],
      dicts: {
        priority: [],
        taskType: [],
        planType: [],
        priority: [],
        xmTaskSettleSchemel: [],
        taskState:[],
      }, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      addFormVisible:false,
      ntype:'1',

    }
  }, //end data
  methods: { 
    
    //选择行xmTask
    selsChange: function (sels) {
      this.sels = sels;
    },
    getXmTasks(){
      listXmTask({parentTaskid:this.parentXmTask.id}).then(res=>{
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
      if(!this.parentXmTask || !this.parentXmTask.id){
        return;
      }
        this.getXmTasks();
    }, 
    addXmTask(){ 
       var task={...this.parentXmTask,name:this.addForm.name,id:null,parentTaskid:this.parentXmTask.id,parentTaskname:this.parentXmTask.name}
             task.priority='3'
             task.verNum=this.parentXmTask.sinceVersion;
             task.pverNum=this.parentXmTask.sinceVersion;
             task.createUserid=this.userInfo.userid
             task.createUsername=this.userInfo.username 
             task.qtype="1"
             task.ntype=this.ntype
             task.ptype="0"
             task.id=null; 
             addTask(task).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
                   this.addFormVisible=false;
                   this.xmTasks.push(res.data.data)
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
    },  
      showAdd(ntype) {
        this.ntype=ntype; 
        this.addFormVisible=true;
        
    },
    
    //查询时选择责任人
    selectCreateUserConfirm(groupUsers,option) {
      if(option && option.action==='createUserid'){
        if (groupUsers && groupUsers.length > 0) {
          var user= groupUsers[0];
          this.editXmTaskSomeFields(option.data,option.action,user)
        }  
      }
      
    },
			editXmTaskSomeFields(row,fieldName,$event){
				var params={ids:[row.id]};
				if(this.sels.length>0){
					if(!this.sels.some(k=>k.id==row.id)){
						this.$notify({showClose:true,message:'请操作选中的行或者取消选中的行再操作其它行',type:'warning'})
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
					params.executorUserid=$event[0].userid
					params.executorUsername=$event[0].username
				}else if(fieldName==='createUserid'){
					params.createUserid=$event[0].userid
					params.createUsername=$event[0].username
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
					}else{
						this.$notify({showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
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
      
			onEditXmTaskSomeFields(data){
        debugger;
        Object.assign(this.editForm,data)
				this.$emit('edit-xm-task-some-fields',data);
			},
      onWorkloadSubmit(data){
         Object.assign(this.editForm,data)
        this.$emit('workload-submit',data)
      }
  }, //end methods
  components: {  
    XmTaskWorkloadRecordDialog,XmGroupDialog,
  },
  mounted() { 
    this.initData();
    
      initSimpleDicts( "all", ["planType","taskType","priority","xmTaskSettleSchemel","priority","taskState" ]).then((res) => {
        this.dicts = res.data.data;
      });
  },
};
</script>

<style scoped> 
  
</style>
