'use client';
import { playlists, users } from '@/lib/data';

export default function PlaylistsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Playlists da Galera</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {playlists.map(p => (
          <div key={p.id} className="bg-white dark:bg-[#242526] p-4 rounded shadow hover:scale-105 transition">
            <h3 className="font-bold text-lg">{p.titulo}</h3>
            <p className="text-sm text-gray-500">Criado por: {users.find(u => u.id === p.donoId)?.nome}</p>
          </div>
        ))}
      </div>
    </div>
  );
}