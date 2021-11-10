import styles from './style.module.scss';
import {useState} from 'react';

function UploadModalInner(){
    const [musicName, setMusicName] = useState<string>("파일선택");
    const [thumbnailName, setThumbnailName] = useState<string>("파일선택");
    const isFileUpload = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setMusicName(e.target.files![0].name);
    }
    const isThumbUpload = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setThumbnailName(e.target.files![0].name);
    }
    return(
        <div className={styles.UploadModalInner}>
            <form className={styles.uploadForm} action="upload" method="post" encType="multipart/form-data">
                <div>음악파일</div>
                
                <input className={styles.musicName} value={musicName} placeholder='음악파일' disabled={true}/>
                <label htmlFor="musicFile">업로드</label>
                
                <input className={styles.input} id="musicFile" type="file" name='userFile1' 
                onChange={isFileUpload} />
                <div>썸네일 이미지</div>
            
                <input className={styles.thumbnailName}value={thumbnailName} placeholder='썸네일'disabled={true} />
                <label htmlFor="thumbnailFile">업로드</label>
                
                <input className={styles.input} id='thumbnailFile' type="file" name='userFile2'
                onChange={isThumbUpload} />
                <input className={styles.submitButton} type="submit"/>
            </form>

        </div>
    )
}
function UploadModal(){
    const [isModalVisible, setVisible] = useState<boolean>(false);
    const modalVisibleChange = ()=>{
        setVisible(!isModalVisible);
    }
    return(
        <div className={styles.modalContainer}>
            <button onClick={modalVisibleChange}>음악 업로드</button>
            {isModalVisible && <UploadModalInner/>}
        </div> 
    )
}

export default UploadModal