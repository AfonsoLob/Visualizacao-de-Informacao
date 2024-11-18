const Base = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="mb-4">
          <label className="block mb-2">Filter 1</label>
          <input type="text" className="w-full p-2 rounded bg-gray-700 border border-gray-600" />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Filter 2</label>
          <input type="text" className="w-full p-2 rounded bg-gray-700 border border-gray-600" />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Filter 3</label>
          <input type="text" className="w-full p-2 rounded bg-gray-700 border border-gray-600" />
        </div>
        {/* Add more filters as needed */}
      </div>
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default Base;