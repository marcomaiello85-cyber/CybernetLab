const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
http.createServer((req,res)=>{
 try {
  const url = new URL(req.url,'http://localhost');
  const relative = decodeURIComponent(url.pathname);
  const file = path.resolve(root,'.'+(relative==='/'?'/index.html':relative));
  if(!file.startsWith(root+path.sep) || !types[path.extname(file)] || !fs.existsSync(file) || !fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found');}
  res.writeHead(200,{'Content-Type':types[path.extname(file)],'X-Content-Type-Options':'nosniff'});
  fs.createReadStream(file).pipe(res);
 } catch {res.writeHead(400);res.end('Bad request');}
}).listen(5173,'127.0.0.1',()=>console.log('CybernetLab: http://127.0.0.1:5173'));
