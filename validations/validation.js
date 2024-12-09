const express = require('express')
const joi = require('joi')

const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(256),
        email:joi.string().required().min(3).max(256).email(),
        password:joi.string().required().min(6).max(1024),
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:joi.string().required().min(3).max(256).email(),
        password:joi.string().required()
    })
    return schemaValidation.validate(data)
}

const isPostExpired = (post) => {
    const currentTime = Date.now(); // Current time in milliseconds
    const postCreationTime = new Date(post.timestamp).getTime(); // Post creation time in milliseconds
    const expirationTime = postCreationTime + post.expirationTimeSec * 1000; // Expiration time in milliseconds
    return currentTime > expirationTime; // Returns true if the post is expired
};

module.exports.isPostExpired = isPostExpired;
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation