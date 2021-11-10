import type { Music } from '../types';

interface PlayList {
  playlist: Music[];
  getPlayList: () => Music[];
  getPlayListByPage: (page: number) => Music[];
  getNextMusic: () => Music;
  getCurrentMusic: () => Music;
}

const PlayList: PlayList = {
  playlist: [
    {
      title: '1Harley Bird - Home',
      singer: 'Jordan Schor',
      isPlayed: false,
      src: '/songs/music-1.mp3',
    },
    {
      title: '2Ikson Anywhere – Ikson',
      singer: 'Audio Library',
      isPlayed: false,
      src: '/songs/music-2.mp3',
    },
    {
      title: '3Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      isPlayed: false,
      src: '/songs/music-3.mp3',
    },
    {
      title: '4Hardwind - Want Me',
      singer: 'Mike Archangelo',
      isPlayed: false,
      src: '/songs/music-4.mp3',
    },
    {
      title: '5Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      isPlayed: false,
      src: '/songs/music-5.mp3',
    },
    {
      title: '6Lost Sky - Vision NCS',
      singer: 'NCS Release',
      isPlayed: false,
      src: '/songs/music-6.mp3',
    },
    {
      title: '7Harley Bird - Home',
      singer: 'Jordan Schor',
      isPlayed: false,
      src: '/songs/music-1.mp3',
    },
    {
      title: '8Ikson Anywhere – Ikson',
      singer: 'Audio Library',
      isPlayed: false,
      src: '/songs/music-2.mp3',
    },
    {
      title: '9Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      isPlayed: false,
      src: '/songs/music-3.mp3',
    },
    {
      title: '10Hardwind - Want Me',
      singer: 'Mike Archangelo',
      isPlayed: false,
      src: '/songs/music-4.mp3',
    },
    {
      title: '11Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      isPlayed: false,
      src: '/songs/music-5.mp3',
    },
    {
      title: '12Lost Sky - Vision NCS',
      singer: 'NCS Release',
      isPlayed: false,
      src: '/songs/music-6.mp3',
    },
    {
      title: '13Harley Bird - Home',
      singer: 'Jordan Schor',
      isPlayed: false,
      src: '/songs/music-1.mp3',
    },
    {
      title: '14Ikson Anywhere – Ikson111111121222',
      singer: 'Audio Library',
      isPlayed: false,
      src: '/songs/music-2.mp3',
    },
    {
      title: '15Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      isPlayed: false,
      src: '/songs/music-3.mp3',
    },
    {
      title: '16Hardwind - Want Me',
      singer: 'Mike Archangelo',
      isPlayed: false,
      src: '/songs/music-4.mp3',
    },
    {
      title: '17Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      isPlayed: false,
      src: '/songs/music-5.mp3',
    },
    {
      title: '18Lost Sky - Vision NCS',
      singer: 'NCS Release',
      isPlayed: false,
      src: '/songs/music-6.mp3',
    },
    {
      title: '19Harley Bird - Home',
      singer: 'Jordan Schor',
      isPlayed: false,
      src: '/songs/music-1.mp3',
    },
    {
      title: '20Ikson Anywhere – Ikson',
      singer: 'Audio Library',
      isPlayed: false,
      src: '/songs/music-2.mp3',
    },
    {
      title: '21Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      isPlayed: false,
      src: '/songs/music-3.mp3',
    },
    {
      title: '22Hardwind - Want Me',
      singer: 'Mike Archangelo',
      isPlayed: false,
      src: '/songs/music-4.mp3',
    },
    {
      title: '23Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      isPlayed: false,
      src: '/songs/music-5.mp3',
    },
    {
      title: '24Lost Sky - Vision NCS',
      singer: 'NCS Release',
      isPlayed: false,
      src: '/songs/music-6.mp3',
    },
    {
      title: '25Harley Bird - Home',
      singer: 'Jordan Schor',
      isPlayed: false,
      src: '/songs/music-1.mp3',
    },
    {
      title: '26Ikson Anywhere – Ikson',
      singer: 'Audio Library',
      isPlayed: false,
      src: '/songs/music-2.mp3',
    },
    {
      title: '27Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      isPlayed: false,
      src: '/songs/music-3.mp3',
    },
    {
      title: '28Hardwind - Want Me',
      singer: 'Mike Archangelo',
      isPlayed: false,
      src: '/songs/music-4.mp3',
    },
    {
      title: '29Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      isPlayed: false,
      src: '/songs/music-5.mp3',
    },
    {
      title: '30Lost Sky - Vision NCS',
      singer: 'NCS Release',
      isPlayed: false,
      src: '/songs/music-6.mp3',
    },
    {
      title: '31Harley Bird - Home',
      singer: 'Jordan Schor',
      isPlayed: false,
      src: '/songs/music-1.mp3',
    },
    {
      title: '32Ikson Anywhere – Ikson111111121222',
      singer: 'Audio Library',
      isPlayed: false,
      src: '/songs/music-2.mp3',
    },
    {
      title: '33Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      isPlayed: false,
      src: '/songs/music-3.mp3',
    },
    {
      title: '34Hardwind - Want Me',
      singer: 'Mike Archangelo',
      isPlayed: false,
      src: '/songs/music-4.mp3',
    },
    {
      title: '35Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      isPlayed: false,
      src: '/songs/music-5.mp3',
    },
    {
      title: '36Lost Sky - Vision NCS',
      singer: 'NCS Release',
      isPlayed: false,
      src: '/songs/music-6.mp3',
    },
  ],
  getPlayList() {
    return this.playlist;
  },
  getPlayListByPage(page) {
    const bloc = 15;
    return this.playlist.slice(page, page + bloc);
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
