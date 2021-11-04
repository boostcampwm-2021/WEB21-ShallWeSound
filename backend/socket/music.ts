import { Server } from 'socket.io';
import type { Music } from '../types';

interface PlayList {
  playlist: Music[];
  getPlayList: () => Music[];
  getPlayListByPage: (page: number, count: number) => Music[];
  getNextMusic: () => Music;
  getCurrentMusic: () => Music;
}

const PlayList: PlayList = {
  playlist: [
    // {
    //   title: 'Savage',
    //   singer: '에스파',
    //   src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
    //   isPlayed: true,
    // },
    // {
    //   title: 'Psycho',
    //   singer: '레드벨벳',
    //   src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Blueming',
    //   singer: '아이유',
    //   src: 'http://localhost:3000/audio/IU_Blueming.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Savage',
    //   singer: '에스파',
    //   src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Psycho',
    //   singer: '레드벨벳',
    //   src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Blueming',
    //   singer: '아이유',
    //   src: 'http://localhost:3000/audio/IU_Blueming.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Savage',
    //   singer: '에스파',
    //   src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Psycho',
    //   singer: '레드벨벳',
    //   src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Blueming',
    //   singer: '아이유',
    //   src: 'http://localhost:3000/audio/IU_Blueming.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Savage',
    //   singer: '에스파',
    //   src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Psycho',
    //   singer: '레드벨벳',
    //   src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Blueming',
    //   singer: '아이유',
    //   src: 'http://localhost:3000/audio/IU_Blueming.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Savage',
    //   singer: '에스파',
    //   src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Psycho',
    //   singer: '레드벨벳',
    //   src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Blueming',
    //   singer: '아이유',
    //   src: 'http://localhost:3000/audio/IU_Blueming.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Savage',
    //   singer: '에스파',
    //   src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Psycho',
    //   singer: '레드벨벳',
    //   src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Blueming',
    //   singer: '아이유',
    //   src: 'http://localhost:3000/audio/IU_Blueming.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Savage',
    //   singer: '에스파',
    //   src: 'http://localhost:3000/audio/Aespa_Savage.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Psycho',
    //   singer: '레드벨벳',
    //   src: 'http://localhost:3000/audio/RedVelvet_Psycho.mp3',
    //   isPlayed: false,
    // },
    // {
    //   title: 'Blueming',
    //   singer: '아이유',
    //   src: 'http://localhost:3000/audio/IU_Blueming.mp3',
    //   isPlayed: false,
    // },
    {
      title: 'Harley Bird - Home',
      singer: 'Jordan Schor',
      isPlayed: false,
      src: '/songs/music-1.mp3',
    },
    {
      title: 'Ikson Anywhere – Ikson',
      singer: 'Audio Library',
      isPlayed: false,
      src: '/songs/music-2.mp3',
    },
    {
      title: 'Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      isPlayed: false,
      src: '/songs/music-3.mp3',
    },
    {
      title: 'Hardwind - Want Me',
      singer: 'Mike Archangelo',
      isPlayed: false,
      src: '/songs/music-4.mp3',
    },
    {
      title: 'Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      isPlayed: false,
      src: '/songs/music-5.mp3',
    },
    {
      title: 'Lost Sky - Vision NCS',
      singer: 'NCS Release',
      isPlayed: false,
      src: '/songs/music-6.mp3',
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
  getCurrentMusic() {
    const current = this.playlist.find(music => music.isPlayed)!;
    return current;
  },
};

interface userList {
  [socketid: string]: number;
}
const userHash: userList = {};
let userNum: number = 0;

const socketData: string[] = [];

const musicSocket = (io: Server) => {
  const namespace = io.of('/music');

  namespace.on('connection', socket => {
    console.log(socket.id);

    userHash[socket.id] = userNum;
    userNum += 1;

    socketData.push(socket.id);

    if (!!socketData.length) {
      socket.broadcast.to([socketData[0]]).emit('requestTime', 'time');
    }

    socket.broadcast.emit('enterRoom', 'new user connected');
    socket.on('disconnect', () => {
      socket.broadcast.emit('leaveRoom', 'user disconnected');
    });
    socket.on('chatMessage', (message: string) => {
      // console.log(userHash[socket.id]);
      socket.broadcast.emit('chatMessage', { id: userHash[socket.id], msg: message });
    });

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

    socket.on('nextMusicReq', ({ src }) => {
      if (socket.id !== socketData[0]) return;

      // namespace.to(socket.id).emit('nextMusicRes', PlayList.getNextMusic());
      namespace.emit('nextMusicRes', src);
    });

    socket.on('currentMusicReq', () => {
      socket.emit('currentMusicRes', PlayList.getCurrentMusic());

      // if (socketData.length > 1) {
      //   socket.broadcast.to([socketData[0]]).emit('requestTime', 'time');
      // }
    });
  });
};

export { PlayList, musicSocket };
