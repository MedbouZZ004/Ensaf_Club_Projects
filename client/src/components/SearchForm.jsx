import React from 'react'
import { FaSearch } from "react-icons/fa";
import { useSearchParams } from 'react-router-dom';
import SearchFormReset from './SearchFormReset';
const SearchForm = ({ setQuery }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query") || "";
    const [inputValue, setInputValue] = React.useState(query);
    React.useEffect(() => {
        setInputValue(query);
        setQuery(query);
    }, [query, setQuery]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const next = (inputValue || "").trim();
        if (next) {
            setSearchParams({ query: next });
            setQuery(next);
        } else {
            setSearchParams({});
            setQuery("");
        }
    };
    return (
    <form 
    onSubmit={handleSubmit}
    className='form' action="/"> 
        <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        name="club"
        className="input"
        type="text"
        placeholder="Search by name or category" />
        {
            query && (
                <SearchFormReset />
            )
        }
        <button type='submit' className="button">
            Search
            <FaSearch  size={15} />
        </button>
        
    </form>
  )
}

export default SearchForm