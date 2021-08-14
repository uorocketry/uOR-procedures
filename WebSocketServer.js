const WebSocket = require('ws');
const http = require('http');

var teams = ['Helm',"Command","Tactical","Engineering"];

const server = http.createServer({
    /*cert: fs.readFileSync('/path/to/cert.pem'),
    key: fs.readFileSync('/path/to/key.pem')*/
});



const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
    console.log('new connection');
    ws.send(JSON.stringify({"type":"handshake","message":teams}));

});


server.listen(4040, () => {
    console.log('Server listening:', `http://${server.address().address}:${server.address().port}`);
});