import type { Music } from '../types';

export class PlayList {
  playlist: Music[] = [];

  constructor() {
  }
  getPlayList(): Music[] {
    return this.playlist;
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
