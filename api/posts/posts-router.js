// implement your posts router here
const express = require('express')
const Post = require('./posts-model')

const router = express.Router()

//ENDPOINT

// [GET] all posts
router.get('/', (req, res) => {
    Post.find()
    .then((posts) => {
        res.status(200).json(posts)
    })
    .catch(() => {
        res.status(500).json({
            message: "The posts information could not be retrieved"
        })
    })
})

// [GET] a post by its id
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            message: 'The post information could not be retrieved',
        })
    })
})

// [POST] make a post
router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        const {title, contents} = req.body
        // console.log(title, contents)
        Post.insert({ title, contents})
            .then(({ id }) => {
                console.log(id)
                return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "There was an error while saving the post to the database"
                })
            })
    }
})

// [PUT] update a post by is id
router.put('/:id', (req, res) => {
    const { title, contents} = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.findById(req.params.id)
            .then(post => {
                if (!post) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                } else {
                    return Post.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                    return Post.findById(req.params.id)
                }
            })
            .then(post => {
                if (post) {
                    res.json(post)
                } 
            })
            .catch(err => {
                res.status(500).json({
                    message:"The posts information could not be retrieved",
                    err: err.message
                })
            })
    }
})

// [DELETE] by id
router.delete('/:id', async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            await Post.remove(req.params.id)
            res.status(200).json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            err: err.message
        })
    }
})

// [GET] comments by id
router.get('/:id/comments'), async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const comments = await Post.findPostComments(req.params.id)
            res.json(comments)
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
            err: err.message
        })
    }
}

module.exports = router
