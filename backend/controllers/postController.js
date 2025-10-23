import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

const postListGet = async (req, res) => {
  const { communityId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        communityId: communityId,
      },
    });
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching Posts");
  }
};

const postGet = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    res.status(200).send(post);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching Post");
  }
};

const postSearch = async (req, res) => {
  const { title } = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
    });
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send("Search failed");
  }
};

const postCreateGet = async (req, res) => {};

const postCreatePost = async (req, res) => {
  const { title, content, authorId, communityId } = req.body;

  if (!title || !content || !authorId || !communityId) {
    return res.status(400).send("Missing required fields: 'title', 'content', 'authorId' and 'communityId' are needed.");
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: authorId,
        communityId: communityId,
      },
    });
    res.status(200).send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create user");
  }
};

const postUpdateGet = async (req, res) => {};

const postUpdatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // if no editable fields are provided to update
  if (!title && !content) {
    return res.status(400).send("No valid fields provided for update. Only 'title' and 'content' are editable.");
  }

  const updateData = {};

  if (title) {
    updateData.title = title;
  }
  if (content) {
    updateData.content = content;
  }

  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: id,
      },
      data: updateData,
    });
    res.status(200).send(updatedPost);
  } catch (error) {
    console.error(err);
    res.status(500).send("Failed to update post");
  }
};

const postDeletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: {
        id: id,
      },
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Delete failed");
  }
};

export default {
  postListGet,
  postGet,
  postSearch,
  postCreateGet,
  postCreatePost,
  postUpdateGet,
  postUpdatePost,
  postDeletePost,
};
