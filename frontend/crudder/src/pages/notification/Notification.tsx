import { useEffect , useState } from "react";
import { socket } from "../../context/AuthProvider";
import api from "../../api/axios";
import {toast} from 'react-toastify'

interface NotificationItem {
  _id?: string;
  type:string;
  message:string;
  senderId? :{firstName: string, lastName:string, username:string};
  createdAt:string
}

const Notification = () => {  
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const loadNotification = async() => {
    try {
      const response = await api.get('/notification/all')
      setNotifications(response.data?.notificaitons)
    } catch (error:any) {
      const generalError = error.response.message 
      if(generalError){
        toast(generalError)
      }
    }
  }
  
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

useEffect(() => {
  const handler = (data: any) => {
    setNotifications((prev) => [
      {
        type: data.type,
        senderId: data.senderId, 
        message: data.message,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  socket.on("notification:new", handler);

  return () => {
    socket.off("notification:new", handler);
  };
}, []);


   const getIcon = (type: string) => {
    switch (type) {
      case "follow": return "⭐";
      case "like": return "❤️";
      case "comment": return "💬";
      case "reply": return "↩️";
      case "mention": return "@";
      default: return "🔔";
    }
  };

  const getMessage = (type:string) => {
    switch (type) {
      case "follow": return `started following you`;
      case "like": return "liked your comment";
      case "comment": return "commented on your tweet";
      case "reply": return "replied your tweet";
      case "mention": return "metioned you";
      default: return "Fuck you";
    }
  }

  useEffect(() => {
    loadNotification()
  },[])
  
  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          No notifications yet
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 bg-[#1E293B] text-white p-4 rounded-xl shadow-md hover:bg-[#243347] transition"
            >
              <div className="text-2xl">{getIcon(item.type)}</div>

              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">
                    {item.senderId?.firstName || "Someone"} {item.senderId?.lastName || ""}
                  </span>{" "}
                  {getMessage(item.type)}
                </p>
                <span className="text-xs text-gray-400">
                  {timeAgo(item.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

};

export default Notification;
