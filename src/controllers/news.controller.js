import {
  createService,
  findAllService,
  countNews,
  findByIdService,
  topNewsService,
  searchByTitleService,
  byUserService,
  updateService,
  eraseService,
  likeNewsService,
  deleteLikeNewsService,
  addCommentService,
  deleteCommentService,
} from "../services/news.service.js";

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

    const news = await findAllService(offset, limit);
    const total = await countNews();
    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=${limit}&offset={previous}`
        : null;

    /* const news = await findAllService(); */
    if (news.length == 0) {
      return res.status(400).send({ message: "There are no news registered" });
    }
    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,
      //item = newsItem
      results: news.map((item) => ({
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
    const news = await findByIdService(id);
    res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const topNews = async (req, res) => {
  try {
    const news = await topNewsService();
    if (!news) {
      return res.status(400).send({ message: "There are no news registered" });
    }
    res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const news = await searchByTitleService(title);

    if (news.length === 0) {
      return res
        .sendStatus(400)
        .send({ message: "no news with the same title have been found" });
    }
    return res.send({
      results: news.map((item) => ({
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
    const news = await byUserService(id);

    return res.send({
      results: news.map((item) => {
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
    const news = await findByIdService(id);
    // o "news.user._id" é da news que eu busquei e o "req.userId" é do usuário que está logado
    //if (news.user._id !== req.userId) {
    console.log(typeof news.user._id, typeof req.userId);
    if (String(news.user._id) !== req.userId) {
      return res.status(400).send({
        message: "It can only be deleted by the author of this post.",
      });
    }
    const data = await eraseService(id);
    res.status(200).send({ message: "News Deleted", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const erase = async (req, res) => {
  try {
    //const { title, text, banner } = req.body;
    const { id } = req.params;

    const news = await findByIdService(id);
    // o "news.user._id" é da news que eu busquei e o "req.userId" é do usuário que está logado
    //if (news.user._id !== req.userId) {
    //console.log(typeof news.user._id, typeof req.userId);
    if (String(news.user._id) !== req.userId) {
      return res.status(400).send({
        message: "It can only be deleted by the author of this post.",
      });
    }
    await eraseService(id);
    return res.send("News deleted Successfully");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const likeNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const newsLiked = await likeNewsService(id, userId);
    console.log(newsLiked);

    if (!newsLiked) {
      await deleteLikeNewsService(id, userId);
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
    const { idNews, idComment } = req.params;
    const userId = req.userId;

    const deletedComment = await deleteCommentService(
      idNews,
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
  topNews,
  findById,
  searchByTitle,
  byUser,
  update,
  erase,
  likeNews,
  addComment,
  deleteComment,
};
