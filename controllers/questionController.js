const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');

// POST /api/questions - Create a new question
exports.create = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    const question = await Question.create({
      title,
      description,
      tags,
      author: req.user.id,
      answers: [],
    });
    await question.populate('author', '_id username');
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/questions - List questions with filters, search, pagination
exports.list = async (req, res) => {
  try {
    const { filter, search, tags, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
    let sort = { createdAt: -1 };
    if (filter === 'unanswered') {
      query.answers = { $size: 0 };
    }
    const questions = await Question.find(query)
      .populate('author', '_id username')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    // Add answerCount, upvoteCount, downvoteCount to each question
    const result = await Promise.all(questions.map(async (q) => {
      // Get all answers for this question
      const answers = await Answer.find({ _id: { $in: q.answers } });
      const upvoteCount = answers.reduce((sum, a) => sum + (a.upvotes ? a.upvotes.length : 0), 0);
      const downvoteCount = answers.reduce((sum, a) => sum + (a.downvotes ? a.downvotes.length : 0), 0);
      return {
        _id: q._id,
        title: q.title,
        tags: q.tags,
        answerCount: q.answers.length,
        upvoteCount,
        downvoteCount,
        createdAt: q.createdAt,
        author: q.author,
      };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/questions/:id - Get single question and its answers
exports.getOne = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', '_id username')
      .populate({
        path: 'answers',
        populate: { path: 'author', select: '_id username' }
      });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    // Format answers to include upvotes, downvotes, totalVotes
    const answers = await Answer.find({ _id: { $in: question.answers } })
      .populate('author', '_id username');
    const formattedAnswers = answers.map(a => ({
      _id: a._id,
      content: a.content,
      upvotes: a.upvotes.map(String),
      downvotes: a.downvotes.map(String),
      totalVotes: a.upvotes.length - a.downvotes.length,
      author: a.author,
    }));
    res.json({
      _id: question._id,
      title: question.title,
      description: question.description,
      tags: question.tags,
      answers: formattedAnswers,
      acceptedAnswer: question.acceptedAnswer,
      author: question.author,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PATCH /api/questions/:questionId/accept/:answerId - Accept answer
exports.acceptAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (String(question.author) !== req.user.id) {
      return res.status(403).json({ message: 'Only the question author can accept an answer' });
    }
    question.acceptedAnswer = answerId;
    await question.save();
    res.json({ message: 'Answer accepted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
