const router = require('express').Router();
const { Story, User, Comment} = require('../models');

//RENDER ALL STORIES
router.get('/', (req, res) => {
  Story.findAll({
    // ORDERED SO NEWEST REMAIN AT TOP
    order: [['created_at', 'DESC']],
    attributes: [
      'id',
      'body',
      'title',
      'created_at',
      'cover_color',
      'title_color',
      'font_size',
      'font',
      'border_width',
      'border_color'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'story_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
      {
        model: User,
        attributes: ['username', 'id'] },
    ],
  })
    .then((dbStoryData) => {
      const stories = dbStoryData.map((story) => story.get({ plain: true }));
      res.render('homepage', {
        stories,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// IF NOT ALREADY LOGGED IN, RENDER THE LOGIN PAGE
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// RENDER A SINGLE STORY
router.get('/:id', (req, res) => {
  Story.findOne({
    where: {
      id: req.params.id,
    },

    attributes: [
      'id',
      'body',
      'title',
      'created_at',
      'cover_color',
      'title_color',
      'font_size',
      'font',
      'border_width',
      'border_color'
    ],

    include: [
      {
        model: Comment,
        attributes: [
          'id','comment_text', 'story_id', 'user_id', 'created_at'],
        include: [
          {
            model: User,
            attributes: ['username','id'],
          },
        ],
      },
    ],
  })
    .then((dbStoryData) => {
      if (!dbStoryData) {
        res.status(404).json({ message: 'No story found with this id' });
        return;
      }

      const story = dbStoryData.get({ plain: true });

      res.render('single-story', {
        story,
        loggedIn: req.session.loggedIn
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
