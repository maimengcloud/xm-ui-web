<template>  
    <section>
      <!-- <div class="module-item" v-for="(item,index) in topModules" :key="index">
        <div class="module-text" @click="gotolink(item)"  >
          <div class="box-icon">
                <img :src="item.icon" height="20px" />
          </div>
          <div class="box-info">{{item.moduleName}}</div> 
        </div>
      </div> -->
      <div class="module-item"> 
        <div class="module-text" @click="menuVisible = true"  >
          <div class="box-info">全部应用</div> 
        </div>
      </div> 

      <div class="module-item">
        <div class="module-text">
          <div class="box-info">我的工作台</div>
        </div>
      </div> 
      
      <div class="drawer-box">
        <all-menus v-model="menuVisible"></all-menus>
        <!-- <el-drawer  
          :visible.sync="drawer"
          :modal-append-to-body="false"
          :direction="direction">
          <div class="drawer">
            <div class="drawer-content">
              <div class="drawer-content-category" v-for="(item,index) in categorys" :key="index">
                <div class="category-name" v-text="item.moduleName"></div>
                <div class="category-list">
                  <div
                    class="category-item"
                    v-for="(module,mindex) in item.childrens" :key="index+'_'+mindex"
                    @click="gotolink(module)"
                    :class="{highlight : module.isHighlight }"
                  > 
                    <div class="module-icon">
                      <img :src="module.icon">
                    </div>
                    <div class="module-name" v-text="module.moduleName"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-drawer> -->
      </div>


    </section>
</template>

<script> 

import NProgress from 'nprogress' // progress bar  
const topModulesData = require("./top_modules_"+process.env.CONTEXT+".js") 
const allModulesData = require("./all_modules.js") 
import allMenus from '../ModulesMenu/allMenus'

export default {
  components: {allMenus},
  created() {
  },
  data() { 
    return {
      levelList: null,
      drawer: false,
      direction: 'rtl',
      key:"",
      topModules: topModulesData.default,
      //模块分类
      categorys:allModulesData.default,
      menuVisible: false,
    }
  },
  watch: { 
    key(val){ 
      this.searchModule();
    }
  },
  methods: { 
    //路由跳转
    gotolink(module) {
        this.drawer = false
        this.jumpToOtherSystem(module); 
    },
    //系统跳转
    jumpToOtherSystem(module) {   
        window.open(module.sysLink, module.moduleName,null,true);
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    },
    //搜索
    searchModule(){
      for(let i =0 ; i <this.categorys.length; i++){
        for(let j =0 ; j <this.categorys[i].childrens.length; j++){
          let module = this.categorys[i].childrens[j];
            this.categorys[i].childrens[j].isHighlight = false;
        }

      }
      if(this.key != ""){
        for(let i =0 ; i <this.categorys.length; i++){
          for(let j =0 ; j <this.categorys[i].childrens.length; j++){
            let module = this.categorys[i].childrens[j];
            if(module.moduleName.indexOf(this.key) > -1){
              this.categorys[i].childrens[j].isHighlight = true;
            }
          }
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped> 
 .drawer-box{
    .drawer{
      padding-left: 10px;
      padding-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9 !important;
      .drawer-content{
        width: 900px;
        height: 100%;
        .drawer-content-input{
          display: flex;
          justify-content: center;
        }
        .drawer-content-category{
          .category-name{
            color: #333333;
            font-size: 16px;
          }
          .category-list{
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            .category-item{
              height: 70px;
              width: 70px;
              margin-right: 20px;
              transition: all 0.3s;
              .module-icon{
                width: 70px;
                height: 38px;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;  
                align-items: center;
                img{
                  width: 20px;
                }
                }
              .module-name{
                height: 32px;
                line-height: 32px;
                color:#666666;
                font-size: 12px;
                text-align: center;
              }
            }
            .category-item:hover{
              background: rgb(240, 241, 245);
            }
          }
        }
      }
    }
    .highlight{
      transform: scale(1.05);
      -webkit-box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
    }
    
  }
  .module-item {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    align-items: center; 
    text-align: center;
    margin-right: 30px;
    .module-text{  
      line-height: 22px;
      font-size: 22px;  
    }
    
    .box-icon {
      text-align: center;
    }

    .box-info {
      text-align: center;
      font-size: 14px;
      color: #7D7D7D;
      font-weight: bold;
    }
}

</style>
<style rel="stylesheet/scss" lang="scss"> 
.drawer-box{
  .el-drawer{
    height: 100% !important;
    overflow: auto;
  }
} 
</style>
