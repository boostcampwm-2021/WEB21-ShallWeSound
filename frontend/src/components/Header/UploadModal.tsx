import styles from '../../stylesheets/style.module.scss';
import React, { useState, useRef} from 'react';
import {FileType, timeoutRef, fileUploadObject} from '../../types'
import uploadController from '../Util/uploadController';

function UploadModalInner() {
  const alertRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const textAlertRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const fileAlertRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const singerRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const musicFileRef = useRef<HTMLInputElement>(null);
  const thumbnailFileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<timeoutRef>({timer:setTimeout(() => {/*초기화용 빈 타이머*/})});
  const [uploadedFile, setUploadedFile] = useState<FileType>({
    musicName:'파일선택',
    thumbnailName: '파일선택',
    singer:'',
    descript:'',
    musicFile:null,
    thumbnailFile:null,
  });

  const isFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadController.fileUploadController(e, setUploadedFile, uploadedFile)
  };

  const isThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadController.thumbnailUploadController(e, setUploadedFile, uploadedFile)
  };
  
  const fileUploadMethod = () => {
    const curObj:fileUploadObject={
      descriptionRef,
      singerRef,
      musicFileRef,
      thumbnailFileRef,
      uploadedFile, 
      setUploadedFile, 
      timerRef, 
      textAlertRef, 
      fileAlertRef
    }
    uploadController.fileUploadMethodController(curObj);
  };

  const writeSingerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadController.writeSingerNameController(e, timerRef, uploadedFile, setUploadedFile);
  };

  const writeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    uploadController.writeDescriptionController(e, timerRef, uploadedFile, setUploadedFile);
  };

  const dropListener = (event: React.DragEvent<HTMLDivElement>) => {
    uploadController.dropListenerController(event, uploadedFile, setUploadedFile, alertRef);
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
            ref={musicFileRef}
            onChange={isFileUpload}
            accept="audio/mp3"
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
            ref={thumbnailFileRef}
            onChange={isThumbUpload}
            accept='image/jpeg, image/png'
          />
        </div>

        <button className={styles.submitButton} onClick={fileUploadMethod}>
          업로드
        </button>
      </div>
      <div className={'delegate'} ref={alertRef}>
        음악은 mp3, 썸네일은 jpeg, png만 업로드 가능합니다!
      </div>
      <div className={'delegate'} ref={textAlertRef}>
        아티스트 이름과 곡 설명은 반드시 적어주셔야 합니다!
      </div>
      <div className={'delegate'} ref={fileAlertRef}>
        mp3 파일과 썸네일 이미지 파일를 반드시 첨부해주셔야 합니다!
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
    <div>
      <button className={styles.headerUploadButton} onClick={modalVisibleChange}>
        <svg xmlns="http://www.w3.org/2000/svg"height="24px" viewBox="0 0 24 24" width="24px"><g><path d="M7.4,10h1.59v5c0,0.55,0.45,1,1,1h4c0.55,0,1-0.45,1-1v-5h1.59c0.89,0,1.34-1.08,0.71-1.71L12.7,3.7 c-0.39-0.39-1.02-0.39-1.41,0L6.7,8.29C6.07,8.92,6.51,10,7.4,10z M5,19c0,0.55,0.45,1,1,1h12c0.55,0,1-0.45,1-1s-0.45-1-1-1H6 C5.45,18,5,18.45,5,19z"/></g></svg>
        <p>음악 업로드</p>
      </button>
      {isModalVisible && <UploadModalInner />}
    </div>
  );
}

export default UploadModal;

