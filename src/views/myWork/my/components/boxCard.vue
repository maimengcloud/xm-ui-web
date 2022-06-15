<template>
   <div>
        <div class="empty" v-if="layout.length == 0">
            <el-empty description="暂未选择模块"></el-empty>
        </div>
        <div v-else class="my_grid" style="width: 100%; min-height: 800px; margin-top: 10px">
            <grid-layout
                :layout.sync="layout"
                :col-num="layoutColNum"
                :row-height="120"
                :is-draggable="true"
                :is-resizable="true"
                :is-mirrored="false"
                :vertical-compact="true"
                :margin="[10, 10]"
                :use-css-transforms="true"
            >
                <grid-item
                    v-for="(item) in layout"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                    :key="item.i">
                    <div class="m_content_card_title">
                        <span><b>{{item.menuname}}</b><font style="font-size:14px;color: #7D7D7D;opacity: 0.53;">(及时取消关注不常用的，常用的5个排在最前面)</font></span><span v-if="item.menuid=='myFocus'" style="float:right;"><el-button icon="el-icon-refresh" @click="refreshMyFocus">刷新</el-button></span>
                    </div>
                    <dsp  source="GZT" v-if="item.menuid == 'dsp'"></dsp>
                    <wdrw source="GZT" v-if="item.menuid == 'wdrw'"></wdrw>
                    <wdcp source="GZT" v-if="item.menuid == 'wdcp'"></wdcp>
                    <wdxm source="GZT" v-if="item.menuid == 'wdxm'"></wdxm>
                    <my-focus source="GZT" v-if="item.menuid == 'myFocus'" ref="refMyFocus"></my-focus>
                </grid-item>
            </grid-layout>
        </div>
   </div>
</template>

<script>
import dsp from  '@/views/mdp/workflow/ru/task/TaskListAssigneeToMe.vue';
import wdrw from '@/views/xm/core/xmTask/xmMyTaskCenter.vue';
import wdcp from '@/views/xm/core/xmProduct/XmProductAllMng.vue';
import wdxm from '@/views/xm/core/xmProject/XmProjectMng';
import { userMenuFavoriteList, saveMenuFavoriteList} from '@/api/mdp/sys/menuFavorite'

import myFocus from '@/views/xm/core/xmMyFocus/XmMyFocusList';
import VueGridLayout from 'vue-grid-layout';
import { mapGetters } from 'vuex'

export default {
    components: {
        dsp,
        wdrw,
        wdcp,
        wdxm,
        myFocus,
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem
    },

    computed: {
        ...mapGetters(['userInfo']), 
    },

    watch: {
        'fMenus': {
            handler(val, oval) {
                this.layout = [];
                this.addItem({menuid:'myFocus',menuname:'我的关注'}, val.length+1);
                val.forEach((element, index) => {
                   this.addItem(element, index);
                });
               
            }
        }
    },

    data() {
        return {
            // 布局位置数据
            layout: [],
            // 布局列数
            layoutColNum: 12,
            fMenus:[],
        }
    },

    methods: {
        refreshMyFocus(){ 
            this.$refs['refMyFocus'][0].searchXmMyFocuss();
        },
        addItem: function(element, index) {
            this.layout.push(
                {
                    ...element,
                    // x: (this.layout.length * 6) % (this.layoutColNum || 12),
                    x: 0,
                    // y: this.layout.length + (this.layoutColNum || 12),
                    y: 12,
                    w: 12,
                    h: 4,
                    i: index,
                }
            )
        },
        getFMenus(){
            userMenuFavoriteList({}).then(res=>{
                localStorage.setItem('fMenus',JSON.stringify(res.data.data));
                this.fMenus=res.data.data;
            }) 
        }
    },

    mounted() {
        this.$nextTick(() => {
            var fMenus=localStorage.getItem("fMenus")
            if(!fMenus){
                this.getFMenus();
            }else{
                this.fMenus=JSON.parse(fMenus)
            }
            
        })
    },

}
</script>

<style>
.my_grid .vue-grid-item.vue-grid-placeholder {
    background: rgb(214, 214, 214) !important;
}
</style>

<style lang="scss" scoped>
@import '../../common.scss';
@import '../index.scss';

.empty {
    height: 500px;
    background: #fff;
    margin: 11px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}


.vue-grid-layout {
    background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 1%, rgba(0, 0, 0, 0) 1%)
    ,linear-gradient(0deg,rgba(0, 0, 0, 0.15) 1%, rgba(0, 0, 0, 0) 1%);
    background-size: calc(100% / 12) calc(100% / 12); /*调节格子宽 高*/
}

.vue-grid-item:not(.vue-grid-placeholder) {
    background: #fff;
}

.vue-grid-item .resizing {
    opacity: 0.9;
}
.vue-grid-item .static {
    background: #cce;
}
.vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
}
.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}
.vue-grid-item .minMax {
    font-size: 12px;
}
.vue-grid-item .add {
    cursor: pointer;
}
.vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
}

.m_content_card_title {
    height: 45px;
    padding: 20px 20px 40px 20px;
    span {
        font-size: 18px;
        font-weight: bold;
        color: #7D7D7D;
    }
}

</style>
