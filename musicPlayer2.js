let express = require('express');
let app = express();
let mysql = require('mysql');
let con = mysql.createConnection({
    host: "localhost",
    user: "c17st01",
    password: "Cc0VDRloLUXo07L9",
    database: "c17st01",
});

app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './src/pug');
app.use(express.static('./public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('musicPlayer');
});

app.post('/storage',(req, res)=>{
    let sql = "SELECT * FROM musicList";
    con.query(sql, (err, result)=>{
        if(err) throw err;
        res.json(result);
    })   
})

app.post('/list', (req, res) => {
    let getLPId = req.body.getLPId;
    con.connect((err) => {
        if (err) throw err;
        console.log('CONNECTED!!')
        let sql = `SELECT * FROM ${getLPId}`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    });
});

app.post('/movie', (req, res) => {
    let songName = req.body.musicListTitleA;
    let sql = `SELECT movieLink FROM musicPlayer WHERE songName = '${songName}'`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/delete', (req, res) => {
    let tempA = req.body.tempA;
    let sql = 'TRUNCATE TABLE musicList';
    con.query(sql, (err, result) => {
        if (err) throw err;
    });
});

app.post('/musicPlay', (req, res) => {
    let musicPlayTitle = req.body.musicPlayTitle;
    let sql = `INSERT INTO musicList SELECT LP, songName, artist, albumLink, songLink, movieLink, 0 FROM musicPlayer WHERE songName = '${musicPlayTitle}'`
    con.query(sql, (err, result) => {
        if (err) throw err;
        sql = `SELECT * FROM musicList`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    });
});



app.post('/deleteListContent', (req, res) => {
    let listIndex = req.body.listIndex;
    let sql = `DELETE FROM musicList WHERE num = ${listIndex}`;
    con.query(sql,(err, result)=>{
        if(err) throw err;
        sql = `SELECT * FROM musicList`;
        con.query(sql,(err, result)=>{
            if(err) throw err;
            res.json(result);   
        })
    })
})

app.listen(4191, () => {
    console.log('4191 PORT START!!');
});