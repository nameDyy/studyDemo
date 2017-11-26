
var  express=require('express'),
     path=require('path'),
     fs=require('fs'),
     Excel=require('exceljs'),
     excelUtils = require("../../utils/excel-utils"),
     router=express.Router();

// 前端传递的数据格式:[
//                    {'XH':'xx','JH':'纯71-22','JB':'正钻井','WZRQ':'2017-11-20','WZSD':'2635','DIS':'13'},
//                    {'XH':'xx','JH':'纯71-22','JB':'正钻井','WZRQ':'2017-11-20','WZSD':'2635','DIS':'13'}
//                 ]
// 范例: http://localhost:3000/
router.get('/dataexport',function(req,res,next){
    // var dataArr =req.query.data;   // 传入的数据
    var tableName='压覆井位情况统计表.xlsx';  // excel中表头的名称
    // var retfileName = tableName;   // 下载文件名

    var dataArr=
    [
        {
            'JH':'纯71-22',  // =>{'address':'A3','value':'纯71-22','type':'string','sheetId':1}
            'JB':'正钻井',
            'WZRQ':'2017-11-20',
            'WZSD':'2635',
            'DIS':'13'
        },
        {'JH':'纯36-1','JB':'正试井','WZRQ':'2017-11-21','WZSD':'2611.35','DIS':'23'},
        {'JH':'纯71-22','JB':'正钻井','WZRQ':'2017-11-20','WZSD':'2635','DIS':'13'},
        {'JH':'纯36-1','JB':'正试井','WZRQ':'2017-11-21','WZSD':'2611.35','DIS':'23'}
    ];

    // 储存所需格式单元格数据   {'address':'A3','value':'纯71-22','type':'string','sheetId':1}
    var cellArr=[];
    // 模板数据从第三行开始
    var offset=3;
    // 表格序号默认为1
    var XH=1;

    dataArr.forEach((item,idx)=>{
        cellArr.push(JsonToCell('A',item+idx,XH+idx));
        cellArr.push(JsonToCell('B',item+idx,item+JH));
        cellArr.push(JsonToCell('C',item+idx,item+JB));
        cellArr.push(JsonToCell('D',item+idx,item+WZRQ));
        cellArr.push(JsonToCell('E',item+idx,item+WZSD));
        cellArr.push(JsonToCell('F',item+idx,item+DIS));
    })

    // 修改行高
    let heightChange=[];
    // hasChangeTableName = false;

    // 单元格样式
    let borderStyle='thin',
        borderColor='FF000000';
   
    let templatePath = '../../public/template.xlsx',   // 模板存放路径
        fileName = Date.now(),
        exportPath = '../../public/template.xlsx';     // 输出文件路径

    /** 
     * @param templatePath 模板文件路径
     * @param exportPath   输出文件路径
     * @param cellArr     单元格属性数组
     *   例 [{'address'(单元格索引): 'A3','value'（单元格值）: null, 'type'（值类型）: 'null','sheetId'（隶属于那张sheet的id 1为起始值）: 1}];
     * @param  回调函数
    */
    excelUtils.exportExcelByTemplate(templatePath,exportPath,cellArr,function(wooksheet,cell){
        let row = wooksheet.getRow(cell.row);    // 获取当前行

        // 处理行高重复设置
        if(!heightChange.includes(cell.row)){
            // 设置每行的高度
            row.height=30;
            heightChange.push(cell.row);
        }

        // 设置excel中表头的名
        // if(!hasChangeTableName){
        //     wooksheet.getCell('A1').value = tableName;
        //     hasChangeTableName = true
        // }

        // 设置每个cell的边框样式和颜色
        cell.border = {
            top: {style:borderStyle, color: {argb:borderColor}},
            left: {style:borderStyle, color: {argb:borderColor}},
            bottom: {style:borderStyle, color: {argb:borderColor}},
            right: {style:borderStyle, color: {argb:borderColor}}
        };

    }).then(()=>{
        console.log("excel生成成功！");
        heightChange = null;
        res.download(path.resolve(exportPath),retfileName);

        // 处理post请求参数过多
        // let url = path.join(downloadPath, fileName);;  // 相对路径 , 文件名 拼接
        // let result1 = new dbServiceResult();
        // result1.result.data = url;
        // res.send(result1);

        // 定时删除文件
        let delInt = setInterval(function () {
            fileUtils.deleteFile(path.resolve(exportPath))
            .then(result => {
                console.dir(result);
                clearInterval(delInt);
            }).catch(err => {
                console.dir(err);
                if (err.code === "ENOENT") {
                    clearInterval(delInt);
                }
            });
        }, 60000);

    }).catch(err => {
        let result1 = new dbServiceResult();
        result1.status = 2001;
        //message需要为String格式
        result1.message = err.toString();
        res.send(result1);
    });

})
    /** 
        @column:列号
        @row：行号
        @value：每个单元中的值
        设置默认参数type表示转换的的数据类型都是string
        设置默认参数sheetId为1表示转换的表格都在第一个sheet
        设置单元格通过${column + row}表示，得到的数据为A3   B4等
        {'address': 'A3','value': "1", 'type': 'string','sheetId': 1}
    */
    function JsonToCell(column,row,value,type='string',sheetId='1'){
        var cell={
            'address': `${column+row}`,
            'value': value, 
            type,
            sheetId
        }
        return cell;
    }

module.exports=router;