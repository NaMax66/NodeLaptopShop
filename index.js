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

    //все что в href в img для Node как запрос и если хотим загрузить изображения - нужно отправить ответ
    const pathName = url.parse(req.url, true).pathname;
    console.log(pathName);

    //тут url модуль помогает получить переменные. Получаем id из ответа
    const id = url.parse(req.url, true).query.id;

    //header нужно настраивать перед res.end
    const setHeader = (code, type = 'text/html') => {
        res.writeHead(code, {'Content-type': type});
    };

    //PRODUCT OVERVIEW
    if (pathName === '/products' || pathName === '/') {
        setHeader(200);
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8',
            (err, data) =>{

            let overviewOutput = data;

                fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8',
                    (err, data) =>{

                    //data - оригинальный файл template-card.html в котором мы меняем плейсходлеры из объекта laptop(el)
                        const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join(''); //превращаем в строку
                        overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                        res.end(overviewOutput);
                    });
        });

    }

    //LAPTOP DETAIL
    else if (pathName === '/laptop' && id < laptopData.length) {
        setHeader(200);

        //NODE работает в одном потоке. Что выполнение кода не останавливалось мы вызываем асинхронный fs.readFile
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) =>{
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            //указываем плейсхолдеры, которые мы обозначили в template-laptop.html
            // /smth/g - значит заменить все в документе
            //express - помогает сделать это проще
            res.end(output);
        });
    }

    //IMAGES - еще один маршрут для рисунков
        //regular expression для проверки - рисунок ли это
    else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
            //как только мы заканчиваем чтение данных мы их отправляем
            setHeader(200, 'image/jpg');
            res.end(data);
        })
    }

    //URL NOT FOUND
    else {
        setHeader(400);
        res.end('URL was not found on the server')
    }
});

//всегда слушай этот порт по этому адресу
server.listen(1337, '127.0.0.1', () => {
    console.log('Listening http://127.0.0.1:1337');
});

function replaceTemplate(originalHTML, laptop) {
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}
