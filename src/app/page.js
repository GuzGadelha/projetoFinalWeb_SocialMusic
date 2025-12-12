'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { musics, playlists, users } from '@/lib/data';
import { Search, Play, Disc, Music, Globe, X, Heart, ListPlus, Share2, Plus, Check, ChevronLeft } from 'lucide-react';

export default function FeedPage() {
  const usuarioLogado = users[0]; 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineMusics, setOnlineMusics] = useState([]); 
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);

  // Filtros locais
  const musicasLocais = musics.filter(m => 
    m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.autor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playlistsLocais = playlists.filter(p => 
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Busca iTunes
  useEffect(() => {
    if (searchTerm.length < 3) {
        setOnlineMusics([]);
        return;
    }

    const delayDebounceFn = setTimeout(async () => {
        setIsSearchingOnline(true);
        try {
            const res = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&media=music&limit=6`);
            const data = await res.json();

            const musicasFormatadas = data.results.map(item => ({
                id: item.trackId.toString(),
                titulo: item.trackName,
                autor: item.artistName,
                album: item.collectionName,
                coverUrl: item.artworkUrl100.replace('100x100', '400x400'),
                previewUrl: item.previewUrl,
                duracao: Math.floor(item.trackTimeMillis / 1000) // Adiciona duração para a tabela funcionar
            }));

            setOnlineMusics(musicasFormatadas);
        } catch (error) {
            console.error("Erro na busca externa:", error);
        } finally {
            setIsSearchingOnline(false);
        }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const isSearching = searchTerm.length > 0;

  return (
    <div className="p-6 text-white min-h-screen pb-24 relative">
      
      {/* Header */}
      <div className="mb-8 sticky top-0 bg-[#121212]/95 backdrop-blur-md z-20 py-4 -mx-6 px-6 border-b border-white/5">
        {!isSearching && (
            <h1 className="text-3xl font-bold mb-4 animate-fade-in">
            Olá, <span className="text-[#6c63ff]">{usuarioLogado?.nome.split(' ')[0]}</span>
            </h1>
        )}
        
        <div className="relative group z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#6c63ff] transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-full leading-5 bg-[#242526] text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] sm:text-sm transition-all shadow-lg"
            placeholder="Pesquise artistas, músicas ou playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isSearchingOnline && (
            <div className="absolute right-4 top-4">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#6c63ff]"></div>
            </div>
          )}
        </div>
      </div>

      {/* Resultados */}
      {isSearching ? (
        <div className="space-y-8 animate-fade-in">
          {/* Músicas Locais */}
          {musicasLocais.length > 0 && (
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Music className="text-[#6c63ff]" /> Músicas Locais
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {musicasLocais.map(music => (
                        <MusicCard key={music.id} music={music} onClick={() => setSelectedMusic(music)} />
                    ))}
                </div>
            </div>
          )}

          {/* Músicas Online */}
          {onlineMusics.length > 0 && (
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 mt-8 text-green-400">
                <Globe /> Resultados Globais
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {onlineMusics.map(music => (
                        <MusicCard key={music.id} music={music} isOnline onClick={() => setSelectedMusic(music)} />
                    ))}
                </div>
            </div>
          )}

          {/* Playlists */}
          {playlistsLocais.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 mt-8">
                <Disc className="text-[#6c63ff]" /> Playlists
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {playlistsLocais.map(p => (
                        <Link key={p.id} href={`/playlist/${p.id}`} className="block">
                            <div className="bg-[#242526] p-4 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-[#6c63ff]/30">
                                <h3 className="font-bold">{p.titulo}</h3>
                                <p className="text-xs text-gray-400">{p.descricao || 'Sem descrição'}</p>
                            </div>
                        </Link>
                    ))}
                </div>
              </div>
          )}
             
          {/* Vazio */}
          {musicasLocais.length === 0 && onlineMusics.length === 0 && playlistsLocais.length === 0 && !isSearchingOnline && (
              <div className="text-center py-20 text-gray-500">
                  <p>Nenhum resultado encontrado para "{searchTerm}".</p>
              </div>
          )}
        </div>
      ) : (
        /* Feed Padrão */
        <div className="space-y-10 animate-fade-in">
          <section>
            <h2 className="text-xl font-bold mb-4 text-gray-200">Recomendado para você</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {playlists.slice(0, 3).map(playlist => (
                <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                  <div className="bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition cursor-pointer group shadow-md hover:shadow-xl border border-transparent hover:border-white/5">
                    <div className="aspect-square bg-gray-800 rounded-lg mb-4 shadow-inner overflow-hidden relative group-hover:shadow-2xl transition">
                       <div className="w-full h-full bg-gradient-to-t from-gray-900 to-gray-700 flex items-center justify-center text-gray-500">
                          <Music size={40} className="group-hover:scale-110 transition duration-500"/>
                       </div>
                    </div>
                    <h3 className="font-bold truncate text-lg">{playlist.titulo}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{playlist.descricao || "Playlist recomendada"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {selectedMusic && (
        <MusicModal music={selectedMusic} onClose={() => setSelectedMusic(null)} />
      )}
    </div>
  );
}

// --- MODAL ---
function MusicModal({ music, onClose }) {
    const [liked, setLiked] = useState(false);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState('');

    const handleShare = () => {
        const link = `${window.location.origin}/music/${music.id}`;
        navigator.clipboard.writeText(link);
        alert('Link da música copiado!');
    };

    // CORREÇÃO AQUI: Salvar a música na memória antes de adicionar na playlist
    const ensureMusicExistsLocally = () => {
        const existe = musics.find(m => m.id === music.id);
        if (!existe) {
            musics.push(music); // SALVA A MÚSICA DA WEB NA LISTA LOCAL
        }
    };

    const handleAddToPlaylist = (playlist) => {
        ensureMusicExistsLocally(); // Garante que a música existe
        
        if (!playlist.musicasIds.includes(music.id)) {
            playlist.musicasIds.push(music.id);
            setFeedbackMsg(`Adicionada a "${playlist.titulo}"!`);
            setTimeout(() => {
                setFeedbackMsg('');
                setShowPlaylists(false);
            }, 1500);
        } else {
            setFeedbackMsg(`Já está em "${playlist.titulo}"`);
        }
    };

    const handleCreatePlaylist = (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;

        ensureMusicExistsLocally(); // Garante que a música existe

        const novaPlaylist = {
            id: Date.now().toString(),
            titulo: newPlaylistName,
            descricao: "Criada via Feed",
            donoId: users[0].id,
            musicasIds: [music.id],
            privada: false
        };

        playlists.push(novaPlaylist);
        
        setNewPlaylistName('');
        setFeedbackMsg(`Playlist "${novaPlaylist.titulo}" criada!`);
        setTimeout(() => {
            setFeedbackMsg('');
            setShowPlaylists(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1e1e1e] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-white/10 relative">
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/40 rounded-full text-white hover:bg-white/20 transition"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col max-h-[85vh] overflow-y-auto">
                    
                    {!showPlaylists && (
                        <div className="relative h-64 w-full shrink-0">
                            <img src={music.coverUrl} alt={music.titulo} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1e1e1e] via-[#1e1e1e]/80 to-transparent p-6 pt-20">
                                <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{music.titulo}</h2>
                                <p className="text-lg text-gray-300 font-medium">{music.autor}</p>
                            </div>
                        </div>
                    )}

                    <div className="p-6 pt-0 mt-6">
                        {showPlaylists ? (
                            <div className="animate-fade-in">
                                <div className="flex items-center gap-2 mb-4">
                                    <button onClick={() => setShowPlaylists(false)} className="text-gray-400 hover:text-white">
                                        <ChevronLeft />
                                    </button>
                                    <h3 className="text-xl font-bold">Adicionar à Playlist</h3>
                                </div>
                                {feedbackMsg && (
                                    <div className="mb-4 p-3 bg-green-900/50 text-green-300 rounded-lg text-center text-sm font-medium border border-green-500/30">
                                        {feedbackMsg}
                                    </div>
                                )}
                                <form onSubmit={handleCreatePlaylist} className="mb-6">
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Criar Nova</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#6c63ff] outline-none"
                                            placeholder="Nome..."
                                            value={newPlaylistName}
                                            onChange={(e) => setNewPlaylistName(e.target.value)}
                                        />
                                        <button type="submit" className="bg-[#6c63ff] p-2 rounded-lg hover:bg-[#5a52d5] transition">
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </form>
                                <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Minhas Playlists</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {playlists.map(playlist => (
                                        <button 
                                            key={playlist.id}
                                            onClick={() => handleAddToPlaylist(playlist)}
                                            className="w-full text-left p-3 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] transition flex items-center justify-between group"
                                        >
                                            <span className="font-medium truncate">{playlist.titulo}</span>
                                            {playlist.musicasIds.includes(music.id) && <Check size={16} className="text-green-500"/>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                                    <button onClick={() => setLiked(!liked)} className="flex flex-col items-center gap-1 text-xs text-gray-400 hover:text-white transition group">
                                        <Heart size={24} className={liked ? "fill-red-500 text-red-500" : "group-hover:scale-110 transition"} />
                                        <span>Favoritar</span>
                                    </button>
                                    <button onClick={() => setShowPlaylists(true)} className="flex flex-col items-center gap-1 text-xs text-gray-400 hover:text-white transition group">
                                        <ListPlus size={24} className="group-hover:scale-110 transition text-[#6c63ff]" />
                                        <span>Add Playlist</span>
                                    </button>
                                    <button onClick={handleShare} className="flex flex-col items-center gap-1 text-xs text-gray-400 hover:text-white transition group">
                                        <Share2 size={24} className="group-hover:scale-110 transition" />
                                        <span>Compartilhar</span>
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold mb-2 text-[#6c63ff]">Letra</h3>
                                    <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line bg-black/20 p-4 rounded-lg border border-white/5 max-h-40 overflow-y-auto">
                                        {music.id.startsWith('m') ? "Letra local simulada..." : "Letra não disponível na API pública."}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MusicCard({ music, isOnline, onClick }) {
    return (
        <div onClick={onClick} className="flex items-center bg-[#242526] p-3 rounded-lg hover:bg-white/10 transition group border border-transparent hover:border-white/10 relative overflow-hidden cursor-pointer">
            <img src={music.coverUrl} alt={music.titulo} className="w-16 h-16 rounded object-cover mr-4 shadow-md" />
            <div className="min-w-0">
                <h3 className="font-bold text-white truncate pr-4">{music.titulo}</h3>
                <p className="text-sm text-gray-400 truncate">{music.autor}</p>
                {isOnline && <span className="text-[10px] uppercase bg-green-900 text-green-300 px-2 py-0.5 rounded mt-1 inline-block">Web</span>}
            </div>
            <button className="ml-auto w-10 h-10 rounded-full bg-[#6c63ff] flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg transform translate-x-4 group-hover:translate-x-0">
                <Play size={18} className="fill-white text-white ml-0.5" />
            </button>
        </div>
    );
}