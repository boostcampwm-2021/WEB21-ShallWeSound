import React from "react";
import './MusicPlayer.scss'

function MusicPlayer({ }) {
  return (
    <>
      <div className="musicplayer">
        <div className="musicplayer-title">제 목</div>
        <div className="musicplayer-body">
          <p>&lt;</p>
          <div className="musicplayer-cover"></div>
          <p>&gt;</p>
        </div>
        <div className="musicplayer-timer">00:00 / 04:22</div>
        <progress></progress>
      </div>
    </>
  );
}

export default MusicPlayer;