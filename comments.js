// Create web server
// Comments API

'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {Comment} = require('./models');

const jsonParser = bodyParser.json();

// Get all comments
router.get('/', (req, res) => {
  Comment
    .find()
    .then(comments => {
      res.json({
        comments: comments.map(
          (comment) => comment.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// Get comment by id
router.get('/:id', (req, res) => {
  Comment
    .findById(req.params.id)
    .then(comment => {
      res.json(comment.serialize())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// Create new comment
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['comment', 'date', 'author', 'post'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      res.status(400).send(message);
    }
  }

  Comment
    .create({
      comment: req.body.comment,
      date: req.body.date,