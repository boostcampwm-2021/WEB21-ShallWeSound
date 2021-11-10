import styles from './style.module.scss';

function UploadModal(){
    return(
        <div>
            <form action="upload" method="post" encType="multipart/form-data">
                <input type="file" name='userFile1' placeholder='음악파일'/>
                <input type="file" name='userFile2' placeholder='썸네일'/>
                <input type="submit"/>
            </form>
        </div>
    )
}

export default UploadModal