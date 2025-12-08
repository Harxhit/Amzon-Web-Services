import { toast } from "react-toastify";
import api from "../../api/axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

interface TweetType {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  content: string;
  likeCount: number;
  retweetCount: number;
  replyCount: number;
  isLiked: boolean;
}

const Home = () => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [likeTweet, setLikeTweet] = useState<Record<string, boolean>>({});
  const [tweetLikeCount, setTweetLikeCount] = useState<Record<string, number>>({});
  const [commentText, setCommentText] = useState("");
  const [tweetComments, setTweetComments] = useState<Record<string, any>>({});
  const [openCommentBox, setOpenCommentBox] = useState<Record<string, boolean>>({});
  const [commentCount, setCommentCount] = useState<Record<string,number>>({})
  const [reTweet, setReTweet] = useState<Record<string, any>>({});
  const [openReTweetBox, setOpenReTweetBox] = useState<Record<string, any>>({});
  const [reTweetCount , setReTweetCount] = useState<Record<string,number>>({})
  const [userReTweetId , setUserReTweetId] = useState<Record<string , boolean>>({})
  const { userAuth } = useAuth();

  const randomTweets = async () => {
    const response = await api.get("/tweet/random");
    const usersTweets = response.data?.tweets;

    const tweetsOfUser = usersTweets.map((tweet: any) => ({
      _id: tweet._id,
      username: tweet.username,
      firstName: tweet.firstName,
      lastName: tweet.lastName,
      content: tweet.content,
      likeCount: tweet.likeCount,
      retweetCount: tweet.retweetCount,
      replyCount: tweet.replyCount,
      isLiked: tweet.isLiked
    }));

    setLikeTweet(Object.fromEntries(tweetsOfUser.map((t: any) => [t._id, t.isLiked])));
    setTweets(tweetsOfUser);
  };

  useEffect(() => {
    randomTweets();
  }, []);

  const handleLike = async (tweetId: string) => {
    const isLiked = likeTweet[tweetId];
    let updatedCount: number;

    try {
      if (!isLiked) {
        const response = await api.post(`/tweet/like/${tweetId}`);
        updatedCount = response.data?.tweet?.likeCount;
      } else {
        const response = await api.patch(`/tweet/unlike/${tweetId}`);
        updatedCount = response.data?.tweet?.likeCount;
      }

      setLikeTweet((prev) => ({ ...prev, [tweetId]: !isLiked }));
      setTweetLikeCount((prev) => ({ ...prev, [tweetId]: updatedCount }));
    } catch (error: any) {
      toast(error);
    }
  };

  const opensCommentBox = (tweetId: string) => {
    setOpenCommentBox((prev) => {
      const newState = !prev[tweetId];
      if (newState) showPreviousComments(tweetId);
      return { ...prev, [tweetId]: newState };
    });
  };

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

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const submitComment = async (tweetId: string) => {
    try {
      const response = await api.post(`/tweet/comment/${tweetId}`, { content: commentText });

      const updatedCount:number = response.data?.updatedCount

      const newComment = {
        username: userAuth.username,
        content: commentText,
        createdAt: new Date()
      };

      setTweetComments((prev) => ({
        ...prev,
        [tweetId]: [newComment, ...(prev[tweetId] || [])]
      }));


      setCommentText("");


      setCommentCount((prev) => ({...prev, [tweetId]: updatedCount}))

    } catch (error: any) {
      toast(error);
    }
  };

  const showPreviousComments = async (tweetId: string) => {
    try {
      const response = await api.get(`/tweet/replies/${tweetId}`);
      const commentData = response.data?.comments;

      const mappedComments = commentData.map((c: any) => ({
        username: c.userId.username,
        content: c.content,
        createdAt: c.createdAt
      }));


      setTweetComments((prev) => ({ ...prev, [tweetId]: mappedComments }));
    } catch (error: any) {
      toast(error);
    }
  };

  const toggleTweetBox = async(tweetId: string) => {
    setOpenReTweetBox((prev) => ({
      ...prev,
      [tweetId]: !prev[tweetId]
    }));

    try {
      const response = await api.get(`tweet/getReTweets/${tweetId}`);
  
      const oldReTweets:any = response.data?.reTweets || []

      if (oldReTweets.length === 0) {
        setReTweet(prev => ({ ...prev, [tweetId]: [] }));
        setUserReTweetId(prev => ({ ...prev, [tweetId]: false }));
        return;
      }

      const mappedTweets = oldReTweets.map((r:any) => ({
        id: r._id,
        username: r.author.username, 
        content: r.content, 
        createdAt : r.createdAt, 
        authorId: r.author?._id?.toString()
      }))


      setReTweet((prev) => ({
        ...prev, 
        [tweetId] : mappedTweets
      }))

      const userId = userAuth?.user?._id || userAuth?._id || userAuth?.id;

      const uid:string = userId.toString()

      const hasReTweeted = mappedTweets.some((m:any) => m.authorId === uid); 

      setUserReTweetId(prev => ({...prev, [tweetId]:hasReTweeted}))

    } catch (error:any) {
      console.error(error);
      toast(error)
    }
  };

  const handlesReTweet = async (tweetId: string) => {
    try {
      const response = await api.post(`/tweet/retweet/${tweetId}`);
      const reTweetData = response.data?.reTweet;

      const updatedCount = response.data?.retweetCount; 
      console.log(updatedCount)
      const userId = userAuth?.user?._id || userAuth?._id || userAuth?.id;

      const author = userId.toString()
      const mappedNew = {
        id: reTweetData._id, 
        username: reTweetData.author.username, 
        content: reTweetData.content, 
        createdAt: reTweetData.createdAt, 
        authorId: author
      }

      setReTweet((prev) => ({
        ...prev,
        [tweetId]: [mappedNew , ...(prev[tweetId] || [])]
      }));

      setReTweetCount((prev) => ({...prev, [tweetId]: updatedCount}))

      setUserReTweetId(prev => ({ ...prev, [tweetId]: true }));

    } catch (error: any) {
      toast(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 overflow-hidden">
      <h1 className="text-white text-2xl font-extrabold text-center mb-4">Home</h1>

      <section className="flex flex-col gap-4">
        {tweets.map((tweet) => (
          <div key={tweet._id} className="flex gap-3 p-4 bg-[#161B22] rounded-lg border border-gray-800">
            <img src="/default.png" alt="profile" className="w-12 h-12 rounded-full bg-white" />

            <div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-white">
                  {tweet.firstName} {tweet.lastName}
                </p>
                <p className="text-gray-400 text-sm">@{tweet.username}</p>
              </div>

              <p className="text-gray-200 mt-1 text-sm">{tweet.content}</p>

              <div className="grid grid-cols-3 mt-3 gap-59 p-2">
                <button onClick={() => opensCommentBox(tweet._id)} className="cursor-pointer flex flex-row gap-2">
                  <img src="/comment.png" alt="Comment Icon" />
                  <p className="text-gray-400">{ commentCount[tweet._id] ??tweet.replyCount}</p>
                </button>

                <button onClick={() => toggleTweetBox(tweet._id)} className="cursor-pointer flex flex-row gap-2">
                  <img src="/shuffle.png" alt="" />
                  <p className="text-gray-400">{reTweetCount[tweet._id] ??tweet.retweetCount}</p>
                </button>

                <button onClick={() => handleLike(tweet._id)} className="flex flex-row gap-2 cursor-pointer">
                  <img src={likeTweet[tweet._id] ? "/heart.png" : "/not-heart.png"} alt="Like Icon" />
                  <p className="text-gray-400">{tweetLikeCount[tweet._id] ?? tweet.likeCount}</p>
                </button>
              </div>

              {openCommentBox[tweet._id] && (
                <div className="mt-4 p-3 bg-[#0F1620] rounded-xl border border-gray-800">
                  <input
                    type="text"
                    placeholder="Write a comment"
                    value={commentText}
                    onChange={handleCommentChange}
                    className="w-full p-2 bg-[#161B22] text-white border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  <button
                    onClick={() => submitComment(tweet._id)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Comment
                  </button>

                  <div className="mt-4 flex flex-col gap-3">
                    {(tweetComments[tweet._id] || []).map((comment: any, index: number) => (
                      <div key={index} className="text-sm text-gray-300 bg-[#111827] p-2 rounded-lg">
                        <div className="flex flex-col">
                          <div className="flex flex-row">
                            <span className="font-semibold text-lg text-white">{comment.username}</span>
                            <span className="text-gray500 mt-1 ml-43">{timeAgo(comment.createdAt)}</span>
                          </div>
                          <span className="text-cyan-400">{comment.content}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {openReTweetBox[tweet._id] && (
                <div className="mt-4 p-3 bg-[#0F1620] rounded-xl border border-gray-800">
                  {Array.isArray(reTweet[tweet._id]) && reTweet[tweet._id].length > 0 && (
                    <div className="mb-3 space-y-2">
                      {reTweet[tweet._id].map((r: any) => (
                        <div key={r.id} className="bg-[#111827] p-3 rounded-lg text-gray-200">
                          <div className="flex justify-between">
                            <span className="font-semibold">@{r.username}</span>
                            <span className="text-sm text-gray-400">{timeAgo(r.createdAt)}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-300">{r.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {userReTweetId[tweet._id] ? (
                    <div className="text-green-400 font-semibold">You retweeted this</div>
                  ) : (
                    <div>
                      <p className="text-gray-300 mb-2">Retweet this tweet?</p>
                      <button
                        onClick={() => handlesReTweet(tweet._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Retweet
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
