// import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutations';
import type { IUser } from '../types';
import { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  age: 0,
  gender: "other" as "other" | "male" | "female",
  interests: [],
  bio: "",
};


const INITIAL_STATE = {
    user: INITIAL_USER,
    isAuthenticated: false,
    isLoading: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { data: currentUser } = useGetCurrentUser();

    const checkAuthUser = async () => {
        setIsLoading(true);
        try {
            if (currentUser) {
                setUser(
                    {
                        id: currentUser.$id,
                        name: currentUser.name,
                        username: currentUser.username,
                        email: currentUser.email,
                        imageUrl: currentUser.imageURL,
                        age: currentUser.age ?? 0,
                        gender: currentUser.gender ?? "other",
                        interests: currentUser.interests ?? [],
                        bio: currentUser.bio,
                    }
                );
                setIsAuthenticated(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Check authentication status on every page load
    useEffect(() => {
        const cookieFallback = localStorage.getItem("cookieFallback");
        if (
        cookieFallback === "[]" ||
        cookieFallback === null ||
        cookieFallback === undefined
        ) {
            navigate("/sign-in");
        }

        checkAuthUser();
    }, [currentUser]);

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
