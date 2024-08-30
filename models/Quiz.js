const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'

    },
    name:{
        type: String,
        required:[true,"Please enter name"],

    },
    type:{
        type: String,
       enum: ['poll','q&a'],
       required: true

    },
    questions:[
        {
            questionText:{
                type: String,
                required:[true,"Please type Question"],
            },
            questionOptions:[{
                text:{
                    type:String,
                    
                },
                imageUrl: String,
                isCorrect:{
                    type: Boolean,
                    default:false
                },
                selectedCount: { 
                    type: Number,
                    default: 0
                },
            }],
            timer:{
                type: Number,
                default:0
            },
            QuestionImpressions: {
                type: Number,
                default: 0
              },
              correctAnswer: {
                type: Number,
                default:0
            },
        }
    ],
    impressions: {
        type: Number,
        default:0
    },
   
    published: {
        type: Boolean,
        default:false
    }
   
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Quiz",schema);