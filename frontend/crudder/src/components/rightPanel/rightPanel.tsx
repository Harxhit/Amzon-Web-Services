import { useAuth } from "../../context/AuthContext";

const RightPanel = () => {

  const {userAuth} = useAuth()
  return (
    <aside className="h-full p-6 border-l border-gray-200 bg-white flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-semibold text-lg">{userAuth.firstName} {userAuth.lastName}</h2>
          <p className="text-sm text-gray-500">@{userAuth.username}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Suggested for you</h3>

        <div className="flex flex-col gap-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/user1.jpg" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-medium">Alex</p>
                <p className="text-sm text-gray-500">@alex123</p>
              </div>
            </div>
            <button className="text-blue-600 font-medium hover:underline">
              Follow
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/user2.jpg" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-medium">Priya</p>
                <p className="text-sm text-gray-500">@priya_21</p>
              </div>
            </div>
            <button className="text-blue-600 font-medium hover:underline">
              Follow
            </button>
          </div>

        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Trending</h3>

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

        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-600 mt-6">
          <a className="hover:text-blue-600 cursor-pointer">About</a>
          <a className="truncate hover:text-blue-600 cursor-pointer">Terms of Service</a>
          <a className="truncate hover:text-blue-600 cursor-pointer">Privacy and Policy</a>
        </div>
      </div>

    </aside>
  );
};

export default RightPanel;
