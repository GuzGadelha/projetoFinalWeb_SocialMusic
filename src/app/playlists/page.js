'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from '@/components/Modal';
import { playlists, users } from '@/lib/data';


function PlaylistCard({ playlist}) {
  const dono = users.find(u => u.id === playlist.donoId);
    
    return (
        <Link href={`/playlist/${playlist.id}`} className="block">
            <div className="bg-white dark:bg-[#242526] p-4 rounded shadow hover:scale-[1.02] transition duration-200 cursor-pointer border-l-4 border-transparent hover:border-[#6c63ff]">
                <h3 className="font-bold text-lg text-[#6c63ff]">{playlist.titulo}</h3>
                <p className="text-sm text-gray-500">Criado por: {dono?.nome || 'Desconhecido'}</p>
                <p className="text-xs text-gray-400 mt-1">{playlist.musicasIds.length} músicas</p>
            </div>
        </Link>
    );
}

export default function PlaylistsPage() {
    const [playlists, setPlaylists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ titulo: '', descricao: '' });

    //  Carregar as playlists existentes
    useEffect(() =>  {
      fetch('/api/playlists').then(res => res.json()).then(setPlaylists);
    }, []);

    //  Criar a nova playlist
    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user')) || users[0]; // Pega o usuário logado ou o primeiro de teste
        
        if (!formData.titulo) return alert("O título é obrigatório!");

        const res = await fetch('/api/playlists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                titulo: formData.titulo, 
                descricao: formData.descricao,
                donoId: user.id
            }),
        });

        if (res.ok) {
            const novaPlaylist = await res.json();
            setPlaylists([...playlists, novaPlaylist]);
            setFormData({ titulo: '', descricao: '' });
            setIsModalOpen(false);
            alert("Playlist criada com sucesso!");
        } else {
            alert('Erro ao criar playlist. Faça o login primeiro.');
        }
    };

    return (
        <div className="relative min-h-[80vh]">
            <h1 className="text-3xl font-bold mb-6">Minhas Playlists</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {playlists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
            </div>

            {/* Botão Flutuante */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-10 right-10 bg-[#6c63ff] text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-2xl hover:scale-105 transition-transform"
                title="Criar nova Playlist"
            >
                +
            </button>

            {/* Modal para Criação */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Playlist">
                <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
                    <input 
                        className="p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                        type="text"
                        placeholder="Título (Obrigatório)"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        required
                    />
                    <textarea 
                        className="p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                        placeholder="Descrição (Opcional)"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    />
                    <button type="submit" className="bg-[#6c63ff] text-white p-3 rounded font-bold hover:opacity-90">
                        Criar Playlist
                    </button>
                </form>
            </Modal>
        </div>
    );
}