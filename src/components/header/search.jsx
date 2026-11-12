import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { useLocation, useNavigate } from 'react-router-dom'
import "./Search.css"
import { supabase } from '../../supabaseClient'

const MIN_CHARS = 2

function Search() {
    const [search, setsearch] = useState("")
    const [suggestions, setsuggestions] = useState([]) // { id, title, image }
    const [activeIndex, setActiveIndex] = useState(-1) // العنصر المحدد بالأسهم

    const [history, sethistory] = useState(() => {
      try {
          const saved = localStorage.getItem('mySearchHistory');
          const parsed = saved ? JSON.parse(saved) : [];
          return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
          console.error("خطأ في قراءة سجل البحث:", error);
          return [];
      }
    })

    const [showDropdown, setShowDropdown] = useState(false)

    const locachan = useLocation()
    const navigat = useNavigate()

    // مزامنة الـ input مع الرابط (URL)
    useEffect(() => {
        const params = new URLSearchParams(locachan.search);
        setsearch(params.get('query') || "");
    }, [locachan.search]);

    const executeSearch = (term) => {
        const trimmedTerm = term.trim();
        if (trimmedTerm) {
            const newHistory = [trimmedTerm, ...history.filter(h => h !== trimmedTerm)].slice(0, 5);
            sethistory(newHistory);
            localStorage.setItem('mySearchHistory', JSON.stringify(newHistory));

            setShowDropdown(false);
            setActiveIndex(-1);
            setsearch(trimmedTerm);

            navigat(`/search?query=${encodeURIComponent(trimmedTerm)}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        executeSearch(search);
    }

    useEffect(() => {
        let isCancelled = false;

        const fetchSuggestions = async () => {
            try {
                // البحث والتقريب بيحصلوا في القاعدة (suggest_products)
                const { data, error } = await supabase.rpc('suggest_products', { q: search });

                if (isCancelled) return;

                if (error) {
                    console.error("خطأ في جلب المقترحات:", error);
                    setsuggestions([]);
                    return;
                }

                setsuggestions(data || []);
                setActiveIndex(-1);
            } catch (error) {
                if (!isCancelled) {
                    console.error("حدث خطأ:", error);
                    setsuggestions([]);
                }
            }
        };

        const time = setTimeout(() => {
            if (search.trim().length >= MIN_CHARS) {
                fetchSuggestions();
            } else {
                setsuggestions([]);
            }
        }, 300);

        return () => {
            isCancelled = true;
            clearTimeout(time);
        };
    }, [search]);

    useEffect(() => {
        setShowDropdown(false);
    }, [locachan])

    // القايمة المعروضة حالياً: السجل لو الخانة فاضية، وإلا الاقتراحات
    const listItems = search === "" ? history : suggestions.map((item) => item.title)
    const isOpen = showDropdown && listItems.length > 0

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowDropdown(false);
            setActiveIndex(-1);
            return;
        }

        if (listItems.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setShowDropdown(true);
            setActiveIndex((prev) => (prev + 1) % listItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setShowDropdown(true);
            setActiveIndex((prev) => (prev <= 0 ? listItems.length - 1 : prev - 1));
        } else if (e.key === 'Enter' && isOpen && activeIndex >= 0 && activeIndex < listItems.length) {
            e.preventDefault();
            executeSearch(listItems[activeIndex]);
        }
    }

    return (
        <div className='search desktop-search' onBlur={() => setTimeout(() => setShowDropdown(false), 200)}>
            <form onSubmit={handleSubmit} className='search-box'>
                <button type='submit' aria-label="بحث"><IoSearchOutline /></button>
                <input
                    type='text'
                    name='search'
                    id='search'
                    value={search}
                    placeholder='ما الذي تبحث عنه'
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls="search-suggestions"
                    aria-autocomplete="list"
                    aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e) => {
                        setsearch(e.target.value);
                        setActiveIndex(-1);
                        setShowDropdown(true);
                    }}
                    onKeyDown={handleKeyDown}
                    autoComplete='off'
                />
            </form>

            {isOpen && (
                <ul className="suggestions" id="search-suggestions" role="listbox">
                    {/* سجل البحث الشخصي */}
                    {search === "" && history.map((item, index) => (
                        <li key={`hist-${item}`} role="none">
                            <button
                                type="button"
                                role="option"
                                id={`search-option-${index}`}
                                aria-selected={activeIndex === index}
                                className={`history-item ${activeIndex === index ? 'active' : ''}`}
                                onMouseDown={() => executeSearch(item)}
                            >
                                {item}
                            </button>
                        </li>
                    ))}

                    {/* اقتراحات من أسماء المنتجات (بتحمّل الأخطاء الإملائية) */}
                    {search !== "" && suggestions.map((item, index) => (
                        <li key={`word-${item.id}`} role="none">
                            <button
                                type="button"
                                role="option"
                                id={`search-option-${index}`}
                                aria-selected={activeIndex === index}
                                className={`your-class suggestion-item ${activeIndex === index ? 'active' : ''}`}
                                onMouseDown={() => executeSearch(item.title)}
                            >
                                {item.image && (
                                    <img className="suggestion-img" src={item.image} alt="" loading="lazy" />
                                )}
                                <span>{item.title}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Search;