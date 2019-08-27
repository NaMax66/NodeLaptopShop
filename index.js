const fs = require('fs');
const http = require('http');
const url = require('url'); //routing - нужно для маршрутизации

//получаем данные
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

//эта функция срабатывает каждый раз когда кто-то обращается к серверу
const server = http.createServer((req, res) => {
    const someData = req.headers;
    //для эксперимента
    //fs.writeFileSync(`${__dirname}/data/res.json`, JSON.stringify(someData));

    const pathName = url.parse(req.url, true).pathname;

    //тут url модуль помогает получить переменные

    //получаем id из ответа
    const id = url.parse(req.url, true).query.id;
    console.log(url.parse(req.url, true));

    console.log(id);

    //header нужно настраивать перед res.end
    const setHeader = (code) => {
        res.writeHead(code, {'Content-type': 'text/html'});
    };

    if (pathName === '/products' || pathName === '/') {
        setHeader(200);
        res.end('This is the PRODUCTS page!');
    }
    else if (pathName === '/laptop' && id < laptopData.length) {
        setHeader(200);
        res.end(`This is the LAPTOP page for laptop ${id}`);

    }
    else {
        setHeader(400);
        res.end('URL was not found on the server')
    }
});

//всегда слушай этот порт по этому адресу
server.listen(1337, '127.0.0.1', () => {
    console.log('Listening http://127.0.0.1:1337');
});
