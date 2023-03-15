//環境變數
require('dotenv').config()
const path = require("path"); //讀取檔案用 resolve join
const cors = require("cors");
//express套件
const express = require('express')
const router = express();

//post套件
const bodyParser = require('body-parser');
router.use(cors({ credentials: true, origin: process.env.WEB_ORIGIN_URL }));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

//josnwebtoken套件
const jwt = require('jsonwebtoken')

//使用資料夾權限
router.use(express.static('public')); 
router.use(express.static('model')); 
router.use(express.static('routes'));

router.use(express.static(path.resolve(__dirname,'./public/build')))


//連接MongoDB
var mongoose = require('mongoose'); //套件引入
mongoose.connect(process.env.MONGODB_LOCALHOST);
//mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('MongoDB連線成功')  
})

//引入Login_Schema
const User_Schema = require('./model/Passward')

User_Schema.countDocuments({})
.then(count=>{
    console.log('Totle date : ' + count)
})
.catch(err =>{
    console.log(err)
})

const secretKey = 'secret';
router.post('/Login',(req,res)=>{
    console.log(req.body)
    User_Schema.findOne({
        powd:req.body.email,
    })
    .then(cat =>{
        // console.log(cat)
        if(!cat){ //帳號錯誤
            console.log(req.body.email)
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

router.post('/creatuser',async (req,res)=>{
    if(!req.body.creatname || !req.body.creatpowd || !req.body.creatpowd){ //空值
        console.log('註冊資料輸入不完全')
    }
    else{
        User_Schema.create({
            name:req.body.creatname,
            powd:req.body.creatpowd,
            pass:req.body.creatpowd,
            management:'使用者' //預設為使用者 1 管理者2
        })
        .then(cat =>{
            console.log('creat name ' + req.body.creatname)
        })
        .catch(err =>{
            console.log(err)
        })
    }
});

router.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./static/build", "index.html"));
});

const port = process.env.SERVER_PORT
router.listen(port,()=>{
    console.log('start port ' + port)
})