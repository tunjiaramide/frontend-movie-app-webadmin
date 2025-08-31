import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
        <h1 className="text-3xl font-bold underline">Welcome to Movies</h1>
        <Link to="/dashboard" className="text-blue-500 underline">Go to Dashboard</Link>
    </div>
  )
}
