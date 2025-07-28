"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {GoogleOAuthProvider} from '@react-oauth/google'

export const user_service  = "https://user-service-c7l6.onrender.com"
export const author_service  = "https://author-service-rv6v.onrender.com"
export const blog_service  = "https://blog-service-hy9p.onrender.com"

export const blogCategories = [
    "Technology",
    "Health",
    "Finance",
    "Travel",
    "Education",
    "Entertainment",
    "Study",
]

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  bio: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  blogcontent: string;
  image: string;
  category: string;
  author: string;
  created_at: string;
}
interface SavedBlogType{
    id:string;
    userid:string;
    blogid:string;
    create_at : string;
}
interface AppContextType{
    user:User | null;
    loading:boolean;
    isAuth:boolean;
    setUser:React.Dispatch<React.SetStateAction<User | null>>;
    setLoading:React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuth:React.Dispatch<React.SetStateAction<boolean>>;
    logoutUser:() => Promise<void>;
    blogs:Blog[] | null;
    blogLoading:boolean;
    setSearchQuery:React.Dispatch<React.SetStateAction<string>>;
    searchQuery:string;
    setCategory:React.Dispatch<React.SetStateAction<string>>;
    category:string;
    fetchBlogs: () => Promise<void>;
    savedBlogs : SavedBlogType[] | null;
    getSavedBlogs: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps{
    children : ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({children})=>{
    const [user,setUser] = useState<User | null>(null);
    const [isAuth,setIsAuth] = useState(false);
    const [loading,setLoading] = useState(true);
   async function fetchUser(){
    try{
      const token = Cookies.get("token");
       const { data } = await axios.get(`${user_service}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    }
    catch(error){
      console.log(error);
      setLoading(false);
    }
   }
   const [blogLoading,setBlogLoading] = useState(true);
   const [blogs,setBlogs] = useState<Blog[] | null>(null);
   
   const [category,setCategory] = useState("");
   const [searchQuery,setSearchQuery] = useState("");




   async function fetchBlogs(){
    setBlogLoading(true);
    try{
    const {data} = await axios.get(`${blog_service}/api/v1/blog/all?searchQuery=${searchQuery}&category=${category}`);
    setBlogs(data);
    }catch(error){
      console.log(error);
    }finally{
        setBlogLoading(false);
    }
   }
  const [savedBlogs,setSavedBlogs] = useState<SavedBlogType[] | null>(null);
   async function getSavedBlogs() {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.get(
        `${blog_service}/api/v1/blog/saved/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSavedBlogs(data);
    } catch (error) {
      console.log(error);
    }
  }
   async function logoutUser(){
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);

    toast.success("User Logged Out");
   }

   useEffect(()=>{
    fetchUser();
    getSavedBlogs();
   },[])
   useEffect(() => {
    fetchBlogs();
   },[searchQuery,category]);
    return(
     <AppContext.Provider value={{user,setIsAuth,isAuth,setLoading,loading,setUser,logoutUser,blogs,blogLoading,
        setSearchQuery,searchQuery,setCategory,category,fetchBlogs,savedBlogs,getSavedBlogs,
     }}>
        <GoogleOAuthProvider clientId="1083162893706-t6n84ka3cqi8hq81ifb962rn1k1s91st.apps.googleusercontent.com">
        {children}
        <Toaster/>
        </GoogleOAuthProvider>
        </AppContext.Provider>
    );
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if(!context){
        throw new Error("useappdata must be used within AppProvider");
    }
    return context;
}




