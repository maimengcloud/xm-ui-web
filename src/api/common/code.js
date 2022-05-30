import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();

/***
 * {
 * 	  
 * }
 */
var cacheOptions={};

var cacheSeconds={};

var cacheOptionsBySecondCodeRows={};

var cacheCompanyDepts=null;

var cacheCompanyEmployees=null;

//默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:1,pageSize:10,total:0}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，

//普通查询
export const listCode = params => { return axios.get(`${base}/sys/code/list`, { params: params }); };

//关键字模糊查询 {字段1:v1,字段2:v1,字段3:v1},字段驼峰命名，条件之间默认为or关系
export const listCodeKey = params => {

	return axios.get(`${base}/sys/code/listKey`, { params: params }); 

};


/**
 * 查询下拉选项目 参数为数组型参数 如 selectOptions( { fieldNames:['sex','age','student'],code:'all' } ),code为数据分类
 * 返回结果为：
 * res.data.data:{
 * 	sex:[{codeName:男,codeValue:1,ifdefault:'1'},{codeName:女,codeValue:2,ifdefault:'0'}],
 *  age:[{codeName:1岁,codeValue:1,ifdefault:'1'},{codeName:2岁,codeValue:2,ifdefault:'0'},{codeName:3岁,codeValue:3,ifdefault:'0'}]
 * }
 */
export const selectCacheOptions = params => { 
	
	let code=params.code;
	let fieldNames=params.fieldNames;
	if(!cacheOptions[code]){
		return new Promise((resolve, reject) => {
			axios.get(`${base}/sys/code/selectOptions`, { params:params }).then(res=>{
				let options=res.data.data; 
				cacheOptions[code]=options;
				resolve({
			           data: {data:options}
			         });
			});
	         
	     });
		
	}else{
		let codeOptions=cacheOptions[code];
		var lostFieldNames=[];
		var cacheHasOptions={};
		fieldNames.forEach(item=>{
			if(codeOptions[item]){
				cacheHasOptions[item]=codeOptions[item];
			}else{
				lostFieldNames.push(item);
			}
		});
		if(lostFieldNames.length>0){
			 return new Promise((resolve, reject) => {
				 axios.get(`${base}/sys/code/selectOptions`, { params:{code:code,fieldNames:lostFieldNames} }).then(res=>{
						let options2=res.data.data; 
						lostFieldNames.forEach(item=>{
							codeOptions[item]=options2[item];
							cacheHasOptions[item]=options2[item];
							cacheOptions[code]=codeOptions;
							
						});
						resolve( {
								data: {data:cacheHasOptions} 
					         });
					});
				 
		     });
			
		}else{
			 return new Promise((resolve, reject) => {
		         resolve( {
		        	 data: {data:cacheHasOptions}  
		         });
		     });
		}
		
	}
	
	
};
/**
 * 查询下拉选项目 参数为数组型参数 如 selectOptionsBySecondCodeRows( {secondCodeRows:['secondCodeRow1','secondCodeRow2']} )
 * 返回结果为：
 * res.data.data:{
 * 	secondCodeRow1:[{codeName:男,codeValue:1,ifdefault:'1'},{codeName:女,codeValue:2,ifdefault:'0'}],
 *  secondCodeRow1:[{codeName:1岁,codeValue:1,ifdefault:'1'},{codeName:2岁,codeValue:2,ifdefault:'0'},{codeName:3岁,codeValue:3,ifdefault:'0'}]
 * }
 */
export const selectOptionsBySecondCodeRows = params => {  
		let secondCodeRows=params.secondCodeRows;
		var lostSecondCodeRows=[];
		var cacheHasOptions={};
		secondCodeRows.forEach(item=>{
			if(cacheOptionsBySecondCodeRows[item]){
				cacheHasOptions[item]=cacheOptionsBySecondCodeRows[item];
			}else{
				lostSecondCodeRows.push(item);
			}
		});
		if(lostSecondCodeRows.length>0){
			 return new Promise((resolve, reject) => {
				 axios.get(`${base}/sys/code/selectOptionsBySecondCodeRows`, { params:{secondCodeRows:lostSecondCodeRows }}).then(res=>{
						let options2=res.data.data; 
						lostSecondCodeRows.forEach(item=>{
							cacheOptionsBySecondCodeRows[item]=options2[item];
							cacheHasOptions[item]=options2[item];
						});
						resolve( {
								data: {data:cacheHasOptions} 
					         });
					});
				 
		     });
			
		}else{
			 return new Promise((resolve, reject) => {
		         resolve( {
		        	 data: {data:cacheHasOptions}  
		         });
		     });
		}
};
/**
 * 查询下拉选项目 参数为数组型参数 如 selectOptions( { fieldNames:['sex','age','student'],code:'all' } ),code为数据分类
 * 返回结果为：
 * res.data.data:{
 * 	sex:[{codeName:男,codeValue:1,ifdefault:'1'},{codeName:女,codeValue:2,ifdefault:'0'}],
 *  age:[{codeName:1岁,codeValue:1,ifdefault:'1'},{codeName:2岁,codeValue:2,ifdefault:'0'},{codeName:3岁,codeValue:3,ifdefault:'0'}]
 * }
 */
export const selectOptions = params => { 
		return axios.get(`${base}/sys/code/selectOptions`, { params:params }) 
};
//获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
export const getCodeName = (options,codeValue)=>{
	if(!options)return codeValue;
	let code=options.filter(i=>i.codeValue==codeValue);
	if(code.length>0){
		return code[0].codeName
	}else{
		return codeValue
	} 
};

/**
 * 获取某个字段的默认值
 * getDefaultValue(options.sex,'1');
 */
export const getDefaultValue = (fieldOptions,defaultValue) =>{
	if(fieldOptions==null || fieldOptions.length==0){
		return defaultValue;
	}
	let defaultV=defaultValue;
	fieldOptions.forEach(i=>{
		if(i.ifdefault=='1'){
			defaultV=i.codeValue;
		}
	});
	return defaultV;
};

/**
* 根据一级分类列表查询所有的二级分类
* @param codes 分类编码  列表  如['JCBM_TPL','SystemParas']
* @return 返回如下格式的map。secondCodeRow为主键,dtcodeId为编码，dtcodeName中文描述
* {
* 	JCBM_TPL:[{secondCodeRow:'xxxx',dtcodeId:1,dtcodeName:男},{secondCodeRow:'xxxx',dtcodeid:1,dtcodeName:男}],
*  SystemParas:[{secondCodeRow:'xxxx',dtcodeId:3,dtcodeName:其它},{secondCodeRow:'xxxx',dtcodeid:2,dtcodeName:其它2}]
* }
*/
export const selectSeconds = params => { return axios.get(`${base}/sys/code/selectSeconds`, { params:params }); };

/**
* 根据一级分类列表查询所有的二级分类
* @param codes 分类编码  列表  如['JCBM_TPL','SystemParas']
* @return 返回如下格式的map。secondCodeRow为主键,dtcodeId为编码，dtcodeName中文描述
* {
* 	JCBM_TPL:[{secondCodeRow:'xxxx',dtcodeId:1,dtcodeName:男},{secondCodeRow:'xxxx',dtcodeid:1,dtcodeName:男}],
*  SystemParas:[{secondCodeRow:'xxxx',dtcodeId:3,dtcodeName:其它},{secondCodeRow:'xxxx',dtcodeid:2,dtcodeName:其它2}]
* }
*/
export const selectCacheSeconds = params => { 
	let codes=params.codes;
	let lostCodes=[];
	codes.forEach(item=>{
		if(!cacheSeconds[item]){
			lostCodes.push(item);
		}
	});
	if(lostCodes.length>0){
		return new Promise((resolve, reject) => {
			selectSeconds({codes:lostCodes}).then(res=>{
				let seconds=res.data.data;
				lostCodes.forEach(item=>{
					cacheSeconds[item]=seconds[item];
				});
				let result={};
				codes.forEach(item=>{
					result[item]=cacheSeconds[item];
				});
				 resolve( {
		        	 data: {data:result}  
		         });
			});
		});
	}else{
		let result={};
		codes.forEach(item=>{
			result[item]=cacheSeconds[item];
		});
		 return new Promise((resolve, reject) => {
	         resolve( {
	        	 data: {data:result}  
	         });
	     });
	}
	

};
// [{dpetid:'',displayDeptid:'',deptName:'',shortName:'',pdeptid:''},{dpetid:'',displayDeptid:'',deptName:'',shortName:'',pdeptid:''}]
export const getCompanyDepts = () => {  
	if(cacheCompanyDepts!=null && cacheCompanyDepts.length>=0){ 
		 return new Promise((resolve, reject) => {
	         resolve( {
	        	 data: {data:cacheCompanyDepts}
	         });
	     });
	}
	
	return axios.get(`${base}/sys/code/companyDepts`).then(res=>{
		if(res.data.data==null){
			cacheCompanyDepts=[];
		}else{
			cacheCompanyDepts=res.data.data;
		}
		return new Promise((resolve, reject) => {
	         resolve( {
	        	 data: {data:cacheCompanyDepts}
	         });
	     });
	});
};
//[{userid:'',displayUserid:'',username:'',deptid:'',shortName:'',deptName:''},{userid:'',displayUserid:'',username:'',deptid:'',shortName:'',deptName:''}]
export const getCompanyEmployees = () => {  
	if(cacheCompanyEmployees!=null && cacheCompanyEmployees.length>=0){ 
		 return new Promise((resolve, reject) => {
	         resolve( {
	        	 data: {data:cacheCompanyEmployees}
	         });
	     });
	}
	
	return axios.get(`${base}/sys/code/companyEmployees`).then(res=>{
		if(res.data.data==null){
			cacheCompanyEmployees=[];
		}else{
			cacheCompanyEmployees=res.data.data;
		}
		return new Promise((resolve, reject) => {
	         resolve( {
	        	 data: {data:cacheCompanyEmployees}
	         });
	     });
	});
};
