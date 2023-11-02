<template>
  <section  class="page-container padding">
    <el-row class="page-main page-height-75" style="overflow-x: hidden;">
      <el-row style="padding-left: 20px;padding-top: 20px;padding-right: 20px">
        <el-card class="box-card" style="padding-left: 20px;">
          <div slot="header" class="clearfix">
            <span><strong>编辑平台及相关配置</strong></span><font color="blue">&nbsp;&nbsp;系统缓存，5-10分钟后起效</font>
          </div>
          <div>
            <el-row>
              <template>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                  <el-tab-pane label="平台信息" name="first">
                    <el-row class="padding-right ">
                      <el-form :model="editForm" label-width="200px" :rules="platformRules" ref="editFormPlat" v-loading="load.list">
                        <el-form-item label="平台名称" prop="platformName" :rules="[{ required:true, message: '平台名称不能为空'}]">
                          <el-input v-model="editForm.platformName" auto-complete="off" style="width: 50%;"></el-input>
                        </el-form-item>
                        <el-form-item label="前端显示的平台名称" prop="platformTitle" :rules="[{ required:true, message: '此项不能为空'}]">
                          <el-input v-model="editForm.platformTitle" auto-complete="off" style="width: 50%;"></el-input>
                        </el-form-item>
                        <el-form-item label="平台LOGO" prop="logoUrl">
                          <mdp-image  v-model="editForm.logoUrl" fit="contain">
                           </mdp-image>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                          <el-input type="textarea" rows=6 v-model="editForm.remark" auto-complete="off" style="width: 50%;"></el-input>
                        </el-form-item>
                        <el-form-item>
                          <el-col :span="24" :offset="8">
                            <el-button @click.native="handleCancel">取消</el-button>
                            <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
                          </el-col>
                        </el-form-item>
                      </el-form>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane label="常规设置" name="second">
                    <el-row class="padding-right ">
                      <el-form :model="editForm" label-width="200px" :rules="platformRules" ref="editFormComm" v-loading="load.list">
                        <el-form-item label="关键词" prop="keywords">
                          <el-input v-model="editForm.keywords" clearable placeholder="请输入关键词"
                                    :rules="[{ required:true, message: '关键词不能为空'}]" style="width:50%">
                          </el-input>
                          <div class="sub-title">多个关键词请以空格分割</div>
                        </el-form-item>
                        <el-form-item label="商品评价是否需要审核" prop="evaluate">
                          <template>
                            <el-radio v-model="editForm.evaluate" label="0">否</el-radio>
                            <el-radio v-model="editForm.evaluate" label="1">是</el-radio>
                          </template>
                        </el-form-item>
                        <el-form-item>
                          <el-col :span="24" :offset="8"> 
                            <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
                          </el-col>
                        </el-form-item>
                      </el-form>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane label="购物设置" name="third">
                    <el-row class="padding-right ">
                      <el-form :model="editForm" label-width="200px" :rules="platformRules" ref="editFormShopping" v-loading="load.list">
                        <el-form-item label="最小购买金额" prop="minBuyAmount">
                          <el-input-number v-model="editForm.minBuyAmount" :min="0" :max="200" :controls="false"></el-input-number>
                          <div class="sub-title">达到此购物金额，才能提交订单,默认为0</div>
                        </el-form-item>
                        <el-form-item label="统一折扣率" prop="discountPct">
                          <el-input-number v-model="editForm.discountPct" :min="1" :max="100" :controls="false"></el-input-number>&nbsp;%
                          <div class="sub-title">所有商品按此打折扣 假设原价100元 ，折后价为= 100 * {{editForm.discountPct}}% = {{editForm.discountPct}}元</div>
                        </el-form-item>
                        <el-form-item label="自动确认收货" prop="autoConfirmReceipt">
                          <template>
                            <el-radio v-model="editForm.autoConfirmReceipt" label="0">关闭</el-radio>
                            <el-radio v-model="editForm.autoConfirmReceipt" label="1">开启</el-radio>
                          </template>
                          <div class="sub-title">确认收货时长请在订单设置中进行设置</div>
                        </el-form-item>
                        <el-form-item label="是否可开发票" prop="canBill">
                          <template>
                            <el-radio v-model="editForm.canBill" label="1">能</el-radio>
                            <el-radio v-model="editForm.canBill" label="0">不能</el-radio>
                          </template>
                        </el-form-item>
                        <el-form-item label="发票内容选项" prop="billContextList">
                          <el-input v-model="editForm.billContextList" placeholder="多个选项请以单个空格分割" style="width: 50%;"></el-input>
                          <div class="sub-title">客户要求开发票时可以选择的内容。例如：办公用品。多个选项用1个空格分隔。</div>
                        </el-form-item>
                        <el-form-item label="扣减库存时机" prop="cutStock">
                          <template>
                            <el-radio v-model="editForm.cutStock" label="0">下单付款完成</el-radio>
                            <el-radio v-model="editForm.cutStock" label="1">发货后</el-radio>
                          </template>
                        </el-form-item>
                        <el-form-item label="增加销量时机" prop="plusSales">
                          <template>
                            <el-radio v-model="editForm.plusSales" label="0">发货后</el-radio>
                            <el-radio v-model="editForm.plusSales" label="1">付款后</el-radio>
                          </template>
                        </el-form-item>
                        <el-form-item>
                          <el-col :span="24" :offset="8"> 
                            <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
                          </el-col>
                        </el-form-item>
                      </el-form>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane label="备注设置" name="fourth">
                    <template>
                      <el-row style="padding-left: 30px;padding-top: 30px;">
                        <el-col :span="8" style="text-align: right">
                          <span>修改订单“发票信息”时：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-radio-group v-model="extConfigObject.bill">
                            <el-radio :label="'1'">必须填写备注</el-radio>
                            <el-radio :label="'0'">无需填写备注</el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row style="padding-left: 30px;padding-top: 30px;">
                        <el-col :span="8" style="text-align: right">
                          <span>修改订单“收货人信息”时：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-radio-group v-model="extConfigObject.receipt">
                            <el-radio :label="'1'">必须填写备注</el-radio>
                            <el-radio :label="'0'">无需填写备注</el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row style="padding-left: 30px;padding-top: 30px;">
                        <el-col :span="8" style="text-align: right">
                          <span>修改订单“商品信息”时：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-radio-group v-model="extConfigObject.order">
                            <el-radio :label="'1'">必须填写备注</el-radio>
                            <el-radio :label="'0'">无需填写备注</el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row style="padding-left: 30px;padding-top: 30px;">
                        <el-col :span="8" style="text-align: right">
                          <span>修改订单“费用信息”时：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-radio-group v-model="extConfigObject.orderFee">
                            <el-radio :label="'1'">必须填写备注</el-radio>
                            <el-radio :label="'0'">无需填写备注</el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row style="padding-left: 30px;padding-top: 30px;">
                        <el-col :span="8" style="text-align: right">
                          <span>关闭订单时：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-radio-group v-model="extConfigObject.closeOrder">
                            <el-radio :label="'1'">必须填写备注</el-radio>
                            <el-radio :label="'0'">无需填写备注</el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row style="padding-left: 30px;padding-top: 30px;">
                        <el-col :span="8" style="text-align: right">
                          <span>取消订单时：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-radio-group v-model="extConfigObject.cancelOrder">
                            <el-radio :label="'1'">必须填写备注</el-radio>
                            <el-radio :label="'0'">无需填写备注</el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row style="padding-left: 30px;padding-top: 30px;">
                        <el-col :span="8" style="text-align: right">
                          <span>退货处理时：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-radio-group v-model="extConfigObject.reGoods">
                            <el-radio :label="'1'">必须填写备注</el-radio>
                            <el-radio :label="'0'">无需填写备注</el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row style="padding-left: 30px;padding-top: 30px;">
                        <el-col :span="8" style="text-align: right">
                          <span>退货确认收货时：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-radio-group v-model="extConfigObject.reReceipt">
                            <el-radio :label="'1'">必须填写备注</el-radio>
                            <el-radio :label="'0'">无需填写备注</el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row style="padding-left: 30px;padding-top: 30px;">
                        <el-col :span="8" style="text-align: right">
                          <span>退款处理时：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-radio-group v-model="extConfigObject.rePay">
                            <el-radio :label="'1'">必须填写备注</el-radio>
                            <el-radio :label="'0'">无需填写备注</el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row style="padding-left: 30px;padding-top: 30px;">
                        <el-col :span="8" style="text-align: right">
                          <span>修改积分时：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-radio-group v-model="extConfigObject.cpoints">
                            <el-radio :label="'1'">必须填写备注</el-radio>
                            <el-radio :label="'0'">无需填写备注</el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                      <el-row style="padding-left: 30px;padding-top: 30px;">
                        <el-col :span="24" :offset="8"> 
                          <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
                        </el-col>
                      </el-row>
                    </template>
                  </el-tab-pane>
                  
                  <el-tab-pane label="商户设置" name="shopSet">
                    <el-row class="padding-right ">
                      <el-form :model="editForm" label-width="200px" :rules="platformRules" ref="editFormShopSet" v-loading="load.list">
                         <el-form-item label="平台机构编号" prop="branchId">
                          <el-input v-model="editForm.branchId" clearable placeholder="请输入平台机构编号"
                                    :rules="[{ required:true, message: '平台机构编号不能为空'}]" style="width:50%">
                          </el-input> 
                          <font color="blue">平台机构编号 请按实际编号填写，一般为运营机构编号</font>
                        </el-form-item> 
                        <el-form-item label="平台商户编号" prop="shopId">
                          <el-input v-model="editForm.shopId" clearable placeholder="平台商户编号"
                                    :rules="[{ required:true, message: '商户编号不能为空'}]" style="width:50%">
                          </el-input>  
                          <font color="blue">平台商户编号 请按实际编号填写，可以取机构编号作为商户编号</font>
                        </el-form-item>
                        <el-form-item label="总部店铺编号" prop="locationId">
                          <el-input v-model="editForm.locationId" clearable placeholder="总部店铺编号"
                                    :rules="[{ required:true, message: '总部店铺编号不能为空'}]" style="width:50%">
                          </el-input> 
                          <font color="总部店铺默认编号，建议为 商户编号-0 "></font>
                        </el-form-item> 
                        <el-form-item>
                          <el-col :span="24" :offset="8"> 
                            <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
                          </el-col>
                        </el-form-item>
                      </el-form>
                    </el-row>
                  </el-tab-pane> 
                  
                  <el-tab-pane label="其它拓展信息" name="extInfosSet">
                      <ext-infos v-model="editForm.extInfos"></ext-infos>

                      <el-row>
                          <el-col :span="24" :offset="8"> 
                            <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
                          </el-col>
                        </el-row>
                  </el-tab-pane>
                </el-tabs>
              </template>
            </el-row>
          </div>
        </el-card>
      </el-row>
    </el-row>
  </section>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import { listPlatform,editPlatform } from '@/api/mdp/plat/platform';
import { mapGetters } from 'vuex'; 
import ExtInfos from "@/components/ExtInfos/Index";

export default {
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  props:['platform','visible'],
  watch: {
    'platform':function( platform ) {
      this.editForm = platform;
    },
    'visible':function(visible) {
      if(visible==true){
        //从新打开页面时某些数据需要重新加载，可以在这里添加
      }
    }
  },
  data() {
    return {
      //其它全局控制参数
      extConfigObject:{
        bill:'',      //填写 发票信息时是否必须填写备注0否1是,
        receipt:'',   //修改订单“收货人信息”时,
        order:'',     //修改订单“商品信息”时,
        orderFee: '', //修改订单“费用信息”时,
        closeOrder:'',//关闭订单时,
        cancelOrder:'',//取消订单时,
        reGoods:'',    //退货处理时,
        reReceipt:'',  //退货确认收货时,
        rePay:'',      //退款处理时,
        cpoints:'',    //修改积分时,
      },
      activeName:'first',
      options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load:{ list: false, edit: false, del: false, add: false },//查询中...
      editFormRules: {
        id: [
          //{ required: true, message: '平台编号建议为platform-001不能为空', trigger: 'blur' }
        ]
      },
      platformRules: {

      },
      //编辑界面数据  Platform plat_platform
      editForm: {
        id:'',platformName:'',remark:'',status:'',ctime:'',ltime:'',cuserid:'',cusername:'',logoUrl:'',platformTitle:'',keywords:'',minBuyAmount:'',autoConfirmReceipt:'',canBill:'',billContextList:'',cutStock:'',extConfig:'',plusSales:'',evaluate:'',discountPct:'100',usePriceGroup:'',shopId:'',branchId:'',locationId:'',extInfos:'',
      }
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/

      /**end 在上面加自定义属性**/
    }//end return
  },//end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
    handleCancel:function(){
      this.getPlatforms();
    },
    getPlatforms() {
      let params = {
        id:'platform-001',
        status:'1',
      };
      this.load.list = true;
      listPlatform(params).then((res) => {
        var tips=res.data.tips;
        if(tips.isOk){
          this.editForm = res.data.data[0];
          //解析其它全局控制参数
          this.extConfigObject = JSON.parse(res.data.data[0].extConfig);
        }else{
          this.$notify({ message: tips.msg, type: 'error' });
        }
        this.load.list = false;
      }).catch( err => this.load.list = false );
    },
    //编辑提交Platform plat_platform父组件监听@submit="afterEditSubmit"
    editSubmit: function () { 
      this.$refs.editFormPlat.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.load.edit=true;
            this.editForm.extConfig = JSON.stringify(this.extConfigObject);
            let params = Object.assign({}, this.editForm);
            editPlatform(params).then((res) => { 
              this.load.edit=false
              var tips=res.data.tips; 
                this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
            }).catch( err =>this.load.edit=false);
          });
        }
      });
    },
    /**begin 在下面加自定义方法,记得补上面的一个逗号**/
    handleClick(tab, event) {
      console.log(tab, event);

    },
    /**end 在上面加自定义方法**/
  },//end method
  components: { 
    ExtInfos
  },
  mounted() {
    this.getPlatforms();
  }
}

</script>

<style scoped>
.sub-title{
  color: #9fa4ad;
}
</style>
