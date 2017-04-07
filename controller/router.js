/**
 * Describe: 路由控制
 * Created by ZhuYuan on 2017-03-17 23:27
 */
var formidable = require("formidable");
var sd = require("silly-datetime");
var objectId = require("mongodb").ObjectID;
var db = require("../models/db.js");

function l(n){
    console.log(n);
}

/**
 * 获取留言 默认6条 最新时间排序
 * @param req
 * @param res
 */
exports.getLeave = function (req, res) {
    var page = parseInt(req.query.page);
    db.find({
        name: "leave",
        json: {},
        pageAmount: 6,
        page: page,
        sort:{
            date: -1
        },
        callback:function(err,result){
            if(err){
                res.json({"result":false,"info":"留言获取失败"});
            }
            res.json({"result":result,"info":"留言获取成功"});
        }
    });
}

/**
 * 增加留言
 * @param req
 * @param res
 */
exports.addLeave = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields){
        var date = sd.format(new Date(),"YYYY-MM-DD HH:mm:ss");
        db.insertOne({
            name: "leave",
            json:{
                name: fields.name,
                content: fields.content,
                date: date
            },
            callback:function(err,result){
                if(err){
                    res.json({"result":false,"info":"留言失败"});
                }
                res.json({"result":true,"info":"留言成功","date":date});
            }
        });
    });
}

/**
 * 获取留言数量
 * @param req
 * @param res
 */
exports.leavePage = function(req,res){
    db.getAllCount({
        name: "leave",
        callback:function(result){
            res.json({"result":result,"info":"留言数量"});
        }
    });
}

/**
 * 删除留言
 * @param req
 * @param res
 */
exports.deleteLeave = function(req,res){
    var id = req.query.id;
    db.deleteOne({
        name:"leave",
        json:{
            _id: objectId(id)
        },
        callback:function(err,result){
            if(err){
                res.json({"result":false,"info":"留言删除失败"});
            }
            res.json({"result":true,"info":"留言删除成功"});
        }
    });
}

