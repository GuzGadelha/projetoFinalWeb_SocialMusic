export const users = [
  { 
    id: "aluno1", 
    nome: "Rafael Donatelo", 
    email: "aluno@faculdade.com", 
    senha: "123", 
    tipo: "admin", 
    avatarUrl: "https://ui-avatars.com/api/?name=Rafael+Donatelo&background=random" 
  },
  { 
    id: "u2", 
    nome: "Levi (Dev)", 
    email: "levi@test.com", 
    senha: "123", 
    tipo: "ouvinte", 
    avatarUrl: "https://ui-avatars.com/api/?name=Levi+Dev&background=random" 
  },
  { 
    id: "u3", 
    nome: "Clawe (Artista)", 
    email: "clawe@test.com", 
    senha: "123", 
    tipo: "musico", 
    avatarUrl: "https://ui-avatars.com/api/?name=Clawe+Artista&background=random" 
  },
];

export const musics = [
  { 
    id: "m1", 
    titulo: "Stairway To Heaven", 
    autor: "Led Zeppelin", 
    album: "Led Zeppelin IV", 
    duracao: 482, 
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086af669" // Link externo é mais seguro para teste
  },
  { 
    id: "m2", 
    titulo: "Do for Love", 
    autor: "Tupac", 
    album: "Single", 
    duracao: 240, 
    coverUrl: "https://i.scdn.co/image/ab67616d0000b2730048882064df595b28de0356" 
  },
  { 
    id: "m3", 
    titulo: "Chicago", 
    autor: "Michael Jackson", 
    album: "Xscape", 
    duracao: 245, 
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273a3ec0da275723528f86f8d08" 
  },
  { 
    id: "m4", 
    titulo: "Neutron Star Collision", 
    autor: "Muse", 
    album: "Black Holes", 
    duracao: 230, 
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273295963b53c15555543c72b22" 
  },
];

export const playlists = [
  { 
    id: "p1", 
    titulo: "Pra chorar e ficar calado!", 
    descricao: "Melhores músicas tristes para codar.",
    donoId: "u2", 
    musicasIds: ["m1", "m4"], // Tem músicas
    privada: false 
  },
  { 
    id: "p2", 
    titulo: "Treino Pesado", 
    descricao: "Músicas para academia.",
    donoId: "aluno1", 
    musicasIds: ["m2", "m3", "m4"], // Tem 3 músicas
    privada: false 
  },
  { 
    id: "p3", 
    titulo: "Segredos do Clawe", 
    descricao: "Ninguém pode ver essa lista.",
    donoId: "u3", 
    musicasIds: [], // Playlist vazia (para testar o aviso de "sem músicas")
    privada: true // Playlist privada (para testar o cadeado/aviso)
  },
];

export const comments = [
  { id: "c1", conteudo: "Essa música é lendária!", autorId: "aluno1", musicaId: "m1", avaliacao: 5 },
  { id: "c2", conteudo: "Não gostei muito do ritmo.", autorId: "u2", musicaId: "m1", avaliacao: 3 }, // Média deve ser 4
  { id: "c3", conteudo: "Clássico!", autorId: "u3", musicaId: "m2", avaliacao: 5 },
];

export const favorites = ["m1", "m2"];

