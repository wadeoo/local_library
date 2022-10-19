const mongoose=require('mongoose');
var Book=require('../models/book');
var Author=require('../models/author');
var Genre=require('../models/genre');
var BookInstance=require('../models/bookinstance');

var async=require('async');
const {body, validationResult}=require('express-validator');
const {sanitizeBody}=require('express-validator');
const author = require('../models/author');

exports.index=(req,res)=>{

    async.parallel({
        book_count:(callback)=>{
            Book.count({},callback);
        },
        book_instance_count:(callback)=>{
            BookInstance.count({},callback);
        },
        book_instance_available_count:(callback)=>{
            BookInstance.count({status: 'Available'},callback);
        },
        author_count:(callback)=>{
            Author.count({},callback);
        },
        genre_count:(callback)=>{
            Genre.count({},callback);
        }
    },(err,results)=>{
        res.render('index',{title: '图书馆主页',error: err, data: results});
    });
};

exports.book_list=(req,res,next)=>{
    Book.find({},'title author')
        .populate('author')
        .exec((error,list_books)=>{
            if(error){
                return next(error);
            }
            res.render('book_list',{title:'藏书列表', book_list: list_books});
            console.log(list_books[0].author.first_name);
        });
};

exports.book_detail=(req,res,next)=>{
    async.parallel(
        {
            book:(callback)=>{
                Book.findById(mongoose.Types.ObjectId(req.params.id))
                    .populate(['author', 'genre'])
                    .exec(callback);
            },
            book_instances:(callback)=>{
                BookInstance.find({book: mongoose.Types.ObjectId(req.params.id)})
                            .exec(callback);
            }
        },(error,results)=>{
            if(error){
                return next(error);
            }
            if(results.book==null){
                var error=new Error('您所请求的藏书不存在');
                error.status=404;
                return next(error);
            }
            res.render('book_detail',{title:'书名',book:results.book
        ,book_instances: results.book_instances});
        }
    );

};

exports.book_create_get=(req,res,next)=>{
    async.parallel(
        {
            authors:(callback)=>{
                Author.find(callback);
            },
            genres:(callback)=>{
                Genre.find(callback);
            }
        },(error,results)=>{
            if(error){
                return next(error);
            }
            res.render('book_form',{title:'创建新书',authors:results.authors,genres:results.genres});
        }
    );
};

// Handle book create on POST.
exports.book_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 3 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),
    sanitizeBody('genre.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='checked';
                    }
                }
                res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(book.url);
                });
        }
    }
];


exports.book_update_get=(req,res)=>{
    res.send('更新藏书 get');
};

exports.book_update_post=(req,res)=>{
    res.send('更新藏书 post');
};

exports.book_delete_get=(req,res)=>{
    res.send('删除藏书 get');
};

exports.book_delete_post=(req,res)=>{
    res.send('删除藏书 post');
};