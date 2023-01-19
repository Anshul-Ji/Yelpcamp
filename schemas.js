const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    city: Joi.string().required(),
    state: Joi.string().required(),
    description: Joi.string().required(),
    deleteImages: Joi.array()
    // image: Joi.string().required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number(),
        body: Joi.string().required()
    }).required()
});