<template>
    <div class="my_grid" style="width: 100%; min-height: 800px; margin-top: 10px">
        <grid-layout
            :layout.sync="layout"
            :col-num="12"
            :row-height="120"
            :is-draggable="true"
            :is-resizable="true"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="true"
        >   
            <grid-item 
                v-for="item in layout"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                :key="item.i">
                <div class="m_content_card_title">
                    <span><b>{{item.moduleName}}</b></span>
                </div>
                <dsp v-if="item.name == 'dsp'"></dsp>
                <wdrw v-if="item.name == 'wdrw'"></wdrw>
                <wdcp v-if="item.name == 'wdcp'"></wdcp>
                <wdxm v-if="item.name == 'wdxm'"></wdxm>
            </grid-item>
        </grid-layout>
    </div>
</template>

<script>
import dsp from  '@/views/mdp/workflow/ru/task/TaskListAssigneeToMe.vue';
import wdrw from '@/views/xm/core/xmTask/xmTaskCenter.vue';
import wdcp from '@/views/xm/core/xmProduct/XmProductAllMng.vue';
import wdxm from '@/views/xm/core/xmProject/XmProjectMng';
import VueGridLayout from 'vue-grid-layout';



export default {
    components: {
        dsp,
        wdrw,
        wdcp,
        wdxm,
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem
    },
    data() {
        return {
            layout: [
                {
                    moduleName: '待审批',
                    name: 'dsp',
                    isOpen: false,
                    x: 0,
                    y: 0,
                    w: 6,
                    h: 4,
                    i: 0
                },
                {
                    moduleName: '我的任务',
                    name: 'wdrw',
                    isOpen: false,
                    x: 6,
                    y: 0,
                    w: 6,
                    h: 4,
                    i: 1
                },
                {
                    moduleName: '我的产品',
                    name: 'wdcp',
                    isOpen: false,
                    x: 0,
                    y: 2,
                    w: 6,
                    h: 4,
                    i: 2
                },
                {
                    moduleName: '我的项目',
                    name: 'wdxm',
                    isOpen: false,
                    x: 6,
                    y: 2,
                    w: 6,
                    h: 4,
                    i: 3
                }
            ],
        }
    },
    methods: {
    }

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
.vue-grid-layout {
    background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 1%, rgba(0, 0, 0, 0) 1%) 
    ,linear-gradient(0deg,rgba(0, 0, 0, 0.15) 1%, rgba(0, 0, 0, 0) 1%);
    background-size: calc(100% / 12) calc(100% / 12); /*调节格子宽 高*/
}

.vue-grid-item:not(.vue-grid-placeholder) {
    background: #fff;
    box-shadow: 1px 1px 1px 1px #ccc;
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