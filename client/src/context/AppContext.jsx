import {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ===========================
  // Fetch Logged In User
  // ===========================
  const fetchUser = async () => {
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      const { data } = await axios.get("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
        setUser(null);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);

      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // ===========================
  // Create Chat
  // ===========================
  const createNewChat = async () => {
    try {
      if (!user) {
        toast.error("Please login first");
        return;
      }

      navigate("/");

      const { data } = await axios.get("/api/chat/create", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        fetchUserChats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ===========================
  // Fetch Chats
  // ===========================
  const fetchUserChats = async () => {
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setChats(data.chats);

        if (data.chats.length > 0) {
          setSelectedChat(data.chats[0]);
        } else {
          setSelectedChat(null);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ===========================
  // Theme
  // ===========================
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // ===========================
  // Fetch Chats
  // ===========================
  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  // ===========================
  // Fetch User
  // ===========================
  useEffect(() => {
    fetchUser();
  }, [token]);

  const value = {
    axios,
    navigate,

    user,
    setUser,

    chats,
    setChats,

    selectedChat,
    setSelectedChat,

    theme,
    setTheme,

    token,
    setToken,

    loadingUser,

    fetchUser,
    fetchUserChats,
    createNewChat,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
/*import {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { dummyUserData, dummyChats } from "../assets/assets";
import axios from 'axios'
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  const [token, setToken]= useState(localStorage.getItem('token')|| null)
  const [loadingUser, setloadingUser] = useState(true)


  // Fetch user
  const fetchUser = async () => {
    try{
     const data = await axios.get('/api/user/data', {headers: {Authorization:token}})
     if(data.success){
      setUser(data.user)
     }else{
      toast.error(data.message)

     }

    } catch(error){
      toast.error(error.message)

    }
    finally{
      setloadingUser(false)
    }

  };

  const createNewChat = async () => {
    try{
      if(!user) return toast('login to create a new chat')
        navigate('/')
      await axios.get('/api/chat/create', {headers:{Authorization:token}})
      await fetchUserChats( )

    }catch(error){
      toast.error(error.message)

    }
    
  }

  // Fetch chats
  const fetchUserChats = async () => {
try{
  const {data} = await axios.get('/api/chat/get', { headers:{Authorization:token}})
  if(data.success){
    setChats(data.chats)
    //if the user has no chats, create  one 
    if(data.chats.length===0){
      await createNewChat()
      return fetchUserChats()

    }else

    {
      setSelectedChat(data.chats[0])
    }
  }else{
    toast.error(data.message)
  }

}catch(error){
      toast.error(error.message)


}  };

  // Handle theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch chats whenever user changes
  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  // Fetch user on app load
  useEffect(() => {
    if(token){
          fetchUser();


    }else{
      setUser(null)
      setloadingUser(false)
    }
  }, [token]);

  const value = {
    navigate,
    user,
    setUser,
    fetchUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme, createNewChat, loadingUser ,fetchUserChats, token, setToken, axios
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};*/