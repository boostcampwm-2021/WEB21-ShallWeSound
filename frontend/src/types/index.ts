type Music = {
  MID: number;
  name: string;
  src: string;
  isPlayed: boolean;
  singer: string;
  thumbnail: string;
};

type FileType = {
  musicName: string;
  thumbnailName: string;
  singer: string;
  descript: string;
  musicFile: FileList | null;
  thumbnailFile: FileList | null;
};

type timeoutRef={
  timer:NodeJS.Timeout|null
}
export type { Music, FileType, timeoutRef };
