import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { socket } from "../../context/AuthProvider";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

interface UserDetails {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface MessageDetails {
  senderId: string;
  receiverId: string;
  content: string;
  deliveredAt: string;
}

const Chat = () => {
  const { id } = useParams();
  const [message, setMessage] = useState<string>("");
  const [chatMessage, setChatMessage] = useState<MessageDetails[]>([]);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const { userAuth } = useAuth();

  const timeAgo = (date: string | undefined) => {
    if (!date) return "";
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const mins = seconds / 60;
    if (mins < 60) return `${Math.floor(mins)}m`;
    const hrs = mins / 60;
    if (hrs < 24) return `${Math.floor(hrs)}h`;
    const days = hrs / 24;
    if (days < 7) return `${Math.floor(days)}d`;
    const weeks = days / 7;
    return `${Math.floor(weeks)}w`;
  };

  const userDetails = async () => {
    const response = await api.get(`/users/details/${id}`);
    setUser(response.data?.userDetails);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAuth || !user) return;

    const senderId = userAuth.id || userAuth._id;
    const chatId = [senderId, user._id].sort().join("_");

    socket.emit("message", {
      chatId,
      senderId,
      receiverId: user._id,
      content: message,
    });

    setMessage("");
  };

  useEffect(() => {
    userDetails();
  }, [id]);

  useEffect(() => {
    if (!userAuth || !user) return;

    const senderId = userAuth.id || userAuth._id;
    if (!senderId || !user._id) return;

    const cid = [senderId, user._id].sort().join("_");

    socket.emit("joinChatRoom", cid);
  }, [userAuth, user]);

  useEffect(() => {
    const handleMessage = (newMessage: MessageDetails) => {
      setChatMessage((prev) => [...prev, newMessage]);
    };

    socket.on("message:received", handleMessage);

    return () => {
      socket.off("message:received", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!userAuth || !user) return;

    const senderId = userAuth.id || userAuth._id;
    if (!senderId || !user._id) return;

    const id = [senderId, user._id].sort().join("_");
    setChatId(id);
  }, [userAuth, user]);

  const fetchChatHistory = async () => {
    if (!chatId) return;
    const response = await api.get(`/message/conversation/${chatId}`);
    setChatMessage(response.data?.chats);
  };

  useEffect(() => {
    if (chatId) fetchChatHistory();
  }, [chatId]);

  return (
    <div className="flex flex-col h-screen bg-[#0F172A]">
      <div className="p-4 border-b border-[#1E293B] flex items-center gap-3">
        <img src="/default.png" alt="" className="rounded-full bg-white" />
        <div>
          <p className="text-white font-semibold text-sm">
            Chat with {user?.firstName} {user?.lastName}
          </p>
          <p className="text-gray-400 text-xs">{user?.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessage.map((msg, index) => {
          const myId = userAuth.id || userAuth._id;
          const isMe = msg.senderId === myId;

          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                isMe ? "justify-end flex-row" : ""
              }`}
            >
              <img src="/default.png" alt="" className="rounded-full bg-white" />

              <div className="max-w-xs flex flex-col">
                <span className="text-xs text-gray-400">
                  {isMe
                    ? `${userAuth.firstName} ${userAuth.lastName}`
                    : `${user?.firstName} ${user?.lastName}`}
                </span>

                <div className="bg-[#1E293B] p-3 rounded-xl text-gray-200 mt-1">
                  {msg.content}
                </div>

                <span className="text-xs text-gray-500">
                  {timeAgo(msg.deliveredAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#1E293B] flex items-center gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-3 bg-[#1E293B] text-white rounded-lg outline-none"
          value={message}
          onChange={handleChange}
        />

        <button
          className="px-4 py-2 bg-blue-600 rounded-lg text-white"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
