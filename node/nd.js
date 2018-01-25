// var http = require('http')
// var path = require('path')
// var url = require('url')
// var fs = require('fs')
//
// function staticRoot(staticPath,request,response) {
//     // console.log(staticPath)
//     var urlObj = url.parse(request.url,true)
//     // console.log(urlObj)
//     if (urlObj === '/'){
//         urlObj.pathname += 'index.html'
//     }
//
//     var filePath = path.join(staticPath,urlObj.pathname)    //  获取文件路径
//     // console.log(filePath)
//
//     // 读取文件路径
//     fs.readFile(filePath,'binary',function (error,fileContent) {
//         console.log(fileContent);
//         if (error){
//             response.writeHead(404,'Not found')
//             response.end('<h1>404 Not found</h1>')
//         } else {
//             response.writeHead(200)
//             response.write(fileContent,'binary')    //  页面写入文件
//             response.end()
//         }
//     })
// }
// http.createServer(function (request,response) {
//     staticRoot(path.join(__dirname,'node-server'),request,response)
// }).listen(9999)

var http = require('http')
var fs = require('fs')
http.createServer(function (req,res) {
    // console.log(__dirname + '/node-server' + req.url)
    var fileContent = fs.readFile(__dirname + '/node-server' + req.url,'binary')
    console.log(fileContent)
    // res.write(fileContent,'binary')
    // res.end()
}).listen(8090)
