const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    postid:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    title:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    body:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    topic:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    timestamp:{
        type:Date,
        default: Date.now
    },
    expirationTimeSec:{
        type:Number,
        require:true,
    },
    status:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    owner:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    likes:{
        type:Number,
        require:true,
    },
    dislikes:{
        type:Number,
        require:true,
    },
    comments:{
        type: [String],
        require:true,
    },
})
module.exports = mongoose.model('posts', postSchema)