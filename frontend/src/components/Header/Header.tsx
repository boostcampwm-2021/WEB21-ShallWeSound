import React, { SyntheticEvent, useState } from 'react';
import UploadModal from "./UploadModal";


function HeaderComponent() {
  const [searchInput, setSearchInput] = useState("");

  function searchInputChange (e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
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