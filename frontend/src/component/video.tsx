import { useEffect, useState } from 'react';

// const flower = require('/music/FlowerDance.wav');

function Video() {
  const [music, setMusic] = useState('/music/FlowerDance.wav');

  const change = () => {
    if (music === '/music/FlowerDance.wav') setMusic('/music/test.mp3');
    else setMusic('/music/FlowerDance.wav');
  };

  return (
    <div>
      <video controls src={music}>
        <source type="video/mp4"></source>
      </video>
      <input value="노래" className="bts" type="button" onClick={change} />
    </div>
  );
}

export default Video;
