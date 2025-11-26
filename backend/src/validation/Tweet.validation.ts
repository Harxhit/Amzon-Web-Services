import Joi from "joi";


const createTweetSchema = Joi.object({
    content: Joi
    .string()
    .min(2)
    .max(280)
    .messages({
        "string.empty" : "Tweet cannot be empty", 
        "string.min" : "Atleast add more than 2 characters", 
        "string.max": "Tweet should be less than 280 characters",
    })
})

const editTweetSchema = Joi.object({
    content: Joi
    .string()
    .min(2)
    .max(280)
    .messages({
        "string.empty" : "Tweet cannot be empty",
        "string.min" : "Tweet should be more than two characters", 
        "string.max" : "Tweet should be less than 280 characters", 
    })
})

export {createTweetSchema, editTweetSchema}