var contextName="sys";
var sysContextName="sys/mdp";//系统管理子模块
var sysName="";//当前系统名称

export default {
    getSysContextName: function () {
        return sysContextName;
    },
	getContextName: function () {
	    return contextName;
	},
	getSysName: function () {
	    return sysName;
	} 
};
