import axios from 'axios';

const BASE_URL = "https://crowdgraph.onrender.com"

///////////////////////////// Community Management /////////////////////////////
// get 10 featured communities
export const getFeaturedCommunities = async () => {
    const response = await axios.get(`${BASE_URL}/community/random`);
    return response.data.communities;
}

// search communities by title
export const searchCommunities = async (title: string) => {
    const response = await axios.get(`${BASE_URL}/community/search?title=${title}`);
    return response.data.communities;
}

// search community by id
export const searchCommunityById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/community/${id}`);
    return response.data.community;
}

// get all users in community by community id
export const getUsersInCommunity = async (communityId: string) => {
    const response = await axios.get(`${BASE_URL}/community/${communityId}/users`);
    return response.data.users;
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
    console.log("Posts in community:", response.data);
    return response.data.posts;
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
    return response.data.posts;
}

///////////////////////////// Comment Management /////////////////////////////
// get all comments in post by post id
export const getCommentsInPost = async (postId: string) => {
    const response = await axios.get(`${BASE_URL}/comment/${postId}/post`);
    return response.data.comments;
}

// get replies to a comment by comment id
export const getRepliesToComment = async (commentId: string) => {
    const response = await axios.get(`${BASE_URL}/comment/${commentId}/replies`);
    return response.data.comments;
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
    return response.data.users;
}

// get user by id
export const getUserById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/user/${id}`);
    return response.data.user;
}

// get user by username
export const getUsersByUsername = async (username: string) => {
    const response = await axios.get(`${BASE_URL}/user/search?username=${username}`);
    return response.data.users;
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
    return response.data.communities;
}