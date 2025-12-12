'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from '@/components/Modal';
import { users } from '@/lib/data';
import { Upload } from 'lucide-react';
import { createServerParamsForMetadata } from 'next/dist/server/request/params';


 function PlaylistCard({ playlist }){
    const dono = users.find(u => u.id === playlist.donoId);
    const musicasCount = playlist.musicasIds ? playlist.musicasIds.length : 0;

    return (
            <Link href={`/playlist/${playlist.id}`} className="block">
            <div className="bg-white dark:bg-[#242526] p-4 rounded shadow hover:scale-[1.02] transition duration-200 cursor-pointer border-l-4 border-transparent hover:border-[#6c63ff]">
                <h3 className="font-bold text-lg text-[#6c63ff]"> {playlist.titulo} </h3>
                <p className="text-sm text-gray-500">Criado por: {dono?.nome || 'Desconhecido'}</p>
                <p className="text-xs text-gray-400 mt-1">{musicasCount} músicas</p>
                {playlist.privada && <span className="text-xs text-red-400 mt-1"> (Privada) </span>}
            </div>
        </Link>
    );
}

export default function PlaylistsPage() {
    const [playlists, setPlaylists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ titulo: '', descricao: '', privada: false, coverFile: null });

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
                donoId: user.id,
                privada: formData.privada
            }),
        });

        if (res.ok) {
            const novaPlaylist = await res.json();
            setPlaylists([...playlists, novaPlaylist]);
            setFormData({ titulo: '', descricao: '', privada: false, coverFile: null });
            setIsModalOpen(false);
            alert("Playlist criada com sucesso!");
        } else {
            alert('Erro ao criar playlist. Faça o login primeiro.');
        }
    };

    const handleCoverChange = (e) => {
        if (e.target.files.length > 0) {
            setFormData({ ...formData, coverFile: e.target.files[0] });
        }
    };

    return (
        <div className="relative min-h-[80vh]">
            <h1 className="text-3xl font-bold mb-6">Minhas Playlists</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {playlists.map((p, index) => (
                    <PlaylistCard key={p.id || index} playlist={p} />
                ))}
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

                    <div className="flex justify-center mb-4">
                        <label htmlFor="cover-upload" className="w-48 h-48 bg-gray-700 dark:bg-gray-800 rounded-lg shadow-xl cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition">
                            {formData.coverFile ? (
                                <span className="text-sm p-4 text-center">Arquivo selecionado: {formData.coverFile.name}</span>
                            ) : (
                                <>
                                    <Upload size={32} />
                                    <span className="mt-2 text-sm">Carregar Foto da Capa</span>
                                </>
                            )}
                            <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                        </label>
                    </div>

                    <input 
                        className="p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                        type="text"
                        placeholder="Título (Obrigatório)"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        required
                    />

                    <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded">
                        <div>
                            <p className="font-semibold dark:text-white">Playlist Privada</p>
                            <p className="text-xs text-gray-500">Apenas você verá esta playlist.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={formData.privada}
                                onChange={(e) => setFormData({ ...formData, privada: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#6c63ff]"></div>
                        </label>
                    </div>

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