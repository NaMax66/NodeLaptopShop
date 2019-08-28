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

        //NODE работает в одном потоке. Что выполнение кода не останавливалось мы вызываем асинхронный fs.readFile
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) =>{
            const laptop = laptopData[id];
            
            console.log(laptop);
            
            //указываем плейсхолдеры, которые мы обозначили в template-laptop.html
            // /smth/g - значит заменить все в документе
            //express - помогает сделать это проще
            let output = data.replace(/{%PRODUCTNAME%}/g, laptop.productName);
            output = output.replace(/{%IMAGE%}/g, laptop.image);
            output = output.replace(/{%PRICE%}/g, laptop.price);
            output = output.replace(/{%SCREEN%}/g, laptop.screen);
            output = output.replace(/{%CPU%}/g, laptop.cpu);
            output = output.replace(/{%STORAGE%}/g, laptop.storage);
            output = output.replace(/{%RAM%}/g, laptop.ram);
            output = output.replace(/{%DESCRIPTION%}/g, laptop.description);

            res.end(output);
        });


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
