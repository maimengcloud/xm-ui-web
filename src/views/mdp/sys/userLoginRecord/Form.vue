<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 UserLoginRecord 用户登录信息登记-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="用户编号" prop="userid">
                <el-input  v-model="editForm.userid" placeholder="用户编号" :maxlength="64" @change="editSomeFields(editForm,'userid',$event)" :disabled="  disabledJudge('userid')"/>
            </el-form-item>
            <el-form-item label="商户编号" prop="shopId">
                <el-input  v-model="editForm.shopId" placeholder="商户编号" :maxlength="64" @change="editSomeFields(editForm,'shopId',$event)" :disabled="  disabledJudge('shopId')"/>
            </el-form-item>
            <el-form-item label="门店编号" prop="locationId">
                <el-input  v-model="editForm.locationId" placeholder="门店编号" :maxlength="64" @change="editSomeFields(editForm,'locationId',$event)" :disabled="  disabledJudge('locationId')"/>
            </el-form-item>
            <el-form-item label="登录的商户编号" prop="loginShopid">
                <el-input  v-model="editForm.loginShopid" placeholder="登录的商户编号" :maxlength="64" @change="editSomeFields(editForm,'loginShopid',$event)" :disabled="  disabledJudge('loginShopid')"/>
            </el-form-item>
            <el-form-item label="登录的门店编号" prop="loginLocationid">
                <el-input  v-model="editForm.loginLocationid" placeholder="登录的门店编号" :maxlength="64" @change="editSomeFields(editForm,'loginLocationid',$event)" :disabled="  disabledJudge('loginLocationid')"/>
            </el-form-item>
            <el-form-item label="机构编号" prop="branchId">
                <el-input  v-model="editForm.branchId" placeholder="机构编号" :maxlength="64" @change="editSomeFields(editForm,'branchId',$event)" :disabled="  disabledJudge('branchId')"/>
            </el-form-item>
            <el-form-item label="1-微信扫门店二维码，2-点击小程序登录，3-账户密码登录，4-手机号码登录" prop="loginType">
                <el-input  v-model="editForm.loginType" placeholder="1-微信扫门店二维码，2-点击小程序登录，3-账户密码登录，4-手机号码登录" :maxlength="1" @change="editSomeFields(editForm,'loginType',$event)" :disabled="  disabledJudge('loginType')"/>
            </el-form-item>
            <el-form-item label="登录时间" prop="loginTime">
                <el-date-picker type="date" placeholder="选择日期"  v-model="editForm.loginTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="  disabledJudge('loginTime')"></el-date-picker>
            </el-form-item>
            <el-form-item label="登录机构号" prop="loginBranchId">
                <el-input  v-model="editForm.loginBranchId" placeholder="登录机构号" :maxlength="64" @change="editSomeFields(editForm,'loginBranchId',$event)" :disabled="  disabledJudge('loginBranchId')"/>
            </el-form-item>
            <el-form-item label="登录用户名" prop="username">
                <el-input  v-model="editForm.username" placeholder="登录用户名" :maxlength="50" @change="editSomeFields(editForm,'username',$event)" :disabled="  disabledJudge('username')"/>
            </el-form-item>
            <el-form-item label="授权码" prop="authId">
                <el-input  v-model="editForm.authId" placeholder="授权码" :maxlength="64" @change="editSomeFields(editForm,'authId',$event)" :disabled="  disabledJudge('authId')"/>
            </el-form-item>
            <el-form-item label="mdp平台appid" prop="mdpAppid">
                <el-input  v-model="editForm.mdpAppid" placeholder="mdp平台appid" :maxlength="64" @change="editSomeFields(editForm,'mdpAppid',$event)" :disabled="  disabledJudge('mdpAppid')"/>
            </el-form-item>
            <el-form-item label="批处理编号" prop="lockNo">
                <el-input  v-model="editForm.lockNo" placeholder="批处理编号" :maxlength="64" @change="editSomeFields(editForm,'lockNo',$event)" :disabled="  disabledJudge('lockNo')"/>
            </el-form-item>
            <el-form-item label="批处理状态0-待处理1-处理中2处理完毕" prop="lockStatus">
                <el-input  v-model="editForm.lockStatus" placeholder="批处理状态0-待处理1-处理中2处理完毕" :maxlength="1" @change="editSomeFields(editForm,'lockStatus',$event)" :disabled="  disabledJudge('lockStatus')"/>
            </el-form-item>
            <el-form-item label="批处理时间" prop="lockTime">
                <el-date-picker type="date" placeholder="选择日期"  v-model="editForm.lockTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="  disabledJudge('lockTime')"></el-date-picker>
            </el-form-item>
            <el-form-item label="登录手机号" prop="phoneno">
                <el-input  v-model="editForm.phoneno" placeholder="登录手机号" :maxlength="64" @change="editSomeFields(editForm,'phoneno',$event)" :disabled="  disabledJudge('phoneno')"/>
            </el-form-item>
            <el-form-item label="登录ip" prop="loginIp">
                <el-input  v-model="editForm.loginIp" placeholder="登录ip" :maxlength="50" @change="editSomeFields(editForm,'loginIp',$event)" :disabled="  disabledJudge('loginIp')"/>
            </el-form-item>
            <el-form-item label="mem-会员端用户，adm-管理端用户" prop="userType">
                <el-input  v-model="editForm.userType" placeholder="mem-会员端用户，adm-管理端用户" :maxlength="10" @change="editSomeFields(editForm,'userType',$event)" :disabled="  disabledJudge('userType')"/>
            </el-form-item>
            <el-form-item label="登录设备编号" prop="loginDeviceId">
                <el-input  v-model="editForm.loginDeviceId" placeholder="登录设备编号" :maxlength="50" @change="editSomeFields(editForm,'loginDeviceId',$event)" :disabled="  disabledJudge('loginDeviceId')"/>
            </el-form-item>
            <el-form-item label="设备特征码" prop="loginDeviceSn">
                <el-input  v-model="editForm.loginDeviceSn" placeholder="设备特征码" :maxlength="50" @change="editSomeFields(editForm,'loginDeviceSn',$event)" :disabled="  disabledJudge('loginDeviceSn')"/>
            </el-form-item>
            <el-form-item label="请求特征码" prop="userAgent">
                <el-input  v-model="editForm.userAgent" placeholder="请求特征码" :maxlength="800" @change="editSomeFields(editForm,'userAgent',$event)" :disabled="  disabledJudge('userAgent')"/>
            </el-form-item>
            <el-form-item label="请求特征码-方便前端补充回填部分信息" prop="reqNo">
                <el-input  v-model="editForm.reqNo" placeholder="请求特征码-方便前端补充回填部分信息" :maxlength="50" @change="editSomeFields(editForm,'reqNo',$event)" :disabled="  disabledJudge('reqNo')"/>
            </el-form-item>
            <el-form-item label="设备类型COMPUTER/MOBILE/TABLET/GAME_CONSOLE/DMR/WEARABLE/UNKNOWN" prop="deviceType">
                <el-input  v-model="editForm.deviceType" placeholder="设备类型COMPUTER/MOBILE/TABLET/GAME_CONSOLE/DMR/WEARABLE/UNKNOWN" :maxlength="50" @change="editSomeFields(editForm,'deviceType',$event)" :disabled="  disabledJudge('deviceType')"/>
            </el-form-item>
            <el-form-item label="操作系统Windows/ios/Android" prop="os">
                <el-input  v-model="editForm.os" placeholder="操作系统Windows/ios/Android" :maxlength="10" @change="editSomeFields(editForm,'os',$event)" :disabled="  disabledJudge('os')"/>
            </el-form-item>
            <el-form-item label="操作系统版本如Android" prop="osVersion">
                <el-input  v-model="editForm.osVersion" placeholder="操作系统版本如Android" :maxlength="50" @change="editSomeFields(editForm,'osVersion',$event)" :disabled="  disabledJudge('osVersion')"/>
            </el-form-item>
            <el-form-item label="操作系统名称如Android" prop="osName">
                <el-input  v-model="editForm.osName" placeholder="操作系统名称如Android" :maxlength="50" @change="editSomeFields(editForm,'osName',$event)" :disabled="  disabledJudge('osName')"/>
            </el-form-item>
            <el-form-item label="浏览器渲染引擎如WEBKIT" prop="renderingEngine">
                <el-input  v-model="editForm.renderingEngine" placeholder="浏览器渲染引擎如WEBKIT" :maxlength="50" @change="editSomeFields(editForm,'renderingEngine',$event)" :disabled="  disabledJudge('renderingEngine')"/>
            </el-form-item>
            <el-form-item label="设备生产厂商" prop="deviceManufacturer">
                <el-input  v-model="editForm.deviceManufacturer" placeholder="设备生产厂商" :maxlength="50" @change="editSomeFields(editForm,'deviceManufacturer',$event)" :disabled="  disabledJudge('deviceManufacturer')"/>
            </el-form-item>
            <el-form-item label="浏览器组" prop="browerGroup">
                <el-input  v-model="editForm.browerGroup" placeholder="浏览器组" :maxlength="50" @change="editSomeFields(editForm,'browerGroup',$event)" :disabled="  disabledJudge('browerGroup')"/>
            </el-form-item>
            <el-form-item label="浏览器名称" prop="borderName">
                <el-input  v-model="editForm.borderName" placeholder="浏览器名称" :maxlength="50" @change="editSomeFields(editForm,'borderName',$event)" :disabled="  disabledJudge('borderName')"/>
            </el-form-item>
            <el-form-item label="浏览器版本" prop="borderVersion">
                <el-input  v-model="editForm.borderVersion" placeholder="浏览器版本" :maxlength="50" @change="editSomeFields(editForm,'borderVersion',$event)" :disabled="  disabledJudge('borderVersion')"/>
            </el-form-item>
            <el-form-item label="主键" prop="id">
                <el-input  v-model="editForm.id" placeholder="主键" :maxlength="50" @change="editSomeFields(editForm,'id',$event)" :disabled="  disabledJudge('id')"/>
            </el-form-item>
            <el-form-item label="经度" prop="longitude">
                <el-input  v-model="editForm.longitude" placeholder="经度" :maxlength="10" :disabled="  disabledJudge('longitude')"/>
            </el-form-item>
            <el-form-item label="纬度" prop="latitude">
                <el-input  v-model="editForm.latitude" placeholder="纬度" :maxlength="10" :disabled="  disabledJudge('latitude')"/>
            </el-form-item>
            <el-form-item label="区域编号精确到4级镇、街道" prop="regionId">
                <el-input  v-model="editForm.regionId" placeholder="区域编号精确到4级镇、街道" :maxlength="50" @change="editSomeFields(editForm,'regionId',$event)" :disabled="  disabledJudge('regionId')"/>
            </el-form-item>
            <el-form-item label="定位街道名称" prop="regionName">
                <el-input  v-model="editForm.regionName" placeholder="定位街道名称" :maxlength="255" @change="editSomeFields(editForm,'regionName',$event)" :disabled="  disabledJudge('regionName')"/>
            </el-form-item>
            <el-form-item label="定位格式化地址名称" prop="formatAddress">
                <el-input  v-model="editForm.formatAddress" placeholder="定位格式化地址名称" :maxlength="255" @change="editSomeFields(editForm,'formatAddress',$event)" :disabled="  disabledJudge('formatAddress')"/>
            </el-form-item>
            <el-form-item label="定位区县编号" prop="districtId">
                <el-input  v-model="editForm.districtId" placeholder="定位区县编号" :maxlength="50" @change="editSomeFields(editForm,'districtId',$event)" :disabled="  disabledJudge('districtId')"/>
            </el-form-item>
            <el-form-item label="用户类型" prop="memType">
                <el-input  v-model="editForm.memType" placeholder="用户类型" :maxlength="1" @change="editSomeFields(editForm,'memType',$event)" :disabled="  disabledJudge('memType')"/>
            </el-form-item>
            <el-form-item label="1-登录成功，0-登录失败" prop="loginStatus">
                <el-input  v-model="editForm.loginStatus" placeholder="1-登录成功，0-登录失败" :maxlength="1" @change="editSomeFields(editForm,'loginStatus',$event)" :disabled="  disabledJudge('loginStatus')"/>
            </el-form-item>
            <el-form-item label="登录成功或者失败的说明" prop="loginMsg">
                <el-input  v-model="editForm.loginMsg" placeholder="登录成功或者失败的说明" :maxlength="255" @change="editSomeFields(editForm,'loginMsg',$event)" :disabled="  disabledJudge('loginMsg')"/>
            </el-form-item>
            <el-form-item label="授权码" prop="authType">
                <el-input  v-model="editForm.authType" placeholder="授权码" :maxlength="50" @change="editSomeFields(editForm,'authType',$event)" :disabled="  disabledJudge('authType')"/>
            </el-form-item>
            <el-form-item label="授权码" prop="grantType">
                <el-input  v-model="editForm.grantType" placeholder="授权码" :maxlength="50" @change="editSomeFields(editForm,'grantType',$event)" :disabled="  disabledJudge('grantType')"/>
            </el-form-item>
        </el-form>
    </el-row>
    <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
            <el-button @click.native="close">关闭</el-button>
            <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
        </el-row>
    </slot>
</el-row>
</template>

<script>
import * as UserLoginRecordApi from '@/api/mdp/sys/userLoginRecord';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'userLoginRecordForm',
    mixins:[MdpFormMixin],
    components: {
    },
    computed: {
    },
    props:{
    },
    watch: {
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                id:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                userid:'',shopId:'',locationId:'',loginShopid:'',loginLocationid:'',branchId:'',loginType:'',loginTime:'',loginBranchId:'',username:'',authId:'',mdpAppid:'',lockNo:'',lockStatus:'',lockTime:'',phoneno:'',loginIp:'',userType:'',loginDeviceId:'',loginDeviceSn:'',userAgent:'',reqNo:'',deviceType:'',os:'',osVersion:'',osName:'',renderingEngine:'',deviceManufacturer:'',browerGroup:'',borderName:'',borderVersion:'',id:'',longitude:'',latitude:'',regionId:'',regionName:'',formatAddress:'',districtId:'',memType:'',loginStatus:'',loginMsg:'',authType:'',grantType:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: UserLoginRecordApi.queryUserLoginRecordById,
                add: UserLoginRecordApi.addUserLoginRecord,
                edit: UserLoginRecordApi.editUserLoginRecord,
                editSomeFields: UserLoginRecordApi.editSomeFieldsUserLoginRecord
            },
            editable:true,//是否可编辑模式
        }
    },
    methods: {
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){

         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
            return true;
        },
        /**
         * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
         * @param {*} row 当前选中的行
         * @param {*} fieldName 修改的字段名
         * @param {*} $event 修改后的值
         * @param {*} params 将要提交服务器的参数
         * @returns true/false 返回false ,将取消更新数据库
         */
        editSomeFieldsCheck(row,fieldName,$event,params){
            if(this.editable==false){
                return false;
            }
            params[fieldName]=$event
            return true;
        },
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>