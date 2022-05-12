<template>
  <div class="full_continer"> 
    <div class="banner">
      <p>购买流程:&nbsp;&nbsp;&nbsp;1.选择模块 》2.确认订单 》 3.支付 》 4.完成</p>
    </div>

    <div class="flux_continer">

      <orderSkeleton v-if="menuLoading" />

      <div class="content" v-else>
        <div class="top_desc">
          <h2>购买订单</h2>
          <p>团队名: 擎勤科技</p>
        </div>

        <div class="version">
          <h2>选择版本</h2>
          <div class="version_item">
            <div @click="selectVersion(item)" class="oItem" v-for="(item, index) in version" :key="index">
              <img :src='item.img'>
              <div class="desc">
                <p>{{item.name}}</p>
                <p>{{item.desc}}</p>
              </div>
              <i v-if="item.isChecked" class="select el-icon-success"></i>
            </div>
          </div>
        </div>

        <div class="version_all">
          <flag-ship ref="flagship" v-if="currentSelectVersion == '旗舰版'"></flag-ship>
          <enterprise ref="enterprise" :menus="menus" v-if="currentSelectVersion == '企业版'"></enterprise>
        </div>

        <el-button :loading="submitLoading" @click="submitOrder" size="larget" class="submit" type="primary">
          {{currentSelectVersion == '企业版' ? '提交订单' : '提交信息'}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>

//图标
import EnterpriseVersionIcon from '@/assets/image/module/mo_enterprise.png'
import FlagShipIcon from '@/assets/image/module/mo_flagship.png'
//组件
import FlagShip from './flagShip'
import Enterprise from './enterprise'
import orderSkeleton from './components/orderSkeleton'
import {getAllMenuModule, getBuyMenuModule} from '@/api/mdp/sys/modules'
import {modulesOfIcon} from "@/components/ModulesMenu/modulesOfIcon";
import {createFlagShipOrder} from '@/api/mdp/sys/order';

export default {
  components: {FlagShip, Enterprise, orderSkeleton},
  data() {
    return {
      version: [
        {
          name: '企业版',
          desc: '(10人起购)',
          isChecked: true,
          img: EnterpriseVersionIcon
        },
        {
          name: '旗舰版',
          desc: '(50人起购)',
          isChecked: false,
          img: FlagShipIcon
        }
      ],
      currentSelectVersion: '企业版',
      menuLoading: false,
      menus: null,
      submitLoading: false,
    }
  },

  methods: {
    selectVersion(item) {
      this.currentSelectVersion = item.name;
      this.version.forEach(element => {
        element.isChecked = false;
        if(item.name == element.name) {
          element.isChecked = true;
        }
      });
    },

    submitOrder() {
      //验证参数
      if(this.currentSelectVersion == "企业版") {
        let data = this.$refs.enterprise.getForm();
        //验证手机号是否填写
        if(data.phone == "" || data.phone == null || data.phone == undefined) {
          this.$message({
            message: '请输入手机号',
            type: 'warning'
          });
          return;
        }

        //验证是否同意服务协议
        if(!data.checked) {
          this.$message({
            message: '请先同意服务协议',
            type: 'warning'
          });
          return;
        }

        //保存购买模块信息到本地
        if(data.moduleIds.length <= 0) {
          this.$message({
            message: '请选择要购买的模块',
            type: 'warning'
          });
          return
        }

        window.localStorage.setItem("BUY_MODULES", undefined)
        window.localStorage.setItem("BUY_MODULES", JSON.stringify(data))
        this.$router.push('/my/order/create')
      }else {
        let flagData = this.$refs.flagship.getForm();
        flagData.then((res) => {
          //创建订单
          res.needs = JSON.stringify(res.needs);
          this.submitLoading = true;
          createFlagShipOrder(res).then(res => {
            if(res.data.tips.isOk){
              this.$message.success("信息已提交，稍后我们将会联系您");
              this.$refs.flagship.clearForm();
            }else{
              this.$message.error(res.data.tips.msg);
            }
          }).catch(err => {
            this.$message.error(err.msg);
          }).finally(() => {
            this.submitLoading = false;
          })
        }).catch(err => {

        })

      }
    },

    //获取所有模块
    getAllModules() {
        this.menuLoading = true
        getAllMenuModule({}).then(res => {
            let tempData = res.data.data;
            tempData.forEach(i=>{
              i.isChecked=false
              i.musers=10
              i.num=10
            })
            getBuyMenuModule({}).then(res2 => {
                let branchModules = res2.data.data;
                tempData.forEach(k => {
                    branchModules.forEach(element => {
                        k.isChecked = false;
                        k.num = 10;
                        if(k.id == element.moduleId) {
                            k.isBuy = true;
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
                this.menus = {
                    "xmgl": xmMenus,
                    "oa" : oaMunus,
                    "mall": mallMenus
                }
            })
        }).finally(() => this.menuLoading = false)
    }

  },

  created() {
    this.getAllModules();
  },






}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>