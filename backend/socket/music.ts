import type { Music } from '../types';

interface PlayList {
  playlist: Music[];
  getPlayList: () => Music[];
  getPlayListByPage: (page: number) => Music[];
  getNextMusic: () => Music;
  getCurrentMusic: () => Music;
  addMusics: (musics: Music[]) => void;
}

const PlayList: PlayList = {
  playlist: [
    {
      MID: 999999999,
      title: '1Harley Bird - Home',
      singer: 'Jordan Schor',
      isPlayed: false,
      src: '/songs/music-1.mp3',
    },
    {
      MID: 999999998,
      title: '2Ikson Anywhere – Ikson',
      singer: 'Audio Library',
      isPlayed: false,
      src: '/songs/music-2.mp3',
    },
    {
      MID: 999999997,
      title: '3Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      isPlayed: false,
      src: '/songs/music-3.mp3',
    },
    {
      MID: 999999991,
      title: '4Hardwind - Want Me',
      singer: 'Mike Archangelo',
      isPlayed: false,
      src: '/songs/music-4.mp3',
    },
    {
      MID: 9999999123,
      title: '5Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      isPlayed: false,
      src: '/songs/music-5.mp3',
    },
    {
      MID: 999999957457,
      title: '6Lost Sky - Vision NCS',
      singer: 'NCS Release',
      isPlayed: false,
      src: '/songs/music-6.mp3',
    },
    {
      MID: 9999999367876,
      title: '7Harley Bird - Home',
      singer: 'Jordan Schor',
      isPlayed: false,
      src: '/songs/music-1.mp3',
    },
    {
      MID: 999999997696789,
      title: '8Ikson Anywhere – Ikson',
      singer: 'Audio Library',
      isPlayed: false,
      src: '/songs/music-2.mp3',
    },
    {
      MID: 99999999456454,
      title: '9Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      isPlayed: false,
      src: '/songs/music-3.mp3',
    },
    {
      MID: 999999999111111,
      title: '10Hardwind - Want Me',
      singer: 'Mike Archangelo',
      isPlayed: false,
      src: '/songs/music-4.mp3',
    },
    {
      MID: 99999999933333,
      title: '11Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      isPlayed: false,
      src: '/songs/music-5.mp3',
    },
    {
      MID: 99999999944444,
      title: '12Lost Sky - Vision NCS',
      singer: 'NCS Release',
      isPlayed: false,
      src: '/songs/music-6.mp3',
    },
    {
      MID: 99999999976767,
      title: '13Harley Bird - Home',
      singer: 'Jordan Schor',
      isPlayed: false,
      src: '/songs/music-1.mp3',
    },
    {
      MID: 99999999989898,
      title: '14Ikson Anywhere – Ikson111111121222',
      singer: 'Audio Library',
      isPlayed: false,
      src: '/songs/music-2.mp3',
    },
    {
      MID: 999996756785,
      title: '15Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      isPlayed: false,
      src: '/songs/music-3.mp3',
    },
    {
      MID: 999978567856756,
      title: '16Hardwind - Want Me',
      singer: 'Mike Archangelo',
      isPlayed: false,
      src: '/songs/music-4.mp3',
    },
    {
      MID: 999943534534534,
      title: '17Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      isPlayed: false,
      src: '/songs/music-5.mp3',
    },
    {
      MID: 99993454656434,
      title: '18Lost Sky - Vision NCS',
      singer: 'NCS Release',
      isPlayed: false,
      src: '/songs/music-6.mp3',
    },
    {
      MID: 99999923512346,
      title: '19Harley Bird - Home',
      singer: 'Jordan Schor',
      isPlayed: false,
      src: '/songs/music-1.mp3',
    },
    {
      MID: 999934643575476,
      title: '20Ikson Anywhere – Ikson',
      singer: 'Audio Library',
      isPlayed: false,
      src: '/songs/music-2.mp3',
    },
    {
      MID: 99995674575675,
      title: '21Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      isPlayed: false,
      src: '/songs/music-3.mp3',
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
  addMusics(musics) {
    this.playlist.push(...musics);
  },
};

export { PlayList };
