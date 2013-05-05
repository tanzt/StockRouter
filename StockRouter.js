/**
 * Function: NodeJS Middleware Center:
 * 1.Receive Stock Exchange Info from  Exchange Center by Asynchronous Socket
 * 2.Broadcast received Stock Exchange Info to web Client by WebSocket;
 * User: tanzt
 * Date: 13-5-3
 * Time: 下午8:07
 * To change this template use File | Settings | File Templates.
 *
 */
//建立一个异步Socket Client端与java Mina实现的交易中心行情数据中心进行通信，接收实时行情信息----------------------------//
var net = require('net');
var HOST = 'localhost';                    //交易中心发送行情数据的服务器地址
var PORT = 8891;                             //交易中心发送行情数据的服务器端口号

var client = new net.Socket();             //建立异步Socket通信方式，接收交易中心发送的实时行情数据
client.setEncoding('utf8');
// 与Java Mina Socket Server端建立连接
client.connect(PORT, HOST, function() {
    console.log('[handler_with_java]CONNECTED TO: ' + HOST + ':' + PORT);
    client.write(' I am handler_with_java !');   // 建立连接后立即向服务器发送握手数据
});

// 为客户端添加“data”事件处理函数，data是交易中心行情服务器端发回的数据
client.on('data', function(data) {
    console.log('[log handler with java]:get the real time stock info from stock exchange center\n :' + data);
    var datamsg=data;
    var fields = datamsg.split(',');
    var ticker  = fields[7].split(':')[1].replace('\"',"").replace('\"',"").replace('}',"").replace(/\s*?/g,"");
    {
        if(ticker.indexOf("IXIC")>0)              //如果是IXIC股票信息，则更新缓存
           cachedata  = data;                     // 将IXIC 股票指数据缓存
    }
	msgreceive(data);           //将消息通过WebSocket 广播出去
    });


// 为客户端添加“close”事件处理函数
client.on('close', function() {
    console.log('Connection closed');
});

client.on('error',function(){
    console.log('Can not connect to che Server ['+HOST+' ]on port:['+PORT+'],\n please make sure the Server on firstly , and then restart the StockRouter.js !');
});

//建立一个WebSocket Server 处理浏览器端的通信，实时向浏览器端传送股票行情信息-------------------------------------------//
var app = require('http').createServer(handler);//返回一个新的web server对象,handler监听器会自动添加到'request'事件中。
var io = require('socket.io').listen(app);
var	fs = require('fs');
var cachedata ;             //股票信息缓存
app.listen(8888);
console.log('[log handler with java]- Http NodeJS WebSocket Server start at port 8888...****************');

function handler(req, res) {
	fs.readFile(__dirname+'/stockwebclient.html',
	function(err, data){         //data指信息正文
		res.writeHead(200);       //发送一个响应头，在一次请求响应中此方法只能调用一次，并且必须在调用response.end()之前调用。
        /*
         *通知服务器所有的响应头和响应正文都已经发出；在每个响应上都必须调用response.end()方法。
         *如果指定了data参数，就相当先调用response.write(data, encoding)再调用response.end()。
         */
		res.end(data);
	});
}
// WebSocket 协议握手
var mysocket = null;
io.sockets.on('connection',function(socket){
    socket.emit('user message',cachedata);  //有新的Web连接请求到达后，立马从缓存中获取IXIC股票信息推送，避免了客户端无数据显示情况
	mysocket = socket;
});
function msgreceive(data){
	if(null != mysocket)
    {
        mysocket.emit('user message',data);                   //向当前连接发送行情数据
        mysocket.broadcast.emit('user message',data);       // 向其他
    }
};


