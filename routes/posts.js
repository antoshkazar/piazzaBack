const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const  {isPostExpired} = require('../validations/validation')
const verify = require('../verifyToken')

router.get('/', verify, async (req,res) => {
    try {
        // topic - chosen topic
        // onlyExpired (boolean) - show only actual posts or only expired ones
        // sortType (values = default/highestLikes/highestDislikes)
        const { topic, onlyExpired, sortType } = req.query;

        if (!topic) {
            return res.status(400).send({ message: 'Incorrect params' });
        }

         // Determine the sort condition (if sortType is provided)
         let sortCondition = {};
         if (sortType === 'highestLikes') {
             sortCondition = { likes: -1 }; // Sort by likes in descending order
         } else if (sortType === 'highestDislikes') {
             sortCondition = { dislikes: -1 }; // Sort by dislikes in descending order
         }

        const allPosts = await Post.find({ topic: topic }).sort(sortCondition);
        
        const filteredPosts = allPosts.filter(postToFilter => 
            onlyExpired === "true" ? isPostExpired(postToFilter) : !isPostExpired(postToFilter)
        )


        if (!filteredPosts) {
            return res.status(400).send({ message: 'No suitable posts found. Try changing search parameters.' });
        }

        res.status(200).send(filteredPosts);
    } catch(err){
        res.status(500).send({ message: err.message });
    }  
})

router.post('/create', verify, async (req,res) => {
    try {
        const { title, body, topic, expirationTimeSec, owner } = req.body;

        // Validation: Check required fields
        if (!title || !body || !topic || !expirationTimeSec || !owner) {
            return res.status(400).send({ message: 'All fields are required.' });
        }

        // Create a new post object
        const newPost = new Post({
            title,
            body,
            topic,
            expirationTimeSec,
            owner,
            likes: 0, // Default value
            dislikes: 0, // Default value
            comments: [], // Default value
        });

        // Save the post to the database
        const savedPost = await newPost.save();
        res.status(201).send(savedPost);
    } catch(err){
        res.status(500).send({ message: err.message });
    }
    
})

router.post('/interact', verify, async (req, res) => {
    try {
        const { postId, action, name, comment } = req.query;

        // Validate required fields
        if (!postId || !action) {
            return res.status(400).send({ message: 'postId and action are required.' });
        }

        // Find the post
        const post = await Post.findOne({ postid: postId });
        if (!post) {
            return res.status(404).send({ message: 'Post not found!' });
        }

        // Prevent users from liking/disliking their own posts
        if (action === 'like' || action === 'dislike') {
            if (post.owner === name) {
                return res.status(400).send({ message: 'Cannot like or dislike your own post.' });
            }
        }

        // Handle actions
        let update = {};
        if (action === 'like') {
            update = { $inc: { likes: 1 } };
        } else if (action === 'dislike') {
            update = { $inc: { dislikes: 1 } };
        } else if (action === 'comment') {
            if (!comment) {
                return res.status(400).send({ message: 'Comment is required for the comment action.' });
            }
            // Check if the post is expired
            if (isPostExpired(post)) {
                return res.status(403).send({ message: 'Post is expired. You cannot comment on it.' });
            }
            update = { $push: { comments: comment } };
        } else {
            return res.status(400).send({ message: 'Invalid action. Use like, dislike, or comment.' });
        }

        // Perform the update
        const updatedPost = await Post.findOneAndUpdate(
            { postid: postId },
            update,
            { new: true } // Return the updated document
        );

        res.status(200).send(updatedPost);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router