import React, { useRef, useEffect } from "react";
import '../../stylesheets/Progress.scss';

type DecoType = (string | number | null | HTMLImageElement)[];

interface TypeProgress {
  tops?: DecoType,
  lefts?: DecoType,
  rights?: DecoType,
  bottoms?: DecoType,
  disabled?: boolean,
  min: number,
  max: number,
  progressDegree: number,
  onUseEffect: () => void | null,
  onChange: (arg: number) => void | null,
}

function Progress ( prop: any ) {
  const {
    tops, lefts, bottoms, rights,
    min, max, progressDegree, disabled = false,
    onUseEffect,
    onChange,
  }: TypeProgress = { ...prop.prop };
  const ProgressInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onUseEffect) { onUseEffect() }
  }, [onUseEffect]);

  useEffect(() => {
    const ProgressInputCurrent = ProgressInput.current;
    if (ProgressInputCurrent) {
      ProgressInputCurrent.value = (progressDegree / 100 * parseFloat(ProgressInputCurrent.max)).toString();
      ProgressInputCurrent.style.backgroundSize = progressDegree + "% 100%";
    }
  }, [progressDegree]);

  function changeInputRange(e: React.BaseSyntheticEvent) {
    if (onChange) { onChange(e.target.value) }
  }

  return (
    <div className="progress-background">
      {tops &&
      <div className="progress-vertical">
        {tops.map(el => <span className="progress-text">{el}</span>)}
      </div>}
      <div className="progress-horizontal">
        {lefts && 
        <div className="progress-neighbor progress-left">
          {lefts.map(el => <span className="progress-text">{el}</span>)}
        </div>}
        <input
          className="progress-bar"
          ref={ProgressInput}
          type="range"
          min={min || 0}
          max={max || 1}
          disabled={disabled}
          onInput={changeInputRange}
        />
        {rights &&
        <div className="progress-neighbor progress-right">
          {rights.map(el => <span className="progress-text">{el}</span>)}
        </div>}
      </div>
      {bottoms &&
      <div className="progress-vertical">
        {bottoms.map(el => <span className="progress-text">{el}</span>)}
      </div>}
    </div>
  )
}

export default Progress;