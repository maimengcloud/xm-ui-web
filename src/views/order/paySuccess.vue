<template>
    <div class="result">
        <el-result icon="success">
            <template slot="title">
                <p style="font-size: 24px;">恭喜您，支付成功！</p>
            </template>
            <template class="subTitle" slot="subTitle">
                <p style="margin-bottom: 6px;font-size: 16px;">您已成功支付￥ {{params.total_amount}} 元</p>
                <p style="margin-bottom: 6px;font-size: 16px;">订单号：{{params.out_trade_no}} （查看订单）</p>
            </template>
            <template slot="extra">
                <el-button type="primary" size="larget" @click="goBuyAgain()">继续购买</el-button>
                <el-button size="larget" @click="returnHome()">返回首页</el-button>
            </template>
        </el-result>
    </div>
</template>

<script>
export default {
    data() {
       return {
            params: {},
       }
    },

    created() {
        const href = window.location.href;
        this.params = this.urlParamsHash(href);
        console.log(this.params, "params");
    },

    methods: {
        returnHome() {
            this.$router.push({path:'/dashboard'})
        },

        goBuyAgain() {
            this.$router.push({path:'/my/order/index'})
        },

        urlParamsHash(url) {
            var params = {}
            var h
            var hash = url.slice(url.indexOf('?') + 1).split('&')
            for(var i = 0; i < hash.length; i++) {
                h = hash[i].split('=')
                params[h[0]] = h[1]
            }
            return params;
        }

    },
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