var express = require('express');
var router = express.Router();
var excel = require("exceljs");
var fs = require('fs');
var excelUtils = require("../utils/excel-utils");
var path = require('path');

router.get('/excel', function(req, res, next) {
    // 要返回的excel表格的名称
    var retfileName = '情况测试表.xlsx',
        tableName = '情况测试表'; // excel中表头的名称
    // 传递来的原始数据
    var rowsJson = [
        {
            XH: "1",         // => {'address': 'A3','value': "1", 'type': 'string','sheetId': 1}
            JH: "纯71-22",   // => {'address': 'B3','value': "纯71-22", 'type': 'string','sheetId': 1}
            JB: "正钻井",    // => {'address': 'C3','value': "正钻井", 'type': 'string','sheetId': 1}
            WZRQ: "2017-11-20", // => {'address': 'D3','value': "2017-11-20", 'type': 'string','sheetId': 1}
            WZSD: "2635", // => {'address': 'E3','value': "2635", 'type': 'string','sheetId': 1}
            DIS: "13",    // => {'address': 'F3','value': "13", 'type': 'string','sheetId': 1}
        },
        {
            XH: "2",  // => {'address': 'A4','value': "2", 'type': 'string','sheetId': 1}
            JH: "纯71-23",
            JB: "正钻井",
            WZRQ: "2017-11-21",
            WZSD: "2636.5",
            DIS: "15",
        }
    ];

    // 存储吴大神方法所需单元格数据
    var cellArr = [];
    // 由于模板是基于第三行开始写入数据的，因此设置一个偏移量
    var offset = 3;
    rowsJson.forEach((item,idx)=>{
        // 在传过来的数据中，依次完成item中的各项到表格列的映射
        cellArr.push(JsonToCell('A',offset+idx,item.XH));
        cellArr.push(JsonToCell('B',offset+idx,item.JH));
        cellArr.push(JsonToCell('C',offset+idx,item.JB));
        cellArr.push(JsonToCell('D',offset+idx,item.WZRQ));
        cellArr.push(JsonToCell('E',offset+idx,item.WZSD));
        cellArr.push(JsonToCell('F',offset+idx,item.DIS));
    })

    // #region 吴大神方法所需示例数据
    // var cellArr =[{
    //     'address': 'A3',
    //     'value': "1", 
    //     'type': 'string',
    //     'sheetId': 1
    // },{
    //     'address': 'B3',
    //     'value': "纯71-22", 
    //     'type': 'string',
    //     'sheetId': 1
    // },{
    //     'address': 'C3',
    //     'value': "正钻井", 
    //     'type': 'string',
    //     'sheetId': 1
    // },{
    //     'address': 'D3',
    //     'value': "2017-11-20", 
    //     'type': 'string',
    //     'sheetId': 1
    // },{
    //     'address': 'E3',
    //     'value': "2635", 
    //     'type': 'string',
    //     'sheetId': 1
    // },{
    //     'address': 'F3',
    //     'value': "13", 
    //     'type': 'string',
    //     'sheetId': 1
    // }]
    // #endregion

    // 由于cellHandler在每次更新一个cell的值的时候调用，为了防止多次修改行高使用该数组维持一个已经修改完成高度的行列表
    let heightChange = [],
        hasChangeTableName = false;
    let borderStyle = 'thin',
        borderColor = 'FF000000';
    let templatePath = './public/template.xlsx',
        fileName = Date.now(),
        exportPath = `./public/${fileName}.xlsx`;
    // 使用吴大神原来写的通过模板方式导出excel的方法
    excelUtils.exportExcelByTemplate(templatePath,exportPath,cellArr,function(wooksheet,cell){
        let row = wooksheet.getRow(cell.row);
        if(!heightChange.includes(cell.row)) {
            // 设置每行的高度
            row.height = 30;
            heightChange.push(cell.row)
        }
        // 设置表头的名字
        if(!hasChangeTableName){
            wooksheet.getCell('A1').value = tableName;
            hasChangeTableName = true
        }
        // 设置每个cell的边框样式和颜色
        cell.border = {
            top: {style:borderStyle, color: {argb:borderColor}},
            left: {style:borderStyle, color: {argb:borderColor}},
            bottom: {style:borderStyle, color: {argb:borderColor}},
            right: {style:borderStyle, color: {argb:borderColor}}
        };
    })
    .then(()=>{
        console.log("excel生成成功！");
        heightChange = null;
        res.download(path.resolve(exportPath),retfileName)

        //定时删除文件
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
    })
});

// 将JSON数据转换到单元格数据，以适配吴大神方法所需要的数据
function JsonToCell(column, row, value, type = 'string', sheetId = '1') {
    // 设置默认参数type表示转换的的数据类型都是string
    // 设置默认参数sheetId为1表示转换的表格都在第一个sheet
    // 设置单元格通过${column + row}表示，得到的数据为A3 B4等
    // {'address': 'A3','value': "1", 'type': 'string','sheetId': 1}
    var cell = {
        address: `${column + row}`,
        value,
        type,
        sheetId
    };
    return cell;
}

module.exports = router;