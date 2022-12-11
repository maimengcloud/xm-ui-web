<template>
  <div class="comment-list-box">
    <div class="comment-list">
      <!-- 回复 -->
      <div v-if="self.pcommentId" class="list-item clear-bd">
        <div class="top-msg">
          <div class="info" @click="toPersonCenter(self)" style="cursor: pointer;">
            <img :src="getHeadimgurl(self.userid)" class="user-avatar" @error="onImgError(self.userid,$event)" />
            <span class="user-name">{{ self.username }} </span>
            <span class="time">{{ self.createDate }}</span>
          </div>
          <div class="btns">
            <span v-if="!self.isPraise" class="like"><img src="../../../../../static/images/like.png" class="like-logo" @click="praiseComment(self)" />{{ self.praiseSum }}</span>
            <span v-else class="like"><img src="../../../../../static/images/like-selected.png" class="like-logo" />{{ self.praiseSum }}</span>
            <span class="reply" @click="isShow = true"><i class="el-icon-s-comment"></i>&nbsp;回复</span>
          </div>
        </div>
        <div class="bottom-con">
          <span class="con">{{ self.context }}</span>
        </div>
        <!-- 递归组件 -->
        <div v-if="self.childList.length < flagNum || showAll" class="child-box">
          <comment-list v-for="(child, index) in self.childList" :self="child" :parent="self" :key="index"></comment-list>
        </div>
        <!-- 查看全部 -->
        <div v-if="self.childList.length >= flagNum ||self.childNums>0" class="show-all">
          <span @click="viewAll">{{ !showAll ? `查看全部 ${self.childNums} 条回复 >>` : `<< 收起 ${self.childList.length} 条回复` }}</span>
        </div>
      </div>
      <!-- 评论 -->
      <div v-else class="list-item">
        <div class="top-msg">
          <div class="info" @click="toPersonCenter(self)" style="cursor: pointer;">
            <img :src="getHeadimgurl(self.userid)" class="user-avatar" @error="onImgError(self.userid,$event)" />
            <span class="user-name">{{ self.username }}</span>
            <span class="time">{{ self.createDate }}</span>
          </div>
          <div class="btns">
            <span v-if="!self.isPraise" class="like"><img src="../../../../../static/images/like-not.png" class="like-logo" @click="praiseComment(self)" />{{ self.praiseSum }}</span>
            <span v-else class="like"><img src="../../../../../static/images/like-selected.png" class="like-logo" />{{ self.praiseSum }}</span>
            <span class="reply" @click="isShow = true"><i class="el-icon-s-comment"></i>&nbsp;回复</span>
          </div>
        </div>
        <div class="bottom-con">
          <span class="con">{{ self.context }}</span>
        </div>
        <!-- 递归组件 -->
        <div v-if="showAll" class="child-box">
          <comment-list  v-for="(child, index) in self.childList" :self="child" :parent="self" :key="index"></comment-list>
        </div>
        <!-- 查看全部 -->
        <div v-if="self.childList.length >= flagNum||self.childNums>0" class="show-all">
          <span @click="viewAll">{{ !showAll ? `查看全部 ${self.childNums} 条回复 >>` : `<< 收起 ${self.childList.length} 条回复` }}</span>
        </div>
      </div>
    </div>
    <el-dialog title="评论回复" :visible.sync="isShow" width="50%">
      <div class="w-box">
        <div class="edit">
          <el-input type="textarea" :rows="8" placeholder="请输入你的回复内容 ......" v-model="replyTxt"> </el-input>
        </div>
        <div class="bottom-btns">
          <img src="../../../../../static/images/expression.png" class="expression" />
          <el-button type="primary" @click="publishComment">发表评论</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { initDicts,listXmMenuComment, delXmMenuComment, batchDelXmMenuComment,editSomeFieldsXmMenuComment } from '@/api/xm/core/xmMenuComment';
import commentList from './comment-list.vue';

import imgUtil from '@/api/imgUtil.js';
export default {
  name: 'commentList',
  props: ['self', 'parent'],
  components: {
    commentList,
  },
  data() {
    return {
      flagNum: 1, // 超过多少条折叠
      showAll: false,
      isShow: false,
      replyTxt: '',
      avatarUrl: '',
      commentsList:[],
    };
  },
  methods: {
    ...imgUtil,
    toPersonCenter(self){
      this.$router.push({
        name: 'personForum',
        query: {
          userid: self.userid,
        },
      });
    }, 
    praiseComment() {
      this.self.praiseSum += 1;
      praisearchiveComment(this.self).then((res) => {
        let tips = res.data.tips;
        if (tips.isOk) {
          this.self.isPraise = true;
          this.$forceUpdate();
        } else {
          this.$message({
            message: tips.msg,
            type: 'error',
          });
        }
      });
    },
    // 点击被回复的昵称事件
    parentClick() {
      console.log(this.parent);
    },
    // 评论人点击事件
    commentUserNameClick() {
      console.log(this.self);
    },
    // 查看/收起回复
    viewAll() {
      if(this.showAll==true){
        this.showAll=false;
        return;
      }
      let params = {  
          pcommentId:this.self.id 
      };
      params.orderBy=" CREATE_DATE DESC "

      getCommentList(params).then((res) => { 
        let tips = res.data.tips;
        if (tips.isOk) { 
          let list = res.data.data;
          this.commentsList = list;  
          this.commentListFormat();
          this.showAll = !this.showAll; 
        } else {
          this.$message({
            message: tips.msg,
            type: 'error',
          });
        }
      });
    },
    publishComment() {
      let params = {
        archiveId: this.self.archiveId,
        pcommentId: this.self.id,
        toUserid: this.self.userid,
        toUsername: this.self.username,
        context: this.replyTxt,
      };
      if (params.context) {
        addarchiveComment(params).then((res) => {
          let tips = res.data.tips;
          if (tips.isOk) {
            this.$message({
              type: 'success',
              message: '评论回复成功',
            });
            this.self.childList.unshift(res.data.data); 
            
            if(!this.self.childNums){
              this.$set(this.self,"childNums",1); 
            }else{
              this.$set(this.self,"childNums",this.self.childNums+1); 
            }
            
            this.isShow = false;
            this.replyTxt = '';
          } else {
            this.$message({
              message: tips.msg,
              type: 'error',
            });
          }
        });
      } else {
        this.$message({
          type: 'error',
          message: '回复内容不能为空',
        });
      }
    },
    // 格式化评论数据
    commentListFormat() {
      this.commentsList.forEach((item) => {
        this.$set(item, 'childList', []); 
      }); 
       this.$set(this.self, 'childList',this.commentsList); 
    },
     
  },
  mounted() {
     self.isPraise = false;
    
  },
};
</script>

<style lang="scss" scoped>
.comment-list-box {
  .comment-list {
    .list-item {
      padding-bottom: 4px;
      margin-bottom: 14px;
      border-bottom: 1px solid #eeeeee;
      .top-msg {
        display: flex;
        justify-content: space-between;
        .info {
          display: flex;
          align-items: center; 
          .user-avatar {
            width: 38px;
            height: 38px;
            margin-right: 10px;
            border-radius: 50%; 
          }
          .user-name {
            display: flex;
            align-items: center;
            font-size: 13px;
            color: #7a7a7a;
            .act {
              display: inline-block;
              margin-left: 4px;
              font-size: 13px;
              color: #d4d4d4;
            }
          }
          .time {
            margin-left: 10px;
            font-size: 13px;
            color: #7a7a7a;
          }
        }
        .btns {
          display: flex;
          font-size: 13px;
          color: #a9a9a9;
          .like {
            display: flex;
            align-items: center;
            margin-right: 20px;
            .like-logo {
              width: 13px;
              height: 13px;
              margin-right: 4px;
              cursor: pointer;
            }
          }
          .reply {
            display: flex;
            align-items: center;
            cursor: pointer;
          }
          .reply:hover {
            color: #1f7eea;
          }
        }
      }
      .bottom-con {
        display: flex;
        flex-direction: column;
        padding: 4px 20px;
        padding-left: 52px;
        .con {
          font-size: 13px;
          color: #333333;
        }
      }
      .child-box {
        padding-left: 52px;
      }
      .show-all {
        margin-bottom: 4px;
        margin-top: 2px;
        padding-left: 52px;
        span {
          font-size: 12px;
          color: #1f7eea;
          cursor: pointer;
        }
        span:hover {
          text-decoration: underline;
          color: #64a1e6;
        }
      }
    }
    .clear-bd {
      margin-bottom: 0;
      margin-top: 8px;
      border-bottom: none;
    }
  }
  .w-box {
    .edit {
      display: flex;
    }
    .bottom-btns {
      margin-top: 14px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .expression {
        width: 22px;
        height: 22px;
        margin-right: 16px;
        border-radius: 50%;
        cursor: pointer;
      }
      .expression:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>