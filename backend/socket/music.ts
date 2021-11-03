import { Server } from 'socket.io';
import type { Music } from '../types';

interface PlayList {
  playlist: Music[];
  getPlayList: () => Music[];
  getNextMusic: () => Music;
}

const PlayList: PlayList = {
  playlist: [
    {
      name: 'Savage',
      src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
      isPlayed: false,
    },
    {
      name: 'Psycho',
      src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
      isPlayed: false,
    },
    {
      name: 'Blueming',
      src: 'http://localhost:3000/audio/IU_Blueming.mp3',
      isPlayed: false,
    },
  ],
  getPlayList() {
    return this.playlist;
  },
  getNextMusic() {
    const now = this.playlist.find(music => music.isPlayed);
    if (!now) {
      this.playlist[0].isPlayed = true;
      return this.playlist[0];
    }

    const next = this.playlist[(this.playlist.indexOf(now) + 1) % this.playlist.length];
    now.isPlayed = false;
    next.isPlayed = true;

    return next;
  },
};

const musicSocket = (io: Server) => {
  const namespace = io.of('/music');

  namespace.on('connection', socket => {
    console.log(socket.id + ' connected');

    socket.emit('init', PlayList.getPlayList());
  });
};

export { PlayList, musicSocket };
