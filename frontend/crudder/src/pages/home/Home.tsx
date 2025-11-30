import api from "../../api/axios";
import { useState, useEffect } from "react";

interface TweetType {
  _id: string;         
  firstName: string;
  lastName: string;
  username: string;
  content: string;
}

const Home = () => {
  const [tweets, setTweets] = useState<TweetType[]>([]);

  const randomTweets = async () => {
    const response = await api.get("/tweet/random");

    const usersTweets = response.data?.tweet?.tweets;

    const tweetsOfUser = usersTweets.map((tweet: any) => ({
      _id: tweet.userId,             
      username: tweet.username,
      firstName: tweet.firstName,
      lastName: tweet.lastName,
      content: tweet.content,
    }));

    setTweets(tweetsOfUser);
  };

  useEffect(() => {
    randomTweets();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 overflow-hidden">
      <h1 className="text-white text-2xl font-extrabold text-center mb-4">
        Home
      </h1>

      <section className="flex flex-col gap-4">
        {tweets.map((tweet) => (
          <div
            key={tweet._id}  
            className="flex gap-3 p-4 bg-[#161B22] rounded-lg border border-gray-800"
          >
            <img
              src="/default.png"
              alt="profile"
              className="w-12 h-12 rounded-full bg-white"
            />

            <div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-white">
                  {tweet.firstName} {tweet.lastName}
                </p>
                <p className="text-gray-400 text-sm">@{tweet.username}</p>
              </div>

              <p className="text-gray-200 mt-1 text-sm">{tweet.content}</p>

              <div className="grid grid-cols-4 mt-3 gap-50 p-2">
                <a href="">
                  <img src="/comment.png" alt="Comment Icon" />
                </a>
                <a href="">
                  <img src="/shuffle.png" alt="" />
                </a>
                <a href="">
                  <img src="/not-heart.png" alt="Like Icon" />
                </a>
                <a href="">
                  <img src="/upload.png" alt="Upload icon" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
