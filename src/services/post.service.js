import Post from "../models/Post.js";

const createService = (body) => Post.create(body);

const findAllService = (offset, limit) =>
  Post.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

const countPosts = () => Post.countDocuments();

const findByIdService = (id) => Post.findById(id).populate("user");

const topPostsService = () => Post.findOne().sort({ _id: -1 }).populate("user");

const searchByTitleService = (title) =>
  Post.find({
    title: { $regex: `${title || ""}`, $options: "i" },
  })
    .sort({ _id: -1 })
    .populate("user");

const byUserService = (id) =>
  Post.find({ user: id }).sort({ _id: -1 }).populate("user");

const updateService = (id, title, text, banner) =>
  Post.findOneAndUpdate(
    { _id: id },
    { title, text, banner },
    /* {rawResult: true}  */ //deprecated
    { includeResultMetadata: true }
  );

const eraseService = (id) => Post.findOneAndDelete({ _id: id });

const likePostService = (idPost, userId) =>
  Post.findOneAndUpdate(
    { _id: idPost, "likes.userId": { $nin: [userId] } },
    { $push: { likes: { userId, createdAt: new Date() } } }
  );

const deleteLikePostService = (idPost, userId) =>
  Post.findOneAndUpdate({ _id: idPost }, { $pull: { likes: { userId } } });

/* *************************************** */
const addCommentService = (idPost, comment, userId) => {
  const idComment = Math.floor(Date.now() + Math.random()).toString(36);
  return Post.findOneAndUpdate(
    { _id: idPost },
    {
      $push: {
        comments: { idComment, userId, comment, createdAt: new Date() },
      },
    }
  );
};

const deleteCommentService = (idPost, idComment, userId) =>
  Post.findOneAndUpdate(
    { _id: idPost },
    { $pull: { comments: { idComment, userId } } }
  );

/* *************************************** */
export {
  createService,
  findAllService,
  countPosts,
  findByIdService,
  topPostsService,
  searchByTitleService,
  byUserService,
  updateService,
  eraseService,
  likePostService,
  deleteLikePostService,
  addCommentService,
  deleteCommentService,
};
