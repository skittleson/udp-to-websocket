var ws = require("nodejs-websocket")
var dgram = require('dgram');

let websocketConnection = null;

var websocketPort = 8081;
var udpPort = 2500;
var udpHost = '127.0.0.1';

//start servers
startWebsocketServer(websocketPort);
startUdpServer(udpPort, udpHost);

/**
 * Udp Server
 * @param port udp port to host on
 * @param host ip address or host name
 */
function startUdpServer(port, host){
    var udpServer = dgram.createSocket('udp4');

    udpServer.on('message', function (message, remote) {
        if (websocketConnection == undefined || websocketConnection == null) {
            console.log('No websocket present');
        } else {
            websocketConnection.sendText('\n' + (new Date()).toISOString() + ' ' + message);
        }
    });
    udpServer.bind(port, host);
}

/**
 * Starts the web socket server
 * @param port websocket port
 */
function startWebsocketServer(port){
    var wsServer = ws.createServer(function (conn) {

        websocketConnection = conn;
        
        conn.on("text", function (str) {
            conn.sendText(str);
        })
        conn.on("close", function (code, reason) {
            websocketConnection = null;
        })

    }).listen(port);
}

//spin up a temp webserver for web socket client
var http = require("http")
var fs = require("fs")

http.createServer(function (req, res) {
    fs.createReadStream("index.html").pipe(res)
}).listen(8080);