import {FileType, timeoutRef} from '../../types'
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

const fileUploadMethodController = (
    descriptionRef:React.RefObject<HTMLTextAreaElement>,
    singerRef:React.RefObject<HTMLInputElement>,
    musicFileRef:React.RefObject<HTMLInputElement>,
    thumbnailFileRef:React.RefObject<HTMLInputElement>,
    uploadedFile:FileType,
    setUploadedFile:React.Dispatch<React.SetStateAction<FileType>>,
    timerRef: React.MutableRefObject<timeoutRef>
) =>{
    if(!checkSingerAndDescriptController(descriptionRef, singerRef)){
        alert('아티스트 이름과 곡 설명은 반드시 적어주셔야 합니다!')
        return;
    }
    if(!checkFileController(musicFileRef, thumbnailFileRef, uploadedFile)){
        alert('mp3 파일과 썸네일 이미지 파일를 반드시 첨부해주셔야 합니다!')
        return;
    }
    if(timerRef.current){
        clearTimeout(timerRef.current.timer!);
    }
    const uploadTimer = setTimeout(async ()=>{
        const formData = new FormData();
        Object.values(uploadedFile.musicFile!).forEach(el=>{
            formData.append('userFile1', el);
        });
        Object.values(uploadedFile.thumbnailFile!).forEach(el=>{
            formData.append('userFile2', el);
        })
        formData.append('singer', uploadedFile.singer!);
        formData.append('description', uploadedFile.descript!);
        await fetch('/upload', {
            method:'POST',
            body: formData,
        })
        const curObj = resetFileState(_.cloneDeep(uploadedFile), descriptionRef, singerRef);
        setUploadedFile(curObj);
        musicFileRef.current!.value = '';
        thumbnailFileRef.current!.value='';
    }, 200)
    timerRef.current.timer = uploadTimer;
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
    alertRef:React.RefObject<HTMLDivElement>,
    musicFileRef:React.RefObject<HTMLInputElement>,
    thumbnailFileRef:React.RefObject<HTMLInputElement>,) =>{
    overrideEventDefaults(event);
    const curObj = _.cloneDeep(uploadedFile);
    const imageType = { 'image/jpeg':true, 'image/png':true}
    console.log(event.dataTransfer.files[0].type)
    console.log(typeof event.dataTransfer.files[0].type)
    console.log(event.dataTransfer.files[0].name);
    console.log(imageType);
    console.log(event.dataTransfer.files[0].type in imageType);
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