import React, { useState, useRef, forwardRef } from "react";
import '../../../stylesheets/Progress.scss';

interface progress {
  tops?: (string | number | null | HTMLImageElement)[];
  lefts?: (string | number | null | HTMLImageElement)[];
  rights?: (string | number | null | HTMLImageElement)[];
  bottoms?: (string | number | null | HTMLImageElement)[];
  ref: any;
  min?: number | null;
  max?: number | null;
};

function Progress ({ tops, lefts, rights, bottoms, ref, min, max } : progress) {
  const Target = ref;
  const ProgressInput = useRef<HTMLInputElement>(null);
  // const [musicPlayerState, setMusicPlayerState] = useState({
  //   currentTime: 0,
  //   volume: 0.5,
  //   backupVolume: 0.5
  // });

  // function updateCurrentTime() {
  //   const playingMusic = musicControl.current;
  //   const playingMusicProgress = musicProgress.current;
  //   if (playingMusic && playingMusicProgress) {
  //     playingMusicProgress.value = playingMusic.currentTime.toString();
  //     setMusicPlayerState({
  //       ...musicPlayerState,
  //       currentTime: playingMusic.currentTime
  //     });
  //     playingMusicProgress.style.backgroundSize = (playingMusic.currentTime * 100) / playingMusic.duration + '% 100%';
  //   }
  // }

  function changeInputRange(e: React.BaseSyntheticEvent) {
    const ProgressInputCurrent = ProgressInput.current;
    if (ProgressInputCurrent) {
      const currentValue = (e.target.value * 100) / e.target.max
      ProgressInputCurrent.style.backgroundSize = currentValue + "% 100%";
    }
  }

  // function changeFormatToTime(number: number) {
  //   const minute = Math.floor(number / 60);
  //   const second = Math.floor(number % 60);
  //   const formattedSecond = second >= 10 ? second : '0' + second.toString();

  //   return `${minute}:${formattedSecond}`;
  // }

  // useEffect (() => {
  //   setMusicPlayerState({
  //     ...musicPlayerState,
  //     currentTime: 0,
  //     volume: 0.5,
  //   })
  //   toggleVolume();
  //   toggleVolume();
  // }, []);

  return (
    <div className="progress-background">
      {tops ?
      <div className="progress-vertical">
        {tops.map(el => <span className="progress-text">{el}</span>)}
      </div> : null}
      <div className="progress-horizontal">
        {lefts ? 
        <div className="progress-neighbor progress-left">
          {lefts.map(el => <span className="progress-text">{el}</span>)}
        </div>
        : null}
        <input
          className="progress-bar"
          ref={ProgressInput}
          type="range"
          min={min || 0}
          max={max || 100}
          onInput={changeInputRange}
        />
        {rights ? 
        <div className="progress-neighbor progress-right">
          {rights.map(el => <span className="progress-text">{el}</span>)}
        </div>
        : null}
      </div>
      {bottoms ? 
      <div className="progress-vertical">
        {bottoms.map(el => <span className="progress-text">{el}</span>)}
      </div> : null}
    </div>
  )
}

Progress.defaultProps = {
  tops: [0, 1],
  ref: null,
  bottoms: null,
  lefts: null,
  rights: null,
}

export default Progress;