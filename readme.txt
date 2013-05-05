Project Function: StockRouter Middleware Center by Node.js v0.10.5 :
 * 1.Receive Stock Exchange Info from  Exchange Center by Asynchronous Socket
 * 2.Broadcast received Stock Exchange Info to web Client by WebSocket;

StockRouter.js: StockRouter Middleware Center by NodeJS; 

stockwebclient.html: receive the Stock Exchange Info from StockRouter.js by WebSocket; 

node-modules : the dependency package (socket.io)

use step:
1. start the StockTickerCenter Socket Server
2. open the StockRouter.js and modify the "Var Host" Ip value to the StockTickerCenter Socket Server IP 
3. input ' node StockRouter.js ' on the cmd or shell
4. visit in browser (Chrome, IE 8 .eg) : http://IP:8891/stockwebclient.html    [IP:mechine of the StockRouter deployed in]

