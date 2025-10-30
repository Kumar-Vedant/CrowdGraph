import axios from 'axios';


///////////////////////////// User Authentication /////////////////////////////
export const signUpUser = async (username: string, password: string) => {
    const response = await axios.post('/user/create', {
        username,
        password,
    });
    return response.data;
}

export const signInUser = async (username: string, password: string) => {
    const response = await axios.post('/user/login', {
        username,
        password,
    });
    return response.data;
}




///////////////////////////// Community Management /////////////////////////////
// get 10 featured communities
export const getFeaturedCommunities = async () => {
    const response = await axios.get('/communities/featured');
    return response.data;
}

// search communities by title
export const searchCommunities = async (title: string) => {
    const response = await axios.get('/communities/search', {
        params: { title },
    });
    return response.data;
}

// search community by id
export const searchCommunityById = async (id: string) => {
    // const response = await axios.get(`/communities/${id}`);
    // return response.data;
    throw console.error();
    await new Promise(resolve => setTimeout(resolve, 3000));
    return null;
}


// get all users in community by community id
export const getUsersInCommunity = async (communityId: string) => {
    const response = await axios.get(`/communities/${communityId}/users`);
    return response.data;
}