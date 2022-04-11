const express = require('express');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const app = express();


const ip = '127.0.0.1';
const port = 80;
  

const parseUrl = async (url, res) => {
    var prom = new Promise(() => {
    var request = new XMLHttpRequest(); 
    request.open("GET", url);
    

    request.onreadystatechange = function() { 
        if (request.readyState !== 4 && request.status !== 200) { return false; } 

        var rawTable = request.responseText.split('<col>')[1];
        var table = rawTable.split('</table>\r\n')[0]
        table = table.split('</tr>\r\n');
        var info = table.slice(0, 12).slice(3, -4);
        var totalTable = table.slice(12, -1);

        var processedTable = totalTable.map((value) => {
            var rawHorizont = value.split('\r\n').slice(1, -3);
            const horizont = rawHorizont.map((value, index) => {
                for (var i = 0; i < 2; i++) {
                    var startIndex = value.indexOf('>') + 1;
                    var endIndex = value.lastIndexOf('<');
                    if (startIndex == 0 || endIndex == 0) {
                    break;
                    }
                    
                    value = value.slice(startIndex, endIndex);
                }

                return value;
            });

            return horizont;
        })

        var answer = JSON.stringify(processedTable, null, '\t')

        
        try {
            return res.status(200).send(answer);
        } catch (err) {
            console.log(err);
        }
        
    };
        request.send();
    })
    
    await prom;
}


app.get('/', (req, res) => {
  res.send('');
})

app.get('/parse', (req, res) => {

    var univ = req.query.univ;
    if (univ == 'sfedu') {
        var url = `https://sfedu.ru/php_j/abitur/show.php?finance=${req.query.finance}&list=${req.query.list}`
    }
    parseUrl(url, res);
});


app.listen(port, ip, () => {
  console.log(`Server has been started on ${ip}:${port}\n`);
});
//http://127.0.0.1/parse?univ=sfedu&finance=p&list=UCNZ21.05.026500OSS