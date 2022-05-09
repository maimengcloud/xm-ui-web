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
                <div class="desc">
                   <el-button @click="goBuy(item)" v-if="!item.isBuy" style="width:70px;" type="primary" round>购买</el-button>
                   <span class="buyAfter" v-else>（已购买）</span>
                </div>
            </div>
        </div>
        
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import {getAllMenuModule, getBuyMenuModule} from '@/api/mdp/sys/modules'
import {modulesOfIcon} from "./modulesOfIcon.js";
import {modulesOfRouter} from "./modulesOfRouter.js";

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
            if(item.isBuy) {
                //路由跳转
                console.log(modulesOfRouter, "modulesOfRouter");
                let name = "";
                modulesOfRouter.forEach(e => {
                    if(e.id == item.id) {
                        name = e.router;
                    }
                })
                if(name != "") {
                    this.$router.push({name: name})
                }
                this.visible = false;
            }
        },


        goBuy(item) {
            this.visible = false;
            //前往购买页面
            this.$router.push('/my/order/index')
        },

        //获取所有模块
        getAllModules() {
            this.menuLoading = true
            getAllMenuModule({}).then(res => {
                let tempData = res.data.data;
                getBuyMenuModule({}).then(res2 => {
                    let branchModules = res2.data.data;
                    tempData.forEach(k => {
                        branchModules.forEach(element => {
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