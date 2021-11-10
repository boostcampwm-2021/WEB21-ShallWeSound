import React, { useState, useEffect } from 'react';
import config from '../config.host.json';

interface Music {
  MID: number;
  name: string;
  thumnail: string;
  singer: string;
  description: string;
  path: string;
}

const MusicSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<Music[]>([]);

  useEffect(() => {
    const fetchMusic = async () => {
      const res = await fetch(`${config.localhost}/api/music?keyword=${keyword}`);
      setResult(await res.json());
    };

    fetchMusic();
  }, [keyword]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <>
      <div>
        <input type="text" value={keyword} onChange={onChange}></input>
      </div>
      <div>
        {result.map((k: Music, i: number) => (
          <div key={i}>
            {k.name}
            {k.singer}
            {k.description}
          </div>
        ))}
      </div>
    </>
  );
};

export default MusicSearch;
