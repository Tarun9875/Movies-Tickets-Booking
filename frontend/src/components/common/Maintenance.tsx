export default function Maintenance() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center">

      <h1 className="text-4xl font-bold text-red-500 mb-4">
        🚧 Site Under Maintenance
      </h1>

      <p className="text-gray-300 text-lg">
        Our booking system is currently under maintenance.
      </p>

      <p className="text-gray-400 mt-2">
        Please come back later.
      </p>

    </div>
  );
}