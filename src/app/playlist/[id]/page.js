'use client';
import { useParams } from 'next/navigation';
import { musics, playlists, users, comments } from '@/lib/data';
import { Heart, Share2, MoreHorizontal, Clock, Star } from 'lucide-react'; 
import { useState, useEffect } from 'react';

export default function PlaylistDetail() {
    const params = useParams();
    const playlistId = params.id;

    // ESTADOS PARA INTERAÇÃO
    const [isLiked, setIsLiked] = useState(false);

    // 1. Lógica para carregar se já foi curtida (Persistência via LocalStorage)
    useEffect(() => {
        const curtidasSalvas = JSON.parse(localStorage.getItem('playlistsFavoritas') || '[]');
        if (curtidasSalvas.includes(playlistId)) {
            setIsLiked(true);
        }
    }, [playlistId]);

    // 2. Busca de dados básicos
    const playlist = playlists.find(p => p.id === playlistId);

    if (!playlist) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-red-500 text-2xl font-bold mb-2">Playlist não encontrada!</h2>
                <p className="text-gray-400">Verifique se o ID "{playlistId}" está correto.</p>
            </div>
        );
    }

    const dono = users.find(u => u.id === playlist.donoId);
    const listaIds = playlist.musicasIds || [];
    const musicasNaPlaylist = musics.filter(m => listaIds.includes(m.id));

    // Cálculos de Média e Duração
    const getAvaliacao = (musicaId) => {
        const avaliacoes = comments.filter(c => c.musicaId === musicaId);
        if (avaliacoes.length === 0) return '-';
        const soma = avaliacoes.reduce((sum, c) => sum + (c.avaliacao || 0), 0);
        return `${(soma / avaliacoes.length).toFixed(1)}/5`;
    };

    const duracaoTotalSegundos = musicasNaPlaylist.reduce((sum, m) => sum + (m.duracao || 0), 0);
    const duracaoTotalFormatada = `${Math.floor(duracaoTotalSegundos / 60)} min ${(duracaoTotalSegundos % 60).toString().padStart(2, '0')} seg`;
    const playlistCoverUrl = musicasNaPlaylist[0]?.coverUrl || '/assets/img/itunes.png'; // Fallback se não tiver música

    // Função do Coração (Salva no LocalStorage para a página de Favoritas usar depois)
    const toggleLike = () => {
        const curtidasAtuais = JSON.parse(localStorage.getItem('playlistsFavoritas') || '[]');
        let novasCurtidas;

        if (isLiked) {
            // Se já curtiu, remove da lista
            novasCurtidas = curtidasAtuais.filter(id => id !== playlistId);
        } else {
            // Se não curtiu, adiciona na lista
            novasCurtidas = [...curtidasAtuais, playlistId];
        }

        localStorage.setItem('playlistsFavoritas', JSON.stringify(novasCurtidas));
        setIsLiked(!isLiked);
    };

    // Função de Compartilhar (Copia o Link)
    const handleShare = () => {
        const linkAtual = window.location.href;
        navigator.clipboard.writeText(linkAtual)
            .then(() => alert("Link copiado para a área de transferência!"))
            .catch(() => alert("Erro ao copiar link."));
    };

    return (
        <div className="text-white pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end bg-gradient-to-b from-purple-900/50 to-black/50 p-8 rounded-t-2xl mb-6">
                <div className="w-52 h-52 shadow-2xl mr-6 mb-4 md:mb-0 shrink-0 bg-gray-800 rounded flex items-center justify-center overflow-hidden">
                    <img 
                        src={playlistCoverUrl} 
                        alt={`Capa de ${playlist.titulo}`} 
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="flex flex-col gap-2 text-center md:text-left">
                    <span className="text-xs uppercase font-bold tracking-wider text-gray-300">Playlist</span>
                    <h1 className="text-4xl md:text-7xl font-black text-white drop-shadow-md">{playlist.titulo}</h1>
                    <p className="text-gray-400 text-sm mt-2">{playlist.descricao || "Sem descrição."}</p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-300 mt-2 font-medium">
                        <span className="text-white font-bold">{dono?.nome || 'Usuário'}</span>
                        <span>•</span>
                        <span>{musicasNaPlaylist.length} músicas,</span>
                        <span className="text-gray-400 font-normal">{duracaoTotalFormatada}</span>
                    </div>
                </div>
            </div>

            {/* BARRA DE AÇÕES (MODIFICADA) */}
            <div className="flex items-center justify-center md:justify-start gap-6 px-6 mb-8">
                
                {/* BOTÃO CORAÇÃO (Like) */}
                <button onClick={toggleLike} title={isLiked ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
                    <Heart 
                        size={32} 
                        className={`transition cursor-pointer ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-white"}`} 
                    />
                </button>

                {/* BOTÃO SHARE (Copiar Link) */}
                <button onClick={handleShare} title="Copiar Link">
                    <Share2 size={28} className="text-gray-400 hover:text-[#6c63ff] cursor-pointer transition" />
                </button>

                {/* BOTÃO MAIS (Sem função por enquanto) */}
                <MoreHorizontal size={28} className="text-gray-400 hover:text-white cursor-pointer transition" />
            </div>

            {/* Tabela de Músicas */}
            <div className="px-6">
                {musicasNaPlaylist.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">Esta playlist ainda não tem músicas.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400 border-collapse">
                            <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-center w-12">#</th>
                                    <th className="px-4 py-3">Título</th>
                                    <th className="px-4 py-3">Álbum</th>
                                    <th className="px-4 py-3">Avaliação</th>
                                    <th className="px-4 py-3 text-right"><Clock size={16} className="inline"/></th>
                                </tr>
                            </thead>
                            <tbody>
                                {musicasNaPlaylist.map((musica, index) => (
                                    <tr key={musica.id} className="group hover:bg-white/10 rounded-md transition-colors">
                                        <td className="px-4 py-3 text-center align-middle rounded-l-md">
                                            <span className="group-hover:hidden">{index + 1}</span>
                                            <span className="hidden group-hover:inline text-white">▶</span>
                                        </td>
                                        <td className="px-4 py-3 align-middle">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={musica.coverUrl || '/assets/img/itunes.png'} 
                                                    alt="Capa" 
                                                    className="w-10 h-10 rounded object-cover"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium text-base hover:underline cursor-pointer">{musica.titulo}</span>
                                                    <span className="text-gray-400 text-xs hover:underline cursor-pointer hover:text-white">{musica.autor}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 align-middle hover:text-white cursor-pointer">{musica.album}</td>
                                        <td className="px-4 py-3 align-middle">
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className={getAvaliacao(musica.id) !== '-' ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                                                <span className={getAvaliacao(musica.id) !== '-' ? "text-white" : ""}>{getAvaliacao(musica.id)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right align-middle rounded-r-md font-mono">
                                            {Math.floor(musica.duracao / 60)}:{(musica.duracao % 60).toString().padStart(2, '0')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}