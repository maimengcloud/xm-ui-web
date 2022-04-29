<template>
    <div class="result">
        <el-result icon="success">
            <template slot="title">
                <p style="font-size: 24px;">恭喜您，支付成功！</p>
            </template>
            <template class="subTitle" slot="subTitle">
                <p style="margin-bottom: 6px;font-size: 16px;">您已成功支付￥299.00元</p>
                <p style="margin-bottom: 6px;font-size: 16px;">支付方式： 支付宝</p>
                <p style="margin-bottom: 6px;font-size: 16px;">订单号：2022042417501233 （查看订单）</p>
            </template>
            <template slot="extra">
                <el-button type="primary" size="larget">继续购买</el-button>
                <el-button size="larget">返回首页</el-button>
            </template>
        </el-result>
    </div>
</template>

<script>
export default {


}
</script>

<style lang="scss" scoped>
.result {
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>