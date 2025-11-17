import pkg, { TargetType } from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const commentGet = async (req, res) => {
  const { id } = req.params;

  try {
    const commentRecord = await prisma.comment.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const { user, ...rest } = commentRecord;
    const comment = { ...rest, username: user.username };
    res.status(200).json({
      success: true,
      data: comment,
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
    const commentRecords = await prisma.comment.findMany({
      where: {
        parentCommentId: id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const comments = commentRecords.map(({ user, ...rest }) => ({ ...rest, username: user.username }));
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
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
    const commentRecords = await prisma.comment.findMany({
      where: {
        postId: id,
        parentCommentId: null,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const comments = commentRecords.map(({ user, ...rest }) => ({ ...rest, username: user.username }));
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
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
    const commentRecord = await prisma.comment.create({
      data: {
        postId: postId,
        content: content,
        userId: userId,
        parentCommentId: parentCommentId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const { user, ...rest } = commentRecord;
    const comment = { ...rest, username: user.username };
    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};
const commentVote = async (req, res) => {
  const { commentId, voteValue, userId } = req.body;

  try {
    // check if vote already exists
    const vote = await prisma.vote.findUnique({
      where: {
        targetId_userId: { targetId: commentId, userId },
      },
    });

    let prevVote = 0;
    // if yes, update vote
    if (vote) {
      prevVote = vote.voteValue;

      if (prevVote !== voteValue) {
        await prisma.vote.update({
          where: {
            id: vote.id,
          },
          data: {
            voteValue: voteValue,
          },
        });
      }
    }
    // if no, create a new vote
    else {
      await prisma.vote.create({
        data: {
          targetId: commentId,
          targetType: TargetType.COMMENT,
          userId: userId,
          voteValue: voteValue,
        },
      });
    }

    // update voteCount on comment
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        voteCount: { increment: voteValue - prevVote },
      },
    });

    const commentRecord = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        post: {
          select: {
            communityId: true,
          },
        },
      },
    });

    const { user, post, ...rest } = commentRecord;
    const comment = { ...rest, username: user.username };

    // update reputation of user whose comment is voted on (+-1)
    await prisma.userCommunity.update({
      where: {
        userId_communityId: {
          userId: comment.userId,
          communityId: post.communityId,
        },
      },
      data: {
        reputation: { increment: voteValue - prevVote },
      },
    });
    res.status(200).json({
      success: true,
      data: comment,
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
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const { user, ...rest } = updatedComment;
    const comment = { ...rest, username: user.username };
    res.status(200).json({
      success: true,
      data: comment,
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
  commentVote,
  commentUpdate,
  commentDelete,
};
