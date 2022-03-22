<template>
  <el-dialog
    top="5vh"
    class="moduleset"
    :visible.sync="visible"
    width="60%">
    <div slot="title" class="dialog-title">
        <p>模块编辑</p>
        <el-divider style="margin: 0 !important;"></el-divider>
    </div>
    <div class="toolBox">
        <el-input v-model="searchResult" @change="searchMenu" placeholder="模糊搜索, enter回车键搜索">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div class="selectItem">
            <div class="item">
                <img src="../../img/qb.png">
                <span>全部</span>
            </div>
            <div class="item">
                <img src="../../img/ty.png">
                <span>通用</span>
            </div>
        </div>
    </div>
    <div class="nav">
       <div class="nav_item" :class="{itemActive:selectArr.indexOf(item.index) != -1}" v-for="(item, index) in (tempMenu.length > 0 ?  tempMenu : menus)" :key="index" @click="selectItem(item, index)">
           <img :src="item.img" alt="">
           <div class="desc">
               <p>{{item.name}}</p>
               <span>
                  {{item.desc}}
               </span>
           </div>
           <i v-if="selectArr.indexOf(item.index) != -1" class="el-icon-success"></i>
       </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import img1 from '../../img/dsp.png'
import img2 from '../../img/wdrw.png'
import img3 from '../../img/wdxm.png'
import img4 from '../../img/wdcp.png'
export default {
    props: ['value'],
    computed: {
        visible: {
            get: function () {
                return this.value;
            },
            set: function (val) {
                this.$emit('input', val)
            }
        }
    },
    data() {
        return {
            searchResult: '',
            selectArr: [],
            tempMenu: [],
            menus: [
                {
                    index: 0,
                    img: img1,
                    name: '待审批',
                    desc: '可以直接显示全部待审批列表，也可根据审批分类详细筛选单条待审批事项'
                },
                {
                    index: 1,
                    img: img2,
                    name: '我的任务',
                    desc: '可以直接显示全部任务列表，也可根据状态、类型详细筛选分类的任务'
                },
                {
                    index: 2,
                    img: img3,
                    name: '我的项目',
                    desc: '可以直接显示全部项目列表，也可根据项目状态产品筛选单条项目'
                },
                {
                    index: 3,
                    img: img4,
                    name: '我的产品',
                    desc: '可以直接显示全部产品列表，可新增我的产品'
                }
            ]
        }
    },

    methods: {
        searchMenu(val) {
            console.log("查询菜单" + val);
            let tempArr = [];
            this.menus.forEach(element => {
                if(element.name.indexOf(val) != -1) {
                    tempArr.push(element);
                }                
            });
            this.tempMenu = tempArr;
        },
        selectItem(item, index) {
            let arrIndex = this.selectArr.indexOf(item.index);
            if(arrIndex != -1) {
                this.selectArr.splice(arrIndex, 1);
            }else {
                this.selectArr.push(item.index);
            }
        },
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
.moduleset {
    .dialog-title {
        font-size: 22px;
        font-weight: bold;
        color: #7D7D7D;
        height: 68px;
        p {
           line-height: 68px;
           margin-left: 28px;
        }
    }
    .toolBox {
        display: flex;
        flex-direction: column;
        .selectItem {
            display: flex;
            flex-direction: row;
            height: 70px;
            .item {
                display: flex;
                flex-direction: row;
                margin-right: 120px;
                cursor: pointer;
                margin: 25px 50px 0 20px;
                img {
                    width: 45px;
                    height: 45px;
                }
                span {
                    margin-left: 8px;
                }
            }
        }
    }

    .nav {
        height: 350px;
        overflow: auto;
        padding:0px 10px 0 20px;
        display:flex;
        align-items:center;
        justify-content: space-between;
        flex-wrap:wrap;
        .nav_item {
            display: flex;
            height: 138px;
            flex-direction: row;
            width: 49%;
            border: 2px solid #EDF0F9;
            box-shadow: 0px 3px 4px 0px rgba(186, 184, 184, 0.1);
            border-radius: 8px;
            align-items: center;
            position: relative;
            cursor: pointer;
            margin-top: 10px;
            img {
                width: 94px;
                height: 94px;
                margin: 0 18px;
            }
            p {
                font-size: 20px;
                font-weight: bold;
                color: #7D7D7D;
                margin-bottom: 10px;
            }
            span {
                font-size: 14px;
                color: #7D7D7D;
                line-height: 26px;
            }
            i {
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 36px;
                color: #90B1F4;
            }
        }
        .itemActive {
            border: 2px solid #90B1F4;
            box-shadow: 0px 3px 4px 0px rgba(186, 184, 184, 0.1);
        }
    }
}



</style>