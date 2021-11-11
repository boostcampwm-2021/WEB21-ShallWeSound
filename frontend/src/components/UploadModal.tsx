import styles from '../stylesheets/style.module.scss';
import {useState} from 'react';

function UploadModalInner(){
    const [musicName, setMusicName] = useState<string>("파일선택");
    const [thumbnailName, setThumbnailName] = useState<string>("파일선택");
    const [singer, setSinger] = useState<string>();
    const [descript, setDescript] = useState<string>();
    const [musicFile, setMusicFile] = useState<FileList>();
    const [thumbnailFile, setThumbnailFile] = useState<FileList>();
    const isFileUpload = (e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e);
        setMusicFile(undefined);
        setMusicFile(e.target.files!);
        setMusicName(e.target.files![0].name);
    }
    const isThumbUpload = (e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e);
        setThumbnailFile(undefined);
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
        formData.append('singer', singer!);
        formData.append('description', descript!);
        fetch("/upload", {
            method: "POST",
            body: formData
        }).then((res)=>{
            console.log(res)
            setMusicName("파일선택");
            setThumbnailName("파일선택");
            setMusicFile(undefined);
            setThumbnailFile(undefined);
            setSinger('');
            setDescript('');
        });
    }
    const writeSingerName = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setSinger(e.target.value);
    }
    const writeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setDescript(e.target.value);
    }
    return(
        <div className={styles.UploadModalInner}>
            <div className={styles.uploadForm}>
                <div className={styles.singerForm}>
                    <div className={styles.title}>아티스트</div>
                    <input className={styles.singer} value={singer} type='text' placeholder='아티스트 이름'
                    onChange={writeSingerName}/>
                </div>
                <div className={styles.descriptForm}>
                    <div className={styles.title}>곡 설명</div>
                    <textarea className={styles.descript} value={descript}  placeholder='곡 설명을 입력하세요'
                    onChange={writeDescription}/>
                </div>
                <div className={styles.musicForm}>
                    <div className={styles.title}>음악파일</div>
                    <input className={styles.musicName} value={musicName} placeholder='음악파일' disabled={true}/>
                    <label htmlFor="musicFile">첨부</label>
                    <input className={styles.input} id="musicFile"  type="file" name='userFile1' 
                    onChange={isFileUpload} />
                </div>
                <div className={styles.thumbnailForm}>
                    <div className={styles.title}>썸네일 이미지</div>
                    <input className={styles.thumbnailName}value={thumbnailName} placeholder='썸네일'disabled={true} />
                    <label htmlFor="thumbnailFile">첨부</label>
                    <input className={styles.input} id='thumbnailFile' type="file" name='userFile2'
                    onChange={isThumbUpload} />
                </div>
                
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
            <button className={styles.headerUploadButton} onClick={modalVisibleChange}>음악 업로드</button>
            {isModalVisible && <UploadModalInner/>}
        </div> 
    )
}

export default UploadModal