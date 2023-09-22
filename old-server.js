const http = require('http');
const path = require('path');
const fs =  require('fs');
const fsPromises =  require('fs').promises; 
const logEvent = require('./logEvent');
const eventEmitter = require('events');

class MyEmitter extends eventEmitter {};

//initialising the onject
const myEmitter = new MyEmitter();
myEmitter.on('log', (msg, fileName) => logEvent(msg, fileName));
const PORT = process.env.PORT || 3500;

const serveFile = async (filepath , contentType , response) => {
    try{
        const rawData = await fsPromises.readFile(
            filepath, 
            !contentType.includes('image') ?'UTF-8' : '');
        const data = contentType === 'application/json' 
            ? JSON.parse(rawData) : rawData;
        response.writeHead(filepath.includes('404.html') ? 404 : 202, 
            {'Content-Type':contentType});
        response.end(
            contentType === 'application/json'
                ?JSON.stringify(data): data
        );
    }catch(err){
        console.log(err);
        myEmitter.emit('log', `${err.name} : ${err.message}`, 'errLog.txt')
        response.statusCode = 500;
        response.end(); 
    }
}

const server = http.createServer((req, res)=>{
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')

    const extension = path.extname(req.url);
    let contentType;

    switch(extension){
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filepath = ""; 
    if(contentType === 'text/html' && req.url === '/'){
        filepath = path.join(__dirname, 'views', 'index.html')
    }else if (contentType === 'text/html' && req.url.slice(-1) === '/'){
        filepath= path.join(__dirname, 'views', req.url , 'index.html')
    }else if ( contentType === 'text/html'){
        filepath = path.join(__dirname, 'views', req.url)
    }else{
        filepath = path.join(__dirname, req.url)
    }
    
    //making the .html not require on browser
    if(!extension && req.url.slice(-1) !== '/') filepath += '.html'

    const fileExists = fs.existsSync(filepath);
    if(fileExists){
        //serving the file
        serveFile(filepath, contentType, res);
    }else{
        switch(path.parse(filepath).base){
            case 'old-page.html':
                res.writeHead(301, {'location' : '/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'location' : '/'});
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html',res);
                //serve the 404 response page 
        };
    }


})
server.listen(PORT,()=> console.log(`server running on port ${PORT}`))



