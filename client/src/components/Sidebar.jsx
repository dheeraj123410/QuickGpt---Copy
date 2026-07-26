import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";

const Sidebar = ({ isMenuOpen, setMenuOpen }) => {
  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
  } = useAppContext();

  const [search, setSearch] = useState("");

  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124] to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-10 ${
        !isMenuOpen ? "max-md:-translate-x-full" : ""
      }`}
    >
      {/* Logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="Logo"
        className="w-full max-w-48"
      />

      {/* New Chat Button */}
      <button className="flex items-center justify-center w-full mt-10 py-2 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] rounded-md text-sm cursor-pointer hover:opacity-90 transition">
        <span className="mr-2 text-xl">+</span> New Chat
      </button>

      {/* Search */}
      <div className="flex items-center gap-2 mt-4 p-3 border border-gray-400 dark:border-white/20 rounded-md">
        <img
          src={assets.search_icon}
          alt="Search"
          className="w-4 not-dark:invert"
        />

        <input
          type="text"
          placeholder="Search Conversation"
          className="text-xs placeholder:text-gray-400 outline-none bg-transparent flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && (
        <p className="mt-4 text-sm font-medium">Recent Chats</p>
      )}

      <div className="flex-1 overflow-y-auto mt-3 text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages.length > 0
              ? chat.messages[0].content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate("/");
                setSelectedChat(chat);
                setMenuOpen(false);
              }}
              className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-[#57317C]/20 transition"
            >
              <div className="overflow-hidden">
                <p className="truncate">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>

              <img
                src={assets.bin_icon}
                className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
                alt="Delete"
              />
            </div>
          ))}
      </div>

      {/* Community Images */}
      <div
        onClick={() => {
          navigate("/community");
          setMenuOpen(false);
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.03] transition-all"
      >
        <img
          src={assets.gallery_icon}
          className="w-4.5 not-dark:invert"
          alt="Gallery"
        />

        <div className="flex flex-col text-sm">
          <p>Community Images</p>
        </div>
      </div>

      {/* Credits */}
      <div
        onClick={() => {
          navigate("/credits");
          setMenuOpen(false);
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.03] transition-all"
      >
        <img
          src={assets.diamond_icon}
          className="w-4.5 dark:invert"
          alt="Credits"
        />

        <div className="flex flex-col text-sm">
          <p>Credits: {user?.credits ?? 0}</p>

          <p className="text-xs text-gray-400">
            Purchase credits to use QuickGPT
          </p>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="flex items-center justify-between p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
        <div className="flex items-center gap-2 text-sm">
          <img
            src={assets.theme_icon}
            className="w-4 not-dark:invert"
            alt="Theme"
          />

          <p>Dark Mode</p>
        </div>

        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          />

          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>

          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>

      {/* User */}
      <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
        <img
          src={assets.user_icon}
          className="w-7 rounded-full"
          alt="User"
        />

        <p className="flex-1 text-sm truncate">
          {user ? user.name : "Login your account"}
        </p>

        {user && (
          <img
            src={assets.logout_icon}
            className="h-5 cursor-pointer hidden group-hover:block not-dark:invert"
            alt="Logout"
          />
        )}
      </div>

      {/* Mobile Close Button */}
      <img
        onClick={() => setMenuOpen(false)}
        src={assets.close_icon}
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
        alt="Close"
      />
    </div>
  );
};



export default Sidebar;
