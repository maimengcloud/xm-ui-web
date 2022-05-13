<template>
  <div class="enterprise">
    <div class="sys_type">
      <div class="sys_desc">
        <h2>选择产品</h2>
        <div class="selectItem">
          <div class="item" :class="{active: active == 'xmgl' }" @click="active = 'xmgl'">
              <span>项目管理系统</span>
          </div>
          <div class="item" :class="{active: active == 'oa' }" @click="active = 'oa'">
              <span>智慧协同办公系统</span>
          </div>
          <div class="item" :class="{active: active == 'mall' }" @click="active = 'mall'">
              <span>电商定制系统</span>
          </div>
        </div>
      </div>

      <div class="sys_modules" v-if="this.menus != null">
        <div class="module" v-for="(item, index) in menus[active]" :key="index" >
          <div class="head"  :class="{active: item.isChecked == true}" @click="selectItem(item, index)">
            <div class="module_top">
              <img :src="item.logoUrl" alt="">
              <span>{{item.name}}</span>
            </div>
            <div v-if="item.isChecked == true" :class="{module_bottom_active: item.isChecked == true}" class="module_bottom">
              <i class="selected el-icon-check"></i>
            </div>
          </div> 
        </div>
      </div>
    </div>        

    <div class="buy_count">
      <h2>
        购买总人数
        <span>(10人起购,请按企业(团队)总人数填写，企业(团队)总人数代表了企业在唛盟平台可开立免费账户的总个数)</span>
      </h2>

      <div class="buy_count_items">
         <el-input-number v-if="branchUsersCpd.ilvlId>1" v-model="form.ousers" :min="branchUsersCpd.maxUsers" @change="formOusersChange"></el-input-number>
         
         <el-input-number v-else  v-model="form.ousers" :min="10" @change="formOusersChange"></el-input-number>
      </div>
    </div>

    <div class="buy_date">
      <h2>期限选择</h2>
      <div class="buy_date_items">
        <div class="oItem" @click="selectBuyDate(item)" v-for="(item, index) in odaysOptions" :key="index">
          <div class="header">
            {{item.label}}
            <i v-if="item.isChecked" class="select el-icon-success"></i>
          </div>
          <div class="bottom">
            <img v-if="item.isHot" src="@/assets/image/module/hot.png" alt="">
            <p>￥{{item.price}}/人天</p>
          </div>
        </div>
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
      <el-input size="larget" v-model="form.phone" class="phone" placeholder="输入手机号"></el-input>
    </div>

    <div class="pay_allAmount">
      <h2>订单总额</h2>
      <p class="allAmount">￥<b>{{orders.order?orders.order.ofinalFee:''}}</b>/{{form.label}}</p>
      <el-checkbox v-model="form.checked">同意</el-checkbox> <a style="font-size: 14px;color: #409EFF">《服务协议》</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {getAllMenuModule, getBuyMenuModule} from '@/api/mdp/sys/modules'
import {calcOrder} from '@/api/mdp/sys/order'

import aliPay from '@/assets/image/module/alipay.png';
import weixinPay from '@/assets/image/module/weixin.png'
import Decimal from "decimal.js"  // 具体文件中引入
import getDecimal from '@/utils/decimalUtil.js'

import {  calcBranchUsers } from '@/api/branch';

export default {
  props: ['menus'],
  data() {
    return {
      menuLoading: false,
      active: "xmgl",
      payWayOptions: [
        {
          label: '支付宝',
          val: 'aliPay',
          icon: aliPay,
          isChecked: true
        },
        {
          label: '微信',
          val: 'weixinPay',
          icon: weixinPay,
          isChecked: false
        }
      ],
      odaysOptions: [
        {
          label: '1年',
          val: '360',
          isHot: true,
          isChecked: true,
          price: '2'
        },
        {
          label: '6个月',
          val: '180',
          isHot: false,
          isChecked: false,
          price: '2'
        },
        {
          label: '3个月',
          val: '90',
          isHot: false,
          isChecked: false,
          price: '2'
        },
      ],
      form: {
        moduleIds:[],
        payway: 'aliPay',
        odays: '360',
        label:'1年',
        ousers:10,
        phone: '',
        checked: false, 
      },
      orders:{order:null,modules:[]},
      branchUsersCpd:{istatus:'1',maxUsers:50,ilvlId:'2',ilvlName:'黄金会员'}
    }
  },

  computed: {
    ...mapGetters([
      'userInfo'
    ]),    
  },

  watch: {

    'form.ousers':function(val,oldValue){  
      this.calcOrder();
    }
  },

  methods: {  
    formOusersChange(val){
      if(this.branchUsersCpd && this.branchUsersCpd.istatus=='1'){
        if(val<=this.branchUsersCpd.maxUsers){
          this.form.ousers=this.branchUsersCpd.maxUsers
          this.$notify({position:"bottom-left",message:"您当前在唛盟平台拥有"+this.branchUsersCpd.maxUsers+"个账户资格，企业总人数不能低于"+this.branchUsersCpd.maxUsers,type:"warning"})
           
          return false;
        }
       
      }
    },
    calcOrder:function() { 
       calcOrder(this.form).then(res=>{ 
         this.orders.order=res.data.data
         this.orders.modules=res.data.modules
         this.odaysOptions.forEach(i=>{ 
             i.price=parseInt(this.orders.order.ofinalFee/this.form.ousers/this.form.odays  )
         })
       })
    },
    selectItem(item) {
      if(item.isBuy){
        this.$notify({position:"bottom-left",message:"【"+item.name+"】已购买，如需调整，请进入【我的订单->加购】 处理",type:"warning"})
        return;
      }
       item.isChecked=!item.isChecked;
       if(item.isChecked==false){
          this.form.moduleIds=this.form.moduleIds.filter(i=>i!=item.id)
       }else  if(item.isChecked==true && !this.form.moduleIds.some(i=>i==item.id)){
         this.form.moduleIds.push(item.id)
       } 
       this.calcOrder();
    },

    selectPayWay(item) {
      this.form.payway = item.val;
      this.payWayOptions.forEach(element => {
        element.isChecked = false;
        if(item.val == element.val) {
          element.isChecked = true;
        }
      });
    },

    selectBuyDate(item) {   
      this.form.odays = item.val;
      this.odaysOptions.forEach(element => {
        element.isChecked = false;
        if(item.val == element.val) {
          element.isChecked = true;
        }
      });
      this.form.odays=item.val
      this.form.label=item.label
       this.calcOrder();
    },


    getForm() { 
      let obj = {
        ...this.orders,
        ...this.form
      }
      return obj;
    },
  },

  mounted() {
    this.form.phone = this.userInfo.phoneno;
    calcBranchUsers().then(res=>{  
     // Object.assign(this.branchUsersCpd,res.data.data);
      if(this.branchUsersCpd.branchId && this.branchUsersCpd.istatus=='1'){
         this.form.ousers=this.branchUsersCpd.maxUsers
         this.calcOrder();
      }
     
    })
  }

}
</script>

<style lang="scss">
@import './index.scss';
</style>