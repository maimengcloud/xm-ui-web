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
          <div class="footer" v-if="item.isChecked == true">
            <el-input-number style="width: 180px;" @change="numChange(item)" v-model="item.num"  :min="10" :max="99999" ></el-input-number>
          </div>
        </div>
      </div>
    </div>        

    <!-- <div class="buy_count">
      <h2>
        购买数量
        <span>(购买账号不能少于10人)</span>
      </h2>

      <div class="buy_count_items">
        <div class="oItem" v-for="(item, index) in totalList" :key="index">
          <div class="item_header">
            <p>{{item.name}}</p>
          </div>
          <div class="item_bottom">
            <span>{{item.val}}</span>
          </div>
        </div>
      </div>
    </div> -->

    <div class="buy_date">
      <h2>期限选择</h2>
      <div class="buy_date_items">
        <div class="oItem" @click="selectBuyDate(item)" v-for="(item, index) in useTimeOptions" :key="index">
          <div class="header">
            {{item.label}}
            <i v-if="item.isChecked" class="select el-icon-success"></i>
          </div>
          <div class="bottom">
            <img v-if="item.isHot" src="@/assets/image/module/hot.png" alt="">
            <p>￥{{item.price}}/人月</p>
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
      <p class="allAmount">￥<b>{{allAmount}}</b>/年</p>
      <el-checkbox v-model="form.checked">同意</el-checkbox> <a style="font-size: 14px;color: #409EFF">《服务协议》</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {getAllMenuModule, getBuyMenuModule} from '@/api/mdp/sys/modules'
import aliPay from '@/assets/image/module/alipay.png';
import weixinPay from '@/assets/image/module/weixin.png'
import Decimal from "decimal.js"  // 具体文件中引入
import { months } from 'moment';

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
      useTimeOptions: [
        {
          label: '1年',
          val: '12',
          isHot: true,
          isChecked: true,
          price: '200.00'
        },
        {
          label: '6个月',
          val: '6',
          isHot: false,
          isChecked: false,
          price: '200.00'
        },
        {
          label: '3个月',
          val: '3',
          isHot: false,
          isChecked: false,
          price: '200.00'
        },
      ],
      form: {
        payway: 'aliPay',
        usetime: '12',
        phone: '',
        checked: false,
        amount: 0
      }
    }
  },

  computed: {
    totalList() {
      if(this.menus == null) return;
      let obj = [{key: 'xmgl',name: '项目管理', val : 0},{key: 'oa',name: '智慧协同办公系统',val : 0},{key: 'mall',name: '商城',val : 0}]
      let xmCount = 0;
      let oaConut = 0;
      let mallCount = 0;
      this.menus.xmgl.forEach(m => {
        if(m.isChecked) {
          xmCount += m.num;
        }
      });
      this.menus.oa.forEach(m => {
        if(m.isChecked) {
          oaConut += m.num;
        }
      });

      this.menus.mall.forEach(m => {
        if(m.isChecked) {
          mallCount += m.num;
        }
      });
      obj[0].val = xmCount;
      obj[1].val = oaConut;
      obj[2].val = mallCount;
      return obj
    },

    allAmount() {
      if(this.menus == null) return;
      //计费规则
      let tempData = [];
      let xm = this.menus.xmgl.filter(res => {return res.isChecked ==  true;})
      let oa = this.menus.oa.filter(res => {return res.isChecked ==  true;})
      let mall = this.menus.mall.filter(res => {return res.isChecked ==  true;})
      tempData = Array.concat(xm).concat(oa).concat(mall);

      //计算价格，每个单独计算
      let amount = new Decimal(0);
      let allNum = 0;
      //人均费用 * 数量 * 数量折扣优惠 * 月份折扣优惠
      tempData.forEach(t => {
        let numDiscount = 1;
        let monthDiscount = 1;
        allNum += t.num;

        //免费
        if(t.billMode == 0) {
          amount = amount.add(0);
        }

        if(t.billMode == 1) {
          if(t.discount != null && t.discount != "" && t.discount != undefined) {
            let discount = JSON.parse(t.discount);
            //用户数量折扣
            numDiscount = this.getNumDiscount(discount.userNum, t.num);
            //用户月份折扣
            monthDiscount = this.getMonthDiscount(discount.months, this.form.usetime);
          }
          amount = amount.add(new Decimal(t.uniFee).mul(new Decimal(t.num)).mul(numDiscount).mul(monthDiscount));
        }
        
        //总包模式
        if(t.billMode == 2) {
          amount = amount.add(new Decimal(t.fee));
        }
      })

      this.form.amount = amount;

      return amount;
    }
  },

  watch: {
    allAmount: {
      handler(val, oval) {
        if(this.menus == null) return;
        let tempData = [];
        let xm = this.menus.xmgl.filter(res => {return res.isChecked ==  true;})
        let oa = this.menus.oa.filter(res => {return res.isChecked ==  true;})
        let mall = this.menus.mall.filter(res => {return res.isChecked ==  true;})
        tempData = Array.concat(xm).concat(oa).concat(mall);
        let yearAmount = new Decimal(0);
        let halfYearAmount = new Decimal(0);
        let quarter = new Decimal(0);
        let allNum = 0;

        tempData.forEach(t => {
          let numDiscount = 1;
          let monthDiscount = 1;
          allNum += t.num;
          if(t.discount != null && t.discount != "" && t.discount != undefined) {
            let discount = JSON.parse(t.discount);
            //用户数量折扣
            numDiscount = this.getNumDiscount(discount.userNum, t.num);
            this.useTimeOptions.forEach(element => {
              //用户月份折扣
              monthDiscount = this.getMonthDiscount(discount.months, element.val);
              if(element.val == "12") {
                yearAmount = yearAmount.add(new Decimal(t.uniFee).mul(new Decimal(t.num)).mul(numDiscount).mul(monthDiscount));
              }

              if(element.val == "6") {
                halfYearAmount = halfYearAmount.add(new Decimal(t.uniFee).mul(new Decimal(t.num)).mul(numDiscount).mul(monthDiscount));
              }

              if(element.val == "3") {
                quarter = quarter.add(new Decimal(t.uniFee).mul(new Decimal(t.num)).mul(numDiscount).mul(monthDiscount));
              }
            });
          }else {
            yearAmount = yearAmount.add(new Decimal(t.uniFee).mul(new Decimal(t.num)));
            halfYearAmount = halfYearAmount.add(new Decimal(t.uniFee).mul(new Decimal(t.num)));
            quarter = quarter.add(new Decimal(t.uniFee).mul(new Decimal(t.num)));
          }
        })
        
        this.useTimeOptions.forEach(element => {
          if(element.val == "12" && yearAmount != 0) {
            element.price = yearAmount.div(allNum).toFixed(2, Decimal.ROUND_HALF_UP);
          }
          if(element.val == "6" && halfYearAmount != 0) {
            element.price = halfYearAmount.div(allNum).toFixed(2, Decimal.ROUND_HALF_UP);
          }
          if(element.val == "3" && quarter != 0) {
            element.price = quarter.div(allNum).toFixed(2, Decimal.ROUND_HALF_UP);
          }
        })
      },
      immediate: true
    }
  },

  methods: {

    getNumDiscount(discount, num) {
      let sale = new Decimal(1);
      let nums = discount.split("\n");
      var map = new Map();
      nums.forEach(element => {
        let t = element.split(":");
        map.set(t[0], t[1]);
      });

      map.forEach(function(value,key){
        let t = key.split("-");
        if(num >= t[0] && num <= t[1]) {
          sale = new Decimal(value).div(new Decimal(100))
        }
      });
      return sale;
    },

    getMonthDiscount(discount, month) {
      let sale = new Decimal(1);
      let condition = discount.split("\n");
      var map = new Map();
      condition.forEach(element => {
        let t = element.split(":");
        map.set(t[0], t[1]);
      });
      map.forEach(function(value, key){
        if(new Decimal(month).comparedTo(key) == 0) {
          sale = new Decimal(value).div(new Decimal(100))
        }
      });
      return sale;
    },

    numChange(item) {
      item.isChecked = true;
    },

    selectItem(item) {
      if(this.active == 'xmgl') {
        this.menus.xmgl.forEach(element => {
          if(element.id == item.id) {
            element.isChecked ? element.isChecked = !element.isChecked : element.isChecked = true;
          }
        });
      }

      if(this.active == 'mall') {
        this.menus.mall.forEach(element => {
          if(element.id == item.id) {
            element.isChecked ? element.isChecked = !element.isChecked : element.isChecked = true;
          }
        });
      }

      if(this.active == 'oa') {
        this.menus.oa.forEach(element => {
          if(element.id == item.id) {
            element.isChecked ? element.isChecked = !element.isChecked : element.isChecked = true;
          }
        });
      }
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
      this.form.usetime = item.val;
      this.useTimeOptions.forEach(element => {
        element.isChecked = false;
        if(item.val == element.val) {
          element.isChecked = true;
        }
      });
    },


    getForm() {
      let tempData = [];
      let xm = this.menus.xmgl.filter(res => {return res.isChecked ==  true;})
      let oa = this.menus.oa.filter(res => {return res.isChecked ==  true;})
      let mall = this.menus.mall.filter(res => {return res.isChecked ==  true;})
      tempData = Array.concat(xm).concat(oa).concat(mall);
      let obj = {
        data: tempData,
        ...this.form
      }
      return obj;
    },

  },

  created() {
  }

}
</script>

<style lang="scss">
@import './index.scss';
</style>