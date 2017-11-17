#browser-sync如何使用
1. 在项目内安装browser-sync,`npm install -D browser-sync`
2. 编写npm脚本,在package.json下面的scripts节增加代码，`browser-sync start --proxy localhost:3005 --files praction/**/*.css,praction/**/*.html,praction/**/*.js`
3. 启动调试后，方式1在vscode中使用 `ctrl+shift+P`,运行任务并找到 `npm:browser-sync`,方式2启动cmd,使用 `npm run browser-sync`
4. 修改css、html、js都会自动的刷新页面了