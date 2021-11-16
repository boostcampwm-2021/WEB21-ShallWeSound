type Music = {
  MID: number;
  title: string;
  src: string;
  isPlayed: boolean;
  singer: string;
};

type FileType={
  musicName: string,
  thumbnailName: string,
  singer: string,
  descript: string,
  musicFile: FileList|null,
  thumbnailFile: FileList|null,
  dragging: boolean
}
export type { Music, FileType };
