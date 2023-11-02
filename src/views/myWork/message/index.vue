<template>
  <div class="m_container">
    <div class="m_content">
      <div class="message_card">  
        <span :class="{'message_type_active' : currentType == 4}" class="message_type " @click="currentType = 4">站内消息</span>
        <span :class="{'message_type_active' : currentType == 5}" class="message_type " @click="currentType = 5">内部公告</span>
        <span :class="{'message_type_active' : currentType == 6}" class="message_type " @click="currentType = 6">平台公告</span>
      </div>
      <div class="message_content"  v-if="currentType == 1">
         <prichat-im :msg-class="'0'" :key="0"></prichat-im>
      </div> 
      <div class="message_content"  v-if="currentType == 2">
         <group-im :msg-class="'CSS'" key="css"></group-im>
      </div> 
      
      <div class="message_content"  v-if="currentType == 4">
         <notify-msg :msg-class="'4'" :key="4"></notify-msg>
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
 
 import notifyMsg from "./notifyMsg"

export default {
  
  components:{
    notifyMsg,
  },
  data() {
    return {
      currentType: 4,  
    }
  },

  methods:{ 
  },

  mounted() { 
  }

}
</script>

<style lang="scss" scoped>
@import '../common.scss';
@import './index.scss';
</style>