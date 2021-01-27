const fs=require('fs')
const SqliteToJson = require('sqlite-to-json')
const  Database  = require('sqlite3')
const sqlite=require('sqlite3').verbose()
const express=require('express')


//express
var app=express()
var router=express.Router();

//PORT
var port=process.env.PORT||3000
app.listen(port)
console.log("DB Logger API running at:"+port)

//DataBase
app.use('/db_logger',router)
var dataBase=new sqlite.Database('./Log.db')

//sqlite to json exporter
const exporter = new SqliteToJson({
    client: new sqlite.Database('./Log.db')
  });

//create table
dataBase.run(`CREATE TABLE IF NOT EXISTS Log(Log_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Log_Type VARCHAR NOT NULL,
    Log_Action VARCHAR NOT NULL,
    Log_TimeStamp TIMESTAMP  NOT NULL,
    Log_User_Id VARCHAR NOT NULL,
    Log_User_Name VARCHAR NOT NULL,
    Log_Actor VARCHAR NOT NULL,
    Log_Namespace VARCHAR NOT NULL,
    Log_Title VARCHAR NOT NULL,
    Log_Page VARCHAR NOT NULL,
    Log_Comment TEXT ,
    Log_Comment_Id VARCHAR, 
    Log_Params VARCHAR, 
    Log_Deleted VARCHAR,
    Log_CorrelationId VARCHAR);`, function(err){
    if(err){
        return console.log(err)
    }
    console.log('Table successfully created')
})
/*let movie = { 1:{
    'Log_Type': 'info',
    'Log_Action': 'end', 
    'Log_TimeStamp': '16254304',
    'Log_User_Id': '212',
    'Log_User_Name': 'prateek' ,
    'Log_Actor':'xyz',
    'Log_Namespace':'__',
    'Log_Title':'love',
    'Log_Page':'2',
    'Log_Comment':'very good',
    'Log_Comment_Id':'1240',
    'Log_Params':'abc',
    'Log_Deleted':'nun',
    'Log_CorrelationId':'1',

},
    2:{
        'Log_Type': 'info',
        'Log_Action': 'start', 
        'Log_TimeStamp': '13521024',
        'Log_User_Id': '525',
        'Log_User_Name': 'Honda' ,
        'Log_Actor':'yxz',
        'Log_Namespace':'__',
        'Log_Title':'Birds',
        'Log_Page':'21',
        'Log_Comment':'Good',
        'Log_Comment_Id':'1201',
        'Log_Params':'bhc',
        'Log_Deleted':'nun',
        'Log_CorrelationId':'1',
},
3:{
    'Log_Type': 'debug',
    'Log_Action': 'start', 
    'Log_TimeStamp': '25122254',
    'Log_User_Id': '1424',
    'Log_User_Name': 'RK' ,
    'Log_Actor':'bnc',
    'Log_Namespace':'__',
    'Log_Title':'1917',
    'Log_Page':'15',
    'Log_Comment':'VG',
    'Log_Comment_Id':'1502',
    'Log_Params':'lkncs',
    'Log_Deleted':'nun',
    'Log_CorrelationId':'2',

},
};
*/
/*
let data = JSON.stringify(movie, null, 2);

fs.writeFile('movie_database.json', data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
console.log('This is after the write call');
*/



//read json file (file name= movie_database.json)
console.log('File read');
fs.readFile('movie_database.json', (err, data) => {
    if (err) throw err;
    let movie = JSON.parse(data);

    for(key in movie){
        dataBase.run(`INSERT INTO Log(Log_Type,
            Log_Action,
            Log_TimeStamp,
            Log_User_Id,
            Log_User_Name,
            Log_Actor,
            Log_Namespace,
            Log_Title,
            Log_Page,
            Log_Comment,
            Log_Comment_Id,
            Log_Params,
            Log_Deleted,
            Log_CorrelationId) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [movie[key].Log_Type,
            movie[key].Log_Action,
            movie[key].Log_TimeStamp,
            movie[key].Log_User_Id ,
            movie[key].Log_User_Name,
            movie[key].Log_Actor,
            movie[key].Log_Namespace,
            movie[key].Log_Title,
            movie[key].Log_Page,
            movie[key].Log_Comment,
            movie[key].Log_Comment_Id,
            movie[key].Log_Params,
            movie[key].Log_Deleted,
            movie[key].Log_CorrelationId] )  }
   
});

//database query
dataBase.each("SELECT * FROM Log",function(err,row){
    if(err){
        return console.log(err)
    }
    console.log(row)
})

//sqlite to json(info is being dumped into query.json file )
exporter.save('Log', './query.json', function (err) {
    if(err){
     return console.log(err)
    }
    console.log('writing values to JSON file successfull')
});




