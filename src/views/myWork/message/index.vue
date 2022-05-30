<template>
  <div class="m_container">
    <div class="m_content">
      <div class="message_card">  
        <span :class="{'message_type_active' : currentType == 1}" class="message_type" @click="currentType = 1">聊天消息</span>
        <span :class="{'message_type_active' : currentType == 2}" class="message_type" @click="currentType = 2">客服消息</span>
        <span :class="{'message_type_active' : currentType == 3}" class="message_type " @click="currentType = 3">审批流消息</span>
        <span :class="{'message_type_active' : currentType == 4}" class="message_type " @click="currentType = 4">任务消息</span>
        <span :class="{'message_type_active' : currentType == 5}" class="message_type " @click="currentType = 5">内部公告</span>
        <span :class="{'message_type_active' : currentType == 6}" class="message_type " @click="currentType = 6">平台公告</span>
      </div>
      <div class="message_content"  v-if="currentType == 1">
         <prichat-im :msg-class="'0'" :key="0"></prichat-im>
      </div> 
      <div class="message_content"  v-if="currentType == 2">
         <group-im :msg-class="'CSS'" key="css"></group-im>
      </div>
      <div class="message_content"  v-if="currentType == 3">
         <prichat-im :msg-class="'4'" :key="4"></prichat-im>
      </div>
      
      <div class="message_content"  v-if="currentType == 4">
         <prichat-im :msg-class="'5'" :key="5"></prichat-im>
      </div>
      
      <div class="message_content" v-if="currentType == 5">
         <archive :archiveType="'2'" :key="2"></archive>
      </div>
      
      <div class="message_content" v-if="currentType == 6">
         <archive :archiveType="'3'" :key="3"></archive>
      </div>
    </div>
  </div>
</template>

<script>
import {listArchive} from '@/api/mdp/arc/archive'

import archive from "./archive"
import prichatIm from "./prichatIm"
import groupIm from "./groupIm"

export default {
  
  components:{
    archive,prichatIm,groupIm
  },
  data() {
    return {
      currentType: 1,
      messageData: [
        {
          type: '审批消息',
          time: '2022-04-26 12:00:00',
          text: '李孝基发起申请领用办公电脑，因工作要求，自己没有电脑所以申请使用公司现有的huaWei办公电脑'
        },
        {
          type: '系统消息',
          time: '2022-04-26 12:00:00',
          text: '李孝基发起申请领用办公电脑，因工作要求，自己没有电脑所以申请使用公司现有的huaWei办公电脑'
        },
        {
          type: '审批消息',
          time: '2022-04-26 12:00:00',
          text: '李孝基发起申请领用办公电脑，因工作要求，自己没有电脑所以申请使用公司现有的huaWei办公电脑'
        },
        {
          type: '审批消息',
          time: '2022-04-26 12:00:00',
          text: '李孝基发起申请领用办公电脑，因工作要求，自己没有电脑所以申请使用公司现有的huaWei办公电脑'
        },
        {
          type: '审批消息',
          time: '2022-04-26 12:00:00',
          text: '李孝基发起申请领用办公电脑，因工作要求，自己没有电脑所以申请使用公司现有的huaWei办公电脑'
        },
        {
          type: '审批消息',
          time: '2022-04-26 12:00:00',
          text: '李孝基发起申请领用办公电脑，因工作要求，自己没有电脑所以申请使用公司现有的huaWei办公电脑'
        },
        
      ],

      arcArchives:[],
    }
  },

  methods:{
    searcArchives(){
      var params={archiveType:'3'}
      listArchive({}).then(res=>{
        this.arcArchives=res.data.data;
      })
    },
    goToArchive(item){
      var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
      window.open(curlDomain+"/api/"+process.env.VERSION+"/arc/arc/archive/showArchive?id="+item.id)
    }
  },

  mounted() {
     this.searcArchives();
  }

}
</script>

<style lang="scss" scoped>
@import '../common.scss';
@import './index.scss';
</style>