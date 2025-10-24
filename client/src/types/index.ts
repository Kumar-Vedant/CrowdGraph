export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  age: number;
  gender: "male" | "female" | "other";
  interests: string[];
  bio: string;
};