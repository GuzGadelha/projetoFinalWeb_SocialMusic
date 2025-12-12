import { NextResponse } from 'next/server';
import { playlists } from '@/lib/data';

export async function GET(){
    return NextResponse.json(playlists);
}

export async function POST(request){
    
    const body = await request.json();
    const { titulo, descricao, donoId, privada } = body;

    const novaPlaylist = {
        id: Date.now().toString, 
        titulo, 
        descricao, 
        donoId, 
        privada: privada || false, 
        musicaIds: [] 
    };

    playlists.push(novaPlaylist);

    return NextResponse.json(novaPlaylist, { status: 201 });

}

