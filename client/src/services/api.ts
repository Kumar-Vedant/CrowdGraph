import axios from 'axios';
import { dummyEdgeProposals } from './data';

const BASE_URL = "https://crowdgraph.onrender.com"

///////////////////////////// Community Management /////////////////////////////
// get 10 featured communities
export const getFeaturedCommunities = async () => {
    const response = await axios.get(`${BASE_URL}/community/random`);
    return response.data;
}

// search communities by title
export const searchCommunities = async (title: string) => {
    const response = await axios.get(`${BASE_URL}/community/search?title=${title}`);
    return response.data;
}

// search community by id
export const searchCommunityById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/community/${id}`);
    return response.data;
}

// get all users in community by community id
export const getUsersInCommunity = async (communityId: string) => {
    const response = await axios.get(`${BASE_URL}/community/${communityId}/users`);
    return response.data;
}

// join a community
export const joinCommunity = async (communityId: string, userId: string) => {
    const response = await axios.post(`${BASE_URL}/community/${communityId}/${userId}`);
    return response.data;
}

// leave a community
export const leaveCommunity = async (communityId: string, userId: string) => {
    const response = await axios.delete(`${BASE_URL}/community/${communityId}/${userId}`);
    return response.data;
}

///////////////////////////// Post Management /////////////////////////////
// get all posts in community by community id
export const getPostsInCommunity = async (communityId: string) => {
    const response = await axios.get(`${BASE_URL}/post/${communityId}/community`);
    return response.data;
}

// create a new post
export const createPost = async (communityId: string, authorId: string, title: string, content: string) => {
    const response = await axios.post(`${BASE_URL}/post/create`, {
        communityId,
        authorId,
        title,
        content,
    });
    return response.data;
}

// update a post
export const updatePost = async (postId: string, title: string, content: string) => {
    const response = await axios.put(`${BASE_URL}/post/${postId}/update`, {
        title,
        content,
    });
    return response.data;
}

// delete a post
export const deletePost = async (postId: string) => {
    const response = await axios.delete(`${BASE_URL}/post/${postId}/delete`);
    return response.data;
}

// get post by title in community
export const getPostByTitleInCommunity = async (communityId: string, title: string) => {
    const response = await axios.get(`${BASE_URL}/post/${communityId}/search?title=${title}`);
    return response.data;
}

///////////////////////////// Comment Management /////////////////////////////
// get all comments in post by post id
export const getCommentsInPost = async (postId: string) => {
    const response = await axios.get(`${BASE_URL}/comment/${postId}/post`);
    return response.data;
}

// get replies to a comment by comment id
export const getRepliesToComment = async (commentId: string) => {
    const response = await axios.get(`${BASE_URL}/comment/${commentId}/replies`);
    return response.data;
}

// create a new comment
export const createComment = async (postId: string, userId: string, content: string, parentCommentId?: string) => {
    const response = await axios.post(`${BASE_URL}/comment/create`, {
        postId,
        userId,
        content,
        parentCommentId: parentCommentId || null,
    });
    return response.data;
}

// update a comment
export const updateComment = async (commentId: string, content: string) => {
    const response = await axios.put(`${BASE_URL}/comment/${commentId}/update`, {
        content,
    });
    return response.data;
}

// delete a comment
export const deleteComment = async (commentId: string) => {
    const response = await axios.delete(`${BASE_URL}/comment/${commentId}/delete`);
    return response.data;
}

///////////////////////////// User Management /////////////////////////////
// get all users
export const getAllUsers = async () => {
    const response = await axios.get(`${BASE_URL}/user`);
    return response.data;
}

// get user by id
export const getUserById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/user/${id}`);
    return response.data;
}

// get user by username
export const getUsersByUsername = async (username: string) => {
    const response = await axios.get(`${BASE_URL}/user/search?username=${username}`);
    return response.data;
}

// sign up user
export const signUpUser = async (username: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/user/create`, {
        username,
        password,
    });
    return response.data;
}

// sign in user
export const signInUser = async (username: string, password: string) => {
    const response = await getUsersByUsername(username);
    return response;
}

// update user
export const updateUser = async (userId: string, username: string, password: string) => {
    const response = await axios.put(`${BASE_URL}/user/${userId}/update`, {
        username,
        password,
    });
    return response.data;
}

// delete user
export const deleteUser = async (userId: string) => {
    const response = await axios.delete(`${BASE_URL}/user/${userId}/delete`);
    return response.data;
}

// get communities of a user by user id
export const getCommunitiesOfUser = async (userId: string) => {
    const response = await axios.get(`${BASE_URL}/user/${userId}/communities`);
    return response.data;
}

///////////////////////////// Node and Edge Management /////////////////////////////
// get all nodes and edges in community by community id
export const getGraphInCommunity = async (communityId: string) => {
    const response = await axios.get(`${BASE_URL}/graph/${communityId}/community`);
    return response.data;
}

// get all node proposals in community by community id
export const getNodeProposalsInCommunity = async (communityId: string) => {
    const response = await axios.get(`${BASE_URL}/node/${communityId}/proposal`);
    return response.data;
}

// get all nodes and edges proposals in community by community id
export const getGraphProposalsInCommunity = async (communityId: string) => {
    const nodesResponse = await getNodeProposalsInCommunity(communityId);
    const response = {
        data: {
            success: true,
            data: {
                nodeProposals: nodesResponse?.data,
                edgeProposals: dummyEdgeProposals
            },
            error: null
        }
    };
    // const response = await axios.get(`${BASE_URL}/graph/proposals/${communityId}/community`);
    return response.data;
}

export const voteNodeProposal = async (
  proposalId: string,
  vote: number,
  userId: string
) => {
  try {
    const response = await axios.post(`${BASE_URL}/node/proposal/vote`, {
      proposalId,
      voteValue: vote,
      userId,
    });
    return response.data;
  } catch (err: any) {
    return err.response?.data;
  }
};

// vote a edge proposal with upvote or downvote or none as +1 or -1 or 0
export const voteEdgeProposal = async (proposalId: string, vote: number, userId: string) => {
    const response = await axios.post(`${BASE_URL}/edge/proposal/vote`, {
        proposalId: proposalId,
        voteValue: vote,
        userId: userId,
    });
    return response.data;
}


///////////////////////////// Query Management /////////////////////////////
// query knowledge graph with a question in community
export const queryKnowledgeGraph = async (communityId: string, question: string) => {
    const response = await axios.post(`${BASE_URL}/query/${communityId}/community`, {
        question,
    });
    return response.data;
}