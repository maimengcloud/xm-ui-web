<template>
  <div class="full_continer">
    <div class="banner">
      <p>购买流程:&nbsp;&nbsp;&nbsp;1.选择模块 》2.确认订单 》 3.支付 》 4.完成</p>
    </div>

    <div class="flux_continer">

      <orderSkeleton v-if="menuLoading" />

      <div class="content" v-else>
        <div class="top_desc">
          <h2>续费订单</h2>
          <p>团队名: {{userInfo.branchName?userInfo.branchName:userInfo.branchId}}</p>
        </div>
        <div class="version_all">
           <enterprise ref="enterprise" :modules="modules" :ooper="'2'"></enterprise>
        </div>
        <el-button :loading="submitLoading" @click="submitOrder" size="larget" class="submit" type="primary">
          提交订单
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
//组件
import Enterprise from './enterprise'
import orderSkeleton from './components/orderSkeleton'
import {getAllMenuModule, getBuyMenuModule} from '@/api/mdp/sys/modules'
import {modulesOfIcon} from "../layout/ModulesMenu/modulesOfIcon.js";

import { mapGetters } from 'vuex'

export default {
  components: {Enterprise, orderSkeleton},

  computed: {
      ...mapGetters([ 'userInfo'  ]),

  },
  data() {
    return {
      menuLoading: false,
      modules: null,
      submitLoading: false,
    }
  },

  methods: {
    submitOrder() {
        let data = this.$refs.enterprise.getData();
        //验证手机号是否填写
        if(data.phone == "" || data.phone == null || data.phone == undefined) {
          this.$notify({
            message: '请输入手机号',
            type: 'warning'
          });
          return;
        }

        //验证是否同意服务协议
        if(!data.checked) {
          this.$notify({
            message: '请先同意服务协议',
            type: 'warning'
          });
          return;
        }

        //保存购买模块信息到本地
        if(data.moduleIds.length <= 0) {
          this.$notify({
            message: '请选择要购买的模块',
            type: 'warning'
          });
          return
        }

        window.localStorage.setItem("BUY_MODULES",  JSON.stringify(data))
        this.$router.push('/my/order/create')
    },

    //获取所有模块
    getAllModules() {
        this.menuLoading = true
        getAllMenuModule({}).then(res => {
            let tempData = res.data.data;
            tempData.forEach(i=>{
              i.isChecked=false
              i.musers=10
              i.isBuy=false
              i.endTime=''
            })
            getBuyMenuModule({}).then(res2 => {
                let branchModules = res2.data.data;
                tempData.forEach(k => {
                    branchModules.forEach(element => {
                        if(k.id == element.moduleId && element.status=='1') {
                            k.isBuy = true;
                            k.musers=element.musers
                            k.endTime=element.endTime
                        }
                    });
                    modulesOfIcon.forEach(element => {
                        if(k.id == element.id) {
                            k.logoUrl = element.logoUrl;
                        }
                    });
                })
                let xmMenus = tempData.filter(res => {return res.mcate == '2'})
                let oaMunus = tempData.filter(res => {return res.mcate == '1'})
                let mallMenus = tempData.filter(res => {return res.mcate == '3'})
                this.modules = {
                    "xmgl": xmMenus,
                    "oa" : oaMunus,
                    "mall": mallMenus
                }
            })
        }).finally(() => this.menuLoading = false)
    }

  },

    mounted(){
         this.getAllModules();
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
