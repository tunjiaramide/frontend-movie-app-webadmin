import { useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

export default function UploadMovie() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);

  const uploadFileWithProgress = (url: string, file: File, onProgress: (percent: number) => void) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });
      xhr.onload = () => (xhr.status === 200 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(file);
    });
  };

  const handleUpload = async () => {
    if (!title || !videoFile || !thumbnailFile) {
      alert("Please fill all fields and select files");
      return;
    }

    setLoading(true);
    setVideoProgress(0);
    setThumbnailProgress(0);

    try {
      const uploadRes = await fetch(`${API_BASE}/upload-urls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoFileName: videoFile.name,
          thumbnailFileName: thumbnailFile.name,
        }),
      });

      const { videoUploadUrl, thumbnailUploadUrl, videoKey, thumbnailKey } = await uploadRes.json();

      await Promise.all([
        uploadFileWithProgress(videoUploadUrl, videoFile, setVideoProgress),
        uploadFileWithProgress(thumbnailUploadUrl, thumbnailFile, setThumbnailProgress),
      ]);

      await fetch(`${API_BASE}/movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          videoUrl: videoKey,
          thumbnailUrl: thumbnailKey,
          metadata: { genre, year: year || undefined },
        }),
      });

      setTitle("");
      setGenre("");
      setYear("");
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoProgress(0);
      setThumbnailProgress(0);
      alert("Movie uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Movie</h1>

            <div className="space-y-4">
            <input
                type="text"
                placeholder="Movie title"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setGenre(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setYear(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div>
                <label className="block mb-1 font-medium text-gray-700">Select Video</label>
                <input
                type="file"
                accept="video/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setVideoFile(e.target.files?.[0] || null)}
                className="w-full"
                />
                {videoProgress > 0 && (
                <div className="w-full bg-gray-200 rounded h-3 mt-2">
                    <div className="bg-blue-500 h-3 rounded" style={{ width: `${videoProgress}%` }} />
                </div>
                )}
            </div>

            <div>
                <label className="block mb-1 font-medium text-gray-700">Select Thumbnail Image</label>
                <input
                type="file"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setThumbnailFile(e.target.files?.[0] || null)}
                className="w-full"
                />
                {thumbnailProgress > 0 && (
                <div className="w-full bg-gray-200 rounded h-3 mt-2">
                    <div className="bg-green-500 h-3 rounded" style={{ width: `${thumbnailProgress}%` }} />
                </div>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
                {loading ? "Uploading..." : "Upload Movie"}
            </button>
                <p>OR</p>
                <Link to="/dashboard" className="text-blue-500 underline">Go to Dashboard</Link>
            </div>
        </div>
    </div>

  );
}
