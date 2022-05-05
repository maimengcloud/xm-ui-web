<template>
  <div class="flagShip"> 
    <h2>购买信息</h2>
    <span class="desc">填写你的联系方式，我们产品顾问将会尽快联系你。</span>
    <el-form class="form"  label-position="left" ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="联系人" prop="contacts">
            <el-input class="inp" v-model="form.contacts"></el-input>
        </el-form-item>

         <el-form-item label="联系电话" prop="phone">
            <el-input class="inp" v-model="form.phone"></el-input>
        </el-form-item>

        <el-form-item label="使用人数">
            <el-select class="inp" v-model="form.usePeoples" placeholder="使用人数">
                <el-option
                v-for="item in usePeopleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="服务需求">
            <el-select class="inp" multiple  v-model="form.needs" placeholder="服务需求">
                <el-option
                v-for="item in needOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <span>想要我们提供哪些服务（可多选）</span>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            usePeopleOptions: [
                {
                    label: '51-100',
                    value: '51-100'
                },
                {
                    label: '101-500',
                    value: '101-500'
                },
                {
                    label: '501-1000',
                    value: '501-1000'
                },
                {
                    label: '1000以上',
                    value: '1000以上'
                }
            ],
            needOptions: [
                {
                    label: '预约演示',
                    value: '预约演示'
                },
                {
                    label: '产品报价',
                    value: '产品报价'
                },
                {
                    label: '部署方式',
                    value: '部署方式'
                },
                {
                    label: '新增功能',
                    value: '新增功能'
                },
                {
                    label: '其它',
                    value: '其它'
                }
            ],
            form: {
                phone: '',
                contacts: '',
                usePeoples: '',
                needs: [],
            },
            rules: {
                contacts: [
                    { required: true, message: '请输入联系人', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                ],
                usePeoples: [
                    { required: true, message: '请选择使用人数', trigger: 'blur' },
                ],
                needs: [
                    { required: true, message: '请选择服务需求', trigger: 'blur' },
                ],
            }
        }
    },

    methods: {
        getForm() {
            //验证表单
            return new Promise((resolve, reject) => {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        resolve(this.form);
                    } else {
                        reject(new Error('前检查表单项是否填写正确'))
                    }
                });
            })
        },



    },


}
</script>

<style lang="scss" scoped>
.flagShip {
    margin-top: 30px;
    h2 {
        margin-bottom: 20px;
    }
    .desc {
        color: #7D7D7D;
    }
    .form {
        margin-top: 40px;
        .inp {
            width: 280px;
        }
        
        span {
            margin-left: 78px;
            color: #7D7D7D;
        }
    }
}
</style>