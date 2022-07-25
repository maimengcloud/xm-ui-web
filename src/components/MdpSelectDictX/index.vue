<template>
  <div class="field-box" @click="showSelect">
    <slot name="avater" class="field-avater">
      <el-avatar
        :class="{ 'dashed-circle': avaterCpd.isNull }"
        :icon="avaterCpd.icon"
        :style="{ backgroundColor: avaterCpd.color }"
        >{{ avaterCpd.innerText }}</el-avatar
      >
    </slot>

    <div class="field-info" :class="{disabled:disabled===true,enabled:disabled!==true}">
      <slot name="info">
        <span class="field-value" v-if="!avaterCpd.isNull"
          >{{ avaterCpd.innerText }}
        </span>
        <span class="field-value" v-else
          ><span class="label-font-color">无</span></span
        >
        <span class="field-label">{{ label }}</span>
      </slot>
    </div>
    <div class="field-oper" :class="{disabled:disabled===true,enabled:disabled!==true}">
      <slot name="oper">
        <mdp-select-dict @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)"
          v-if="disabled !== true"
          :dict="dict"
          ref="selectRef"
          v-model="myVal"
          @change="onChange"
          :get-icon="getIcon"
          :get-color="getColor"
          :icon="icon"
        ></mdp-select-dict>
      </slot>
    </div>
  </div>
</template>
  
  <script>
import util from "@/common/js/util";
export default {
  name: "mdp-select-dict-x",
  components: {},
  computed: {
    currentItem() {
      if (this.dict) {
        return this.dict.find((k) => k.id == this.myVal);
      } else {
        return null;
      }
    },
    avaterCpd() {
      var currentItem = null;
      if (this.dict) {
        currentItem = this.dict.find((k) => k.id == this.myVal);
      }
      var isEmpty = this.isEmpty(this.myVal);
      var obj = {
        isNull: isEmpty,
        icon: "el-icon-full-screen",
        color: "#E4E7ED",
        innerText: "",
      };
      if (this.getColor || this.color) {
        if (this.getColor) {
          obj.color = this.getColor(this.myVal, currentItem, this.dict);
        } else {
          obj.color = this.color;
        }
      } else {
        if (!isEmpty) {
          if (currentItem && currentItem.color) {
            obj.color = currentItem.color;
          } else {
            obj.color = util.getColor(this.myVal);
          }
        }
      }
      if (this.getIcon || this.icon) {
        if (this.getIcon) {
          obj.icon = this.getIcon(this.myVal, currentItem, this.dict);
        } else if (this.icon) {
          obj.icon = this.icon;
        }
      } else {
        if (!isEmpty) {
          if (currentItem && currentItem.icon) {
            obj.icon = currentItem.icon;
          } else {
            obj.icon = "";
          }
        }
      }
      if (isEmpty) {
        obj.innerText = "";
      } else {
        if (currentItem == null) {
          obj.innerText = this.myVal;
        } else {
          obj.innerText = currentItem.name;
        }
      }
      return obj;
    },
  },
  data() {
    return {
      myVal: "",
    };
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.initData();
      },
    },

    myVal() {
      this.$emit("input", this.myVal);
    },
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    dict: {
      type: Array,
      default: function () {
        return [];
      },
    },
    value: {},

    icon: {
      type: String,
      default: null,
    },
    getIcon: {
      type: Function,
    },
    getColor: {
      type: Function,
    },
  },
  methods: {
    showSelect() {
      if (this.disabled) {
        return;
      }
      if (this.$refs["selectRef"]) {
        if (this.$refs["selectRef"].$refs["selectRef"]) {
          this.$refs["selectRef"].$refs["selectRef"].toggleMenu();
        }
      }
    },
    initData() {
      this.myVal = this.value;
    },

    onChange(data) {
      this.$emit("change", data);
    },
    isEmpty(v) {
      switch (typeof v) {
        case "undefined":
          return true;
        case "string":
          if (v.length == 0) return true;
          break;
        case "object":
          if (null === v || v.length === 0) return true;
          for (var i in v) {
            return false;
          }
          return true;
      }
      return false;
    },
  },
  mounted() {
    this.initData();
  },
};
</script>
  

<style lang="scss" scoped>  
  @import '../Mdp/index.scss';
</style>
  