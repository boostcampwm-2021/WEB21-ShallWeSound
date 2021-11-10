import styles from './style.module.scss';
import {useState} from 'react';

function UploadModalInner(){
    const [musicName, setMusicName] = useState<string>("파일선택");
    const [thumbnailName, setThumbnailName] = useState<string>("파일선택");
    const [musicFile, setMusicFile] = useState<FileList>();
    const [thumbnailFile, setThumbnailFile] = useState<FileList>();
    const isFileUpload = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const f = e.target.files![0];
        setMusicFile(e.target.files!);
        setMusicName(e.target.files![0].name);
    }
    const isThumbUpload = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setThumbnailFile(e.target.files!);
        setThumbnailName(e.target.files![0].name);
    }
    const fileUploadMethod = ()=>{
        const formData = new FormData();
        Object.values(musicFile!).forEach((el)=>{
            formData.append('userFile1', el);
        })
        Object.values(thumbnailFile!).forEach((el)=>{
            formData.append('userFile2', el);
        })
        fetch("/upload", {
            method: "POST",
            body: formData
        }).then((res)=>{
            console.log(res)
            setMusicName("파일선택");
            setThumbnailName("파일선택");
        });
    }
    return(
        <div className={styles.UploadModalInner}>
            <div className={styles.uploadForm}>
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
                <button className={styles.submitButton} onClick={fileUploadMethod}>업로드</button>
            </div>

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