export default {
	 getNavs(){ 
		 return {
			 sourceCenter:{id:'source-center',name:'开源社区',categoryType:''},
			 productCenter:{id:'product-center',name:'产品中心',categoryType:''},
			 cooperCenter:{id:'cooper-center',name:'商务合作',categoryType:'',
				children:[
					{id:'cooper-agent',name:'区域代理',categoryType:''},
					{id:'cooper-crowd',name:'众包合作',categoryType:''},
					{id:'cooper-company',name:'企业入驻',categoryType:''},
					{id:'cooper-ad',name:'广告合作',categoryType:''}, 
					{id:'cooper-agreement',name:'合作协议',categoryType:''},  
			 	]
			},
			 caseCenter: {id:'case-center',name:'案例中心',categoryType:''},
			 expCenter: {id:'exp-center',name:'体验专区',categoryType:''},
			 newsCenter: {id:'news-center',name:'新闻中心',categoryType:''},
			 aboutMe:{id:'about-me',name:'关于我们',categoryType:''},
			 userAgreement:{id:'user-agreement',name:'用户协议',categoryType:''},
		 } 
	 },
	 getContactInfo(){
		 return {
			branchId:'platform-branch-001',
			companyName:'广州擎勤网络科技有限公司',
			companyEmail:'qingqinkj@qingqinkj.com',
			phoneno:'4000006458', 
			qq:'2306198404',
			wechat:'qqkj218',
			contactUsers:[
				{username:'商务-陈经理',userid:'chenjiahua',phoneno:'4000006458',qq:'2306198404',wechat:'qqkj218',email:'chenjiahua@qingqinkj.com',officePhoneno:'4000006458'},
				{username:'售后-唐经理',userid:'tangchunyan',phoneno:'4000006458',qq:'2306198404',wechat:'qqkj218',email:'chenjiahua@qingqinkj.com',officePhoneno:'4000006458'},
				{username:'客服-詹经理',userid:'zanpingli',phoneno:'4000006458',qq:'2306198404',wechat:'qqkj218',email:'chenjiahua@qingqinkj.com',officePhoneno:'4000006458'},
				{username:'技术-李经理',userid:'tangchunyan',phoneno:'4000006458',qq:'2306198404',wechat:'qqkj218',email:'chenjiahua@qingqinkj.com',officePhoneno:'4000006458'}

			]
		 }
	 },
	 getShowArchivePath(archiveId){
		return "/api/"+process.env.VERSION+"/arc/arc/archive/showArchive?id=" +archiveId
	 },
	 getMaimDomain(){
		 return ""
	 },
	 getQqkjDomain(){
		 return ""
	 }
}
