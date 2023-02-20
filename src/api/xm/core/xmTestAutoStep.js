
 
export const parseEnvVarValue=(valueTpl,env)=>{
    if(!env){
        return valueTpl
    } 
    if(!valueTpl){
        return valueTpl;
    }else{ 
        var reg = /\#\{(\w+)\}/g; 
        var value=valueTpl.replace(reg,function(){   
            var arg=arguments;
            var key=arguments[1]
            return env[key] 
        }) 
        return value
    }
    
}

export const autoStepToAxios=(autoStepObj,env)=>{
    var axiosObj={url:autoStepObj.url,method:autoStepObj.method}

    //参数处理
    if(autoStepObj.method=='GET'){
        var params={}
        autoStepObj.params.forEach(k=>{ 
            params[k.id]=parseEnvVarValue(k.value,env)
        })
        axiosObj.params=params
    }else if(autoStepObj.method=='POST'){
        var params={}
        autoStepObj.params.forEach(k=>{ 
            params[k.id]=parseEnvVarValue(k.value,env)
        })
        axiosObj.params=params
        if(autoStepObj.bodyType=='json'){
            axiosObj.data=autoStepObj.body
        }else if(autoStepObj.bodyType=='xml'){
            axiosObj.data=autoStepObj.body
        }else if(autoStepObj.bodyType=='raw'){
            axiosObj.data=autoStepObj.body
        }else if(autoStepObj.bodyType=='form-data'){
            var data={}
            autoStepObj.body.forEach(k=>{
                data[k.id]=parseEnvVarValue(k.value,env)
            })
            axiosObj.data=data;
        }else if(autoStepObj.bodyType=='x-www-form-urlencoded'){
            var data={}
            autoStepObj.body.forEach(k=>{
                data[k.id]=parseEnvVarValue(k.value,env)
            })
            axiosObj.data=data;
        } 
    }

    //header处理
    if(autoStepObj.headers){
        axiosObj.headers={}
        autoStepObj.headers.forEach(k=>{
            axiosObj.headers[k.id]=parseEnvVarValue(k.value,env)
        })
    }else {
        axiosObj.headers={}
    }
     if(autoStepObj.authType=='bearer-token'){ 
        axiosObj.headers['Authorization'] = 'Bearer '+parseEnvVarValue(autoStepObj.authData.bearerToken,env)
    }else if(autoStepObj.authType=='basic-auth'){
        var username=parseEnvVarValue(autoStepObj.authData.username,env)
        var password=parseEnvVarValue(autoStepObj.authData.password,env)
        var authorizationBasic = window.btoa(username + ':' + password);
         axiosObj.headers['Authorization'] = 'Basic '+authorizationBasic
    }

    //cookie 处理
    if(autoStepObj.cookies){
        axiosObj.cookies={}
        autoStepObj.cookies.forEach(k=>{
            axiosObj.cookies[k.id]=parseEnvVarValue(k.value,env)
        })
    }  
    return axiosObj
}


export const initEnvVars=(casedbEnvJson,testPlanEnvJson)=>{
    var casedbEnv={};
    if(casedbEnvJson){
        casedbEnv={}
        var casedbEnvList=JSON.parse(casedbEnvJson)
        casedbEnvList.forEach(k=>{
            casedbEnv[k.id]=k.value
        })
    }

    var testPlanEnv={};
    if(testPlanEnvJson){
        testPlanEnv={}
        var testPlanEnvList=JSON.parse(testPlanEnvJson)
        testPlanEnvList.forEach(k=>{
            testPlanEnv[k.id]=k.value
        })
    }  
    Object.assign(casedbEnv,testPlanEnv)
    return casedbEnv;
}