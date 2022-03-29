<template>
  <section  class="page-container padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width:50%;" placeholder="项目名称模糊查询" clearable>
      </el-input>
      <el-button  type="primary" icon="el-icon-search" @click="searchXmProjects">查询</el-button>
    </el-row>
    <el-row>
      <el-row>
        <el-table  ref="table" v-cloak fit border :data="xmProjects" highlight-current-row v-loading="load.list"
                   style="width: 100%;" :header-cell-style="{'text-align':'center'}"
                   :cell-style="{'text-align':'center'}">
          <el-table-column  type="index" label="序号" min-width="50" ></el-table-column>
          <el-table-column prop="id" label="项目编码" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="标题" min-width="150" ></el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <el-button @click.stop="selectRow(scope.row)" >选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
      </el-row>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import { addXmTaskSbill,editXmTaskSbill } from '@/api/xm/core/xmTaskSbill';
import { mapGetters } from 'vuex'
import {listXmProject} from "@/api/xm/core/xmProject";

export default {
  components: {
    //XmTaskSbillEdit,
  },
  computed: {
    ...mapGetters([ 'userInfo'  ]),

  },
  props:['visible'],

  watch: {
    'visible':function(visible) {
      if(visible==true){
        //从新打开页面时某些数据需要重新加载，可以在这里添加
        this.initData()
      }
    }
  },
  data() {
    return {
      filters: {
        key: ''
      },
      load:{ list: false, edit: false, del: false, add: false },//查询中...
      xmProjects:[],
      pageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:10,//每页数据
        count:false,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
    }//end return
  },//end data
  methods: {
    //编辑提交XmTaskSbill 任务结算表父组件监听@submit="afterEditSubmit"
    initData: function(){
      this.searchXmProjects();
    },
    /**begin 在下面加自定义方法**/
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize=pageSize;
      this.getXmProjects();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getXmProjects();
    },
    //获取列表 XmProject xm_project
    getXmProjects(callBack) {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count:this.pageInfo.count,
      };
      if(this.filters.key!==""){
        params.key= "%"+this.filters.key+"%";
      }else{
        //params.xxx=xxxxx
      }
      this.load.list = true;
      listXmProject(params).then((res) => {
        let tips=res.data.tips;
        if(tips.isOk){
          console.log(res.data);
          this.pageInfo.total = res.data.total;
          this.pageInfo.count=false;
          this.xmProjects = res.data.data;
        }else{
          this.$notify({ showClose: true, message: tips.msg, type: 'error' });
        }
        this.load.list = false;
      }).catch( err => this.load.list = false );
    },
    selectRow(row){
      let obj = {
        projectId:row.id,
        projectName:row.name
      }
      this.$emit('select',obj);
    },
    searchXmProjects(){
      this.pageInfo.count=true;
      this.getXmProjects();
    }
  },//end method
  mounted() {
    this.$nextTick(() => {
      //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
      this.initData()
    });
  }
}

</script>

<style scoped>

</style>
