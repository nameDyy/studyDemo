/**
 * @description excel文件处理通用类
 * @author wfy
 */
'use strict';
var Excel = require('exceljs');
var Promise = require('es6-promise').Promise;

// excel文件处理通用类
class excelUtils {
    /**
     * 通过excel模板输出excel文件
     * @param templatePath 模板文件路径
     * @param exportPath 输出文件路径
     * @param cellArr 单元格属性数组 例 [{'address'(单元格索引): 'A3','value'（单元格值）: null, 'type'（值类型）: 'null','sheetId'（隶属于那张sheet的id 1为起始值）: 1}];
     */
    exportExcelByTemplate(templatePath, exportPath, cellArr = [], cellHandler) {
        var promise = new Promise((resolve, reject) => {
            // 初始化exceljs workbook
            var workbook = new Excel.Workbook();
            // 读取模板excel，文件不存在会reject错误
            workbook.xlsx.readFile(templatePath).then((worksheet) => {
                //遍历sheet
                workbook.eachSheet((worksheet, sheetId) => {
                    // 获取当前sheet需要插入的cellArr
                    var sheetCellArr = cellArr.filter((item) => {
                        return item.sheetId == sheetId;
                    });
                    // 遍历sheetCellArr 插入相应的单元格
                    for (let cell of sheetCellArr) {
                        var type = cell.type,
                            value = cell.value,
                            address = cell.address;
                        // 按格式插入值
                        switch (type) {
                            // 例：{'address': 'A3','value': 'aaa','type': 'string','sheetId': 1}
                            case 'string':
                                worksheet.getCell(address).value = value;
                                break;
                                // 例：{'address': 'A3','value': '2014/08/08','type': 'date','sheetId': 1}
                            case 'date':
                                worksheet.getCell(address).value = new Date(value);
                                break;
                                // 例：{'address': 'A3','value': 15,'type': 'number','sheetId': 1}
                            case 'number':
                                worksheet.getCell(address).value = new Number(value);
                                break;
                                // 例：{'address': 'A3','value': null,'type': 'null','sheetId': 1}
                            case 'null':
                                worksheet.getCell(address).value = null;
                                break;
                                // 例：{'address': 'A3','value': { text: 'www.mylink.com', hyperlink: 'http://www.mylink.com' },'type': 'hyperlink','sheetId': 1}
                            case 'hyperlink':
                                worksheet.getCell(address).value = value;
                                break;
                                // 例：{'address': 'A3','value': { formula: 'A1+A2', result: 7 },'type': 'formula','sheetId': 1}
                            case 'formula':
                                let _oldV = worksheet.getCell(address).value;
                                worksheet.getCell(address).value = { formula: _oldV.formula, result: value.toString() };
                                break;
                                // 例：{'address': 'A3','value':{richText: [ { text: 'This is ' }, { font: { italic: true }, text: 'italic' }]},'type': 'richtext','sheetId': 1}
                            case 'richtext':
                                worksheet.getCell(address).value = value;
                                break;
                                // 默认string
                            default:
                                worksheet.getCell(address).value = value;
                                break;
                        }
                        
                        if(cellHandler) {
                            cellHandler(worksheet,worksheet.getCell(address));
                        }
                    }
                });

                // 输出修改后的excel 路径不存在会reject错误
                workbook.xlsx.writeFile(exportPath).then(() => {
                    resolve(exportPath);
                }).catch(err => {
                    reject(err);
                });
            }).catch(error => {
                reject(error);
            });
        });
        return promise;
    };

    /**
     * 解析excel文件 promise返回各个sheet数组（标准格式，不支持单元格合并情况，参考储量边界模板表格）
     * @param filePath 文件路径
     */
    readStandardExcel(filePath) {
        var promise = new Promise((resolve, reject) => {
            // 初始化exceljs workbook
            var workbook = new Excel.Workbook(),
                options = {
                    map: function(value, index) {
                        switch (index) {
                            case 0:
                                // column 1 is string
                                return value;
                            case 1:
                                // column 2 is a date
                                return new Date(value);
                            case 2:
                                // column 3 is JSON of a formula value
                                return JSON.parse(value);
                            default:
                                // the rest are numbers
                                return parseFloat(value);
                        }
                    }
                };
            // 读取模板excel，文件不存在会reject错误
            workbook.xlsx.readFile(filePath, options).then(() => {
                var dataArr = [];
                //遍历sheet
                workbook.eachSheet((worksheet, sheetId) => {
                    var sheetobj = { 'sheetId': worksheet.id, data: [] },
                        header = [null],
                        jsonArr = [];
                    // 遍历每行
                    worksheet.eachRow((row, rowNumber) => {
                        var cellJson = {};
                        // 遍历当前行每个单元格
                        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                            if (rowNumber == 1) {
                                header.push(cell.value);
                            } else {
                                if (typeof header[colNumber] !== 'undefined') {
                                    var filed = header[colNumber].toString();
                                    cellJson[filed] = cell.value;
                                }
                            }
                        });
                        if (rowNumber > 1) {
                            jsonArr.push(cellJson);
                        }
                    });
                    Array.prototype.push.apply(sheetobj.data, jsonArr);
                    dataArr.push(sheetobj);
                });
                resolve(dataArr);
            }).catch(error => {
                reject(error);
            });
        });
        return promise;
    };

    /**
     * 生成excel文件 promise返回各个sheet数组（标准格式，不支持单元格合并情况，参考储量边界模板表格）
     * @param filePath 文件路径
     * @param dataArr 表格数据 [{sheetName（sheet表名称）:name,data（当前sheet表的数据）:[[],[],[]]},{sheetName:name,data(数组类型 第一行数组需要存表头信息，对象素组不需要):[[],[],[]]}] or [{sheetName:name,data:[{},{},{}]},{sheetName:name,data:[{},{},{}]}]
     */
    writeStandardExcel(filePath, dataArr = []) {
        var promise = new Promise((resolve, reject) => {
            // 初始化exceljs workbook
            var workbook = new Excel.Workbook();
            dataArr.forEach((sheetItem, index) => {
                var sheetName = sheetItem.sheetName || 'Sheet' + (index + 1);
                var data = sheetItem.data || [];
                var worksheet = workbook.addWorksheet(sheetName);
                if (data.length > 0) {
                    // 判断data数组类型
                    var type = Object.prototype.toString.call(data[0]).slice(8, -1).toLowerCase();
                    var columns = [];
                    // 处理不同类型
                    switch (type) {
                        case 'object':
                            // 构建表头
                            for (var filed in data[0]) {
                                var columnsHeader = { header: filed.toString(), key: filed.toString() };
                                columns.push(columnsHeader);
                            }
                            worksheet.columns = columns;
                            break;
                        case 'array':
                            // 构建表头
                            for (var filed of data[0]) {
                                var columnsHeader = { header: filed.toString(), key: filed.toString() };
                                columns.push(columnsHeader);
                            }
                            // 去除表头数据
                            data.splice(0, 1);
                            worksheet.columns = columns;
                            break;
                        default:
                            reject('data type error');
                            break;
                    }
                    // 添加数据
                    worksheet.addRows(sheetItem.data);
                } else {
                    reject('data is null');
                }
            });
            // 输出修改后的excel 路径不存在会reject错误
            workbook.xlsx.writeFile(filePath).then(() => {
                resolve(filePath);
            }).catch(err => {
                reject(err);
            });
        });
        return promise;
    }

}

module.exports = new excelUtils();