import {FileType, timeoutRef, fileUploadObject} from '../../types'
import * as _ from 'lodash'

const fileUploadController = (e:React.ChangeEvent<HTMLInputElement>, 
    setState:React.Dispatch<React.SetStateAction<FileType>>,
    state:FileType) =>{
    const curObj = _.cloneDeep(state);
    curObj.musicFile = e.target.files!
    curObj.musicName = e.target.files![0].name;
    setState(curObj);
}

const thumbnailUploadController = (e:React.ChangeEvent<HTMLInputElement>, 
    setState:React.Dispatch<React.SetStateAction<FileType>>,
    state:FileType) =>{
    const curObj = _.cloneDeep(state);
    curObj.thumbnailFile = e.target.files!
    curObj.thumbnailName = e.target.files![0].name;
    setState(curObj);
}

const checkSingerAndDescriptController = (
    descriptionRef:React.RefObject<HTMLTextAreaElement>,
    singerRef:React.RefObject<HTMLInputElement>
)=>{
    if(descriptionRef.current!.value === null || descriptionRef.current!.value === '' || singerRef.current!.value === null || singerRef.current!.value === ''){
        return false;
    }else{
    return true;
    }

}

const checkFileController=(
    musicFileRef:React.RefObject<HTMLInputElement>,
    thumbnailFileRef:React.RefObject<HTMLInputElement>,
    uploadedFile:FileType
)=>{
    if(musicFileRef.current!.value ===null || musicFileRef.current!.value==='' || thumbnailFileRef.current!.value === null || thumbnailFileRef.current!.value === '' ){
        if(uploadedFile.musicFile===null || uploadedFile.thumbnailFile === null){
            return false;
        }else{
            return true;
        }
    }else{
    return true;
    }
}

function fileUploadMethodController(fileUploadObj:fileUploadObject){
    if(!checkSingerAndDescriptController(fileUploadObj.descriptionRef, fileUploadObj.singerRef)){
        fileUploadObj.textAlertRef.current!.style.opacity = '1';
        setTimeout(() => {
            if (fileUploadObj.textAlertRef.current) fileUploadObj.textAlertRef.current!.style.opacity = '0';
        }, 3000);
        return;
    }
    if(!checkFileController(fileUploadObj.musicFileRef, fileUploadObj.thumbnailFileRef, fileUploadObj.uploadedFile)){
        fileUploadObj.fileAlertRef.current!.style.opacity = '1';
        setTimeout(() => {
            if (fileUploadObj.fileAlertRef.current) fileUploadObj.fileAlertRef.current!.style.opacity = '0';
        }, 3000);
        return;
    }
    if(fileUploadObj.timerRef.current){
        clearTimeout(fileUploadObj.timerRef.current.timer!);
    }
    const uploadTimer = setTimeout(async ()=>{
        const formData = new FormData();
        Object.values(fileUploadObj.uploadedFile.musicFile!).forEach(el=>{
            formData.append('userFile1', el);
        });
        Object.values(fileUploadObj.uploadedFile.thumbnailFile!).forEach(el=>{
            formData.append('userFile2', el);
        })
        formData.append('singer', fileUploadObj.uploadedFile.singer!);
        formData.append('description', fileUploadObj.uploadedFile.descript!);
        await fetch('/upload', {
            method:'POST',
            body: formData,
        })
        const curObj = resetFileState(_.cloneDeep(fileUploadObj.uploadedFile), fileUploadObj.descriptionRef, fileUploadObj.singerRef);
        fileUploadObj.setUploadedFile(curObj);
        fileUploadObj.musicFileRef.current!.value = '';
        fileUploadObj.thumbnailFileRef.current!.value='';
    }, 200)
    fileUploadObj.timerRef.current.timer = uploadTimer;
    return;
}

const resetFileState = (
    curObj:FileType,
    descriptionRef:React.RefObject<HTMLTextAreaElement>,
    singerRef:React.RefObject<HTMLInputElement>,):FileType => {
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

const writeSingerNameController = (
    e: React.ChangeEvent<HTMLInputElement>,
    timerRef: React.MutableRefObject<timeoutRef>,
    uploadedFile:FileType,
    setUploadedFile:React.Dispatch<React.SetStateAction<FileType>>,
) =>{
    if(timerRef.current){
        clearTimeout(timerRef.current.timer!);
    }
    const timer = setTimeout(function(){
        const curObj = _.cloneDeep(uploadedFile);
        curObj.singer = e.target.value;
        setUploadedFile(curObj);
    }, 200)
    timerRef.current!.timer = timer;
} 

const writeDescriptionController = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    timerRef: React.MutableRefObject<timeoutRef>,
    uploadedFile:FileType,
    setUploadedFile:React.Dispatch<React.SetStateAction<FileType>>,
) =>{
    if(timerRef.current){
        clearTimeout(timerRef.current.timer!);
    }
    const timer = setTimeout(function(){
        const curObj = _.cloneDeep(uploadedFile);
        curObj.descript = e.target.value;
        setUploadedFile(curObj);
    }, 200)
    timerRef.current!.timer = timer;
} 

const dropListenerController = (
    event: React.DragEvent<HTMLDivElement>,
    uploadedFile:FileType,
    setUploadedFile:React.Dispatch<React.SetStateAction<FileType>>,
    alertRef:React.RefObject<HTMLDivElement>) =>{
    overrideEventDefaults(event);
    const curObj = _.cloneDeep(uploadedFile);
    const imageType = { 'image/jpeg':true, 'image/png':true}
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        if(event.dataTransfer.files[0].type in imageType){
            curObj.thumbnailFile = event.dataTransfer.files;
            curObj.thumbnailName = event.dataTransfer.files[0].name;
        }else if(event.dataTransfer.files[0].type=== 'audio/mpeg'){
            curObj.musicFile = event.dataTransfer.files;
            curObj.musicName = event.dataTransfer.files[0].name;
        }else{
            alertRef.current!.style.opacity = '1';
            setTimeout(() => {
                if (alertRef.current) alertRef.current!.style.opacity = '0';
            }, 3000);
        }
    }
    setUploadedFile(curObj);
}

const overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
};

const uploadController = {
    fileUploadController:fileUploadController,
    thumbnailUploadController:thumbnailUploadController,
    fileUploadMethodController:fileUploadMethodController,
    writeSingerNameController:writeSingerNameController,
    writeDescriptionController:writeDescriptionController,
    dropListenerController:dropListenerController
}

export default uploadController