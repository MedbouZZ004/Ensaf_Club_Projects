import React from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import { IoCloseSharp } from "react-icons/io5";
const SearchFormReset = () => {
  const [, setSearchParams] = useSearchParams();
    const resetForm = ()=>{
        const form = document.querySelector('form');
        if(form){
            form.reset();
        }
    // Clear the URL query param so state sync effects pick it up
    setSearchParams({});
    }
  return (
    <Link to="/" className='reset-link' onClick={resetForm}>
      <IoCloseSharp />
    </Link>
  )
}

export default SearchFormReset