// pages/room/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { db } from "../../lib/firebase";
import { ref, set, onValue, update, remove } from "firebase/database";

const cards = ["1", "2", "3", "5", "8", "13", "21", "☕️"];

interface User {
  name: string;
  vote: string | null;
}

export default function Room() {
  const router = useRouter();
  const { id, name } = router.query;

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [inputName, setInputName] = useState("");

  const handleNameSubmit = () => {
    if (!inputName.trim()) return;
    router.replace({ pathname: router.pathname, query: { id, name: inputName } });
  };

  useEffect(() => {
    if (!id || !name || typeof id !== "string" || typeof name !== "string") return;

    const roomRef = ref(db, `rooms/${id}`);
    const userRef = ref(db, `rooms/${id}/users/${name}`);
    set(userRef, { name, vote: null });

    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList: User[] = Object.values(data.users || {});
        setUsers(userList);
        setRevealed(!!data.revealed);

        const me = data.users?.[name];
        if (me?.vote) {
          setSelectedCard(me.vote);
        }
      }
    });
  }, [id, name]);

  const handleSelectCard = (card: string) => {
    if (revealed || !id || !name || typeof id !== "string" || typeof name !== "string") return;
    setSelectedCard(card);
    const userRef = ref(db, `rooms/${id}/users/${name}`);
    update(userRef, { vote: card });
  };

  const handleToggleReveal = () => {
    if (!id || typeof id !== "string") return;
    const roomRef = ref(db, `rooms/${id}`);
    update(roomRef, { revealed: !revealed });
  };

  const handleResetVotes = () => {
    if (!id || typeof id !== "string") return;
    users.forEach((user) => {
      const userRef = ref(db, `rooms/${id}/users/${user.name}`);
      update(userRef, { vote: null });
    });
    const roomRef = ref(db, `rooms/${id}`);
    update(roomRef, { revealed: false });
    setSelectedCard(null);
  };

  const handleLeaveRoom = () => {
    if (!id || !name || typeof id !== "string" || typeof name !== "string") return;
    const userRef = ref(db, `rooms/${id}/users/${name}`);
    remove(userRef).then(() => {
      router.push("/");
    });
  };

  const handleNewRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    router.push(`/room/${newRoomId}`);
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/room/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("ルームURLをコピーしました！");
    });
  };

  if (!name || typeof name !== "string") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm text-center">
          <h1 className="text-xl font-bold mb-4">ニックネームを入力してください</h1>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="あなたの名前"
            className="w-full border p-3 rounded mb-4"
          />
          <button
            onClick={handleNameSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            入室する
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Room {id} - Planning Poker</title>
      </Head>
      <header className="w-full bg-white shadow py-4 mb-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Planning Poker</h1>
          <nav className="space-x-2">
            <button onClick={handleNewRoom} className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">新規ルーム</button>
            <button onClick={handleResetVotes} className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">リセット</button>
            <button onClick={handleLeaveRoom} className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">退出</button>
          </nav>
        </div>
      </header>
      <main className="min-h-screen bg-blue-50 px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-2">ルームID: {id}</h2>
        <p className="mb-4">こんにちは、{name} さん</p>

        <div className="mb-6">
          <button onClick={handleCopyUrl} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            ルームURLをコピー
          </button>
        </div>

        <h2 className="text-lg font-semibold mb-4">参加者</h2>
        <ul className="mb-6 space-y-2 max-w-md mx-auto">
          {users.map((user) => (
            <li
              key={user.name}
              className="flex justify-between bg-white rounded p-2 shadow text-left"
            >
              <span className="font-medium">{user.name}</span>
              <span className="text-gray-500">
                {revealed ? user.vote || "?" : user.name === name ? (user.vote ? "✓" : "未投票") : "?"}
              </span>
            </li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mb-4">カードを選んでください</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {cards.map((card) => (
            <button
              key={card}
              onClick={() => handleSelectCard(card)}
              className={`w-16 h-20 rounded-xl border text-xl font-bold shadow-md transition-transform transform hover:scale-105 ${
                selectedCard === card ? "bg-blue-600 text-white scale-110" : "bg-white hover:bg-blue-100"
              }`}
            >
              {card}
            </button>
          ))}
        </div>

        <button
          onClick={handleToggleReveal}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {revealed ? "カードを非表示にする" : "結果を表示する"}
        </button>
      </main>
      <footer className="mt-10 py-6 bg-white text-center text-gray-500 border-t">
        &copy; {new Date().getFullYear()} Planning Poker by Bandai Koki
      </footer>
    </>
  );
}
