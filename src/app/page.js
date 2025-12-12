'use client';
import { useState } from 'react';
import Link from 'next/link';
import { musics, playlists, users } from '@/lib/data';
import { Search, Play, Disc, User, Music, Heart } from 'lucide-react';

export default function FeedPage() {
  // Simula o usuário logado (ex: Levi)
  const usuarioLogado = users[1]; 
  
  // Estado da Pesquisa
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de Filtragem (Busca por Título ou Autor)
  const musicasFiltradas = musics.filter(m => 
    m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.autor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica de Filtragem de Playlists
  const playlistsFiltradas = playlists.filter(p => 
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSearching = searchTerm.length > 0;

  return (
    <div className="p-6 text-white min-h-screen pb-24">
      
      {/*  1. CABEÇALHO E BARRA DE PESQUISA  */}
      <div className="mb-8">
        {!isSearching && (
            <h1 className="text-3xl font-bold mb-4 animate-fade-in">
            Bom dia, <span className="text-[#6c63ff]">{usuarioLogado?.nome.split(' ')[0]}</span>!
            </h1>
        )}
        
        <div className="relative group z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#6c63ff] transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-full leading-5 bg-[#242526] text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] sm:text-sm transition-all shadow-lg"
            placeholder="O que você quer ouvir hoje? (Músicas, Artistas ou Playlists)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/*  2. ÁREA DE RESULTADOS DA BUSCA */}
      {isSearching ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* Resultados de Músicas */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Music className="text-[#6c63ff]" /> Músicas Encontradas
            </h2>
            {musicasFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {musicasFiltradas.map(music => (
                  <div key={music.id} className="flex items-center bg-[#242526] p-3 rounded-lg hover:bg-white/10 transition cursor-pointer group border border-transparent hover:border-[#6c63ff]/30">
                    <img src={music.coverUrl} alt={music.titulo} className="w-16 h-16 rounded object-cover mr-4" />
                    <div>
                      <h3 className="font-bold text-white group-hover:text-[#6c63ff] transition">{music.titulo}</h3>
                      <p className="text-sm text-gray-400">{music.autor}</p>
                    </div>
                    {/* Botão Play Visual apenas */}
                    <button className="ml-auto w-10 h-10 rounded-full bg-[#6c63ff] flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg transform group-hover:scale-110">
                      <Play size={20} className="ml-1 fill-white text-white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic ml-2">Nenhuma música encontrada com esse termo.</p>
            )}
          </div>

          {/* Resultados de Playlists */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 mt-6">
              <Disc className="text-[#6c63ff]" /> Playlists Encontradas
            </h2>
            {playlistsFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {playlistsFiltradas.map(playlist => (
                  <Link key={playlist.id} href={`/playlist/${playlist.id}`} className="block">
                    <div className="bg-[#242526] p-6 rounded-xl hover:scale-[1.02] transition duration-200 border border-transparent hover:border-[#6c63ff]/50 group cursor-pointer shadow-lg">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#6c63ff] transition-colors">
                        <Disc className="text-gray-400 group-hover:text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-[#6c63ff] transition">{playlist.titulo}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2">{playlist.descricao || "Sem descrição disponível."}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic ml-2">Nenhuma playlist encontrada com esse termo.</p>
            )}
          </div>

        </div>
      ) : (
        /* 3. CONTEÚDO PADRÃO (FEED) */
        <div className="space-y-10 animate-fade-in">

          {/* Sugestões do Momento */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-gray-200">Recomendado para você</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {playlists.slice(0, 3).map(playlist => (
                <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                  <div className="bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition cursor-pointer group shadow-md hover:shadow-xl border border-transparent hover:border-white/5">
                    <div className="aspect-square bg-gray-800 rounded-lg mb-4 shadow-inner overflow-hidden relative group-hover:shadow-2xl transition">
                       {/* Placeholder de capa */}
                       <div className="w-full h-full bg-gradient-to-t from-gray-900 to-gray-700 flex items-center justify-center text-gray-500">
                          <Music size={40} className="group-hover:scale-110 transition duration-500"/>
                       </div>
                       {/* Botão Play Hover (Decorativo) */}
                       <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="w-12 h-12 bg-[#6c63ff] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition">
                            <Play className="fill-white ml-1 text-white" size={24} />
                          </div>
                       </div>
                    </div>
                    <h3 className="font-bold truncate text-lg">{playlist.titulo}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{playlist.descricao || "Uma seleção especial."}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      )}
    </div>
  );
}