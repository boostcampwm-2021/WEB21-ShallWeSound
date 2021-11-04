import { Server } from 'socket.io';
import type { Music } from '../types';

interface PlayList {
  playlist: Music[];
  getPlayList: () => Music[];
  getPlayListByPage: (page: number, count: number) => Music[];
  getNextMusic: () => Music;
}

const PlayList: PlayList = {
  playlist: [
    {
      title: 'Savage',
      singer: '에스파',
      src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
      isPlayed: false,
    },
    {
      title: 'Psycho',
      singer: '레드벨벳',
      src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
      isPlayed: false,
    },
    {
      title: 'Blueming',
      singer: '아이유',
      src: 'http://localhost:3000/audio/IU_Blueming.mp3',
      isPlayed: false,
    },
    {
      title: 'Savage',
      singer: '에스파',
      src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
      isPlayed: false,
    },
    {
      title: 'Psycho',
      singer: '레드벨벳',
      src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
      isPlayed: false,
    },
    {
      title: 'Blueming',
      singer: '아이유',
      src: 'http://localhost:3000/audio/IU_Blueming.mp3',
      isPlayed: false,
    },
    {
      title: 'Savage',
      singer: '에스파',
      src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
      isPlayed: false,
    },
    {
      title: 'Psycho',
      singer: '레드벨벳',
      src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
      isPlayed: false,
    },
    {
      title: 'Blueming',
      singer: '아이유',
      src: 'http://localhost:3000/audio/IU_Blueming.mp3',
      isPlayed: false,
    },
    {
      title: 'Savage',
      singer: '에스파',
      src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
      isPlayed: false,
    },
    {
      title: 'Psycho',
      singer: '레드벨벳',
      src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
      isPlayed: false,
    },
    {
      title: 'Blueming',
      singer: '아이유',
      src: 'http://localhost:3000/audio/IU_Blueming.mp3',
      isPlayed: false,
    },
    {
      title: 'Savage',
      singer: '에스파',
      src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
      isPlayed: false,
    },
    {
      title: 'Psycho',
      singer: '레드벨벳',
      src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
      isPlayed: false,
    },
    {
      title: 'Blueming',
      singer: '아이유',
      src: 'http://localhost:3000/audio/IU_Blueming.mp3',
      isPlayed: false,
    },
    {
      title: 'Savage',
      singer: '에스파',
      src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
      isPlayed: false,
    },
    {
      title: 'Psycho',
      singer: '레드벨벳',
      src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
      isPlayed: false,
    },
    {
      title: 'Blueming',
      singer: '아이유',
      src: 'http://localhost:3000/audio/IU_Blueming.mp3',
      isPlayed: false,
    },
    {
      title: 'Savage',
      singer: '에스파',
      src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
      isPlayed: false,
    },
    {
      title: 'Psycho',
      singer: '레드벨벳',
      src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
      isPlayed: false,
    },
    {
      title: 'Blueming',
      singer: '아이유',
      src: 'http://localhost:3000/audio/IU_Blueming.mp3',
      isPlayed: false,
    },
  ],
  getPlayList() {
    return this.playlist;
  },
  getPlayListByPage(page, count) {
    return this.playlist.slice(page, page + count);
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

const socketData: string[] = [];

const musicSocket = (io: Server) => {
  const namespace = io.of('/music');

  namespace.on('connection', socket => {
    console.log(socket.id + ' connected');

    if (socketData.length !== 0) {
      socket.broadcast.to([socketData[0]]).emit('requestTime', 'time');
    }

    socketData.push(socket.id);

    socket.on('responseTime', (data: string) => {
      socket.broadcast.emit('sync', data);
    });

    socket.on('pause', (data: string) => {
      if (socket.id === socketData[0]) {
        socket.broadcast.emit('clientPause', '멈춰!');
      }
    });

    socket.on('play', (data: string) => {
      if (socket.id === socketData[0]) {
        socket.broadcast.emit('clientPlay', '시작해!');
      }
    });

    socket.on('moving', (data: string) => {
      if (socket.id === socketData[0]) {
        console.log('모두들 시작하세요');
        socket.broadcast.emit('clientMoving', data);
      }
    });

    socket.on('request', ([page, count]) => {
      namespace.to(socket.id).emit('response', PlayList.getPlayListByPage(page, count));
    });

    socket.on('nextMusicReq', () => {
      if (socket.id !== socketData[0]) return;

      // namespace.to(socket.id).emit('nextMusicRes', PlayList.getNextMusic());
      namespace.emit('nextMusicRes', PlayList.getNextMusic());
    });
  });
};

export { PlayList, musicSocket };
