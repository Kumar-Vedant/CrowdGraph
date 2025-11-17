import pkg, { TargetType } from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const postListGet = async (req, res) => {
  const { communityId } = req.params;

  try {
    const postRecords = await prisma.post.findMany({
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
        author: {
          select: {
            username: true,
          },
        },
        voteCount: true,
      },
    });
    const posts = postRecords.map(({ author, ...post }) => ({ ...post, authorName: author.username }));
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
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
    const postRecord = await prisma.post.findUnique({
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
        author: {
          select: {
            username: true,
          },
        },
        voteCount: true,
      },
    });
    const { author, ...rest } = postRecord;
    const post = { ...rest, authorName: author.username };

    res.status(200).json({
      success: true,
      data: post,
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
    const postRecords = await prisma.post.findMany({
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
        author: {
          select: {
            username: true,
          },
        },
        voteCount: true,
      },
    });

    const posts = postRecords.map(({ author, ...post }) => ({ ...post, authorName: author.username }));
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
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
    const postRecord = await prisma.post.create({
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
        author: {
          select: {
            username: true,
          },
        },
        voteCount: true,
      },
    });

    const { author, ...rest } = postRecord;
    const post = { ...rest, authorName: author.username };
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const postVote = async (req, res) => {
  const { postId, voteValue, userId } = req.body;

  try {
    // check if vote already exists
    const vote = await prisma.vote.findUnique({
      where: {
        targetId_userId: { targetId: postId, userId },
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
          targetId: postId,
          targetType: TargetType.POST,
          userId: userId,
          voteValue: voteValue,
        },
      });
    }

    // update voteCount on post
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        voteCount: { increment: voteValue - prevVote },
      },
    });

    const postRecord = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        communityId: true,
        createdAt: true,
        author: {
          select: {
            username: true,
          },
        },
        voteCount: true,
      },
    });
    const { author, ...rest } = postRecord;
    const post = { ...rest, authorName: author.username };

    // update reputation of user whose post is voted on (+-2)
    await prisma.userCommunity.update({
      where: {
        userId_communityId: {
          userId: post.authorId,
          communityId: post.communityId,
        },
      },
      data: {
        reputation: { increment: 2 * (voteValue - prevVote) },
      },
    });

    res.status(200).json({
      success: true,
      data: post,
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
        author: {
          select: {
            username: true,
          },
        },
        voteCount: true,
      },
    });

    const { author, ...rest } = updatedPost;
    const post = { ...rest, authorName: author.username };
    res.status(200).json({
      success: true,
      data: post,
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
  postVote,
  postUpdate,
  postDelete,
};
