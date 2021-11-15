import { useEffect, useState } from 'react';
import { useSocket } from '../context/MyContext';
import { Music } from '../types';

function Video() {
  const socket: any = useSocket();
  const [music, setMusic] = useState<string>();

  useEffect(() => {
    socket.emit('currentMusicReq');
    console.log('useEEEEE');
  }, []);

  useEffect(() => {
    socket.on('nextMusicRes', (data: Music) => {
      setMusic(data.src);
    });

    socket.on('currentMusicRes', (data: Music) => {
      console.log(data);
      setMusic(data.src);
    });

    return () => {
      socket.off('nextMusicRes');
      socket.off('currentMusicRes');
    };
  }, []);

  useEffect(() => {
    const aud: any = document.getElementById('video')!;
    aud.onended = function () {
      socket.emit('nextMusicReq');
    };

    aud.onpause = () => {
      socket.emit('pause', '멈추시오');
    };

    aud.onplay = () => {
      socket.emit('play', '사작하시오');
    };

    aud.onseeked = () => {
      socket.emit('moving', aud.currentTime);
    };

    socket.on('requestTime', (data: string) => {
      console.log('방장이다.');
      socket.emit('responseTime', aud.currentTime);
    });

    socket.on('sync', (data: string) => {
      aud.currentTime = data;
    });

    socket.on('clientPause', (data: string) => {
      aud.pause();
    });

    socket.on('clientPlay', (data: string) => {
      aud.play();
    });

    socket.on('clientMoving', (data: string) => {
      aud.currentTime = data;
    });
  }, []);

  const change = () => {
    socket.emit('nextMusicReq');
  };

  return (
    <div>
      <video id="video" controls autoPlay={true} muted={true} src={music}>
        <source type="video/mp4"></source>
      </video>
      <input value="노래" className="bts" type="button" onClick={change} />
    </div>
  );
}

export default Video;
