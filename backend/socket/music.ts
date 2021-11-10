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

export { PlayList };
