import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const commentGet = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: id,
      },
    });
    res.status(200).send(comment);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching comment");
  }
};

const commentRepliesGet = async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        parentCommentId: id,
      },
    });
    res.status(200).send(comments);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching comments");
  }
};

const commentsInPostGet = async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: id,
      },
    });
    res.status(200).send(comments);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching comments");
  }
};

const commentCreate = async (req, res) => {
  const { postId, userId, content, parentCommentId } = req.body;

  if (!postId || !content || !userId) {
    return res.status(400).send("Missing required fields: 'postId', 'content' and 'userId' are needed.");
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        postId: postId,
        content: content,
        userId: userId,
        parentCommentId: parentCommentId,
      },
    });
    res.status(200).send(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create comment");
  }
};

const commentUpdate = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // if no editable fields are provided to update
  if (!content) {
    return res.status(400).send("No valid fields provided for update. Only 'content' is editable");
  }

  const updateData = {};

  if (content) {
    updateData.content = content;
  }

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: id,
      },
      data: updateData,
    });
    res.status(200).send(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update comment");
  }
};

const commentDelete = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({
      where: {
        id: id,
      },
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to delete comment");
  }
};

export default {
  commentGet,
  commentRepliesGet,
  commentsInPostGet,
  commentCreate,
  commentUpdate,
  commentDelete,
};
