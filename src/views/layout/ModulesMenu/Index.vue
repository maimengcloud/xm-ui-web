<template>
    <el-dialog
      top="5vh"
      class="moduleset"
      :visible.sync="visible"
      width="60%"
      append-to-body>
        <div slot="title" class="dialog-title">
            <p>全部应用</p>
            <el-divider style="margin: 0 !important;"></el-divider>
        </div>

        <div class="toolBox">
            <el-input  v-model="keyWords" @change="searchMenu" placeholder="模糊搜索, enter回车键搜索">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
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

        <div class="nav" v-loading="menuLoading">
            <div class="nav_item"  v-for="(item, index) in (selectMenus.length > 0 ?  selectMenus : menus[active])" :key="index" @click="selectItem(item, index)">
                <img :src="item.logoUrl" alt="">
                <span>{{item.name}}</span>
                <el-divider></el-divider>
                <div class="desc" v-if="item.billMode!=='0'">
                   <el-button @click="goBuy(item)" v-if="!item.isBuy" style="width:70px;" type="primary" round>购买</el-button>
                   <span class="buyAfter" v-else>（已购买）</span>
                </div>
                <div class="desc" v-else> 
                   <span class="buyAfter">（免费）</span>
                </div>
            </div>
        </div>
        
    </el-dialog>
</template>

<script>
import config from '@/api/mdp_pub/mdp_config';
import { mapGetters } from 'vuex'; 
import {modulesOfIcon} from "./modulesOfIcon.js";
import {modulesOfRouter} from "./modulesOfRouter.js";

import NProgress from 'nprogress' // progress bar

export default {
    props: ['value'],
    computed: {
        ...mapGetters([
            'userInfo'
        ]),
        visible: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    
    watch: {
        'value': {
            handler(nval, oval) {
               if(nval) {
                   this.getAllModules();
               }
            }
        },
        'keyWords': 'filterModule'
    },

    data() {
        return {
            menuLoading: false,
            selectMenus: [],
            active: "xmgl",
            menus: {},
            keyWords: null,
            filterVal: '',
        }
    },

    methods: {
        searchMenu(val) {
            this.keyWords = val;
        },

        filterModule() {
            if(this.keyWords == null || this.keyWords == "" || this.keyWords == undefined) {
                this.selectMenus = [];
                return;
            }
            let val = this.keyWords;
            let tempArr = [];
            this.menus.mall.forEach(element => {
                if(element.name.indexOf(val) != -1) {
                    tempArr.push(element);
                }
            });
            this.menus.oa.forEach(element => {
                if(element.name.indexOf(val) != -1) {
                    tempArr.push(element);
                }
            });
            this.menus.xmgl.forEach(element => {
                if(element.name.indexOf(val) != -1) {
                    tempArr.push(element);
                }
            });
            this.selectMenus = tempArr;
        },
 
        selectItem(item) {
            if(item.isBuy||item.billMode=='0') {
                var context="";
                //路由跳转
                let path = "";
                modulesOfRouter.forEach(e => {
                    if(e.id == item.id) {
                        path = e.path; 
                        context=e.context
                    }
                })

                if(path != "") {
                    if(context != process.env.CONTEXT) { 
                        var fullpath=config.getBaseDomainUrl()+"/"+context+"/"+process.env.VERSION+"/#"+path
                        window.open(fullpath);
                        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
                    }else {
                        this.$router.push({path: path})
                    }
                }
                this.visible = false;
            }
        },

        goBuy(item) {
            this.visible = false;
            if(process.env.CONTEXT==this.$mdp.getSysContext()){
                //前往购买页面
                this.$router.push({path:'/my/order/index',query:{moduleId:item.id}})
            }else{
                var fullpath=config.getBaseDomainUrl()+"/"+this.$mdp.getSysContext()+"/"+process.env.VERSION+"/#/my/order/index?moduleId="+item.id
                window.open(fullpath);
                NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
            }
            
        },

        //获取所有模块
        getAllModules() {
            this.menuLoading = true
            this.$mdp.getAllMenuModule({}).then(res => {
                let tempData = res.data.data;
                tempData.forEach(i=>{
                    i.isBuy=false; 
                })
                this.$mdp.getBuyMenuModule({}).then(res2 => {
                    let branchModules = res2.data.data;
                    tempData.forEach(k => {
                        branchModules.forEach(element => {
                            if(k.id == element.moduleId && element.status=='1') {
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
        },


    },

    created() {
        
    }

}
</script>

<style lang="scss">
.moduleset .el-dialog__header {
    padding: 0;
}
.moduleset .el-divider--horizontal {
    margin: 0 !important;
}
</style>

<style lang="scss" scoped>
@import './index.scss';

</style>