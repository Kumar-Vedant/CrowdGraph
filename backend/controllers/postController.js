import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const postListGet = async (req, res) => {
  const { communityId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        communityId: communityId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        communityId: true,
        createdAt: true,
      },
    });
    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error,
    });
  }
};

const postGet = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        communityId: true,
        createdAt: true,
      },
    });
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
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
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        communityId: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const postCreate = async (req, res) => {
  const { title, content, authorId, communityId } = req.body;

  if (!title || !content || !authorId || !communityId) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: 'title', 'content', 'authorId' and 'communityId' are needed.",
    });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: authorId,
        communityId: communityId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        communityId: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const postUpdate = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // if no editable fields are provided to update
  if (!title && !content) {
    return res.status(400).json({
      success: false,
      error: "No valid fields provided for update. Only 'title' and 'content' are editable",
    });
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
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        communityId: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const postDelete = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

export default {
  postListGet,
  postGet,
  postSearch,
  postCreate,
  postUpdate,
  postDelete,
};
