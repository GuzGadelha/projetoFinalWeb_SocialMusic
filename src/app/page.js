'use client';
import { useState } from 'react';
import { comments, users, musics } from '@/lib/data';

export default function Home() {
  const [feed] = useState(comments);
  const getAutor = (id) => users.find(u => u.id === id)?.nome || "Anônimo";
  const getMusica = (id) => musics.find(m => m.id === id)?.titulo || "Música removida";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Feed Social</h1>
      {feed.map(post => (
        <div key={post.id} className="bg-white dark:bg-[#242526] p-6 rounded-xl shadow-sm mb-4">
          <h4 className="font-bold text-[#6c63ff]">{getAutor(post.autorId)}</h4>
          <p className="text-sm text-gray-400 mb-2">Avaliou: {getMusica(post.musicaId)} ({post.avaliacao}/5 ⭐)</p>
          <p>{post.conteudo}</p>
        </div>
      ))}
    </div>
  );
}