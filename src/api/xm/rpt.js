 
//格式化柱状图底部名称太长换行
export const formatterLabel = (params) => {
    var newParamsName = ''
    const paramsNameNumber = params.length
    const provideNumber = 4 // 单行显示文字个数
    const rowNumber = Math.ceil(paramsNameNumber / provideNumber)
    if (paramsNameNumber > provideNumber) {
        for (let p = 0; p < rowNumber; p++) {
        var tempStr = ''
        var start = p * provideNumber
        var end = start + provideNumber
        if (p === rowNumber - 1) {
            tempStr = params.substring(start, paramsNameNumber)
        } else {
            tempStr = params.substring(start, end) + '\n'
        }
        newParamsName += tempStr
        }
    } else {
        newParamsName = params
    }
    return newParamsName
};
 