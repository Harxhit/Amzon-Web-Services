import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../../api/axios";

interface TweeterUser {
  firstName: string;
  username: string;
}

const RightPanel = () => {
  const [user, setUser] = useState<TweeterUser[]>([]);

  const registeredUser = async () => {
    const response = await api.get("/users/tweet");

    const users: Array<{
      firstName: string;
      username: string;
    }> = response.data?.data?.users;

    const mappedUser = users.map((u) => ({
      firstName: u.firstName,
      username: u.username,
    }));

    setUser(mappedUser);
  };

  useEffect(() => {
    registeredUser();
  }, []);

  const defaultUserImage = "/default.png";
  const { userAuth } = useAuth();

  return (
    <aside className="h-full p-6 border-l border-black bg-[#151B23] flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-semibold text-lg text-white">
            {userAuth.firstName} {userAuth.lastName}
          </h2>
          <p className="text-sm text-gray-500">@{userAuth.username}</p>
        </div>
      </div>

      <div className="bg-black p-4 pl-5 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 text-white">Suggested for you</h3>

        {user.map((u, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center gap-3">
                <img
                  src={defaultUserImage}
                  className="w-10 h-10 rounded-full bg-white"
                />
                <div>
                  <p className="font-medium text-white">{u.firstName}</p>
                  <p className="text-sm text-gray-500">@{u.username}</p>
                </div>
              </div>
              <button className="text-blue-600 font-medium hover:underline">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black rounded-2xl pr-4 pl-4 pb-1 pt-1">
        <h3 className="text-lg font-semibold mb-4 text-white text-center">
          Trending
        </h3>

        <div className="flex flex-col gap-3">
          <div className="text-sm text-gray-700">
            #javascript
            <p className="text-xs text-gray-500">120K posts</p>
          </div>
          <div className="text-sm text-gray-700">
            #react
            <p className="text-xs text-gray-500">85K posts</p>
          </div>
          <div className="text-sm text-gray-700">
            #devlife
            <p className="text-xs text-gray-500">50K posts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 rounded-lg text-sm text-black">
        <a className="hover:text-blue-600 cursor-pointer">About</a>
        <a className="truncate hover:text-blue-600 cursor-pointer">
          Terms of Service
        </a>
        <a className="truncate hover:text-blue-600 cursor-pointer">
          Privacy and Policy
        </a>
      </div>
    </aside>
  );
};

export default RightPanel;
