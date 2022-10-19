const BookInstance=require('../models/bookinstance');
const Book=require('../models/book');


const async=require('async');
const {body,validationResult}=require('express-validator');
const {sanitizeBody}=require('express-validator');

exports.book_instance_list=(req,res,next)=>{
    BookInstance.find()
                .populate('book')
                .exec((error,list_book_instance)=>{
                    if(error){
                        return next(error);
                    }
                    res.render('book_instance_list'
                    ,{title:'藏书副本列表',book_instance_list:list_book_instance});
                });
};

exports.book_instance_detail=(req,res,next)=>{
    BookInstance.findById(req.params.id)
                .populate('book')
                .exec(
                    (error,book_instance)=>{
                        if(error){
                            return next(error);
                        }
                        if(book_instance==null){
                            var error=new Error('无法找到该副本');
                            error.status=404;
                            return next(error);
                        }
                        res.render('book_instance_detail',{
                            title:book_instance.book.title+' 副本',
                            book_instance:book_instance
                        });
                    }
                );
};

exports.book_instance_create_get=(req,res,next)=>{
    Book.find({},'title')
    .exec((error,books)=>{
        if(error){
            return next(error);
        }
        res.render('book_instance_form',{title:'创建新书籍副本',book_list:books});
    })
};

exports.book_instance_create_post=[

    body('book','书名不能为空').isLength({min:1}).trim(),
    body('imprint','imprint 不能为空').isLength({min:1}).trim(),
    body('due_back','无效日期').optional({checkFalsy:true}).isISO8601(),

    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape,
    sanitizeBody('due_back').toDate(),

    (req,res,next)=>{
        const errors=validationResult(req);


        const book_instance=new BookInstance(
            {
                book:req.body.book,
                imprint:req.body.imprint,
                status:req.body.status,
                due_back:req.body.due_back
            }
        )

        if(!errors.isEmpty()){
            Book.find({},'title')
            .exec((error,result)=>{
                if(error){
                    return next(error);
                }
                res.render('book_instance_form',{title:'创建副本',book_list:result,book_instance:book_instance,book:book_instance.book,errors:errors.array()});
            })
        }else{
            book_instance.save(
                (error)=>{
                    if(error){
                        return next(error);
                    }
                    res.redirect(book_instance.url);
                }
            )
        }

    }

];


exports.book_instance_update_get=(req,res)=>{
    res.send('藏书副本更新 get');
};

exports.book_instance_update_post=(req,res)=>{
    res.send('藏书副本更新 post');
};

exports.book_instance_delete_get=(req,res)=>{
    res.send('藏书副本删除 get');
};

exports.book_instance_delete_post=(req,res)=>{
    res.send('藏书副本删除 post');
};