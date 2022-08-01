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
                    <component :is="item.compName"></component>
                </grid-item>
            </grid-layout>
        </div>
   </div>
</template>

<script>  
 
import VueGridLayout from 'vue-grid-layout';
import { mapGetters } from 'vuex'
import XmTestPlanMng from '@/views/xm/core/xmTestPlan/XmTestPlanMng'

export default {
    components: { 
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        XmTestPlanMng,
    },

    computed: {
        ...mapGetters(['userInfo']), 
    },

    watch: {
        
    },

    data() {
        return {
            // 布局位置数据
            layout: [
                 { 
                    // x: (this.layout.length * 6) % (this.layoutColNum || 12),
                    x: 0,
                    // y: this.layout.length + (this.layoutColNum || 12),
                    y: 12,
                    w: 12,
                    h: 4,
                    i: index,
                    compName:'xm-test-plan-mng', 
                }
            ],
            // 布局列数
            layoutColNum: 12, 
        }
    },

    methods: { 
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
                    compName:'xm-test-plan-mng', 
                }
            )
        },
         
    },

    mounted() {
        this.$nextTick(() => {
             
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
@import './common.scss';
@import './index.scss';

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
