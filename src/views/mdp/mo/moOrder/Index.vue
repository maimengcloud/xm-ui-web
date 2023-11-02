<template>
	<section class="border padding">
		<el-row>
            			<el-input v-model="filters.id" style="width: 20%;" placeholder="订单编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
 			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})" icon="el-icon-plus"/>
                <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>
            </span>
            <span style="float:right;" v-else-if="currOpType=='select' &&  this.multiple==true">
                <el-button :disabled="disabledJudge('selectBtn') || this.sels.length===0" type="primary" @click="selectListConfirm" icon="el-icon-check"/>
            </span>
		</el-row>
		<el-row> 
			<mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
			<el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
		</el-row>
		<el-row>
			<!--列表 MoOrder mo_order-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="id" label="订单编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>
				<el-table-column prop="name"  label="订单名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('name')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.name" :maxlength="255" @change="editSomeFields(editForm,'name',$event)" :disabled="disabledJudge('name')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="obranchId"  label="下单机构号码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('obranchId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.obranchId" :maxlength="50" @change="editSomeFields(editForm,'obranchId',$event)" :disabled="disabledJudge('obranchId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ouserid"  label="下单用户编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ouserid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.ouserid" :maxlength="50" @change="editSomeFields(editForm,'ouserid',$event)" :disabled="disabledJudge('ouserid')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ousername"  label="下单用户名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ousername')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.ousername" :maxlength="255" @change="editSomeFields(editForm,'ousername',$event)" :disabled="disabledJudge('ousername')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="moFinalFee"  label="模块合计总金额=模块中的final_fee合计" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('moFinalFee')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.moFinalFee" :maxlength="10" :disabled="disabledJudge('moFinalFee')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="status"  label="订单状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('status')">
				    <template slot-scope="scope">
                            <mdp-select item-code="mo_order_status" show-style="tag" v-model="scope.row.status" :maxlength="1" @change="editSomeFields(editForm,'status',$event)" :disabled="disabledJudge('status')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ooper"  label="操作类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ooper')">
				    <template slot-scope="scope">
                            <mdp-select item-code="mo_ooper" show-style="tag" v-model="scope.row.ooper" :maxlength="1" @change="editSomeFields(editForm,'ooper',$event)" :disabled="disabledJudge('ooper')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ctime"  label="创建时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('ctime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('ctime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="payTime"  label="付款时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('payTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.payTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('payTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="payCtime"  label="付款确认时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('payCtime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.payCtime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('payCtime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="moOrginFee"  label="折扣前总价=模块中orgin_fee合计" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('moOrginFee')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.moOrginFee" :maxlength="10" :disabled="disabledJudge('moOrginFee')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ousers"  label="购买人数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('ousers')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.ousers" :precision="0" :disabled="disabledJudge('ousers')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ocates"  label="购买分类数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('ocates')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.ocates" :precision="0" :disabled="disabledJudge('ocates')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="omodules"  label="购买模块数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('omodules')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.omodules" :precision="0" :disabled="disabledJudge('omodules')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="startTime"  label="启用日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('startTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.startTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('startTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="endTime"  label="结束日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('endTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('endTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="payType"  label="支付方式" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('payType')">
				    <template slot-scope="scope">
                            <mdp-select item-code="tpAppPayType" show-style="tag" v-model="scope.row.payType" :maxlength="1" @change="editSomeFields(editForm,'payType',$event)" :disabled="disabledJudge('payType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="payId"  label="付款流水号(内部生成，传给第三方原样传回，如果不正确，不允许更新数据库，防止作弊)" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('payId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.payId" :maxlength="50" @change="editSomeFields(editForm,'payId',$event)" :disabled="disabledJudge('payId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="prepayId"  label="预下单付款订单号（第三方返回）" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('prepayId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.prepayId" :maxlength="50" @change="editSomeFields(editForm,'prepayId',$event)" :disabled="disabledJudge('prepayId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="topenId"  label="第三方账号编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('topenId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.topenId" :maxlength="50" @change="editSomeFields(editForm,'topenId',$event)" :disabled="disabledJudge('topenId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="pbankId"  label="收款银行编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pbankId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.pbankId" :maxlength="50" @change="editSomeFields(editForm,'pbankId',$event)" :disabled="disabledJudge('pbankId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="pbankName"  label="收款银行名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pbankName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.pbankName" :maxlength="255" @change="editSomeFields(editForm,'pbankName',$event)" :disabled="disabledJudge('pbankName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="pbankCardNo"  label="收款银行卡号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pbankCardNo')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.pbankCardNo" :maxlength="50" @change="editSomeFields(editForm,'pbankCardNo',$event)" :disabled="disabledJudge('pbankCardNo')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="pbankUsername"  label="收款账户姓名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pbankUsername')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.pbankUsername" :maxlength="255" @change="editSomeFields(editForm,'pbankUsername',$event)" :disabled="disabledJudge('pbankUsername')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="remark"  label="备注" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('remark')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.remark" :maxlength="255" @change="editSomeFields(editForm,'remark',$event)" :disabled="disabledJudge('remark')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="finishTime"  label="完成时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('finishTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.finishTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('finishTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="closeTime"  label="关闭时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('closeTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.closeTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('closeTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="sstatus"  label="结算状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('sstatus')">
				    <template slot-scope="scope">
                            <mdp-select item-code="mo_set_status" show-style="tag" v-model="scope.row.sstatus" :maxlength="1" @change="editSomeFields(editForm,'sstatus',$event)" :disabled="disabledJudge('sstatus')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="setTime"  label="结算时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('setTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.setTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('setTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="odays"  label="购买天数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('odays')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.odays" :precision="0" :disabled="disabledJudge('odays')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ofinalFee"  label="订单总价" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('ofinalFee')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.ofinalFee" :maxlength="10" :disabled="disabledJudge('ofinalFee')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="odisRate"  label="折扣率" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('odisRate')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.odisRate" :precision="0" :disabled="disabledJudge('odisRate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="othFee"  label="其它费用" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('othFee')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.othFee" :maxlength="10" :disabled="disabledJudge('othFee')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="otype"  label="订单类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('otype')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.otype" :maxlength="1" @change="editSomeFields(editForm,'otype',$event)" :disabled="disabledJudge('otype')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="osource"  label="订单来源" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('osource')">
				    <template slot-scope="scope">
                            <mdp-select item-code="osource" show-style="tag" v-model="scope.row.osource" :maxlength="1" @change="editSomeFields(editForm,'osource',$event)" :disabled="disabledJudge('osource')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="memType"  label="客户类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('memType')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.memType" :maxlength="1" @change="editSomeFields(editForm,'memType',$event)" :disabled="disabledJudge('memType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="atype"  label="账户类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('atype')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.atype" :maxlength="1" @change="editSomeFields(editForm,'atype',$event)" :disabled="disabledJudge('atype')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="saleUserid"  label="销售经理编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('saleUserid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.saleUserid" :maxlength="50" @change="editSomeFields(editForm,'saleUserid',$event)" :disabled="disabledJudge('saleUserid')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="saleUsername"  label="销售经理名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('saleUsername')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.saleUsername" :maxlength="255" @change="editSomeFields(editForm,'saleUsername',$event)" :disabled="disabledJudge('saleUsername')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="custPhone"  label="客户联系电话" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('custPhone')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.custPhone" :maxlength="50" @change="editSomeFields(editForm,'custPhone',$event)" :disabled="disabledJudge('custPhone')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="custAddress"  label="客户联系地址" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('custAddress')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.custAddress" :maxlength="255" @change="editSomeFields(editForm,'custAddress',$event)" :disabled="disabledJudge('custAddress')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="payAt"  label="最终付款金额" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('payAt')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.payAt" :maxlength="20" :disabled="disabledJudge('payAt')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="obranchName"  label="下单机构名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('obranchName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.obranchName" :maxlength="255" @change="editSomeFields(editForm,'obranchName',$event)" :disabled="disabledJudge('obranchName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="tranId"  label="第三方付款事务号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tranId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tranId" :maxlength="50" @change="editSomeFields(editForm,'tranId',$event)" :disabled="disabledJudge('tranId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="invoice"  label="是否已开票" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('invoice')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.invoice" :maxlength="1" @change="editSomeFields(editForm,'invoice',$event)" :disabled="disabledJudge('invoice')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="invoiceTime"  label="开票时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('invoiceTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.invoiceTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('invoiceTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="invoiceId"  label="发票编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('invoiceId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.invoiceId" :maxlength="50" @change="editSomeFields(editForm,'invoiceId',$event)" :disabled="disabledJudge('invoiceId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="poid"  label="上级订单" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('poid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.poid" :maxlength="50" @change="editSomeFields(editForm,'poid',$event)" :disabled="disabledJudge('poid')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?180:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})" icon="el-icon-edit" title="修改一条数据"/>
 				        <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"/>
				    </template>

				    <template scope="scope" v-else-if="currOpType=='list'" >
				        <el-button   type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="el-icon-view"/>
 				    </template>

				    <template scope="scope" v-else-if="currOpType=='select' && this.multiple!=true" >
				        <el-button   type="primary" @click="selectConfirm(scope.row)" icon="el-icon-check"/>
 				    </template>
				</el-table-column>
			</el-table>
		</el-row>
		<el-row>
			<el-pagination
				layout="slot,total, sizes, prev, next,pager,jumper"
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				:page-sizes="[10,20, 50, 100, 500]"
				:current-page="pageInfo.pageNum"
				:page-size="pageInfo.pageSize"
				:total="pageInfo.total"
				style="float:right;"
			> 
			</el-pagination>
		</el-row>
		<el-row>
			<!--新增修改明细 MoOrder mo_order界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <mo-order-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import * as MoOrderApi from '@/api/mdp/mo/moOrder';
import  MoOrderForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'

export default {
    name:'moOrderMng',
    mixins:[MdpTableMixin],
    components: {
        MoOrderForm,
    },
	props:{
		isMyBranch:{
			type:Boolean,
			default:false,
		} 
	},
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'mo_order',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'moOrder',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: MoOrderApi.listMoOrder,
                add: MoOrderApi.addMoOrder,
                del: MoOrderApi.delMoOrder,
                edit: MoOrderApi.editMoOrder,
                editSomeFields: MoOrderApi.editSomeFieldsMoOrder,
                batchAdd: MoOrderApi.batchAddMoOrder,
                batchDel: MoOrderApi.batchDelMoOrder,
                batchEdit: MoOrderApi.batchEditMoOrder,
            }
        }
    },
    methods: {
         //页面初始化需要配置的特殊逻辑写这里
          initCurrData(){
             this.searchTableDatas();
          },

          /**
           * 检查参数是否满足调用后台接口的条件
           *
           * @param params 提交给后台的参数池,map类型
           * @returns true / false
           */
          preQueryParamCheck(params){
			if(this.isMyBranch){
				params.branchId=this.userInfo.branchId
			}
              return true;
          },

          //页面数据加载完后需要对数据进行加工处理的
          afterList(res,isOk,apiName){

          },

          /**
           * 对修改的字段进行判断，返回false ,将取消更新数据库
           * @param {*} row 当前选中的行
           * @param {*} fieldName 修改的字段名
           * @param {*} $event 修改后的值
           * @param {*} params 将要提交服务器的参数
           * @returns true/false 返回false ,将取消更新数据库
           */
          editSomeFieldsCheck(row,fieldName,$event,params){
              if(this.currOpType=='add'||this.currOpType=='detail'){
                  return false;
              }
              params[fieldName]=$event
              return true;
          },
           /**
           * 设置某个关键词、按钮、输入框禁用 disabledRules['addBtn']=false
           * 判断某个对象是否可编辑 this.disabledJudge('addBtn')==false
           */
          disabledRulesInit(disabledRules){

          },
         /**
          * 打开某个子页面
          */
        openForm(res){
            let {parentOpType,formRefId,subOpType,formData} = res
            if(!formRefId){
                formRefId=this.getRefId()+"FormDialog"
            }
            if(!parentOpType){
                parentOpType=this.currOpType
            }
            var form=this.$refs[formRefId]
            if(form){
                res.parentOpType=parentOpType
                res.formRefId=formRefId
                form.open(res);
            }else{

            }

        },
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>