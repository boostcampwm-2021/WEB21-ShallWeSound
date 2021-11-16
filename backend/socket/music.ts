import type { Music } from '../types';

// interface PlayList {
//   playlist: Music[];
//   getPlayList: () => Music[];
//   getPlayListByPage: (page: number) => Music[];
//   getNextMusic: () => Music;
//   getCurrentMusic: () => Music;
//   addMusics: (musics: Music[]) => void;
// }

export class PlayList {
  playlist: Music[];

  constructor() {

    this.playlist = [
      {
        MID: 1,
        name: 'Harley Bird - Home',
        singer: 'Jordan Schor',
        description: 'blahblah',
        thumbnail: '/images/music-1.jpg',
        path: '/songs/music-1.mp3',
        isPlayed: false,
      },
      {
        MID: 2,
        name: 'Ikson Anywhere – Ikson',
        singer: 'Audio Library',
        description: 'blahblah',
        thumbnail: '/images/music-2.jpg',
        path: '/songs/music-2.mp3',
        isPlayed: false,
      },
      {
        MID: 3,
        name: 'Beauz & Jvna - Crazy',
        singer: 'Beauz & Jvna',
        description: 'blahblah',
        thumbnail: '/images/music-3.jpg',
        path: '/songs/music-3.mp3',
        isPlayed: false,
      },
      {
        MID: 4,
        name: 'Hardwind - Want Me',
        singer: 'Mike Archangelo',
        description: 'blahblah',
        thumbnail: '/images/music-4.jpg',
        path: '/songs/music-4.mp3',
        isPlayed: false,
      },
      {
        MID: 5,
        name: 'Jim - Sun Goes Down',
        singer: 'Jim Yosef x Roy',
        description: 'blahblah',
        thumbnail: '/images/music-5.jpg',
        path: '/songs/music-5.mp3',
        isPlayed: false,
      },
      {
        MID: 6,
        name: 'Lost Sky - Vision NCS',
        singer: 'NCS Release',
        description: 'blahblah',
        thumbnail: '/images/music-6.jpg',
        path: '/songs/music-6.mp3',
        isPlayed: false,
      },
    ];
  }
  getPlayList(): Music[] {
    return this.playlist;
  }

  getPlayListByPage(page: number): Music[] {
    const bloc = 15;
    return this.playlist.slice(page, page + bloc);
  }

  getNextMusic(): Music {
    const now = this.playlist.find(music => music.isPlayed);
    if (!now) {
      this.playlist[0].isPlayed = true;
      return this.playlist[0];
    }

    const next = this.playlist[(this.playlist.indexOf(now) + 1) % this.playlist.length];
    now.isPlayed = false;
    next.isPlayed = true;

    return next;
  }

  getCurrentMusic(): Music {
    const current = this.playlist.find(music => music.isPlayed)!;
    return current;
  }

  addMusics(musics: Music[]): void {
    this.playlist.push(...musics);
  }
}
