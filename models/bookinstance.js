const mongoose=require('mongoose');
const moment =require('moment');

const Schema=mongoose.Schema;
const BookInstanceSchema = new Schema(
    {
        //指向藏书的引用
        book:{type:Schema.Types.ObjectId, ref:'Book', required:true},
        //出版项
        imprint:{type:String, required:true},
        status:{
            type:String,
            required:true,
            enum:['Available','Maintenance', 'Loaned', 'Reserved'],
            default:'Maintenance'
        },
        due_back:{
            type:Date,
            default:Date.now
        }

    }
);

//虚拟属性
BookInstanceSchema
    .virtual('url')
    .get(
        function(){return ('/catalog/book-instance/'+this._id);}
    );


BookInstanceSchema
    .virtual('due_back_formatted')
    .get(
        function(){
            return moment(this.due_back).format('YYYY-MM-DD');
        }
    );


module.exports=mongoose.model('BookInstance',BookInstanceSchema);