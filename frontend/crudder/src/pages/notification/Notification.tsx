const notifications = [
  {
    id: 1,
    type: "like",
    message: "John Doe liked your tweet",
    time: "2h ago",
  },
  {
    id: 2,
    type: "comment",
    message: "Aman commented on your tweet",
    time: "5h ago",
  },
  {
    id: 3,
    type: "follow",
    message: "Priya started following you",
    time: "1d ago",
  },
];

const Notification = () => {
  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      <div className="flex flex-col gap-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-[#1E293B] text-white p-4 rounded-xl shadow-md"
          >
            <div className="flex flex-col">
              <span className="font-medium">{item.message}</span>
              <span className="text-sm text-gray-400">{item.time}</span>
            </div>

            <div>
              {item.type === "like" && <span>❤️</span>}
              {item.type === "comment" && <span>💬</span>}
              {item.type === "follow" && <span>⭐</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
