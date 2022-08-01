const {Schema, model} = require('mongoose'); 

const examSchema = new Schema({
    Result:{
        type: Number,
        required: false
    }, 
    description:{
        type: String, 
        required: false
    }, 
    date_of_exam: {
        type: String,
        required: true
    },
    Dx: {
        type: String,
        required: true
    },
    hour_of_exam: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    identification: {
        type: String,
        required: false
    },
    user : {
        type: String, 
        required : false
    }, 
    status :{
        type: String, 
        required: false
    }, 
    whyCancel :{
        type : String,
        required : false
    }, 
    city: {
        type: String,
        required : false
    }, 
    nivel: {
        type: String,
        required : false
    }, 
    date_of_bird: {
        type: String,
        required: false
    },
    age : {
        type: Number,
        required : false
    }, 
    group : {
        type: String, 
        required : false
    }
}, {
    timestamps: true
})

module.exports = model('Exam', examSchema)