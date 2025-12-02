export const users = [
  { id: "aluno1", nome: "Rafael Donatelo", email: "aluno@faculdade.com", senha: "123", tipo: "admin", avatarUrl: "https://i.pravatar.cc/150?u=rafael" },
  { id: "u2", nome: "Levi (Dev)", email: "levi@test.com", senha: "123", tipo: "ouvinte", avatarUrl: "https://i.pravatar.cc/150?u=levi" },
  { id: "u3", nome: "Clawe (Artista)", email: "clawe@test.com", senha: "123", tipo: "musico", avatarUrl: "https://i.pravatar.cc/150?u=clawe" },
];

export const musics = [
  { id: "m1", titulo: "Stairway To Heaven", autor: "Led Zeppelin", album: "Led Zeppelin IV", duracao: 482 },
  { id: "m2", titulo: "Do for Love", autor: "Tupac", album: "Single", duracao: 240 },
  { id: "m3", titulo: "Chicago", autor: "Michael Jackson", album: "Xscape", duracao: 245 },
  { id: "m4", titulo: "Neutron Star Collision", autor: "Muse", album: "Black Holes", duracao: 230 },
];

export const playlists = [
  { id: "p1", titulo: "Pra chorar e ficar calado!", donoId: "u2", musicasIds: ["m1", "m4"], privado: false },
];

export const comments = [
  { id: "c1", conteudo: "Minha música favorita!", autorId: "aluno1", musicaId: "m4", avaliacao: 5 },
];

export const favorites = ["m1", "m2"];