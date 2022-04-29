<template>
  <div class="m_container">
    <div class="m_content">
      <div class="message_card">  
        <span :class="{'message_type_active' : currentType == 1}" class="message_type" @click="currentType = 1">全部消息</span>
        <span :class="{'message_type_active' : currentType == 2}" class="message_type " @click="currentType = 2">审批消息</span>
      </div>
      <div class="message_content">
        <div class="message_content_box" v-for="(item, index) in messageData" :key="index">
          <p class="title">{{item.type}}</p>
          <p class="date">{{item.time}}</p>
          <span class="text">{{item.text}}</span>
          <div class="line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

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


    }
  },

  methods() {

  },

  mounted: {

  }

}
</script>

<style lang="scss" scoped>
@import '../common.scss';
@import './index.scss';
</style>