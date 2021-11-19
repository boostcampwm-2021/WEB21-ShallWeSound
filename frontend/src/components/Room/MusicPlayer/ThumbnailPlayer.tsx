import { useState, MouseEventHandler } from 'react';


function ThumbnailPlayer({
  name,
  thumbnail,
  musicControl,
  onClick,
}: {
  name: string | undefined;
  thumbnail: string | undefined;
  musicControl: React.MutableRefObject<HTMLVideoElement | null>;
  onClick: MouseEventHandler;
}) {
  const [isHover, setIsHover] = useState(false);
  function onMouseEnter() {
    setIsHover(true);
  }
  function onMouseLeave() {
    setIsHover(false);
  }

  return (
    <div className="musicplayer-cover" onClick={onClick}>
      <div className="cover-hover" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {thumbnail ? (
          <img src={thumbnail} alt={name} />
        ) : (
          <img className="no-thumbnail" src="/icons/music-note.svg" alt="no-thumbnail" />
        )}
        {isHover && (
          <>
            <div className="only-hover"></div>
            {musicControl.current?.paused ? (
              <img className="icon" src="/icons/play.svg" alt="play" />
              ) : (
              <img className="icon" src="/icons/pause.svg" alt="pause" />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ThumbnailPlayer;