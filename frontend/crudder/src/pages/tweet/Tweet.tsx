import React, { useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const Tweet = () => {
  const [tweet, setTweet] = useState({ content: "" });
  const [error, setError] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet({ content: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/tweet/create", {
        content: tweet.content,
      });

      setTweet({ content: "" });
      setError([]);

      const successMessage = response.data?.message;
      if (successMessage) {
        toast(successMessage);
      }
    } catch (err: any) {
      const errors = err?.response?.data?.error?.erros || [];
      setError(errors);

      const generalError = err?.response?.data?.message;
      if (generalError) {
        toast(generalError);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-4 rounded-xl shadow flex gap-4">
      <img src="/default.png" className="w-10 h-10 rounded-full" alt="User" />

      <div className="flex-1">
        <textarea
          name="content"
          placeholder="What is happening?!"
          className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-blue-200"
          rows={3}
          value={tweet.content}
          onChange={handleChange}
        />

        {error.length > 0 &&
          error.map((msg: string, index: number) => (
            <p key={index} className="text-red-500 text-sm mt-1">
              {msg}
            </p>
          ))}

        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-500 text-sm">
            {tweet.content.length} / 280
          </span>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            onClick={handleSubmit}
            disabled={tweet.content.length === 0}
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
