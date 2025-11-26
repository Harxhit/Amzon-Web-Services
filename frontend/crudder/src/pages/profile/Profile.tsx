import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { useEffect , useState} from "react";

interface ProfileTweet {
  content: string;
  createdAt: string;
  replyCount: number;
  like: number;
  reTweetCount: number;
}

const ProfilePage = () => {

  const {userAuth} = useAuth()
  const [allTweet,setTweet] = useState<ProfileTweet[]>([])


  const userTweets  = async() => {
    const response = await api.get("/tweet/all")

    const rawTweets = response.data?.tweets?.userTweets || [];
    
    const userAllTweets = rawTweets.map((tweet:any) => ({
      content : tweet.content,
      createdAt: tweet.createdAt,
      like: tweet.likeCount,
      replyCount: tweet.replyCount,
      reTweetCount : tweet.retweetCount
    }))

    setTweet(userAllTweets)
  }

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo`;

    const years = Math.floor(days / 365);
    return `${years}y`;
  };


  useEffect(() => {
    userTweets()
  },[])

  return (
    <div className="max-w-2xl mx-auto py-6 bg-yellow-100 rounded-2xl">
      <div className="px-4 relative">
        
        <div className="flex justify-between items-center mt-2">
          <div>
            <h2 className="text-xl font-bold">{userAuth.firstName} {userAuth.lastName}</h2>
            <p className="text-gray-500">@{userAuth.username}</p>
          </div>

          <button className="px-4 py-1 rounded-full border hover:bg-gray-100">
            Edit Profile
          </button>
        </div>

        <p className="mt-2 text-gray-700">
          This is a sample bio. UI only, no functionality.
        </p>

        <div className="flex gap-4 text-sm text-gray-500 mt-2">
          <span>📍 India</span>
          <span>🔗 website.com</span>
          <span>📅 {timeAgo(userAuth.createdAt)}</span>
        </div>

        <div className="flex gap-6 mt-3 text-sm">
          <span>
            <span className="font-semibold">{}</span> Following
          </span>
          <span>
            <span className="font-semibold">{}</span> Followers
          </span>
        </div>
      </div>

      <div className="mt-6 border-b flex text-center">
        <button className="flex-1 py-3 hover:bg-gray-200 font-medium border-b-2 border-black">
          Tweets
        </button>
        <button className="flex-1 py-3 hover:bg-gray-200">Replies</button>
        <button className="flex-1 py-3 hover:bg-gray-200">Media</button>
      </div>

      <div className="mt-4 space-y-4">
        {allTweet.map((tweet, index) => (
          <div className="flex gap-3 p-3 border-b" key={index}>
          <img src="/default.png" className="w-10 h-10 rounded-full" />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{userAuth.firstName} {userAuth.lastName}</span>
              <span className="text-gray-500">@{userAuth.username} · {timeAgo(tweet.createdAt)}</span>
            </div>

            <p className="text-gray-800">
              {tweet.content}
            </p>

            <div className="flex gap-6 text-gray-500 text-sm mt-2">
              <span>💬 {tweet.replyCount}</span>
              <span>❤️ {tweet.like}</span>
              <span>🔁 {tweet.reTweetCount}</span>
            </div>
          </div>
        </div>
    ))}
      </div>
    </div>
  );
};

export default ProfilePage;
