const Message = () => {
  return (
    <div className="flex items-start gap-3 p-4 bg-[#1E293B] rounded-xl shadow-md max-w-md">
      <div className="w-10 h-10 rounded-full bg-gray-500"></div>

      <div className="flex-1">
        <p className="text-white text-sm">
          <span className="font-semibold">John Doe</span>{" "}
          <span className="text-gray-300">@johndoe</span>
        </p>

        <p className="text-gray-200 mt-1">
          This is a fake message used for testing your UI components.
        </p>

        <span className="text-xs text-gray-400 mt-2 block">2h ago</span>
      </div>
    </div>
  );
};

export default Message;
