import React, {useState, useRef} from 'react';
import UploadModal from "./UploadModal";
import {timeoutRef} from '../../types'
function HeaderComponent() {
  const timerRef = useRef<timeoutRef>({timer:setTimeout(() => {})})
  const [searchInput, setSearchInput] = useState("");

  function searchInputChange (e: React.ChangeEvent<HTMLInputElement>) {
    if(timerRef.current){
      clearTimeout(timerRef.current.timer!);
    }
    const searchTimer = setTimeout(() => {
      setSearchInput(e.target.value);
    }, 200);
    timerRef.current.timer = searchTimer;
  }

  function doSearch() {
    console.log("do Search!");
  }

  function searchInputSubmit (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      doSearch();
    }
  }

  return (
    <div className="header">
      <UploadModal />
      <div className="header-search">
        <input className="header-search-input" type="text" placeholder="검색어를 입력하세요" onChange={searchInputChange} onKeyPress={searchInputSubmit} />
        <img src="/icons/search.svg" alt="search" onClick={doSearch}/>
      </div>
    </div>
  )
}

export default HeaderComponent;