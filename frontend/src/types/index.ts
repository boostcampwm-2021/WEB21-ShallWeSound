type fileUploadObject={
  descriptionRef:React.RefObject<HTMLTextAreaElement>,
  singerRef:React.RefObject<HTMLInputElement>,
  musicFileRef:React.RefObject<HTMLInputElement>,
  thumbnailFileRef:React.RefObject<HTMLInputElement>,
  uploadedFile:FileType,
  setUploadedFile:React.Dispatch<React.SetStateAction<FileType>>,
  timerRef: React.MutableRefObject<timeoutRef>,
  textAlertRef:React.RefObject<HTMLDivElement>,
  fileAlertRef:React.RefObject<HTMLDivElement>
}

type Room = {
  id: string;
  name: string;
  description: string;
  totalUser: number;
};

type Music = {
  MID: number;
  name: string;
  src: string;
  isPlayed: boolean;
  singer: string;
  thumbnail: string;
  description: string;
};

type music = {
  MID: number;
  name: string;
  singer: string;
  description: string;
  thumbnail: string;
  path: string;
  isPlayed: boolean;
};

type FileType = {
  musicName: string;
  thumbnailName: string;
  singer: string;
  descript: string;
  musicFile: FileList | null;
  thumbnailFile: FileList | null;
};

type timeoutRef = {
  timer: NodeJS.Timeout | null;
};

type fetchState = {
  loading: boolean;
  data: Room[] & string[];
  error: any;
};

type musicResultItem = {
  name: string;
  singer: string;
  thumbnail: string;
  description: string;
  path: string;
};

type Action =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; data: Room[] & string[] }
  | { type: 'ERROR'; error: Error }
  | { type: null };

type joinData = {
  isRedundancy: boolean;
  roomID: string;
};

export type { Music, FileType, timeoutRef, fetchState, Room, Action, musicResultItem, joinData, music, fileUploadObject};
