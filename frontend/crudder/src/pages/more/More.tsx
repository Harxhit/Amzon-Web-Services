const More = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10">

      <div className="text-5xl mb-4">🤔</div>

      <h1 className="text-2xl font-bold mb-2">More?</h1>

      <p className="text-gray-600 max-w-md">
        You clicked on <span className="font-semibold">More</span> and now you are here,
        staring at this mysterious blank page wondering what comes next.
      </p>

      <p className="mt-4 text-gray-500">
        Spoiler: absolutely nothing.
      </p>

      <p className="text-gray-400 text-sm mt-8 italic">
        Maybe someday this page will have features.<br />
        But today… it just has vibes.
      </p>

    </div>
  );
};

export default More;
