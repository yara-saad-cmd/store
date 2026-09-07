
import React, { useEffect, useState } from 'react'
import { IoSearchOutline, IoTimeOutline } from 'react-icons/io5'
import { useLocation, useNavigate } from 'react-router-dom'
import "./Search.css"
import { supabase } from '../../supabaseClient'; // تأكدي من مسار الملف لديكِ

function Search() {
    const [search, setsearch] = useState("")
    const [suggestions, setsuggestions] = useState([]) // هنا هنخزن كلمات مش منتجات
    const [history, sethistory] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)

    const locachan = useLocation()
    const navigat = useNavigate()

    // أضف هذا الـ useEffect لمزامنة الـ input مع الرابط (URL)
useEffect(() => {
    const params = new URLSearchParams(locachan.search);
    const query = params.get('query');
    if (query) {
        setsearch(query);
    }
}, [locachan.search]); // سيعمل في كل مرة يتغير فيها الرابط

    
const executeSearch = (term) => {
    const trimmedTerm = term.trim();
    if (trimmedTerm) {
        // تحديث التاريخ
        const newHistory = [trimmedTerm, ...history.filter(h => h !== trimmedTerm)].slice(0, 5);
        sethistory(newHistory);
        localStorage.setItem('mySearchHistory', JSON.stringify(newHistory));
        
        // إخفاء القائمة المنسدلة وتحديث النص
        setShowDropdown(false);
        setsearch(trimmedTerm); 
        
        // الانتقال لصفحة البحث
        navigat(`/search?query=${encodeURIComponent(trimmedTerm)}`);
    }
};
    const handleSubmit = (e) => {
        e.preventDefault();
        executeSearch(search);
    }

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
              // البحث في جدول المنتجات عن التي تحتوي على نص البحث
              const { data, error } = await supabase
                .from('products')
                .select('title') // جلب عمود العنوان فقط
                .ilike('title', `%${search}%`) // البحث الجزيئي عن الكلمة
                .limit(6); // حد أقصى 6 نتائج للمقترحات
          
              if (error) {
                console.error("خطأ في جلب المقترحات:", error);
                setsuggestions([]);
                return;
              }
          
              if (data) {
                // استخراج عناوين المنتجات وعرضها
                const titles = data.map(item => item.title);
                setsuggestions(titles);
              }
            } catch (error) {
              console.error("حدث خطأ:", error);
              setsuggestions([]);
            }
          };
        const time = setTimeout(() => {
            if (search.trim() !== "") {
                fetchSuggestions();
            } else {
                setsuggestions([]);
            }
        }, 300);

        return () => clearTimeout(time);
    }, [search]);

    useEffect(() => {
        setShowDropdown(false);
    }, [locachan])

    return (
        <div className='search desktop-search' onBlur={() => setTimeout(() => setShowDropdown(false), 200)}>
            <form onSubmit={handleSubmit} className='search-box'>
                <button type='submit'><IoSearchOutline /></button>
                <input 
                    type='text' 
                    name='search' 
                    id='search' 
                    value={search}
                    placeholder='ما الذي تبحث عنه' 
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e) => {
                        setsearch(e.target.value);
                        setShowDropdown(true);
                    }} 
                    autoComplete='off'
                />
            </form>

            {showDropdown && (suggestions.length > 0 || (search === "" && history.length > 0)) && (
                <ul className="suggestions">
                    {/* سجل البحث الشخصي */}
                    {search === "" && history.map((item, index) => (
                        <li key={`hist-${index}`}>
                        <button
                          type="button"
                          className="history-item"
                          onMouseDown={() => executeSearch(item)}
                        >
                          {item}
                        </button>
                      </li>
                    ))}

                    {/* مقترحات كلمات البحث الشائعة (مستخرجة من البيانات) */}
                    {search !== "" && suggestions.map((word, index) => (
                        <li key={`word-${index}`}>
                        <button
                          type="button"
                          className="your-class"
                          onMouseDown={() => executeSearch(word)}
                        >
                          {word}
                        </button>
                      </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Search;



// الكود القديم




// import React, { useEffect, useState } from 'react'
// import { IoSearchOutline } from 'react-icons/io5'
// import { Link, useLocation, useNavigate } from 'react-router-dom'

// function Search() {

//     const [search ,setsearch] = useState("")

//     const [suggestions ,setsuggestions] = useState([])

//     const locachan = useLocation()

//     const navigat = useNavigate()


//     const handleSubmit = (e) => {
//         e.preventDefault()
//         if (search.trim()){
//              navigat(`/search?query=${encodeURIComponent(search.trim())}`)
//         } 
//     }


//     useEffect(() => {
//       const fetchSuggestions = async () => {
//         try {
//           const res = await fetch(`https://dummyjson.com/produts/search?q=${search}`);
//           const data = await res.json();
//           setsuggestions(data.produts.slice(0, 5) || []);
//         } catch (error) {
//           console.error("search error", error);
//           setsuggestions([]);
//         }
//       };
    
      
//       const time = setTimeout(() => {
//         if (search.trim() !== "") {
//           fetchSuggestions();
//         } else {
//           setsuggestions([]);
//         }
//       }, 300);
    
     
//       return () => clearTimeout(time);
    
//     }, [search]); 

  
//     useEffect(()=>{
//       setsuggestions([]);
//     },[locachan])

//   return (
//     <div className='search'>
//         <form onSubmit={handleSubmit} className='search-box'>

//             <button type='submit' ><IoSearchOutline /></button>
//             <input type='text' name='search' id='search' placeholder='ما المنتج اللني تبحث' onChange={(e) => setsearch(e.target.value)} autoComplete='off'/>

//         </form>
//         {suggestions.length > 0 && (

//   <ul className="suggestions">

//     {suggestions.map((item) => (

//       <li key={item.id}>

//         <Link to={`/produts/${item.id}`}>
//           {item.title}
//         </Link>

//       </li>

//     ))}

//   </ul>
// )}


//  </div>
//   )
// }

// export default Search