/**
 * Describe: 项目入口
 * Created by ZhuYuan on 2017-03-17 23:23
 */

var express=require("express");
var app=express();
var router=require("./controller");

function l(n){
    console.log(n);
}

app.use(express.static("./public"));

app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("index");
});

app.get("/getLeave",router.getLeave);

app.get("/leavePage",router.leavePage);

app.post("/addLeave",router.addLeave);

app.get("/deleteLeave",router.deleteLeave);

app.listen(3000);

l(new Date());

