import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const createComment = async (req, res) => {
  try {
    const postID = req.params.id;

    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
    });

    await doc.save();

    await PostModel.findByIdAndUpdate(
      {
        _id: postID,
      },
      {
        $push: { comments: { text: doc.text, user: doc.user } },
      },

      res.json(doc)
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать комментарий',
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate('user').exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить комментарии',
    });
  }
};
