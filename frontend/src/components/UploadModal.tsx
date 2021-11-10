import styles from './style.module.scss';

function UploadModal(){
    return(
        <div>
            <form action="upload" method="post" encType="multipart/form-data">
                <input type="file" name='userFile'/>
                <input type="submit"/>
            </form>
        </div>
    )
}

export default UploadModal