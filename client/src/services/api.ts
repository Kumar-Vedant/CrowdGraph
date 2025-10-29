import axios from 'axios';

const createNewUser = async (username: string, password: string) => {
    const response = await axios.post('/user/create', {
        username,
        password,
    });
    return response.data;
}

export default {
    createNewUser,
};
