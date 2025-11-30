import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";

interface SearchUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface ConversationPreview {
  _id: string;
  lastMessage: string;
  lastMessageTime: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

const Message = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);

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

  // SEARCH USERS
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await api.get(`/users/search?query=${query}`);
        setResults(response.data?.results || []);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // FETCH ALL CONVERSATIONS
  const allConversation = async () => {
    try {
      const response = await api.get("/message/getAll");
      setConversations(response.data?.conversations || []);
    } catch (err) {
      console.error("Conversation fetch failed:", err);
      setConversations([]);
    }
  };

  useEffect(() => {
    allConversation();
  }, []);

  return (
    <div className="space-y-6">

      {/* SEARCH BAR */}
      <div className="bg-[#1E293B] p-3 rounded-xl shadow-md max-w-md">
        <input
          type="text"
          placeholder="Search users by name or username..."
          className="w-full px-4 py-2 bg-[#111827] text-white rounded-lg outline-none border border-gray-700 focus:border-blue-500"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* SEARCH RESULTS */}
      <div className="bg-[#1E293B] p-3 rounded-xl shadow-md max-w-md space-y-3">
        {results.map((u) => (
          <div
            key={u._id}
            onClick={() => navigate(`/chat/${u._id}`)}
            className="flex items-center gap-3 p-2 bg-[#111827] rounded-lg hover:bg-[#0F172A] cursor-pointer"
          >
            <img src="/default.png" alt="" className="bg-white rounded-full" />
            <div>
              <p className="text-white text-sm font-semibold">
                {u.firstName} {u.lastName}
              </p>
              <p className="text-gray-400 text-xs">@{u.username}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-10"></div>

      {/* CONVERSATION LIST */}
      <div className="space-y-10 mb-4">
        {conversations.map((c) => (
          <Link to={`/chat/${c.user._id}`} key={c._id}>
            <div className="flex items-start gap-3 p-4 bg-[#1E293B] rounded-xl shadow-md max-w-md hover:bg-[#111827] cursor-pointer mb-2">
              
              <img src="/default.png" alt=""  className="bg-white rounded-full"/>

              <div className="flex-1">
                <p className="text-white text-sm">
                  <span className="font-semibold">
                    {c.user.firstName} {c.user.lastName}
                  </span>{" "}
                  <span className="text-gray-300">@{c.user.username}</span>
                </p>

                <p className="text-gray-200 mt-1 line-clamp-1">
                  {c.lastMessage}
                </p>

                <span className="text-xs text-gray-400 mt-2 block">
                  {timeAgo(c.lastMessageTime)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Message;
