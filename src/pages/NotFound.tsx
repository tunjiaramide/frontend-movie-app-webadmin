// src/pages/NotFound.jsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-xl text-gray-700">Oops! Page not found</p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-black-500 text-white rounded-lg"
      >
        Go Home
      </a>
    </div>
  );
}
