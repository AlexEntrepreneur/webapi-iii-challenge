const express = require('express');
const Posts = require('./postDb.js');

const router = express.Router();

router.use(express.json());

//====== ENDPOINTS ======//
router.get('/', (req, res) => {
  Posts.get()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({
      error: "The posts information could not be retrieved."
    }));
});

router.get('/:id', (req, res) => {
  Posts.getById(req.params.id)
    .then(data => {
      if (data) {
        res.json(data);
      }
      else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        })
      }
    })
    .catch(err => res.status(500).json({
      error: "The posts information could not be retrieved."
    }));
});

router.post('/', (req, res) => {
  const { text: postText, user_id } = req.body;
  if (postText && user_id) {
    Posts.insert({ text: postText, user_id })
    .then(data => {
      Posts.get()
        .then(data => res.status(201).json(data))
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "Your post could not be added"
      })
    })
  }
  else {
    res.status(400).json({
      errorMessage: "Please provide text and user_id fields for the post."
    })
  }
});

router.put('/:id', (req, res) => {
  const { text: postText } = req.body;;

  if (postText) {
    Posts.update(req.params.id, { text: postText })
    .then(data => {
      if (data) {
        Posts.get()
          .then(data => res.status(201).json(data))
      }
      else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        })
      }
    })
    .catch(err => res.status(400).json({
      errorMessage: "The post failed to update."
    }))
  }
  else {
    res.status(400).json({
      errorMessage: "Please provide text for the post."
    })
  }
});

router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
    .then(data => {
      if (data) {
        Posts.get()
          .then(data => {
            res.json(data);
          })
      }
      else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        })
      }
    })
    .catch(err => res.status(500).json({
      error: "The post could not be removed"
    }));
});

module.exports = router;
