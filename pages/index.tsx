// pages/index.tsx（ルーム作成 UI）
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleCreateRoom = () => {
    if (!name.trim()) return;
    const roomId = Math.random().toString(36).substring(2, 8);
    router.push(`/room/${roomId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <>
      <Head>
        <title>Planning Poker - ルーム作成</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">プランニングポーカーへようこそ</h1>
          <p className="mb-4 text-gray-600">ニックネームを入力してルームを作成しましょう</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ニックネーム"
            className="w-full border p-3 rounded mb-4"
          />
          <button
            onClick={handleCreateRoom}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            ルームを作成して参加する
          </button>
        </div>
      </main>
    </>
  );
}
