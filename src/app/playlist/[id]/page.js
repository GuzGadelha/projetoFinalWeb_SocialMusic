'use client';
import { musics, playlists, users, comments } from '@/lib/data';
import { Heart, Share2, MoreHorizontal, Clock, Star } from 'lucide-react';

export default function PlaylistDetail({ params }) {
    const playlistId = params.id;
    const playlist = playlists.find(p => p.id === playlistId);

    if (!playlist) {
        return <div className="text-red-500 mt-10 text-center">Playlist não encontrada!</div>;
    }

    const dono = users.find(u => u.id === playlist.donoId);
    
    // Filtra as músicas da playlist
    const musicasNaPlaylist = musics.filter(m => playlist.musicasIds.includes(m.id));

    const getAvaliacao = = (musicaId) => {
        const avaliacoes = comments.filter(c => c.musicaId === musicaId);
        if (avaliacoes.length === 0) return '-';
        
        const soma = avaliacoes.reduce((sum, c) => sum + (c.avaliacao || 0), 0);
        return `${(soma / avaliacoes.length).toFixed(1)}/5`;
    };

    // Calcula a duração total
    const duracaoTotalSegundos = musicasNaPlaylist.reduce((sum, m) => sum + (m.duracao || 0), 0);
    const duracaoTotalFormatada = `${Math.floor(duracaoTotalSegundos / 60)} min ${duracaoTotalSegundos % 60} seg`;
    
    return (
        <div className="text-white">
            <div className="flex bg-gradient-to-br from-purple-800 to-black p-8 rounded-lg mb-8">
                <div className="w-48 h-48 bg-gray-700 rounded-lg shadow-xl mr-6 flex items-center justify-center text-6xl text-purple-400">
                    <img 
                        src={playlistCoverUrl} 
                        alt="Capa" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <p className="text-sm uppercase text-gray-400 font-semibold">Playlist</p>
                    <h1 className="text-5xl md:text-7xl font-extrabold my-2">{playlist.titulo}</h1>
                    <p className="text-gray-300 mb-4">{playlist.descricao || "Nenhuma descrição fornecida."}</p>
                    <p className="text-sm text-gray-400">Criada por: <span className="text-white font-bold">{dono?.nome || 'Artista'}</span></p>
                    <p className="text-sm text-gray-400">{musicasNaPlaylist.length} músicas • {duracaoTotalFormatada}</p>
                </div>
            </div>

            {/* Ações e Botões */}
            <div className="flex items-center gap-6 mb-8 pl-4">
                <button className="bg-[#6c63ff] text-white px-6 py-2 rounded-full font-bold hover:bg-purple-700 transition">
                    ▶ Play
                </button>
                <Heart size={24} className="text-gray-400 hover:text-red-500 cursor-pointer" />
                <Share2 size={24} className="text-gray-400 hover:text-[#6c63ff] cursor-pointer" />
                <MoreHorizontal size={24} className="text-gray-400 hover:text-white cursor-pointer" />
            </div>

            {/* Tabela de Músicas */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-400">
                    <thead className="text-xs uppercase text-gray-500 border-b border-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">#</th>
                            <th scope="col" className="px-6 py-3">TÍTULO</th>
                            <th scope="col" className="px-6 py-3">ARTISTA</th>
                            <th scope="col" className="px-6 py-3">ÁLBUM</th>
                            <th scope="col" className="px-6 py-3">AVALIAÇÃO</th>
                            <th scope="col" className="px-6 py-3"><Clock size={16} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {musicasNaPlaylist.map((musica, index) => (
                            <tr key={musica.id} className="border-b dark:border-gray-800 hover:bg-[#242526] transition-colors duration-150">
                                <td className="px-6 py-3 font-medium text-gray-300">{index + 1}</td>
                                <td className="px-6 py-3 font-medium text-white flex items-center gap-3">
                                    <img 
                                    src={musica.coverUrl ||'/assets/img/itunes.png'}
                                    alt='Capa'
                                    className='w-10 h-10 rounded object-cover'
                                    />
                                    {musica.titulo}
                                </td>
                                <td className="px-6 py-3">{musica.autor}</td>
                                <td className="px-6 py-3">{musica.album}</td>
                                <td className="px-6 py-3 flex items-center gap-1 mt-2">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" /> 
                                    {getAvaliacao(musica.id)}
                                </td>
                                <td className="px-6 py-3">{Math.floor(musica.duracao / 60)}:{musica.duracao % 60}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}