<template>
  <div class="full_continer">
    <div class="banner">
        <p>购买流程:&nbsp;&nbsp;&nbsp;1.选择模块 》 <span style="color:red;">2.确认订单 》</span> 3.支付 》 4.完成</p>
    </div>
    <div class="flux_continer">
      <div class="content">
        <div class="top_desc">
          <h2>购买信息</h2>
          <p>团队名:&nbsp;&nbsp;擎勤科技</p>
        </div>

        <div class="order_detail">
          <h2>订单详情</h2>

          <div class="order_box">
            <div class="content">
              <div class="middle">
                <div class="desc">
                  <el-descriptions size="larget" :column="3" >
                    <el-descriptions-item label="购买版本">企业版</el-descriptions-item>
                    <el-descriptions-item label="创建人">谢家豪</el-descriptions-item>
                    <!-- <el-descriptions-item label="手机号码">18826103122</el-descriptions-item> -->
                    <el-descriptions-item label="支付方式">{{data.payway == 'aliPay' ? '支付宝' : '微信'}}</el-descriptions-item>
                  </el-descriptions>
                </div>
                <div class="table">
                  <el-table
                    size="larget"
                    border
                    :data="data.data"
                    style="width: 100%"
                    height="250">
                    <el-table-column
                      prop="name"
                      label="产品类型"
                      >
                      <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.mcate == '1' ? '智慧协同办公系统' : 
                           scope.row.mcate == '2' ? '项目管理' : '商城'}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="产品名称"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="num"
                      label="账号数量"
                      width="120">
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <div class="bottom">
                <span class="allAmount">
                  总金额: <b>{{data.amount}}￥</b>
                </span>
                <el-button size="larget" @click="returnPage">上一步</el-button>
                <el-button size="larget" type="primary" :loading="createOrderLonding" @click="createOrder">确认支付</el-button>
              </div>
            </div>
          </div>
        </div>
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
import {createOrder} from '@/api/mdp/sys/order'
import {aliPay, weixinPay, checkWxPayStatus} from '@/api/mdp/pay/pay'

export default {
  data() {
    return {
      data: null,
      createOrderLonding: false,
      weixinPayVisible: false,
      codeUrl: ""
    }
  },
  methods: {
    returnPage() {
      this.$router.go(-1);
    },

    createOrder() {
      //来源
      this.data.osource = "1";
      //订单类型
      this.data.otype = "1";
      //备注
      this.data.remark = "";
      this.data.name = "模块开通订单"
      this.createOrderLonding = true;
      createOrder(this.data).then(res => {
        if(res.data.tips.isOk){
          //获取订单号
          let orderId = res.data.data;
          if(this.data.payway == 'aliPay') {
            this.toAliPay(orderId);
            return;
          }
          if(this.data.payway == 'weixinPay') {
            this.toWeixinPay(orderId);
            return;
          }
        }else{
          this.$message.error(res.data.tips.msg);
        }
      }).catch(err => {
        this.$message.error(err.msg);
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
          this.$message.error(res.data.tips.msg);
        }
      }).finally(() => {
        setTimeout(() => {
          this.createOrderLonding = false;
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
          this.$message.error(res.data.tips.msg);
        }
      }).finally(() => {
         setTimeout(() => {
          this.createOrderLonding = false;
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

  created() {
    let data = JSON.parse(window.localStorage.getItem("BUY_MODULES"));
    this.data = data;
   
  },

}
</script>

<style lang="scss" scoped>
@import './index.scss';
.order_detail {
  margin-top: 30px;
  .order_box {
    margin-top: 30px;
    width: 100%;
    max-height: 500px;
    border: 1px solid #E3E4E6;
    .content {
      .header {
        height: 60px;
        display: flex;
        align-items: center;
        padding-left: 20px;
        border-bottom: 2px solid #F4F5F8;
      }
      .middle {
        padding: 20px;
        .desc {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          span {
            margin-right: 60px;
            margin-bottom: 20px;
            color: #606060;
          }
        }
      }
      .bottom {
        padding: 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .allAmount {
          margin-right: 40px;
          b {
            font-size: 24px;
            color: #FA5A55;
          }
        }
      }
    }
  }
}


</style>