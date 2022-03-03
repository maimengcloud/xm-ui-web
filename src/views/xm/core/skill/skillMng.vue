<template>
  <section class="page-container  padding border">
    <el-row >
      <el-row v-if="editVisible==false">
        <el-col :span="10"> 
          <el-button type="primary" v-if="jump==true" @click="selectConfirm" icon="el-icon-finished">确认选择</el-button>
          <el-button  @click="getAllHrSkill" v-loading="sectionLoading" icon="el-icon-search">刷新标签</el-button>
        </el-col> 
        <el-col :span="14"> 
           <el-button type="text"  @click="editVisible=true" icon="el-icon-edit">管理技能</el-button> 
          <el-tooltip content="黄色表示已经有的技能">
            <span class="addTagSquare"></span>
          </el-tooltip>
          <el-tooltip content="白色表示尚未拥有的技能">
            <span class="closeTagSquare"></span>
          </el-tooltip>
        </el-col> 
      </el-row>
      <el-row v-else>
        <el-col :span="10"> 
          <el-button type="primary"  @click="editVisible=false" icon="el-icon-finished">确认</el-button> 
        </el-col> 
        <el-col :span="14">
          <el-checkbox 
            v-model="isPub"
            true-label="1"
            false-label="0"
          >公共分类</el-checkbox>
          <el-input
            style="width:50%;"
            v-model="needAddTagCategoryNameInputValue"
            placeholder="回车直接快速添加技能分类"
            @keyup.enter.native="addTagCategorySubmitMethod"
          ></el-input>
          <el-button type="primary"  @click="addTagCategorySubmitMethod" icon="el-icon-finished">保存分类</el-button>
          <el-tooltip content="黄色表示已经有的技能">
            <span class="addTagSquare"></span>
          </el-tooltip>
          <el-tooltip content="白色表示尚未拥有的技能">
            <span class="closeTagSquare"></span>
          </el-tooltip>
        </el-col> 
      </el-row>
    </el-row>
    <el-row class="app-container page-height-80 overflow-auto" v-if="editVisible==false">
      <el-row v-for="(item,index) in convertSkills" :key="item.categoryId" class="padding">
        <h3>
          <div>
            {{item.categoryName+(item.pubc=='1'?'(公共)':'')}} 
          </div>
        </h3>
        <el-col :span="24" style="margin-left:30px;display:flex;flex-wrap: wrap;width: 100%;">
          <div
            :class="v.checked?'checkCopyButton':'copyButton'"
            v-for="(v,valueIndex) in item.values"
            :key="valueIndex"
            @click="clickTagMethod(index,valueIndex)"
          >
            {{v.skillName +(v.pubSkill=='1'?'':'')}} 
          </div>  
        </el-col>
      </el-row>
    </el-row>
    <el-row class="app-container page-height-80  overflow-auto" v-else>
      <el-row v-for="(item,index) in convertSkills" :key="item.categoryId" class="padding">
        <h3>
          <div>
            {{item.categoryName+(item.pubc=='1'?'(公共)':'')}}
            <i
              class="el-icon-close closeStyle"
              @click.stop="delTagCategoryMethod(item.categoryId,index)"
            ></i>:
          </div>
        </h3>
        <el-col :span="24" style="margin-left:30px;display:flex;flex-wrap: wrap;width: 100%;">
          <div
            :class="'copyButton'"
            v-for="(v,valueIndex) in item.values"
            :key="valueIndex"
            @click="clickTagMethod(index,valueIndex)"
          >
            {{v.skillName +(v.pubSkill=='1'?'':'')}}
            <i
              class="el-icon-close closeStyle"
              @click.stop="delTagMethod(v.skillId,index,valueIndex)"
            ></i>
          </div>
          <div class="input-tag" v-if="item.showAddButtonVisible">
            <el-input
              style="200px;"
              v-model="item.showAddButtonInputValue"
              placeholder="请输入技能,回车即可"
              @keyup.enter.native="addTagMethod(index)"
              autofocus
            ></el-input>
          </div>
          <div v-else class="add" @click="showAddButtonMethod(index)">
            <i class="el-icon-circle-plus-outline" style="font-size:35px;"></i>
          </div>
        </el-col>
      </el-row>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  getAllHrSkill,
  delHrSkillCategory,
  addHrSkill,
  delHrSkill,
} from "@/api/xm/core/hrSkill";

import { mapGetters } from "vuex";
import { addHrSkillCategory } from "@/api/xm/core/hrSkillCategory";
export default {
  computed: {
    ...mapGetters(["workShop", "userInfo"]),
  },

  props: ["jump", "visible", "skillIds"],
  watch: {
    'skillIds' : {
      immediate:true,
      handler(skillIds, old) {
        console.log("skillIds:"+skillIds);
        if (skillIds && skillIds.length > 0) {
          console.log(":==============================");
          // console.log("this.convertSkills:"+JSON.stringify(this.convertSkills));
          this.convertSkills.forEach((i) => {
            if (i.values && i.values.length > 0) {
              i.values.forEach((k) => {
                console.log("k.skillId:"+k.skillId);

                if (skillIds.some((j) => j == k.skillId)) {
                  k.checked = true;
                } else {
                  k.checked = false;
                }
              });
            }
          });
        }
      } 
    
    },
  },
  data() {
    return {
      sectionLoading: false,
      convertSkills: [],
      needAddTagCategoryNameInputValue: "",
      isPub: "0",
      editVisible:false,
    };
  }, //end data
  methods: {
    getAllHrSkill() {
      let params = {};
      params.branchId = this.workShop.branchId;
      this.sectionLoading = true;
      getAllHrSkill(params)
        .then((res) => {
          this.sectionLoading = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            let allSkill = res.data.data;
            let convert = [];
            for (let i = 0; i < allSkill.length; i++) {
              let flag = true; //判断是否需要添加
              let skill = allSkill[i];
              for (let j = 0; j < convert.length; j++) {
                if (
                  skill.skillId &&
                  skill.categoryId == convert[j].categoryId
                ) {
                  let json = {
                    isSaveInDatabase: true,
                    checked: skill.checked ? true : false,
                    skillId: skill.skillId,
                    skillName: skill.skillName,
                    pubSkill: skill.pubSkill,
                    pubc:skill.pupc,
                  };
                  if (
                    this.skillIds &&
                    this.skillIds.some((id) => id == json.skillId)
                  ) {
                    json.checked = true;
                  }
                  convert[j].values.push(json);
                  flag = false;
                  break;
                }
              }
              if (flag) {
                let json = {
                  showAddButtonVisible: false, //添加技能按钮
                  showAddButtonInputValue: "", //添加技能按钮的输入框的值
                  categoryId: skill.categoryId,
                  categoryName: skill.categoryName,
                  pubc: skill.pubc,
                  values: [
                    {
                      isSaveInDatabase: false,
                      checked: false,
                      skillId: skill.skillId,
                      skillName: skill.skillName,
                      pubSkill: skill.pubSkill,
                    },
                  ],
                };
                if (!json.values[0].skillId) {
                  json.values = [];
                } else {
                  if (
                    this.skillIds &&
                    this.skillIds.some((id) => id == json.values[0].skillId)
                  ) {
                    json.values[0].checked = true;
                  }
                }
                convert.push(json);
              }
            }
            console.log(convert);
            this.convertSkills = convert;
            this.setSkillsToLocal();
          } else {
            this.$notify({showClose: true,
              message: tips.msg,
              type: "error",
            });
          }
          this.sectionLoading = false;
        })
        .catch((err) => (this.sectionLoading = false));
    },
    //添加技能分类的方法
    addTagCategorySubmitMethod() {
      let that = this; 

      if (
        this.convertSkills.some(
          (i) => i.categoryName == this.needAddTagCategoryNameInputValue
        )
      ) {
        this.$notify({showClose: true,
          message: "技能分类已经存在",
          type: "error",
        });
        return false;
      }
      if (!this.needAddTagCategoryNameInputValue) {
        return;
      }
      let params = {
        branchId: this.workShop.branchId,
        shopId: this.workShop.shopId,
        categoryName: this.needAddTagCategoryNameInputValue,
        isPub: this.isPub,
      };
      that.sectionLoading = true;
      addHrSkillCategory(params)
        .then((res) => {
          that.sectionLoading = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            that.needAddTagCategoryNameInputValue = "";
            let json = {
              showAddButtonVisible: false, //添加技能按钮
              showAddButtonInputValue: "", //添加技能按钮的输入框的值
              categoryId: res.data.data.id,
              categoryName: res.data.data.categoryName,
              values: [],
              pubc: res.data.data.isPub,
            };
            this.convertSkills.push(json);
            this.setSkillsToLocal();
          }
          this.$notify({showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((err) => (this.sectionLoading = false));
    },
    //删除技能分类的方法
    delTagCategoryMethod(categoryId, index) {
      let that = this;
      if (!categoryId) {
        return;
      }
      let params = {
        shopId: this.workShop.shopId,
        branchId: this.workShop.branchId,
        id: categoryId,
      }; 
      this.$confirm(
        "此操作将永久删除该技能分类, 并连同该技能分类下面的技能也删除，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          that.sectionLoading = true;
          delHrSkillCategory(params)
            .then((res) => {
              that.sectionLoading = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.convertSkills.splice(index, 1);
                this.setSkillsToLocal();
                /*this.getTags();*/
              }
              this.$notify({showClose: true,
                message: tips.msg,
                type: tips.isOk ? "success" : "error",
              });
            })
            .catch((err) => (this.sectionLoading = false));
        })
        .catch(() => {});
    },
    //显示添加按钮的方法
    showAddButtonMethod(index) {
      this.convertSkills[index].showAddButtonVisible = true;
    },
    //添加技能的方法
    addTagMethod(index) { 
      if (
        this.convertSkills.some((i) => {
          return i.values.some(
            (skill) =>
              skill.categoryId==i.categoryId &&
              skill.skillName ==
              this.convertSkills[index].showAddButtonInputValue
          );
        })
      ) {
        this.$notify({showClose: true,
          message: "技能已经存在",
          type: "error",
        });
        return false;
      }
      if (!this.convertSkills[index].pubc) {
        if (this.isPub == "1") {
          this.$notify({showClose: true,
            message: "该分类不是公共分类，不能添加公共技能",
            type: "error",
          });
          return false;
        }
      }
      let that = this;
      let skillName = this.convertSkills[index].showAddButtonInputValue;
      let categoryId = this.convertSkills[index].categoryId;
      let params = {
        branchId: that.workShop.branchId,
        shopId: that.workShop.shopId,
        categoryId: categoryId,
        skillName: skillName,
        isPub: this.isPub,
      };

      if (!params.skillName) {
        return;
      }
      console.log("params");
      console.log(params);
      this.sectionLoading = true;
      addHrSkill(params)
        .then((res) => {
          this.sectionLoading = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            let json = {
              isSaveInDatabase: false,
              checked: false,
              skillId: res.data.data.id,
              skillName: res.data.data.skillName,
              pubTag: res.data.data.isPub,
            };
            this.convertSkills[index].showAddButtonInputValue = "";
            this.convertSkills[index].values.push(json);
            this.setSkillsToLocal();
          }
          this.$notify({showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((err) => (this.sectionLoading = false));
    },
    //删除技能的方法
    delTagMethod(skillId, index, valueIndex) {
 
      let that = this;

      let params = {
        id: skillId,
      };
      if (!params.id) {
        return;
      }

      this.$confirm("此操作将永久删除该技能, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          that.sectionLoading = true;
          delHrSkill(params)
            .then((res) => {
              that.sectionLoading = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.convertSkills[index].values.splice(valueIndex, 1);
                this.setSkillsToLocal();
                /*this.getTags();*/
              }
              this.$notify({showClose: true,
                message: tips.msg,
                type: tips.isOk ? "success" : "error",
              });
            })
            .catch((err) => (this.sectionLoading = false));
        })
        .catch(() => {});
    },
    clickTagMethod(index, valueIndex) {
      this.convertSkills[index].values[valueIndex].checked = !this
        .convertSkills[index].values[valueIndex].checked;
    },
    selectConfirm() {
      let selectSkills = [];
      this.sels = this.convertSkills.forEach((i) => {
        if (i.values && i.values.length > 0) {
          i.values.forEach((j) => {
            if (j.checked == true) {
              selectSkills.push(j);
            }
          });
        }
      });
      this.$emit("select-confirm", selectSkills);
    },
    setSkillsToLocal(){
      localStorage.setItem("skill_"+this.userInfo.branchId,JSON.stringify(this.convertSkills))
    },
  }, //end methods
  components: {
    
    //在下面添加其它组件
  },
  mounted() {
    var localSkills=localStorage.getItem("skill_"+this.userInfo.branchId)
    if(localSkills){
      this.convertSkills=JSON.parse(localSkills)
    }else{
      this.getAllHrSkill();
    }
    
    // this.$nextTick(() => {
    // 	this.getAllHrSkill();
    // });
  },
};
</script>

<style scoped>
.copyButton {
  margin-left: 5px;
  border-radius: 20px;
  padding: 10px 1px;
  border: 1px solid rgb(220, 223, 230);
  /* color:#039; */
}

.copyButton:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
  cursor: default;
}

.checkCopyButton {
  /*color: #fff;*/
  margin-left: 5px;
  border-radius: 20px;
  padding: 10px 1px;
  border: 1px solid #ffa00a;
  /*background-color: rgba(230, 162, 60, .1);*/
  /* background-color: #f9f9f9; */
  background-color: #fff;
  /*border-color: rgba(230,162,60,.2);*/
  color: #ffa00a;
}

.add {
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-top: 2px;
}

.add:hover {
  cursor: pointer;
  animation: myrotate 0.5s linear infinite;
}

.input-tag {
  margin-left: 10px;
  margin-top: 2px;
  align-self: center;
}
.closeStyle {
  padding: 1px;
}

.closeStyle:hover {
  cursor: pointer;
  /* border-color:#f40; */
  /* border: 1px solid #f40; */
  background-color: #ffa00a;
  color: #fff;
  border-radius: 50%;
  padding: 1px;
  animation: myrotate 1s linear;
}

.addTagSquare {
  width: 15px;
  height: 15px;
  display: inline-block;
  background-color: #ffa00a;
  animation: myrotate 2s linear infinite;
}

.closeTagSquare {
  width: 15px;
  height: 15px;
  display: inline-block;
  background-color: #fff;
  animation: myrotate 2s linear infinite;
}
@keyframes myrotate {
  0% {
    transform: rotate(0deg);
    box-shadow: 0px 0px 10px #fff;
  }

  50% {
    transform: rotate(180deg);
    box-shadow: 0px 0px 45px #fff;
  }

  100% {
    transform: rotate(360deg);
    box-shadow: 0px 0px 10px #fff;
  }
} 
</style>
