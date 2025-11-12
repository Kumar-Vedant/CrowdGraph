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
    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
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
    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
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
    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const commentCreate = async (req, res) => {
  const { postId, userId, content, parentCommentId } = req.body;

  if (!postId || !content || !userId) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: 'postId', 'content' and 'userId' are needed.",
    });
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
    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const commentUpdate = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // if no editable fields are provided to update
  if (!content) {
    return res.status(400).json({
      success: false,
      error: "No valid fields provided for update. Only 'content' is editable",
    });
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

    res.status(200).json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
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
  commentGet,
  commentRepliesGet,
  commentsInPostGet,
  commentCreate,
  commentUpdate,
  commentDelete,
};
