<template>
  <div class="full_continer"> 
    <div class="banner">
      <p>购买流程:&nbsp;&nbsp;&nbsp;1.选择模块 》2.确认订单 》 3.支付 》 4.完成</p>
    </div>

    <div class="flux_continer"> 
      <div class="content">
        <div class="top_desc">
          <h2>升级所有已购买产品可用人数</h2>
          <p>团队名: {{userInfo.branchName?userInfo.branchName:userInfo.branchId}}</p>
        </div>
        <div class="version_all">
          <div class="enterprise">    
            <div class="buy_count">
              <h2>
                购买总人数
                <span>(10人起购) &nbsp;当前企业已有<font color="red">{{branchUsersCpd.maxUsers}}</font>个账户可用 </span>
              </h2>

              <div class="buy_count_items">
                <el-input type="number" style="width:30%;"  v-model="data.ousers" :min="10" @change="formOusersChange"></el-input> 
                 
               </div>
            </div> 
               
            <div class="buy_count">
              <h2>
                产品明细
                <span> 增加人数将自动分配人员额度给企业已购买的产品，涉及的产品明细如下 </span>
              </h2>

              <div class="buy_count_items"> 
                  <el-table
                    size="larget"
                    border
                    :data="orders.modules"
                    style="width: 100%" >
                    <!--
                    <el-table-column
                      prop="name"
                      label="产品类型"
                      >
                      <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.mcate == '1' ? '智慧协同办公系统' : 
                            scope.row.mcate == '2' ? '项目管理' : '商城'}}</span>
                      </template>
                    </el-table-column>
                    -->
                    <el-table-column
                      prop="name"
                      label="产品名称" min-width="150"
                      >
                      <template slot-scope="scope">
                        <div class="avatar-container">
                          <div class="avatar-wrapper">
                            <img v-if=" scope.row.logoUrl" class="user-avatar" :src="scope.row.logoUrl"> 
                            <span class="username">  {{scope.row.name}}</span> 
                          </div>    
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="ousers"
                      label="可使用人数"
                      min-width="120">
                    </el-table-column>
                    <el-table-column
                      prop="musers"
                      label="计价人数"
                      min-width="120">
                    </el-table-column>
                    <el-table-column
                      prop="orginFee"
                      label="原价"
                      min-width="120">
                      <template slot-scope="scope">
                        ￥{{scope.row.orginFee}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="finalFee"
                      label="折扣价"
                      min-width="120">
                      <template slot-scope="scope">
                        ￥{{scope.row.finalFee}}
                      </template>
                    </el-table-column>
                  </el-table>
                </div> 
            </div>  
            <div class="pay_way">
              <h2>支付方式</h2>
              <div class="pay_way_items">
                <div class="oItem" @click="selectPayWay(item)"  v-for="(item, index) in payWayOptions" :key="index">
                  <img :src="item.icon">
                  <span>{{item.label}}</span>
                  <i v-if="item.isChecked" class="select el-icon-success"></i>
                </div>
              </div>
              <el-input size="larget" style="width:30%;" v-model="data.phone" class="phone" placeholder="输入手机号"></el-input>
            </div>

            <div class="pay_allAmount">
              <h2>订单总额</h2>
              <p class="allAmount">￥<b>{{orders.order?orders.order.ofinalFee:''}}</b>/{{data.label}}</p>
              <el-checkbox v-model="data.checked">同意</el-checkbox> <a style="font-size: 14px;color: #409EFF">《服务协议》</a>
            </div>
          </div>
      </div>
       
        <el-button :loading="load.add" @click="createOrder" size="larget" class="submit" type="primary">
          提交
        </el-button>
      </div>
    </div>

    <el-dialog
      title="微信支付"
      :visible.sync="weixinPayVisible"
      :show-close="false"
      @close="closeDialog"
       width="350px"
     >
      <qriously :value="codeUrl" :size="300" /> 
    </el-dialog>
  </div>
</template>

<script>
  
import {getAllMenuModule, getBuyMenuModule} from '@/api/mdp/sys/modules'
import {modulesOfIcon} from "@/components/ModulesMenu/modulesOfIcon";
import {createAddUsersOrder,calcAddUsersOrder} from '@/api/mdp/sys/order';

import aliPayImg from '@/assets/image/module/alipay.png';
import weixinPayImg from '@/assets/image/module/weixin.png';

import {  getBranchInterestsDetail } from '@/api/branch';
import { mapGetters } from 'vuex'
import {aliPay, weixinPay, checkWxPayStatus} from '@/api/mdp/pay/pay'

export default {
  components: {  },
  
  computed: {
      ...mapGetters([ 'userInfo'  ]),

  },
  data() {
    return {  
      
      payWayOptions: [
        {
          label: '支付宝',
          val: '2',
          icon: aliPayImg,
          isChecked: true
        },
        {
          label: '微信',
          val: '1',
          icon: weixinPayImg,
          isChecked: false
        }
      ], 
      load:{add:false,calc:false,list:false},
      orders:{
        modules: null,
        order:null,
      }, 
      data:{
        phone:'',
        name:'',
        ousers:10, 
        payType:'1',
        checked:true,//是否同意协议
      },
      
      branchUsersCpd:{istatus:'1',maxUsers:50,ilvlId:'2',ilvlName:'黄金会员'},  
      weixinPayVisible: false,
      codeUrl: ""
    }
  },

  methods: {
     
    formOusersChange(val){
       this.calcOrder();
    },
    calcOrder:function() { 
      if(!this.data.ousers){ 
         return;
      }
      var params={ousers:this.data.ousers}
       calcAddUsersOrder(params).then(res=>{ 
         this.orders.order=res.data.data
         var modules=res.data.modules
         var defIcon=modulesOfIcon[0]
         modules.forEach(i=>{
           var e=modulesOfIcon.find(k=>k.id==i.moduleId)
           if(e && e.id){
              i.logoUrl = e.logoUrl; 
           }else{
              i.logoUrl=defIcon.logoUrl
           }
         })
         this.orders.modules=modules
       })
    },
    selectPayWay(item) {
      this.data.payType = item.val;
      this.payWayOptions.forEach(element => {
        element.isChecked = false;
        if(item.val == element.val) {
          element.isChecked = true;
        }
      });
    }, 
    createOrder() {
      //来源
      this.data.osource = "1";
      //订单类型
      this.data.otype = "1";
      //备注
      this.data.remark = "";
      this.data.name = "模块开通订单"
      this.load.add = true;
      createAddUsersOrder(this.data).then(res => {
        if(res.data.tips.isOk){
          //获取订单号
          let orderId = res.data.data.id;
          if(this.data.payType == '2') {
            this.toAliPay(orderId);
            return;
          }
          if(this.data.payType == '1') {
            this.toWeixinPay(orderId);
            return;
          }
        }else{
          this.$notify.error(res.data.tips.msg);
        }
      }).catch(err => {
        this.$notify.error(err.msg);
      }).finally(() => {
      })
    },

    toAliPay(orderId) {
      let params = { 
        id: orderId,
        otype: 1,
        returnUrl: `${window.location.protocol+"//"+window.location.host}/${process.env.CONTEXT}/${process.env.VERSION}/#/my/order/paySuccess`
      }
      aliPay(params).then(res => {
        if(res.data.tips.isOk) {
          const div = document.createElement("divform");
          div.innerHTML = res.data.data.htmlStr;
          document.body.appendChild(div);
          document.forms[0].submit();
        }else {
          this.$notify.error(res.data.tips.msg);
        }
      }).finally(() => {
        setTimeout(() => {
          this.load.add = false;
        }, 2000);
      })
    },

    toWeixinPay(orderId) {
      let params = {
        id: orderId,
        otype: 1,
        returnUrl: ""
      }
      weixinPay(params).then(res => {
        if(res.data.tips.isOk) {
          this.codeUrl = res.data.data.codeUrl;
          this.weixinPayVisible = true;
          this.timer = setInterval(() => {
            this.queryOrderStatus(orderId)
          }, 3000)
        }else {
          this.$notify.error(res.data.tips.msg);
        }
      }).finally(() => {
         setTimeout(() => {
          this.load.add = false;
        }, 2000);
      })
    },

    //查询订单支付状态
    queryOrderStatus(orderId) {
      console.log("查询订单");
      checkWxPayStatus({'orderId': orderId, "otype": "1"}).then(res => {
        if(res.data.tips.isOk) {
          this.$router.push({path:'/my/order/paySuccess', query:{total_amount: this.data.amount, out_trade_no: orderId}});
          clearInterval(this.timer);
        }else {
        }
      }).finally(() => {
        
      })
    },

    closeDialog() {
      clearInterval(this.timer);
    }
  },

    mounted(){  
      this.calcOrder();
      getBranchInterestsDetail().then(res=>{  
        this.branchUsersCpd=res.data.data 
      })
    }   
}
</script>

<style lang="scss" scoped>
@import './index.scss'; 
</style>