const SideBar = () => {
  return (
    <aside className="flex flex-col h-full p-6 border-r border-gray-200 bg-white">
      <div className="mb-10">
        <img src="/logo.png" alt="Logo" className="w-32" />
      </div>

      <nav className="flex flex-col gap-6">
        <a
          href="/home"
          className="flex items-center gap-4 text-lg font-medium hover:text-blue-600"
        >
          <img src="/icons/home.svg" className="w-6 h-6" />
          <h2>Home</h2>
        </a>

        <a
          href="/notifications"
          className="flex items-center gap-4 text-lg font-medium hover:text-blue-600"
        >
          <img src="/icons/bell.svg" className="w-6 h-6" />
          <h2>Notifications</h2>
        </a>

        <a
          href="/profile"
          className="flex items-center gap-4 text-lg font-medium hover:text-blue-600"
        >
          <img src="/icons/user.svg" className="w-6 h-6" />
          <h2>Profile</h2>
        </a>

        <a
          href="/more"
          className="flex items-center gap-4 text-lg font-medium hover:text-blue-600"
        >
          <img src="/icons/more.svg" className="w-6 h-6" />
          <h2>More</h2>
        </a>
      </nav>

      <div className="mt-auto pt-6">
        <a
          href="/create"
          className="flex items-center gap-4 text-lg font-semibold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          +
          <span>Create</span>
        </a>
      </div>
    </aside>
  );
};

export default SideBar;
