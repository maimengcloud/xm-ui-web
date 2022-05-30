<template>
  <section>
    <el-row class="app-container">
      <el-input v-model="filters.key" style="width: 20%;" placeholder="名称 简称  编号 模糊查询"></el-input>
      <el-button type="primary" v-loading="load.list" v-on:click="searchDepts" icon="el-icon-search"></el-button>  
      <el-button v-if="multiple"    @click="selectMultiple()"  type="warning">确认选中</el-button>
    </el-row> 
		<el-row v-if="filters.parentDeptList && filters.parentDeptList.length>0" class="padding-top padding-left"> 
			<span v-for="(item ,index) in filters.parentDeptList" :key="index">
				<el-tag   @close="clearParentDept(item,index)" closable @click="clickParentDept(item,index)">{{item.deptName}}</el-tag>/
			</span>
		</el-row>
    <el-row class="app-container">
      <el-col :span="24">
        <!--列表 Dept sys_dept-->
        <el-table :max-height="tableHeight"
          :data="treeData" 
          highlight-current-row
          v-loading="load.list"
          border
          @selection-change="selsChange"
          style="width: 100%;"						
          fit
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          row-key="deptid" 
        >
          <el-table-column sortable type="selection" width="40"></el-table-column>
          <el-table-column sortable type="index" width="40"></el-table-column>
          <el-table-column
            sortable
            prop="displayDeptid"
            label="部门名称"
            min-width="400" 
          > 
							<template slot-scope="scope">
 							  {{scope.row.displayDeptid}}	- <el-link   type="primary">{{scope.row.deptName}}</el-link>   
              </template>
          </el-table-column>  
          <el-table-column sortable prop="deptType" label="类型" min-width="80" show-overflow-tooltip>
            <template scope="scope">
              <el-tag
                close-transition
              >{{ getOptionName(options.deptType,scope.row.deptType) }}</el-tag>
            </template>
          </el-table-column> 
          <el-table-column  label="操作" width="300" v-if="single">
            
            <template scope="scope">
              
                  <el-button @click="showSubDept(scope.row,scope.$index)" >下级</el-button>
                  <el-button    @click="selectSingle(scope.$index,scope.row)"  type="warning">选中</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          
          layout="total, sizes, prev, pager, next"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="[10,20, 50, 100, 500]"
          :current-page="pageInfo.pageNum"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          style="float:right;"
        ></el-pagination>
      </el-col>
    </el-row> 
  </section>
</template>

<script>
import util from "../../../../common/js/util"; //全局公共库
import config from "@/common/config"; //全局公共库 
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import { listDept } from "../../../../api/mdp/sys/dept";  

import { mapGetters } from "vuex";

export default {
  
  name:"DeptSelect",
  computed: {
    ...mapGetters(["userInfo"]),
    treeData(){
      return this.translateDataToTree(this.depts)
    }
  },
  props:['single','multiple'],
  data() {
    return {
      filters: {
        key: "",
        parentDept:null,
        parentDeptList:[],
        levelTypes:[],//L1,L2
      },
      depts: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 options.sex,options.project

      addFormVisible: false, //新增dept界面是否显示
      //新增dept界面初始化数据
      addForm: {
        deptid: "",
        deptName: "",
        pdeptid: "",
        deptType: "",
        state: "1",
        manager: "",
        leader: "",
        shortName: "",
        displayDeptid: "",
        orgType: "",
        managerName: "",
        leaderName: "",
        branchId: "",
        levelType: "",
        idPath: ""
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑dept界面初始化数据
      editForm: {
        deptid: "",
        deptName: "",
        pdeptid: "",
        deptType: "",
        state: "1",
        manager: "",
        leader: "",
        shortName: "",
        displayDeptid: "",
        orgType: "",
        managerName: "",
        leaderName: "",
        branchId: "",
        levelType: "",
        idPath: ""
      },
      addDeptDressForm: {
        deptid: "",
        longitude: "",
        latitude: "",
        address: "",
        province: "",
        city: "",
        district: ""
      },
      /**begin 自定义属性请在下面加 请加备注**/
      userDeptFormVisible: false,
      deptlocationVisible: false,
      deptPostVisible: false, //部门岗位关系维护
      showEditLocationId: {},
      addLoading: false,
      delLoading: false,
      branch: null, //选择的当前机构
      parentDept:null,
			tableHeight:500,
      //resultDeptData:{}
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    //获取代码对应的名称 用于数据反显 如 getOptionName(options.sex,'1');
    getOptionName(options, optionValue) {
      if (!options) return optionValue;
      let option = options.filter(i => i.optionValue == optionValue);
      if (option.length > 0) {
        return option[0].optionName;
      } else {
        return optionValue;
      }
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.pageInfo.count = true;

      this.getDepts();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getDepts();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      var dir = "asc";
      if (obj.order == "ascending") {
        dir = "asc";
      } else {
        dir = "desc";
      }
      if (obj.prop == "xxx") {
        this.pageInfo.orderFields = ["xxx"];
        this.pageInfo.orderDirs = [dir];
      }
      this.getDepts();
    },
    searchDepts() {
      this.pageInfo.count = true;
      this.getDepts();
    },
    //获取列表 Dept sys_dept
    getDepts() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count
      };
      if (
        this.pageInfo.orderFields != null &&
        this.pageInfo.orderFields.length > 0
      ) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(
            this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
          );
        }
        params.orderBy = orderBys.join(",");
      }
      if (this.filters.key !== "") {
        params.key = "%" + this.filters.key + "%";
      }
      if (
        !this.userInfo.isSuperAdmin
      ) {
        params.pdeptid = this.userInfo.deptid
      }
      params.branchId = this.userInfo.branchId;
      if (this.branch != null) {
        params.branchId = this.branch.id;
      }
      this.load.list = true;
      listDept(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.depts = res.data.data;
            console.log("查看");
            console.log(this.depts);
          } else {
            this.$notify({ message: tips.msg, type: "error" });
          }
          this.load.list = false;
        })
        .catch(() => {
          this.load.list = false;
          //this.$notify({ message: '通讯错误', type: 'error' });
        });
    }, 
    //选择行dept
    selsChange: function(sels) {
      this.sels = sels;
    }, 
    
			translateDataToTree(data) {  

				let parents = data.filter(value =>{ 
					//如果我的上级为空，则我是最上级
					if(value.pdeptid == 'undefined' || value.pdeptid == null  || value.pdeptid == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.pdeptid==i.deptid)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.pdeptid==i.deptid)){
						return true;
					}else{
						return false;
					} 
				})  
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.pdeptid === parent.deptid) {
								let temp = JSON.parse(JSON.stringify(children))
								temp.splice(index, 1)
								translator([current], temp)
								typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
							}
						}
						)
					}
					)
				}

				translator(parents, children)

				return parents
			},
     
    selectSingle(row){
      this.$emit('select',[row]);
    },
    selectMultiple(){
      this.$emit('select',this.sels);
    },
    clearParentDept(parentDept,index){
      if(index==1){
        this.filters.parentObj=null;
      }else{
        this.filters.parentDept=this.filters.parentDeptList[index-1];
      }

      this.filters.parentDeptList.splice(index,this.filters.parentDeptList.length-index)
      this.pageInfo.count=true
      this.getDepts()
    }, 
    clickParentDept(parentDept,index){
      this.filters.parentDept=parentDept;
      this.filters.parentDeptList.splice(index+1,this.filters.parentDeptList.length-index-1)
      this.pageInfo.count=true
      this.getDepts()
    }, 
      showSubDept(row){
      this.editForm = Object.assign({}, row);
      this.filters.parentDept=row
      this.filters.parentDeptList.push(row);
      this.pageInfo.count=true;
      this.getDepts();

      },
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: { 
  },
  mounted() {  
			this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 250;   
      }); 
    //this.getDepts();
    this.branch = {
      id: this.userInfo.branchId,
      branchName: this.userInfo.branchName
    };
    //加载下拉列表 如有需要去年注释
    let optionsParams = [
      { categoryId: "all", itemCode: "orgType" },
      { categoryId: "all", itemCode: "deptType" }
    ];
    listOption(optionsParams).then(res => {
      this.options = res.data.data;
    });
    this.searchDepts();
    //给下拉列表初始化默认值
    //this.addForm.xxx=getDefaultValue(this.options.xxx,'1');

    /**在下面写其它函数***/
  }
};
</script>

<style scoped>
</style>
