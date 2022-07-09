<template>
	<section>  
		<el-row :gutter="20" >
			<el-col v-if="editForm.crowd==='1'" :span="4" class="border padding">
				<el-steps :active="calcTaskStep" align-center  v-if="editForm.crowd==='1'" finish-status="success" process-status="process" direction="vertical">
					<el-step v-for="(item,index) in dicts.bidStep" :title="item.name" :description="item.name" :key="index"> 
						<span slot="description">
								<span v-if="item.id=='0'"><!--草稿-->
									<span>修改任务信息</span>
								</span> 
								<span v-else-if="item.id=='1'"> <!--需求-->
								<el-button type="primary" size="mini" v-if="editForm.bidStep=='0'" @click="editXmTaskSomeFields(editForm,'bidStep','1')" plain>去发布</el-button> 
								<span v-else-if="editForm.bidStep>='1'">
									<el-button style="margin-left:0px;" type="primary" size="mini" v-if="editForm.bidStep=='1'" @click="editXmTaskSomeFields(editForm,'bidStep','0')" plain>去取消发布</el-button> 
									<el-button style="margin-left:0px;" type="warning" size="mini" v-if="editForm.bidStep>='1'" @click="activateTabPaneName='82'" plain>参加推广活动</el-button> 
								</span>
								
								<span v-else>发布、取消发布</span>

								</span>
								<span v-else-if="item.id=='2'"> <!--投标中-->
								<el-button type="primary" size="mini" v-if="editForm.bidStep=='1'" @click="activateTabPaneName='42'" plain>去投标</el-button> 
								<el-button type="primary" size="mini" v-else-if="editForm.bidStep>'1'" @click="activateTabPaneName='42'" plain>投标人管理</el-button> 
								<span v-else>投标、投标人管理</span>
								</span>
								<span v-else-if="item.id=='3'"> <!--选标-->
								<el-button type="primary" size="mini" v-if="editForm.bidStep=='2'" @click="activateTabPaneName='42'" plain>去选标</el-button>
								<el-button type="primary" size="mini" v-else-if="editForm.bidStep>'2'" @click="activateTabPaneName='42'" plain>中标人管理</el-button>
								<span v-else>雇主选标、中标人管理</span>
								</span>
								<span v-else-if="item.id=='4'"> <!--拓管资金-->
								<el-button style="margin-left:0px;"  type="primary" size="mini" v-if="(editForm.bidStep=='4'||editForm.bidStep=='3') && (editForm.estate=='0'||editForm.estate==''||editForm.estate=='1')" @click="activateTabPaneName='8'" plain>去托管佣金￥：{{needPayEfundsAt}}</el-button>
								<el-button style="margin-left:0px;"  type="primary" size="mini" v-if=" (editForm.estate>'1')" @click="activateTabPaneName='8'" plain>已托管佣金￥：{{editForm.efunds}}</el-button>
								<span v-else>付款给平台</span>
								</span>
								<span v-else-if="item.id=='5'"> <!--工作中-->
								
								<el-button style="margin-left:0px;"  type="primary" size="mini" v-if="editForm.bidStep>'1'" @click="activateTabPaneName='5'" plain>报工、报进度</el-button>
								<el-button style="margin-left:0px;"  type="primary" size="mini" v-if="(editForm.bidStep=='4'||editForm.bidStep=='3') && (editForm.estate>='2')" @click="editXmTaskSomeFields(editForm,'bidStep','5')" plain>开始工作</el-button>
								 
								<el-button style="margin-left:0px;"  type="primary" size="mini" v-else-if="editForm.bidStep=='5' && (editForm.taskState=='1'||editForm.taskState=='0')" @click="editXmTaskSomeFields(editForm,'taskState','2')" plain>去提交任务</el-button>
								 
								<span v-else><br/>服务商提交任务</span>
								</span>
								<span v-else-if="item.id=='6'"> <!--付款完成-->
								<span v-if="editForm.bidStep=='5' && editForm.taskState=='2'">
									<el-button style="margin-left:0px;"  type="primary" size="mini"  @click="editXmTaskSomeFields(editForm,'taskState','3')" plain>设置为验收成功</el-button> 
									<el-button style="margin-left:0px;"  type="primary" size="mini" @click="editXmTaskSomeFields(editForm,'taskState','1')" plain>设置为验收不成功</el-button> 
								</span> 
								<span v-if="editForm.bidStep=='6'">
									 <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'taskState',editForm.taskState)" :key="index" :type="item.className">{{item.name}}</el-tag>
								</span> 
								<el-button style="margin-left:0px;" type="primary" size="mini" v-if="editForm.bidStep=='6'&&editForm.taskState=='4'" plain @click="editXmTaskSomeFields(editForm,'taskState','9')">去关闭</el-button> 
								<span v-else>雇主付款、关闭任务</span>
								</span>
						</span>
					</el-step> 
				</el-steps> 
			</el-col>
			<el-col v-if="editForm.crowd!='1'" :span="4" class="border padding">
				<el-steps :active="calcTaskStep" align-center  v-if="editForm.crowd==='1'" finish-status="success" process-status="process" direction="vertical">
					<el-step v-for="(item,index) in dicts.bidStep" :title="item.name" :description="item.name" :key="index"> 
						<span slot="description">
								<span v-if="item.id=='0'"><!--草稿-->
									<span>修改任务信息</span>
								</span> 
								<span v-else-if="item.id=='1'"> <!--需求-->
								<el-button type="primary" size="mini" v-if="editForm.bidStep=='0'" @click="editXmTaskSomeFields(editForm,'bidStep','1')" plain>去发布</el-button> 
								<span v-else-if="editForm.bidStep>='1'">
									<el-button style="margin-left:0px;" type="primary" size="mini" v-if="editForm.bidStep=='1'" @click="editXmTaskSomeFields(editForm,'bidStep','0')" plain>去取消发布</el-button> 
									<el-button style="margin-left:0px;" type="warning" size="mini" v-if="editForm.bidStep>='1'" @click="activateTabPaneName='82'" plain>参加推广活动</el-button> 
								</span>
								
								<span v-else>发布、取消发布</span>

								</span>
								<span v-else-if="item.id=='2'"> <!--投标中-->
								<el-button type="primary" size="mini" v-if="editForm.bidStep=='1'" @click="activateTabPaneName='42'" plain>去投标</el-button> 
								<el-button type="primary" size="mini" v-else-if="editForm.bidStep>'1'" @click="activateTabPaneName='42'" plain>投标人管理</el-button> 
								<span v-else>投标、投标人管理</span>
								</span>
								<span v-else-if="item.id=='3'"> <!--选标-->
								<el-button type="primary" size="mini" v-if="editForm.bidStep=='2'" @click="activateTabPaneName='42'" plain>去选标</el-button>
								<el-button type="primary" size="mini" v-else-if="editForm.bidStep>'2'" @click="activateTabPaneName='42'" plain>中标人管理</el-button>
								<span v-else>雇主选标、中标人管理</span>
								</span>
								<span v-else-if="item.id=='4'"> <!--拓管资金-->
								<el-button style="margin-left:0px;"  type="primary" size="mini" v-if="(editForm.bidStep=='4'||editForm.bidStep=='3') && (editForm.estate=='0'||editForm.estate==''||editForm.estate=='1')" @click="activateTabPaneName='8'" plain>去托管佣金￥：{{needPayEfundsAt}}</el-button>
								<el-button style="margin-left:0px;"  type="primary" size="mini" v-if=" (editForm.estate>'1')" @click="activateTabPaneName='8'" plain>已托管佣金￥：{{editForm.efunds}}</el-button>
								<span v-else>付款给平台</span>
								</span>
								<span v-else-if="item.id=='5'"> <!--工作中-->
								
								<el-button style="margin-left:0px;"  type="primary" size="mini" v-if="editForm.bidStep>'1'" @click="activateTabPaneName='5'" plain>报工、报进度</el-button>
								<el-button style="margin-left:0px;"  type="primary" size="mini" v-if="(editForm.bidStep=='4'||editForm.bidStep=='3') && (editForm.estate>='2')" @click="editXmTaskSomeFields(editForm,'bidStep','5')" plain>开始工作</el-button>
								 
								<el-button style="margin-left:0px;"  type="primary" size="mini" v-else-if="editForm.bidStep=='5' && (editForm.taskState=='1'||editForm.taskState=='0')" @click="editXmTaskSomeFields(editForm,'taskState','2')" plain>去提交任务</el-button>
								 
								<span v-else><br/>服务商提交任务</span>
								</span>
								<span v-else-if="item.id=='6'"> <!--付款完成-->
								<span v-if="editForm.bidStep=='5' && editForm.taskState=='2'">
									<el-button style="margin-left:0px;"  type="primary" size="mini"  @click="editXmTaskSomeFields(editForm,'taskState','3')" plain>设置为验收成功</el-button> 
									<el-button style="margin-left:0px;"  type="primary" size="mini" @click="editXmTaskSomeFields(editForm,'taskState','1')" plain>设置为验收不成功</el-button> 
								</span> 
								<span v-if="editForm.bidStep=='6'">
									 <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'taskState',editForm.taskState)" :key="index" :type="item.className">{{item.name}}</el-tag>
								</span> 
								<el-button style="margin-left:0px;" type="primary" size="mini" v-if="editForm.bidStep=='6'&&editForm.taskState=='4'" plain @click="editXmTaskSomeFields(editForm,'taskState','9')">去关闭</el-button> 
								<span v-else>雇主付款、关闭任务</span>
								</span>
						</span>
					</el-step> 
				</el-steps> 
			</el-col>
			<el-col :span="20">
			<!--新增界面 XmTask xm_task--> 
			<el-form :model="editForm"  label-width="120px" label-position="left" :rules="editFormRules" ref="editForm">  
						<el-row :gutter="10">
							<el-col :span="6">
								<el-form-item label="序号" prop="sortLevel" >  
									<template slot="label"> 
									<div    class="icon" :style="{backgroundColor:   editForm.ntype==='0'?'#409EFF':'#E6A23C'}">
										<i :class="  editForm.ntype==='0'?'el-icon-s-operation':'el-icon-odometer' " ></i>
									</div>  
									{{editForm.ntype==='0'?'序号/任务':'序号/计划'}}
									</template>
									<el-input  v-model="editForm.sortLevel"    placeholder="如1.0或者1.2.3等" title="序号，如1.0、1.1.1或者1，2，3等"  @change="editXmTaskSomeFields(editForm,'sortLevel',$event)"></el-input> 
 
								</el-form-item>  
							</el-col>
							<el-col :span="18"> 
								<el-form-item label="" prop="name" label-width="0"> 
										<el-input v-model="editForm.name" placeholder="名称" @change="editXmTaskSomeFields(editForm,'name',$event)"></el-input>   
								</el-form-item> 
							</el-col>
							
						</el-row>
						
						
						<el-row>
							<el-col :span="8"> 
								 <el-form-item v-if="editForm.ptype==='0'" label="归属项目" prop="projectId"> 
									{{editForm.projectName?editForm.projectName:editForm.projectId}}
								</el-form-item>
								
								<el-form-item v-if="editForm.ptype==='1'" label="归属产品" prop="productId">
									{{editForm.productName?editForm.productName:editForm.productId}}
								</el-form-item>
							</el-col>
							<el-col :span="8"> 
								 <el-form-item label="上级计划" prop="parentTaskname">  
									<template slot="label"> 
										<div    class="icon" :style="{backgroundColor:   '#E6A23C'}">
										<i :class=" 'el-icon-odometer' " ></i>
										</div> 
										上级计划
									</template>
									<font v-if="editForm.parentTaskid" >{{editForm.parentTaskname?editForm.parentTaskname:editForm.parentTaskid}}</font> 
									<font v-else>无上级(视为顶级)</font> 
									
									<el-button
										@click="selectParentTaskVisible=true"  
										title="更换任务的上级，实现任务搬家功能"
										icon="el-icon-upload2" 
									> </el-button> 
								</el-form-item>
							</el-col> 
							<el-col :span="8"> 
								<el-form-item label="总负责人"> 
									<el-tag  v-if="editForm.createUserid" style="margin-left:10px;border-radius:30px;"  >{{editForm.createUsername}}</el-tag>
									<el-button type="text" @click="showGroupUserSelect(editForm)" icon="el-icon-setting">设置负责人</el-button>
								</el-form-item> 
							</el-col>  
						</el-row>
						<el-row>
							<el-col :span="8"> 
								<el-form-item :label="editForm.ntype=='0'?'任务状态':'计划状态'">  
									
									<el-select v-model="editForm.taskState" @change="editXmTaskSomeFields(editForm,'taskState',$event)">
											<el-option v-for="i in dicts.taskState" :label="i.name" :key="i.id" :value="i.id"></el-option> 
									</el-select>    
								</el-form-item> 
							</el-col> 
							<el-col :span="8"> 
								<el-form-item label="进度">   
										{{editForm.rate?editForm.rate:0}}%
								</el-form-item>  
							</el-col> 
							<el-col :span="8"> 
								<el-form-item label="起止时间">  
										<date-range 
											:style-obj="{maxWidth:'100%'}"
											v-model="editForm"
											start-key="startTime"
											end-key="endTime"
											@change="onBudgetDateRangerChange" 
											type="daterange"
											:auto-default="false" 
											unlink-panels
											range-separator="-"
											start-placeholder="开始日期"
											end-placeholder="完成日期"
											value-format="yyyy-MM-dd HH:mm:ss"
											:default-time="['00:00:00','23:59:59']"
											:picker-options="pickerOptions"
										></date-range> 
								</el-form-item>  
							</el-col> 

							
						</el-row>
					<el-tabs v-model="activateTabPaneName" >
						<el-tab-pane label="基础信息" name="1"> 	
						<el-row>  
							<el-col :span="10">
								<el-form-item  label="" prop="milestone">  
									<el-checkbox v-model="editForm.milestone" true-label="1" false-label="0" @change="editXmTaskSomeFields(editForm,'milestone',$event)">里程碑</el-checkbox>
								</el-form-item> 
							</el-col> 
							<el-col :span="14"> 
								<el-form-item prop="skill" label=""  v-if="editForm.ntype!='1'"  label-width="0"> 
									<el-tag class="fs-ft" style="margin-right:10px" v-for="(item,i) in taskSkills" :key="i">{{item.taskSkillName}}</el-tag>
									<el-button   type="text" @click.stop="showSkill()" icon="el-icon-plus">技能要求</el-button>
								</el-form-item> 
							</el-col>  
						</el-row> 
						<el-row> 
							
							<el-col :span="12">
								<el-form-item  label="优先级别" prop="level">  
									<el-select v-model="editForm.level" @change="editXmTaskSomeFields(editForm,'level',$event)">
											<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option> 
									</el-select>    
								</el-form-item>  
							</el-col>
							<el-col :span="12"  prop="planType"> 
								<el-form-item label="工期类型"> 
								<el-select v-model=" editForm.planType" @change="editXmTaskSomeFields(editForm,'planType',$event)">
									<el-option v-for="i in this.dicts.planType" :label="i.name" :key="i.id" :value="i.id"></el-option>
								</el-select> 
								</el-form-item>
							</el-col>
						</el-row> 
						
						<el-row>
							<el-col :span="12"> 
								<el-form-item :label="editForm.ntype=='0'?'任务前置':'计划前置'"> 
									<el-tag v-if="editForm.preTaskid"  @close="clearPreTask" closable >{{editForm.preTaskname}}</el-tag>
									<el-button  type="text"  @click.stop="selectTaskVisible=true"  >选前置</el-button> 
								</el-form-item>  
							</el-col>  
							<el-col :span="12">
								<el-form-item  :label="editForm.ntype=='0'?'任务类型':'计划类型'" prop="taskType">   
									<el-select v-model="editForm.taskType" @change="editXmTaskSomeFields(editForm,'taskType',$event)">
										<el-option v-for="i in this.dicts.taskType" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>  
								</el-form-item>   
							</el-col>
						</el-row>  
					</el-tab-pane>
					<el-tab-pane label="概述" name="2">  
						<el-form-item  label="任务概述" prop="description">  
 							<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" v-model="editForm.description" placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划"  @change="editXmTaskSomeFields(editForm,'description',$event)"></el-input> 
						</el-form-item> 
					</el-tab-pane>
					
					<el-tab-pane label="需求" name="3">  
						
						<el-row>
							<el-col :span="12"> 
								<el-form-item  label="归属产品" prop="productId"> 
									 {{editForm.productId}}
								</el-form-item>  
							</el-col>
							<el-col :span="12"> 
								<el-form-item  label="用户故事" prop="menuId" id="menuInfo" v-if="editForm.ntype!='1'"> 
									{{editForm.menuName}} &nbsp;&nbsp;&nbsp; <el-link @click="menuVisible=true" type="primary">{{editForm.menuName?'更改':'设置'}}</el-link>&nbsp;&nbsp;&nbsp;
									<el-link v-if="editForm.menuName" @click="toMenu" type="primary">查看需求</el-link>
								</el-form-item> 
							</el-col> 
						</el-row>
					</el-tab-pane>
					
					<el-tab-pane label="工时" name="5"> 
						 <xm-task-workload-record v-if="activateTabPaneName=='5'" :xm-task="editForm" ></xm-task-workload-record>
					</el-tab-pane>
					<el-tab-pane label="预算金额" name="6"> 
						<el-form-item label="自研工时单价" prop="uniInnerPrice">
							 <el-input type="number" style="width:150px;"   v-model="editForm.uniInnerPrice" :precision="2" :step="10" :min="0" placeholder="自研工时单价" @change="editXmTaskSomeFields(editForm,'uniInnerPrice',$event)"></el-input  >   元/h
							 
						</el-form-item> 
						<el-form-item label="外包、众包单价" prop="uniOutPrice"> 
								 <el-input type="number" style="width:150px;"   v-model="editForm.uniOutPrice" :precision="2" :step="10" :min="0" placeholder="外发工时单价" @change="editXmTaskSomeFields(editForm,'uniOutPrice',$event)"></el-input  >   元/h
						 
						</el-form-item> 
						<el-form-item label="预估金额" prop="budgetAt">
						 	<el-input type="number" style="width:150px;"    v-model="editForm.budgetAt" :precision="2" :step="100" :min="0" placeholder="预算金额" @change="editXmTaskSomeFields(editForm,'budgetAt',$event)"></el-input  >   元 
						</el-form-item> 

					</el-tab-pane>
					<el-tab-pane :label="'子工作项('+subWorkItemNum+')'" name="4" v-if="editForm.ntype==='1'">  
							 <xm-sub-work-item v-if="activateTabPaneName=='4'" :parent-xm-task="editForm"  @sub-work-item-num="setSubWorkItemNum" @add-sub-task="onAddSubTask"></xm-sub-work-item>
					</el-tab-pane>
					<el-tab-pane label="缺陷" name="41" v-if="editForm.ntype!='1'">  
						<xm-question-for-task v-if="activateTabPaneName=='41'"  :xm-task="editForm" :sel-project="xmProject"></xm-question-for-task>
					</el-tab-pane>
					
					<el-tab-pane label="执行人" name="42" v-if="editForm.ntype!='1'"> 
						<xm-task-execuser-for-task v-if="activateTabPaneName=='42'" :xm-task="editForm" @after-add-submit="afterAddExecSubmit" @after-edit-submit="afterEditExecSubmit" @after-delete-submit="afterEditExecSubmit"></xm-task-execuser-for-task>
					</el-tab-pane>
					<el-tab-pane label="结算信息" name="7" v-if="editForm.ntype!='1'">
						<el-form-item label="" prop="taskClass">
							<el-checkbox v-model="editForm.taskClass" true-label="1" false-label="0"  @change="editXmTaskSomeFields(editForm,'taskClass',$event)">是否需要结算</el-checkbox>
						</el-form-item>
						<el-form-item v-if="editForm.taskClass=='1'" label="结算方案" prop="settlSchemel">
							<el-select v-model=" editForm.settleSchemel"  @change="editXmTaskSomeFields(editForm,'settleSchemel',$event)">
								<el-option v-for="i in dicts.xmTaskSettleSchemel" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="众包、互联网访问" name="8" v-if="editForm.ntype!='1'">
						
						<p v-if="!toPayEfundsVisible &&  activateTabPaneName=='8'">
					 	<el-form-item> 
							 <el-checkbox v-model="editForm.taskOut" true-label="1" false-label="0" id="taskOut" @change="editXmTaskSomeFields(editForm,'taskOut',$event)">外购</el-checkbox>   
 						 
							 <el-checkbox v-model="editForm.crowd"  v-if="editForm.taskOut==='1'" true-label="1" false-label="0" id="crowd" @change="editXmTaskSomeFields(editForm,'crowd',$event)">开通众包</el-checkbox>   
						 
							<el-checkbox v-model="editForm.toTaskCenter" v-if="editForm.taskOut==='1'" true-label="1" false-label="0" id="toTaskCenter" @change="editXmTaskSomeFields(editForm,'toTaskCenter',$event)">发布到互联网任务大厅</el-checkbox> 
						</el-form-item>
						<el-row>
							<el-col :span="12"> 
								<el-form-item label="交易模式" prop="tranMode"  v-if="editForm.crowd==='1'"> 
									<el-select v-model="editForm.tranMode" @change="editXmTaskSomeFields(editForm,'tranMode',$event)">
										<el-option v-for="(item,index) in dicts['tranMode']" :key="index" :value="item.id" :label="item.name"></el-option>
									</el-select>
								</el-form-item> 
							</el-col>
							<el-col :span="12"> 
								<el-form-item label="最低能力等级" prop="capaLvls"  v-if="editForm.crowd==='1'"> 
									<el-select v-model="editForm.capaLvls" @change="editXmTaskSomeFields(editForm,'capaLvls',$event)">
										<el-option v-for="(item,index) in dicts['capaLvl']" :key="index" :value="item.id" :label="item.name"></el-option>
									</el-select>
								</el-form-item> 
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12"> 
								<el-form-item label="服务保障" prop="supRequires"  v-if="editForm.crowd==='1'"> 
									<el-select v-model="supRequires" @change="editXmTaskSomeFields(editForm,'supRequires',$event)" multiple>
										<el-option v-for="(item,index) in dicts['supRequire']" :key="index" :value="item.id" :label="item.name"></el-option>
									</el-select>
								</el-form-item> 
							</el-col>
							<el-col :span="12"> 
								<el-form-item label="最低会员等级" prop="interestLvls"  v-if="editForm.crowd==='1'"> 
									<el-select v-model="editForm.interestLvls" @change="editXmTaskSomeFields(editForm,'interestLvls',$event)">
										<el-option v-for="(item,index) in dicts['memInterestLvl']" :key="index" :value="item.id" :label="item.name"></el-option>
									</el-select>
								</el-form-item> 
							</el-col>
							
						</el-row>
						<el-row>
							<el-col :span="12"> 
								<el-form-item label="地区限制" prop="regionType"  v-if="editForm.crowd==='1'"> 
									<el-select v-model="editForm.regionType" @change="editXmTaskSomeFields(editForm,'regionType',$event)" >
										<el-option v-for="(item,index) in dicts['regionType']" :key="index" :value="item.id" :label="item.name"></el-option>
									</el-select>
								</el-form-item> 
							</el-col>
							<el-col :span="12"> 
								<el-form-item label="城市名称" prop="cityName"  v-if="editForm.crowd==='1'"> 
									<el-input v-model="editForm.cityName" placeholder="城市名称" @change="editXmTaskSomeFields(editForm,'cityName',$event)"></el-input>   

								</el-form-item> 
							</el-col>
							
						</el-row>
						
						<el-row v-if="editForm.crowd==='1'">
							<el-col :span="18"> 
								<el-row>
									<el-col :span="6">
										<el-form-item label="托管资金" prop="estate"  v-if="editForm.taskOut==='1'">
											<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'estate',editForm.estate)" :key="index" :type="item.className">{{item.name}}</el-tag>
											<span v-if="editForm.efunds>0 && (editForm.estate=='2'||editForm.estate=='3')">{{editForm.efunds}}元</span>
										</el-form-item> 
									</el-col>
									<el-col :span="6">
										<el-form-item label="预算佣金" prop="budgetAt" v-if="editForm.taskOut==='1'">
											 {{editForm.budgetAt}}元
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="中标人总价" prop="quoteFinalAt" v-if="editForm.taskOut==='1'">
											 {{editForm.quoteFinalAt}}元
										</el-form-item>
									</el-col>
								</el-row> 
							</el-col>
							<el-col :span="6" v-if="editForm.bidStep=='4'">  
								<strong> 合计待付款￥:</strong>&nbsp;&nbsp;<font style="font-size:48px;color:red;"> {{needPayEfundsAt}}&nbsp;</font>元
								 <br/>
								 <el-button class="padding" @click="toPayEfundsVisible=true" type="primary">去付款</el-button> 
							</el-col> 
						</el-row>  
						</p>
						 <to-pay v-else-if="toPayEfundsVisible &&  activateTabPaneName=='8'" :biz-type="'1'" :task-id="editForm.id" :visible="toPayEfundsVisible" @cancel="toPayEfundsVisible=false" @pay-success="onTaskPaySuccess"></to-pay>
					</el-tab-pane>
					
					<el-tab-pane label="营销推广" name="82" v-if="editForm.ntype!='1'"> 
						<el-row>
							<el-col :span="6">
								<el-form-item label="浏览人次" prop="browseUsers">
									 {{editForm.browseUsers}}
								</el-form-item> 
							</el-col>
							<el-col :span="6">
								 <el-form-item label="浏览数" prop="browseTimes">
									 {{editForm.browseTimes}}
								</el-form-item> 
							</el-col>
							<el-col :span="6">
								 <el-form-item label="候选人数" prop="execUsers">
									 {{editForm.execUsers}}
								</el-form-item> 
							</el-col>
						</el-row>  
						<p v-if="!toPayMarketVisible &&  activateTabPaneName=='82'">  
						
						<el-row v-if="editForm.crowd==='1'">
							<el-col :span="18">  
								<el-row>
									<el-col :span="6">
										<el-form-item label="分享赚" prop="oshare"  v-if="editForm.taskOut==='1'">
											<el-checkbox v-model="editForm.oshare" v-if="editForm.oshare!='2'" true-label="1" false-label="0" id="oshare" @change="editXmTaskSomeFields(editForm,'oshare',$event)">分享赚</el-checkbox>  
											<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'marketState',editForm.oshare)" :key="index" :type="item.className">{{item.name}}</el-tag>
										</el-form-item> 
									</el-col>
									<el-col :span="18">
										<el-form-item label="分享佣金" prop="shareFee" v-if="editForm.oshare==='1' && editForm.taskOut==='1'">
											<el-input type="number" style="width:100px;"    v-model="editForm.shareFee" :precision="2" :step="2" :min="0" placeholder="分享赚佣金" @change="editXmTaskSomeFields(editForm,'shareFee',$event)"></el-input  >   元
											<font color="blue">一般建议为任务佣金的1%-5%</font>
										</el-form-item>
									</el-col>
								</el-row> 
								<el-row>
									<el-col :span="6">
										<el-form-item label="热门" prop="hot"  v-if="editForm.taskOut==='1'">
										 	<el-checkbox v-model="editForm.hot" v-if="editForm.hot!='2'" true-label="1" false-label="0" id="hot" @change="editXmTaskSomeFields(editForm,'hot',$event)">热门</el-checkbox>  
											<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'marketState',editForm.hot)" :key="index" :type="item.className">{{item.name}}</el-tag>
										</el-form-item> 
									</el-col>
									<el-col :span="18">
										<el-form-item label="热门费用" prop="hotFee" v-if="editForm.hot==='1' && editForm.taskOut==='1'">
											 {{needPayMarketAt.hotFee}}&nbsp;元
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="6">
										<el-form-item label="置顶" prop="top"  v-if="editForm.taskOut==='1'">
											<el-checkbox v-model="editForm.top" v-if="editForm.top!='2'" true-label="1" false-label="0" id="hot" @change="editXmTaskSomeFields(editForm,'top',$event)">置顶</el-checkbox>  
											<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'marketState',editForm.top)" :key="index" :type="item.className">{{item.name}}</el-tag>
										</el-form-item> 
									</el-col>
									<el-col :span="18">
										<el-form-item label="置顶费用" prop="topFee" v-if="editForm.top==='1' && editForm.taskOut==='1'">
											 {{needPayMarketAt.topFee}}&nbsp;元
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="6">
										<el-form-item label="加急" prop="urgent"  v-if="editForm.taskOut==='1'">
											<el-checkbox v-model="editForm.urgent" v-if="editForm.urgent!='2'" true-label="1" false-label="0" id="urgent" @change="editXmTaskSomeFields(editForm,'urgent',$event)">加急</el-checkbox>  
											<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'marketState',editForm.urgent)" :key="index" :type="item.className">{{item.name}}</el-tag>
										</el-form-item> 
									</el-col>
									<el-col :span="18">
										<el-form-item label="加急费用" prop="urgentFee" v-if="editForm.urgent==='1' && editForm.taskOut==='1'">
											 {{needPayMarketAt.urgentFee}}&nbsp;元
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="6">
										<el-form-item label="客服包办" prop="crmSup"  v-if="editForm.taskOut==='1'">
											<el-checkbox v-model="editForm.crmSup" v-if="editForm.crmSup!='2'" true-label="1" false-label="0" id="hot" @change="editXmTaskSomeFields(editForm,'crmSup',$event)">客服包办</el-checkbox>  
											<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'marketState',editForm.crmSup)" :key="index" :type="item.className">{{item.name}}</el-tag>
										</el-form-item> 
									</el-col>
									<el-col :span="18">
										<el-form-item label="客服包办费用" prop="crmSupFee" v-if="editForm.crmSup==='1' && editForm.taskOut==='1'">
											 {{needPayMarketAt.crmSupFee}}&nbsp;元
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6" v-if="needPayMarketAt.total>0">  
								<strong> 合计待付款￥:</strong>&nbsp;&nbsp;<font style="font-size:48px;color:red;"> {{needPayMarketAt.total}}&nbsp;</font>元
								 <br/>
								 <el-button class="padding" @click="toPayMarketVisible=true" type="primary">去付款</el-button> 
							</el-col> 
						</el-row>  
						</p>
						 <to-pay v-else-if=" toPayMarketVisible &&  activateTabPaneName=='82'" :task-id="editForm.id" :visible="toPayMarketVisible" :biz-type="'2'" @cancel="toPayMarketVisible=false" @pay-success="onTaskPaySuccess"></to-pay>
					</el-tab-pane>
					<el-tab-pane label="关注" name="91"> 
						<xm-my-do-focus v-if="activateTabPaneName=='91'" :biz-id="editForm.id" :pbiz-id="editForm.projectId" :biz-name="editForm.name" focus-type="2"></xm-my-do-focus>
					</el-tab-pane>
					<el-tab-pane label="日志" name="9">
						 <xm-record v-if="activateTabPaneName=='9'"  :biz-id="editForm.id" :obj-type="'task'"></xm-record>
					</el-tab-pane>
				</el-tabs>   
			</el-form>
			</el-col>
		</el-row> 

		<!-- <el-drawer append-to-body :title="'技能要求'" :visible.sync="skillVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
			<xm-skill-mng :visible="skillVisible" :task-id="editForm.id" @cancel="skillVisible=false" @getSkill="getSkill"></xm-skill-mng>
		</el-drawer> -->
		<el-drawer append-to-body title="选择执行人"  :visible.sync="execGroupUserSelectVisible" size="60%"    :close-on-click-modal="false">
			<xm-group-select :pgClass="editForm.ptype" :xm-product="editForm.productId?{id:editForm.productId,productName:''}:null" :visible="execGroupUserSelectVisible" :sel-project="xmProject" :isSelectSingleUser="1" @user-confirm="execGroupUserSelectConfirm"></xm-group-select>
		</el-drawer>
		<el-drawer append-to-body title="选择负责人"  :visible.sync="groupUserSelectVisible" size="60%"    :close-on-click-modal="false">
			<xm-group-select :xm-product="editForm.productId?{id:editForm.productId,productName:''}:null" :visible="groupUserSelectVisible" :sel-project="xmProject" :isSelectSingleUser="1" @user-confirm="groupUserSelectConfirm"></xm-group-select>
		</el-drawer>
		<el-drawer append-to-body title="新增技能"  :visible.sync="skillVisible" size="60%"    :close-on-click-modal="false">
			<skill-mng :task-skills="taskSkills" :jump="true" @select-confirm="onTaskSkillsSelected"></skill-mng>
		</el-drawer>

		<el-drawer append-to-body title="需求选择"  :visible.sync="menuVisible" size="80%"   :close-on-click-modal="false">
			<xm-menu-select :is-select-menu="true" checkScope="3"  @selected="onMenuSelected" :sel-project="xmProject"></xm-menu-select>
		</el-drawer>
		
		<el-drawer title="选中任务"  :visible.sync="selectTaskVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
			<xm-task-list :ptype="editForm.ptype" :xm-product="{id:editForm.productId,productName:''}" :sel-project="xmProject"   @task-selected="onSelectedTask"></xm-task-list>
		</el-drawer> 	
		 

		<el-dialog append-to-body title="需求明细"  :visible.sync="menuDetailVisible" width="80%"  top="20px"  :close-on-click-modal="false">
			<xm-menu-edit :visible="menuDetailVisible"  :reload="true" :xm-menu="{menuId:editForm.menuId,menuName:editForm.menuName}" ></xm-menu-edit>
		</el-dialog>
			
		<el-drawer append-to-body title="标签"  :visible.sync="tagSelectVisible" size="60%">
			<tag-mng :tagIds="editForm.tagIds?editForm.tagIds.split(','):[]" :jump="true" @select-confirm="onTagSelected">
			</tag-mng>
		</el-drawer>
		
		<el-dialog title="选择新的上级计划" append-to-body :visible.sync="selectParentTaskVisible" width="60%" top="20px">
		<xm-phase-select :sel-project="xmProject"   @select="onSelectedParentTask"></xm-phase-select>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	import {initDicts,editXmTask,setTaskCreateUser,editXmTaskSomeFields,batchChangeParentTask,listXmTask } from '@/api/xm/core/xmTask';
	import {addXmRecordVisit } from '@/api/xm/core/xmRecordVisit';
	import { mapGetters } from 'vuex';
 	import {sn} from '@/common/js/sequence';
 	import xmSkillMng from '../xmTaskSkill/XmTaskSkillMng';
	import skillMng from "@/views/xm/core/skill/skillMng";
	import {batchAddSkill } from '@/api/xm/core/xmTaskSkill';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import XmTaskList from '../xmTask/XmTaskList';
	import XmExecuserMng from '../xmTaskExecuser/XmTaskExecuserForTask';
	import XmGroupSelect from '../xmGroup/XmGroupSelect.vue';
	import XmMenuRichDetail from '../xmMenu/XmMenuRichDetail';
	import TagMng from "@/views/mdp/arc/tag/TagMng";
	import XmRecord from '../xmRecord/XmRecord' 

	import XmSubWorkItem from "@/views/xm/core/xmTaskWorkItem/XmSubWorkItem";
	import xmQuestionForTask from "@/views/xm/core/xmQuestion/XmQuestionForTask";
	import XmTaskWorkloadRecord from "../xmTaskWorkload/XmTaskWorkloadRecord"
	import XmMenuEdit from '../xmMenu/XmMenuEdit.vue';
	import XmMyDoFocus from '@/views/myWork/my/components/DoFocus';
	import XmTaskExecuserForTask from '../xmTaskExecuser/XmTaskExecuserForTask.vue';
	import XmPhaseSelect from "./XmPhaseSelect.vue"; 
	import ToPay from "../xmTaskOrder/ToPay.vue"; 
	import { initSysDicts } from '../../../../api/xm/core/xmTask';
	export default { 
		name:'xmTaskEdit',
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),   
			calcTaskStep(){
				return this.dicts['bidStep'].findIndex(i=>i.id==this.editForm.bidStep)+1;
			},
			needPayEfundsAt(){
				var toPayAt=0; 
				if((this.editForm.estate=='1'||this.editForm.estate=='0'||this.editForm.estate=='') && this.editForm.crowd==='1' && this.editForm.bidStep<='4'){
					toPayAt=toPayAt+parseFloat(this.editForm.efunds||this.editForm.quoteFinalAt||this.editForm.budgetAt)
				}
				return toPayAt;
			},
			
			needPayMarketAt(){
				debugger;
				var toPayAtObj={total:0,topFee:0,hotFee:0,urgentFee:0,crmSup:0,shareFee:0}
				var toPayAt=0;
				var extInfos=this.doInitMarket(this.dicts.crowd_task_market)  
				Object.assign(toPayAtObj,extInfos)
				if(this.editForm.oshare=='1'){
					toPayAt=toPayAt+parseFloat(this.editForm.shareFee||0)
				}
				if(this.editForm.top=='1'){
					toPayAt=toPayAt+parseFloat(extInfos.topFee||0)
				}
				if(this.editForm.hot=='1'){
					toPayAt=toPayAt+parseFloat(extInfos.hotFee||0)
				}
				if(this.editForm.urgent=='1'){
					toPayAt=toPayAt+parseFloat(extInfos.urgentFee||0)
				}
				if(this.editForm.crmSup=='1'){
					toPayAt=toPayAt+parseFloat(extInfos.crmSupFee||0)
				} 
				toPayAtObj.total=toPayAt;
				return toPayAtObj;
			},

		},
		props:['xmTask','visible','xmProject',"parentTask"],
		watch: {
			'xmTask':function( xmTask ) {  
			},
			'visible':function(visible) { 
				this.fileVisible = visible;
				if(visible==true){ 
					this.editForm=Object.assign(this.editForm, this.xmTask);      
					this.editFormBak=Object.assign({},this.editForm)
					this.setSkills()
					this.activateTabPaneName="2"
					this.supRequires=this.editForm.supRequires?this.editForm.supRequires.split(","):[] 
					this.doAddXmRecordVisit() 
					//从新打开页面时某些数据需要重新加载，可以在这里添加
				}
			},  
		},
		data() { 
			const beginDate = new Date();
			const endDate = new Date();
			endDate.setTime(beginDate.getTime() + 3600 * 1000 * 24 * 7 * 4);
			return {
				dicts:{
					priority:[],
					taskType:[],
					planType:[],
					priority:[],
					xmTaskSettleSchemel:[],
					bidStep:[],
					marketState:[],
					crowd_task_market:{},
				},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					name: [
						{ required: true, message: '任务名称不能为空', trigger: 'change' },
						{ min: 2, max: 150, message: '长度在 2 到 150 个字符', trigger: 'change' },//长度

					],
					description: [ 
						{ max: 1000, message: '长度在 0 到 1000 个字符', trigger: 'change' },//长度 
					],
					taskState: [
						{ required: true, message: '请选择任务状态', trigger: 'change' }
					],  
					// execuser:[{
					// 	validator: validateExec, trigger: 'blur'
					// }],
				},
				//新增界面数据 xm_task
				
				editForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',executorUserid:'',executorUsername:'',preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',rate:0,budgetAt:0,budgetWorkload:0,actAt:0,actWorkload:0,taskState:'0',taskType:'4',taskClass:'',toTaskCenter:'0',actStartTime:'',actEndTime:'',bizProcInstId:'',bizFlowState:'',phaseId:'',phaseName:'',taskSkillNames:'',exeUsernames:'',taskSkillIds:'',exeUserids:'',taskOut:'0',planType:'w2',settleSchemel:'1',menuId:'',menuName:'',productId:'',cbranchId:'',cdeptid:'',tagIds:'',tagNames:'',ntype:'0',childrenCnt:0,ltime:'',pidPaths:'',lvl:'',isTpl:'',keyPath:'',uniInnerPrice:80,uniOutPrice:100,calcType:'',ptype:'',wtype:'',bctrl:'',initWorkload:'',shareFee:'',oshare:'',crowd:'',browseUsers:'',execUsers:'',cityId:'',cityName:'',regionType:'',browseTimes:'',capaLvls:'',tranMode:'',supRequires:'',hot:'0',top:'0',urgent:'0',crmSup:'0',bidStep:'0',interestLvls:'',filePaths:'',estate:'0',efunds:0,etoPlatTime:'',etoDevTime:'',ebackTime:'',topStime:'',topEtime:'',hotStime:'',hotEtime:'',urgentStime:'',urgentEtime:'',urgentFee:0,topFee:0,hotFee:0
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
 				menuVisible:false,
				menuDetailVisible:false,
				skillVisible: false,
				taskSkills: [],
				selectTaskVisible:false,
				execUserVisible:false,
				groupUserSelectVisible:false,
				execGroupUserSelectVisible:false,  
				pickerOptions:  util.getPickerOptions('datarange'),
				tagSelectVisible:false,
				subWorkItemNum:0,
				activateTabPaneName:'2',
				selectParentTaskVisible:false, 
				supRequires:[],
				toPayEfundsVisible:false,
				toPayMarketVisible:false,
				 /**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {  
			...util,
			setSubWorkItemNum(val){
				this.subWorkItemNum=val;
			},
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
 				this.$emit('cancel');
			},
			//新增提交XmTask xm_task 父组件监听@submit="afterAddSubmit"
			editSubmit: function () { 
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							let params = Object.assign({}, this.editForm);   
							editXmTask(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['editForm'].resetFields();
									this.$emit('submit',res.data.data);//  @submit="aftereditSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
						});
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: "表单验证不通过，请修改后提交", type: 'error' }); 
					}
				});
			}, 
			doInitMarket(data){  
				if(!data){
					return {};
				}
				var extInfos={};
				if(data.extInfos){
					var ext=JSON.parse(data.extInfos)
					ext.forEach(k=>{
						extInfos[k.id]=k.value
					})

				}
				return extInfos; 
			},
			formatDate: function(time) {
				const date = new Date(time);
				const m = date.getMonth()+1;
				const d = date.getDate();
				return date.getFullYear()+"-"+(m < 10 ? "0"+m : m)+"-"+ (d < 10 ? "0"+d : d) + " 00:00:00";
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
 

			showSkill(){  
				this.skillVisible = true;
			},
			onMenuSelected:function(menu){
				this.editForm.menuId=menu.menuId
				this.editForm.menuName=menu.menuName
				this.editForm.productId=menu.productId
				this.editForm.productName=menu.productName
				this.editXmTaskSomeFields(this.editForm,'menuId',menu);
				this.menuVisible=false;
			},
			onTaskSkillsSelected(skills) {
				let taskSkill = [];
				skills.forEach(i=>{ 
					let obj = {
						taskId: this.editForm.id,
						taskSkillId: i.skillId,
						taskSkillName: i.skillName,
						skillRemarks: '',
					};
					taskSkill.push(obj);
				});
				this.taskSkills = taskSkill;
				batchAddSkill(taskSkill).then((res) => {
					this.load.add=false
					var tips=res.data.tips;
					if(tips.isOk){
						this.skillVisible = false;
						this.editForm.taskSkillIds = skills.map(s=>s.skillId).join(",")
						this.editForm.taskSkillNames = skills.map(s=>s.skillName).join(",")
						this.editFormBak={...this.editForm}
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch( err  => this.load.add=false);
			}, 
			
			getWeekday(first, last) {
				//计算工作日方法：遍历这两个日期区间的每一个日期，获取他的getDay()

				//分别获取first和last的毫秒数(时间戳)
				first = first.getTime();
				last = last.getTime();

				var count = 0;
				for (var i = first; i <= last; i += 24 * 3600 * 1000) {
					var d = new Date(i);
					if (d.getDay() >= 1 && d.getDay() <= 5) {
						count++;
					}
				}
				return count;
			},
			toFixed(floatValue){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					return parseFloat(floatValue).toFixed(2);
				}
			},

			onBudgetDateRangerChange(){ 
				this.editXmTaskSomeFields(this.editForm,'dateRange',{startTime:this.editForm.startTime,endTime:this.editForm.endTime});
			},  
			onSelectedTask(task){
				this.selectTaskVisible=false;
				if(task){  
					this.editForm.preTaskid=task.id
					this.editForm.preTaskname=task.name
					
					this.editXmTaskSomeFields(this.editForm,'preTaskid',task);
				}
			},
			clearPreTask(){
					this.editForm.preTaskid=''
					this.editForm.preTaskname=''
			},
			goAnchor :function(id){  
       			document.querySelector("#"+id).scrollIntoView(true);
    		},
			setSkills(){
				if(this.editForm.taskSkillIds && this.editForm.taskSkillNames){
					var skillNames=this.editForm.taskSkillNames.split(","); 
					this.taskSkills=this.editForm.taskSkillIds.split(",").map((item,index)=>{
						return {
							taskId:this.editForm.id,
							taskSkillId:item,
							taskSkillName:skillNames[index]
						}
					})
				}
			},
			
			showExecusers() {
				this.execUserVisible = true;
			},
			
			toJoin(){
				if(this.editForm.exeUserids && this.editForm.exeUserids.indexOf(this.userInfo.userid)>=0){
					this.$notify.success("你已经加入该任务了");
					return;
				}
				this.execUserVisible=true;
				this.$nextTick(()=>{
					this.$refs.execuserMng.toJoin();

				})
			},
			/**end 在上面加自定义方法**/
			
			showGroupUserSelect:function(){
				this.groupUserSelectVisible=true;
			},
			groupUserSelectConfirm:function(users){
				if( users==null || users.length==0 ){
					this.groupUserSelectVisible=false; 
					return
				}   
				this.editForm.createUserid=users[0].userid
				this.editForm.createUsername=users[0].username 
				this.groupUserSelectVisible=false; 
				
				this.editXmTaskSomeFields(this.editForm,'createUserid',users[0] );
			},
			
			execGroupUserSelectConfirm:function(users){
				if( users==null || users.length==0 ){
					this.execGroupUserSelectVisible=false; 
					return
				} 
				this.editForm.executorUserid=users[0].userid
				this.editForm.executorUsername=users[0].username 
				this.execGroupUserSelectVisible=false; 
				this.editXmTaskSomeFields(this.editForm,'executorUserid',users[0]);
			},
			
			toMenu(){
				this.menuDetailVisible=true
			},
			
			afterAddExecSubmit(execForm){ 
				debugger;
				this.$emit("after-add-submit",execForm);
			},
			afterEditExecSubmit(execForm){  
				debugger;
				listXmTask({ids:[this.editForm.id]}).then(res=>{
						Object.assign(this.editForm,res.data.data[0])
						this.editFormBak={...this.editForm}  
						this.$emit("after-edit-submit",execForm);
					}) 
				
			},     
			onTagSelected(tags) {
				this.tagSelectVisible = false; 
				if(tags && tags.length>0){ 
					this.editForm.tagIds=tags.map(i=>i.tagId).join(",")
					this.editForm.tagNames=tags.map(i=>i.tagName).join(",")
				}else{
					this.editForm.tagIds=""
					this.editForm.tagNames=""
				}
				
				this.editXmTaskSomeFields(this.editForm,'tagIds',tags );
			},
			onAddSubTask(val){

			},
			
			editXmTaskSomeFields(row,fieldName,$event){
				debugger;
				var that=this;
				var func=(params)=>{
					editXmTaskSomeFields(params).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.$emit('edit-fields',params)
							Object.assign(row,params) 
							this.editFormBak=Object.assign({},row)
						}else{   
							Object.assign(this.editForm,this.editFormBak)
							this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
						}
					})
				}
				var params={ids:[row.id]}; 
				if(fieldName==='menuId'){
					if($event){
						params[fieldName]=$event.menuId;
						params.menuName=$event.menuName
            			params.productId=$event.productId
					}else{
						return;
					}
				}else if(fieldName==='tagIds'){
					if($event){
						params[fieldName]=$event.map(i=>i.tagId).join(",");
						params.tagNames=$event.map(i=>i.tagName).join(",");
					}else{
						return;
					}
				}else if(fieldName==='workload'){
					params={...params,...$event}
				}else if(fieldName==='executorUserid'){
					params.executorUserid=$event[0].userid
					params.executorUsername=$event[0].username
				}else if(fieldName==='createUserid'){
					params.createUserid=$event.userid
					params.createUsername=$event.username
				}else if(fieldName==='dateRange'){
					params.startTime=$event.startTime
					params.endTime=$event.endTime
				}else if(fieldName==='shareFee'){  
					params.shareFee=$event
				}else if(fieldName==='supRequires'){
					params.supRequires=$event.join(",") 
				}else{
					params[fieldName]=$event
				}
				
				
				if(fieldName=='description'){
					this.$refs.editForm.validateField('description',err=>{
						if(err){ 
							this.$notify({position:'bottom-left',showClose:true,message: err,type: 'error'})
							return;
						}else{
							func(params)
						}
					})
				}else if(fieldName=='name'){  
					this.$refs.editForm.validateField('name',err=>{
						if(err){
							this.$notify({position:'bottom-left',showClose:true,message: err,type: 'error'})
							return;
						}else{
							func(params)
						}
					})
				}else{
					func(params)
				}
			},
			onSelectedParentTask(task){
				 if(task==null || !task.id){
					this.$notify({position:'bottom-left',showClose:true,message:"请选择上级计划/任务",type:'warning'})
					return;
				}

				var params={taskIds:[this.editForm.id],parentTaskid:task.id}
				this.$confirm("确认更新任务的上级为【"+task.name+"】吗?", "提示", {
					type: "warning",
				}).then(() => {
					batchChangeParentTask(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){ 
						this.editForm.parentTaskid=task.id
						this.editForm.parentTaskname=task.name  
						this.editFormBak=Object.assign({},this.editForm)
						this.$emit('edit-fields',this.editForm)
						
					}
					this.$notify({
						showClose: true,
						message: tips.msg,
						type: tips.isOk ? "success" : "error",
					});
					});
				})
			},
			doAddXmRecordVisit(){
				addXmRecordVisit({bizId:this.editForm.id,objType:'2',pbizId:this.editForm.projectId})
			}, 
			onTaskPaySuccess(orderId){ 
				listXmTask({ids:[this.editForm.id]}).then(res=>{
					Object.assign(this.editForm,res.data.data[0])
					this.editFormBak={...this.editForm}
					this.$emit("pay-success",this.editForm)
					this.toPayEfundsVisible=false;
					this.toPayMarketVisible=false;
				})
				
			}
		},//end method
		components: { 
 			xmSkillMng,
			skillMng,xmMenuSelect,XmTaskList,XmExecuserMng,XmGroupSelect,XmMenuRichDetail,TagMng,XmSubWorkItem,XmTaskWorkloadRecord,XmMenuEdit,
			XmRecord,xmQuestionForTask,XmMyDoFocus,XmTaskExecuserForTask,XmPhaseSelect,ToPay
			//在下面添加其它组件 'xm-task-edit':XmTaskEdit
		},
		mounted() { 
			this.$nextTick(()=>{
				initDicts(this); 
				this.editForm=Object.assign(this.editForm, this.xmTask);    
				this.editFormBak=Object.assign({},this.editForm) 
				this.supRequires=this.editForm.supRequires?this.editForm.supRequires.split(","):[]
				this.setSkills();
				this.doAddXmRecordVisit()
				initSysDicts(this)
			})
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>
.el-form-item{
	margin-bottom: 15px;
}
.el-form-item__content{
	margin-left: 0;
}

.icon {
  color: #fff;
  height: 20px;
  width: 20px;
  border-radius: 15px;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  display: inline-block;
  margin-right: 5px;
} 
</style>