const Author=require('../models/author');
const Book=require('../models/book');

const async=require('async');
const {body, validationResult}=require('express-validator');
const {sanitizeBody}=require('express-validator');
const e = require('express');


exports.author_list=(req,res,next)=>{
    Author  
        .find()
        .sort([['family_name','ascending']])
        .exec(
            (error,list_authors)=>{
                if(error){
                    return next(error);
                }
                res.render('author_list'
                ,{title:'全部作者列表',author_list:list_authors});
            }
        );
};

exports.author_detail=(req,res,next)=>{
    async.parallel(
        {
            author:(callback)=>{
                Author.findById(req.params.id)
                        .exec(callback);
            },
            author_books:(callback)=>{
                Book.find({author: req.params.id})
                    .exec(callback);
            }
        },(error,results)=>{
            if(error){
                return next(error);
            }
            if(results.author==null){
                var error=new Error('找不到该作者');
                error.status=404;
                return next(error);
            }
            res.render('author_detail',{title:results.author.name
            ,author:results.author,author_books:results.author_books});
        }
    );
};

exports.author_create_get=(req,res)=>{
    res.render('author_form',{title:'创建作者'});
};

exports.author_create_post=[
    body('first_name').isLength({min:1}).trim().withMessage('名字不能为空!'),
    body('family_name').isLength({min:1}).trim().withMessage('姓氏不能为空!'),
    body('date_of_birth').optional({checkFalsy:false}).isISO8601(),
    body('date_of_birth').optional({checkFalsy:false}).isISO8601(),


    //sanitize
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),


    (req,res,next)=>{
        const errors=validationResult(req);

        const author=new Author({
            first_name:req.body.first_name,
            family_name:req.body.family_name,
            date_of_birth:req.body.date_of_birth,
            date_of_death:req.body.date_of_death
        });

        if(!errors.isEmpty()){
            res.render('author_form',{title:'创建作者',author:author, errors:errors.array()});
            return;
        }else{
            Author.findOne({'first_name':author.first_name,
                            'family_name':author.family_name,
                            'date_of_birth':author.date_of_birth,
                            'date_of_death':author.date_of_death})
                    .exec((error,found_author)=>{
                        if(error){
                            return next(error);
                        }
                        if(found_author){
                            res.redirect(found_author.url);
                            console.log('该作者已存在');
                        }else{
                            author.save((error)=>{
                                if(error){
                                    return next(error);
                                }
                                res.redirect(author.url);
                            });
                        }
                    });
        }
        
    }


    
];

exports.author_delete_get=(req,res)=>{
    res.send('作者删除 post');
};

exports.author_delete_post=(req,res)=>{
    res.send('作者删除 get');
};

exports.author_update_get=(req,res)=>{
    res.send('作者更新 get');
};

exports.author_update_post=(req,res)=>{
    res.send('作者更新 post');
}