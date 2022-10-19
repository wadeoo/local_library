const Genre=require('../models/genre');
var Book =require('../models/book');



const mongoose=require('mongoose');
var async=require('async');
const {body,validationResult}=require('express-validator');
const {sanitizeBody}=require('express-validator');



exports.genre_list=(req,res,next)=>{
    Genre.find()
        .sort([['name','ascending']])
        .exec((error,list_genres)=>{
            if(error){
                return next(error);
            }
            res.render('genre_list',{title:'藏书种类清单'
        ,genre_list:list_genres});
        });
};

exports.genre_detail=(req,res,next)=>{
    async.parallel(
        {
            genre:(callback)=>{
                Genre.findById(mongoose.Types.ObjectId(req.params.id))
                    .exec(callback);
            },
            genre_books:(callback)=>{
                Book.find({genre: mongoose.Types.ObjectId(req.params.id)})
                    .exec(callback);
            }
        },(error,results)=>{
            if(error){
                return next(error);
            }
            if(results.genre==null){
                var error=new Error('您要访问的藏书种类不在了');
                error.status=404;
                return next(error);
            }
            res.render('genre_detail',{
                title:results.genre.name,
                genre:results.genre,
                genre_books:results.genre_books
            });
        }
    );
};

exports.genre_create_get=(req,res)=>{
    res.render('genre_form',{title:'创建书类'});
};

exports.genre_create_post=[
    //验证名字属性非空
    body('name','输入不能为空!').isLength({min:1}).trim(),

    //清洁名字属性
    sanitizeBody('name').trim().escape(),

    (req,res,next)=>{
        //从请求中提取错误
        const errors=validationResult(req);

        var genre=new Genre(
            {name:req.body.name}
        );

        if(!errors.isEmpty()){
            res.render('genre_form',{title:'创建书类',genre:genre,errors:errors.array()});
            return;
        }else{
            //检查是否已经有同样的书类存在
            Genre.findOne({'name':req.body.name})
                    .exec((err,found_genre)=>{
                        if(err){
                            return next(err);
                        }
                        if(found_genre){
                            //用户想创建的书类已经存在
                            res.redirect(found_genre.url);
                        }else{
                            genre.save((err)=>{
                                if(err){
                                    return next(err);
                                }
                                //用户所输入书类已保存
                                res.redirect(genre.url);
                            })
                        }
                    })
        }

    }
];



exports.genre_update_get=(req,res)=>{
    res.send('藏书种类更新 get');
};

exports.genre_update_post=(req,res)=>{
    res.send('藏书种类更新 post');
};

exports.genre_delete_get=(req,res)=>{
    res.send('藏书种类删除 get');
};

exports.genre_delete_post=(req,res)=>{
    res.send('藏书种类删除 post');
};