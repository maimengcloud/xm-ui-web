<template>
  <div class="full_continer">
    <div class="banner">
      <p>购买流程:&nbsp;&nbsp;&nbsp;1.选择模块 》 2.确认订单 》 3.支付 》 4.完成</p>
    </div>
    
    <div class="flux_continer">
      <div class="content">
        <div class="top_desc">
          <h2>购买订单</h2>
          <p>团队名: 擎勤科技</p>
        </div>

        <div class="version">
          <h2>选择版本</h2>
          <div class="version_item">
            <div class="oItem">
              <img src="@/assets/image/module/mo_enterprise.png" alt="">
              <div class="desc">
                <p>企业版</p>
                <p>(10人起购)</p>
              </div>
              <i class="select el-icon-success"></i>
            </div>
            <div class="oItem">
              <img src="@/assets/image/module/mo_flagship.png" alt="">
              <div class="desc">
                <p>旗舰版</p>
                <p>(50人起购)</p>
              </div>
            </div>
          </div>
        </div>

        <div class="sys_type">
          <div class="sys_desc">
            <h2>选择产品</h2>
            <span>项目管理系统</span>
            <span>协同办公系统</span>
            <span>电商定制系统</span>
          </div>

          <div class="sys_modules">
             <div class="module">
                <div class="module_top">
                  <img :src="xmgl" alt="">
                  <span>督办管理</span>
                </div>
                <div class="module_bottom">
                </div>
             </div>

             <div class="module">
                <div class="module_top">
                  <img :src="xmgl" alt="">
                  <span>资产管理</span>
                </div>
                <div class="module_bottom">
                </div>
              </div>

              <div class="module">
                <div class="module_top">
                  <img :src="csgl" alt="">
                  <span>会议管理</span>
                </div>
                <div class="module_bottom">
                </div>
              </div>

              <div class="module">
                <div class="module_top">
                  <img :src="csgl" alt="">
                  <span>会议管理</span>
                </div>
                <div class="module_bottom">
                </div>
              </div>
          </div>
        </div>        

        <div class="buy_count">
          <h2>
            购买数量
            <span>(购买账号不能少于10人)</span>
          </h2>

          <div class="buy_count_items">
            <div class="oItem">
              <div class="item_header">
                <p>项目管理系统</p>
              </div>
              <div class="item_bottom">
                 <span>10</span>
              </div>
            </div>

            <div class="oItem">
              <div class="item_header">
                <p>智慧协同办公系统</p>
              </div>
              <div class="item_bottom">
                 <span>10</span>
              </div>
            </div>
          </div>
        </div>

        <div class="buy_date">
          <h2>期限选择</h2>
          <div class="buy_date_items">
            <div class="oItem">
              <div class="header">
                1年
                <i class="select el-icon-success"></i>
              </div>
              <div class="bottom">
                <img src="@/assets/image/module/hot.png" alt="">
                <p>￥138.33/人月</p>
              </div>
            </div>

            <div class="oItem">
              <div class="header">
                6个月
                <i></i>
              </div>
              <div class="bottom">
                <p class="normal">￥138.33/人月</p>
              </div>
            </div>

            <div class="oItem">
              <div class="header">
                3个月
                <i></i>
              </div>
              <div class="bottom">
                <p class="normal">￥138.33/人月</p>
              </div>
            </div>
          </div>
        </div>

        <div class="pay_way">
          <h2>支付方式</h2>
          <div class="pay_way_items">
            <div class="oItem">
              <img src="@/assets/image/module/alipay.png" alt="">
              <span>支付宝</span>
              <i></i>
            </div>

            <div class="oItem">
              <img src="@/assets/image/module/weixin.png" alt="">
              <span>微信</span>
              <i></i>
            </div>
          </div>
          <el-input class="phone" placeholder="输入手机号"></el-input>
        </div>

        <div class="pay_allAmount">
          <h2>订单总额</h2>
          <p class="allAmount">￥<b>299</b>.00/年</p>
          <el-checkbox v-model="checked">同意<a>《服务协议》</a></el-checkbox>
        </div>

        <el-button size="larget" class="submit" type="primary">提交订单</el-button>

      </div>
    </div>
  </div>
</template>

<script>
import xmgl from '@/assets/image/module/xm/xm_project_management.png'
import csgl from '@/assets/image/module/xm/xm_test.png'
import cpgh from '@/assets/image/module/xm/xm_product_management.png'
import xngl from '@/assets/image/module/xm/xm_Efficiency_management.png'
import lsx  from '@/assets/image/module/xm/xm_flow_line.png'
import zzjg from '@/assets/image/module/xm/mo_org.png'
import zb   from '@/assets/image/module/xm/xm_crowd-sourcing.png'
import kfpt from '@/assets/image/module/xm/xm_development.png'



export default {
  data() {
    return {
      xmgl: xmgl,
      csgl: csgl,
      cpgh: cpgh,
      xngl: xngl,
      lsx: lsx,
      zzjg: zzjg,
      zb: zb,
      kfpt: kfpt,

    }
  },

}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>