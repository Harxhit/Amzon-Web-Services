import { NavLink } from "react-router-dom";

const SideBar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 text-lg font-medium 
     hover:text-blue-600 transition 
     ${isActive ? "text-blue-600 font-semibold" : "text-white"}`;

  return (
    <aside className="flex flex-col h-full p-6 border-r border-black bg-[#151B23]">
      
      <div className="mb-10">
        <img src="/logo.png" alt="Logo" className="w-32" />
      </div>

      <nav className="flex flex-col gap-6">
        <NavLink to="/home" className={linkClass}>
          <img src="/home.png" className="w-6 h-6" />
          <h2>Home</h2>
        </NavLink>

        <NavLink to="/notifications" className={linkClass}>
          <img src="/bell.png" className="w-6 h-6" />
          <h2>Notifications</h2>
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          <img src="/user.png" className="w-6 h-6" />
          <h2>Profile</h2>
        </NavLink>

        <NavLink to="/more" className={linkClass}>
          <img src="/apps.png" className="w-6 h-6" />
          <h2>More</h2>
        </NavLink>
      </nav>

      <div className="mt-auto pt-6">
        <NavLink
          to="/create"
          className="flex items-center gap-4 text-lg font-semibold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          +
          <span>Create</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default SideBar;
