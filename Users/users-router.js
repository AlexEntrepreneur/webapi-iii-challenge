const express = require('express');
const Users = require('./userDb.js');
const Posts = require('../Posts/postDb.js');
const middleware = require('../middleware');

const router = express.Router();

router.use(express.json());
router.use(middleware.makeNameUpperCase);

//====== ENDPOINTS ======//
router.get('/', (req, res) => {
  Users.get()
    .then(data => res.json(data))
    .catch(data => res.status(500).json({
      errorMessage: "The users information could not be retrieved."
    }));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(data => {
      if (data) {
        res.json(data)
      }
      else {
        res.status(404).json({
          errorMessage: `The user with the specified ID \"${id}\" does not exist.`
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "The user information could not be retrieved."
      });
    });
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (name) {
    Users.insert({ name })
      .then(data => {
        Users.get()
          .then(data => res.status(201).json(data));
      })
      .catch(error => res.status(500).json({
        errorMessage: "There was an error while saving the user to the database"
      }))
  }
  else {
    res.status(400).json({
      errorMessage: "Please provide name field for the user."
    });
  }
})

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const removeUserPosts = (userId) => {
    return new Promise((resolve, reject) => {
      Users.getUserPosts(userId)
        .then(posts => {
          if (posts.length) {
            posts.forEach(post => {
              Posts.remove(post.id)
                .then(() => resolve())
                .catch(() => reject())
            });
          }
          resolve();
        })
        .catch(err => {
          reject(err);
        })
    })
  }

  removeUserPosts(id)
    .then(() => {
      // After removing user's posts
      Users.remove(id)
      .then(data => {
        if (data) {
          Users.get()
          .then(data => {
            res.json(data);
          })
        }
        else {
          res.status(404).json({
            errorMessage: `The user with the specified ID \"${id}\" does not exist.`
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          errorMessage: "The user could not be removed"
        });
      });
    })
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  if (id) {
    Users.update(id, { name: req.body.name })
      .then(data => {
        if (data) {
          Users.get()
            .then(data => res.json(data));
        }
        else {
          res.status(404).json({
            errorMessage: `The user with the specified ID \"${id}\" does not exist.`
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          errorMessage: "The user information could not be modified."
        });
      });
  }
  else {
    res.status(400).json({
      errorMessage: "Please provide name and bio for the user."
    });
  }
});

module.exports = router;
