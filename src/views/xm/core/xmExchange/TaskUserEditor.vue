<template>
  <div class="comment-list head-editor clearfix">
    <div class="comment-avater">
      <el-avatar  v-if="user.headimgurl" icon="el-icon-user-solid" :src="user.headimgurl">{{user.username}}</el-avatar>
       <el-avatar  v-else icon="el-icon-user-solid">{{user.username}}</el-avatar>
    </div>
    <div class="comment-wrap">
      <div class="clearfix">
        <vue-editor :id="id" :branch-id="userInfo.branchId" :category-id="projectId+'-'+taskId" v-model="content"></vue-editor>
      </div>
      <div style="margin-top:20px;"></div>
    <el-button @click="publish" class="toolbar"   type="primary">发布</el-button> <el-button @click="clearContent" style="margin-right: 0.25rem;" class="toolbar"   type="plain">清空内容</el-button> 
    </div>
  </div>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import { mapGetters } from 'vuex';
import VueEditor from '@/components/VueEditor';
import {sn} from '@/common/js/sequence';
export default {
  props:['id',"projectId","taskId",'user'],
  computed: {
    ...mapGetters([
      'userInfo','roles',
    ]),
  },
  data() {
    return {
      content: '',
    }
  },
  methods: {
    publish() {
      let params = {
        content: this.content, 
      }
      if(!this.content){
         this.$message.error("请输入内容再提交");
         return;
      } 
      this.$emit('publish',params); 
    },
    clearContent(){
      this.content="";
    }
  },
  mounted() {
    this.$nextTick(() => {
    });
  },
  components: {
    VueEditor,
  },
}
</script>

<style lang="scss" scoped>
.head-editor{
	border: none;
  padding: 0 15px 10px 60px;
	margin-top: 15px;
	position: relative;
}
.comment-avater{
	position: absolute;
	left: 10px;
	top: 0;
}
.toolbar{
	float: right;
	margin: .25rem 0;
}
.clearfix::after {
	clear: both;
	content: "";
}
</style>