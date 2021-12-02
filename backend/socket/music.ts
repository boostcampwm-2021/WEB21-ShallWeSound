import type { Music } from '../types';

export class PlayList {
  playlist: Music[] = [];

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
    return this.playlist.find(music => music.isPlayed)!;
  }

  addMusics(musics: Music[]): void {
    this.playlist.push(...musics);
  }

  getMusicByName(musicName: string) {
    return this.playlist.find(val => val.name === musicName);
  }

  setIsPlayed(state: boolean, musicName: string) {
    const music: Music = this.getMusicByName(musicName)!;
    music.isPlayed = state;
  }

  removeMusicByMID(MID: number): void {
    this.playlist = this.playlist.filter(music => music.MID !== MID);
  }

  isExist(MIDs: number[]): boolean {
    const temp = new Set(this.playlist.map(music => music.MID));
    return MIDs.find(MID => temp.has(MID)) ? true : false;
  }
}
