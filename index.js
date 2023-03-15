//環境變數
require('dotenv').config()
const path = require("path"); //讀取檔案用 resolve join

//express套件
const express = require('express')
const router = express();

//post套件
const body = require('body-parser');
router.use(body.urlencoded({ extended: false }));
//router.use(body.json())

//使用資料夾權限
router.use(express.static('public'));
router.use(express.static('model'));
router.use(express.static('routes'));
//
const morgan = require('morgan')
router.use(morgan('dev'))

//josnwebtoken套件
const jwt = require('jsonwebtoken')

//連接MongoDB
var mongoose = require('mongoose'); //套件引入
mongoose.connect(process.env.MONGODB_LOCALHOST);
//mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('MongoDB連線成功')
})

//引入Login_Schema
const User_Schema = require('./model/Passward');
const { token } = require('morgan');

const port = process.env.SERVER_PORT
router.listen(port, () => {
    console.log('start port ' + port)
})

router.get('/', (req, res) => {
    res.send('Hi, The API is at http://localhost:' + port + '/api')
})

//新增資料
// User_Schema.create({
//     name:'jack',
//     powd:'test',
//     pass:'1234',
// })
// .then(cat =>{

// })
// .catch(err =>{
//     console.log(err)
// })

router.get('/acc', (req, res) => {
    res.json({ message: 'Welcome to the API' })
})

//驗證機制jwt
const secretKey = 'secret';
router.post('/Login',(req,res)=>{
    User_Schema.findOne({
        powd:req.body.powd,
    })
    .then(cat =>{
        // console.log(cat)
        if(!cat){ //帳號錯誤
            console.log(req.body.powd)
            console.log('Powd Error')
            res.status(401).json({message : 'Powd Error'})
        }
        else{
            const secret = 'secret'
            if(cat.pass == req.body.pass){ //密碼正確
                console.log('Login sucess')
                const token = jwt.sign({cat},secretKey,{ //router.get('secret') 密鑰ˇˇ
                    expiresIn:60*60*24 //jwt的過期時間 606024秒 = 1hr
                })
                res.json({
                    success: true,
                    message: 'Enjoy your token',
                    token: token
                })
            }
            else{ //密碼錯誤
                console.log('Pass Error')
                res.status(402).json({message : 'Pass Error'})
            }
        }
    })
    .catch(err =>{
        console.log(err)
    })
})
//驗證token
router.use(function(req,res,next){

})
