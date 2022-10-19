const express=require('express');
const router=express.Router();

const authorController=require('../controllers/authorController');
const bookController=require('../controllers/bookController');
const bookInstanceController=require('../controllers/bookInstanceController');
const genreController=require('../controllers/genreController');
const bookinstance = require('../models/bookinstance');

//藏书路由
router.get('/',bookController.index);
router.get('/books',bookController.book_list);


router.get('/book/create',bookController.book_create_get);
router.post('/book/create',bookController.book_create_post);
router.get('/book/:id/update',bookController.book_update_get);
router.post('/book/:id/update',bookController.book_update_post);
router.get('/book/:id/delete',bookController.book_delete_get);
router.post('/book/:id/delete',bookController.book_delete_post);

router.get('/book/:id',bookController.book_detail);



//藏书副本路由
router.get('/book-instances',bookInstanceController.book_instance_list);

router.get('/book-instance/create',bookInstanceController.book_instance_create_get);
router.post('/book-instance/create',bookInstanceController.book_instance_create_post);
router.get('/book-instance/:id/update',bookInstanceController.book_instance_update_get);
router.post('/book-instance/:id/update',bookInstanceController.book_instance_update_post);
router.get('/book-instance/:id/delete',bookInstanceController.book_instance_delete_get);
router.post('/book-instance/:id/delete',bookInstanceController.book_instance_delete_post);

router.get('/book-instance/:id',bookInstanceController.book_instance_detail);



//作者路由
router.get('/authors',authorController.author_list);

router.get('/author/create',authorController.author_create_get);
router.post('/author/create',authorController.author_create_post);
router.get('/author/:id/update',authorController.author_update_get);
router.post('/author/:id/update',authorController.author_update_post);
router.get('/author/:id/delete',authorController.author_delete_get);
router.post('/author/:id/delete',authorController.author_delete_post);

router.get('/author/:id',authorController.author_detail);



//藏书种类路由
router.get('/genres',genreController.genre_list);

router.get('/genre/create',genreController.genre_create_get);
router.post('/genre/create',genreController.genre_create_post);
router.get('/genre/:id/update',genreController.genre_update_get);
router.post('/genre/:id/update',genreController.genre_update_post);
router.get('/genre/:id/delete',genreController.genre_delete_get);
router.post('/genre/:id/delete',genreController.genre_delete_post);

router.get('/genre/:id',genreController.genre_detail);


module.exports=router;