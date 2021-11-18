import styles from '../../stylesheets/style.module.scss';
import React, { useState, useRef} from 'react';
import {FileType} from '../../types'

type timeoutRef={
  timer:NodeJS.Timeout|null
}
function UploadModalInner() {
  console.log('render');
  const singerRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<timeoutRef>({timer:setTimeout(() => {})});
  const [uploadedFile, setUploadedFile] = useState<FileType>({
    musicName:'파일선택',
    thumbnailName: '파일선택',
    singer:'',
    descript:'',
    musicFile:null,
    thumbnailFile:null,
  });

  const isFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const curObj = {...uploadedFile};
    curObj.musicFile = e.target.files!;
    curObj.musicName = e.target.files![0].name;
    e.target.value='';
    setUploadedFile(curObj);
  };

  const isThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const curObj = {...uploadedFile};
    curObj.thumbnailFile = e.target.files!;
    curObj.thumbnailName = e.target.files![0].name;
    e.target.value='';
    setUploadedFile(curObj);
  };

  const fileUploadMethod = () => {
    if(timerRef.current){
      clearTimeout(timerRef.current.timer!);
    }
    const uploadTimer = setTimeout(async () => {
      const formData = new FormData();
      Object.values(uploadedFile.musicFile!).forEach(el => {
        formData.append('userFile1', el);
      });
      Object.values(uploadedFile.thumbnailFile!).forEach(el => {
        formData.append('userFile2', el);
      });
      formData.append('singer', uploadedFile.singer!);
      formData.append('description', uploadedFile.descript!);
      await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      const curObj = resetFileState({...uploadedFile});
      setUploadedFile(curObj);
    }, 200);
    timerRef.current.timer = uploadTimer;
  };

  const resetFileState = (curObj:FileType):FileType => {
    curObj.musicName='파일선택';
    curObj.thumbnailName='파일선택';
    curObj.musicFile=null;
    curObj.thumbnailFile=null;
    curObj.singer='';
    curObj.descript='';
    descriptionRef.current!.value = '';
    singerRef.current!.value = '';
    return curObj;
  }

  const writeSingerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(timerRef.current){
      clearTimeout(timerRef.current.timer!);
    }
    const timer = setTimeout(function(){
      const curObj = {...uploadedFile};
      curObj.singer=e.target.value;
      console.log(curObj)
      setUploadedFile(curObj);
    }, 200);
    timerRef.current!.timer = timer;
  };

  const writeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(timerRef.current){
      clearTimeout(timerRef.current.timer!);
    }
    const timer = setTimeout(function(){
      const curObj = {...uploadedFile};
      curObj.descript=e.target.value;
      console.log(curObj)
      setUploadedFile(curObj);
    }, 400);
    timerRef.current!.timer = timer;
  };

  const dropListener = (event: React.DragEvent<HTMLDivElement>) => {
    overrideEventDefaults(event);
    const curObj = {...uploadedFile};
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      if(event.dataTransfer.files[0].type === 'image/jpeg'){
        curObj.thumbnailFile = event.dataTransfer.files;
        curObj.thumbnailName = event.dataTransfer.files[0].name;
      }else{
        curObj.musicFile = event.dataTransfer.files;
        curObj.musicName = event.dataTransfer.files[0].name;
      }
    }
    setUploadedFile(curObj);
  };

  const overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className={styles.UploadModalInner}>
      <div className={styles.uploadForm}>
        <div className={styles.singerForm}>
          <div className={styles.title}>아티스트</div>
          <input
            ref={singerRef}
            className={styles.singer}
            type="text"
            placeholder="아티스트 이름"
            onChange={writeSingerName}
          />
        </div>
        <div className={styles.descriptForm}>
          <div className={styles.title}>곡 설명</div>
          <textarea
            ref={descriptionRef}
            className={styles.descript}
            placeholder="곡 설명을 입력하세요"
            onChange={writeDescription}
          />
        </div>
        <div className={styles.musicForm}
        onDrag={overrideEventDefaults}
        onDragStart={overrideEventDefaults}
        onDragEnd={overrideEventDefaults}
        onDragOver={overrideEventDefaults}
        onDragEnter={overrideEventDefaults}
        onDragLeave={overrideEventDefaults}
        onDrop={dropListener}
        >
          <div className={styles.title}>음악파일</div>
          <input
            className={styles.musicName}
            value={uploadedFile.musicName}
            placeholder="음악파일"
            disabled={true}
          />
          
          <label htmlFor="musicFile">첨부</label>
          <input
            {...uploadedFile.musicFile}
            className={styles.input}
            id="musicFile"
            type="file"
            name="userFile1"
            onChange={isFileUpload}
          />
        </div>
        <div className={styles.thumbnailForm}
        onDrag={overrideEventDefaults}
        onDragStart={overrideEventDefaults}
        onDragEnd={overrideEventDefaults}
        onDragOver={overrideEventDefaults}
        onDragEnter={overrideEventDefaults}
        onDragLeave={overrideEventDefaults}
        onDrop={dropListener}
        >
          <div className={styles.title}>썸네일 이미지</div>
          <input
            className={styles.thumbnailName}
            value={uploadedFile.thumbnailName}
            placeholder="썸네일"
            disabled={true}
          />
          <label htmlFor="thumbnailFile">첨부</label>
          <input
            {...uploadedFile.thumbnailFile}
            className={styles.input}
            id="thumbnailFile"
            type="file"
            name="userFile2"
            onChange={isThumbUpload}
          />
        </div>

        <button className={styles.submitButton} onClick={fileUploadMethod}>
          업로드
        </button>
      </div>
    </div>
  );
}

function UploadModal() {
  const [isModalVisible, setVisible] = useState<boolean>(false);

  const modalVisibleChange = () => {
    setVisible(!isModalVisible);
  };

  return (
    <div className={styles.modalContainer}>
      <button className={styles.headerUploadButton} onClick={modalVisibleChange}>
        음악 업로드
      </button>
      {isModalVisible && <UploadModalInner />}
    </div>
  );
}

export default UploadModal;
