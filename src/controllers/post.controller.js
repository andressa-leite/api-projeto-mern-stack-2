import {
  createService,
  findAllService,
  countPost,
  findByIdService,
  topPostService,
  searchByTitleService,
  byUserService,
  updateService,
  eraseService,
  likePostService,
  deleteLikePostService,
  addCommentService,
  deleteCommentService,
} from "../services/post.service.js";

const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;
    if (!title || !text || !banner) {
      res.status(400).send({ message: "All fields must be submitted" });
    }
    await createService({
      title,
      text,
      banner,
      user: req.userId,
      /* user: { _id: "650c6e9990cc9dd26018deb3" }, */
    });
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findAll = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
      limit = 5;
    }

    if (!offset) {
      offset = 0;
    }

    const post = await findAllService(offset, limit);
    const total = await countPost();
    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=${limit}&offset={previous}`
        : null;

    /* const post = await findAllService(); */
    if (post.length == 0) {
      return res.status(400).send({ message: "There are no posts registered" });
    }
    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,
      //item = postItem
      results: post.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        username: item.user.username,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await findByIdService(id);
    res.send({
      post: {
        id: post._id,
        title: post.title,
        text: post.text,
        banner: post.banner,
        likes: post.likes,
        comments: post.comments,
        name: post.user.name,
        username: post.user.username,
        userAvatar: post.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const topPost = async (req, res) => {
  try {
    const post = await topPostService();
    if (!post) {
      return res.status(400).send({ message: "There are no posts registered" });
    }
    res.send({
      post: {
        id: post._id,
        title: post.title,
        text: post.text,
        banner: post.banner,
        likes: post.likes,
        comments: post.comments,
        name: post.user.name,
        username: post.user.username,
        userAvatar: post.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const post = await searchByTitleService(title);

    if (post.length === 0) {
      return res
        .sendStatus(400)
        .send({ message: "no post with the same title have been found" });
    }
    return res.send({
      results: post.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        username: item.user.username,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const byUser = async (req, res) => {
  try {
    const id = req.userId; //não precisa desconstruir pq vem do authmiddleware e o token tem o id dentro dele
    const post = await byUserService(id);

    return res.send({
      results: post.map((item) => {
        return {
          id: item._id,
          title: item.title,
          text: item.text,
          banner: item.banner,
          likes: item.likes,
          comments: item.comments,
          name: item.user.name,
          username: item.user.username,
          userAvatar: item.user.avatar,
        };
      }),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { title, text, banner } = req.body;
    const { id } = req.params;

    //console.log(id)
    const post = await findByIdService(id);
    // o "post.user._id" é da post que eu busquei e o "req.userId" é do usuário que está logado
    //if (post.user._id !== req.userId) {
    console.log(typeof post.user._id, typeof req.userId);
    if (String(post.user._id) !== req.userId) {
      return res.status(400).send({
        message: "It can only be deleted by the author of this post.",
      });
    }
    const data = await eraseService(id);
    res.status(200).send({ message: "Post Deleted", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const erase = async (req, res) => {
  try {
    //const { title, text, banner } = req.body;
    const { id } = req.params;

    const post = await findByIdService(id);
    // o "post.user._id" é da post que eu busquei e o "req.userId" é do usuário que está logado
    //if (post.user._id !== req.userId) {
    //console.log(typeof post.user._id, typeof req.userId);
    if (String(post.user._id) !== req.userId) {
      return res.status(400).send({
        message: "It can only be deleted by the author of this post.",
      });
    }
    await eraseService(id);
    return res.send("Post deleted Successfully");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const postLiked = await likePostService(id, userId);
    console.log(postLiked);

    if (!postLiked) {
      await deleteLikePostService(id, userId);
      return res.status(200).send({ message: "Like removed successfully" });
    }
    res.send({ message: "like received successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
/* *************************************** */
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).send({ message: "write a message to comment" });
    }
    await addCommentService(id, comment, userId);
    res.send({ message: "Comment successfully added" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { idPost, idComment } = req.params;
    const userId = req.userId;

    const deletedComment = await deleteCommentService(
      idPost,
      idComment,
      userId
    );
    res.send({ message: "Comment successfully removed" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/* *************************************** */

export {
  create,
  findAll,
  topPost,
  findById,
  searchByTitle,
  byUser,
  update,
  erase,
  likePost,
  addComment,
  deleteComment,
};
