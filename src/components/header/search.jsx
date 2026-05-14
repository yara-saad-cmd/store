import { hgroup } from 'framer-motion/client'
import React, { useEffect, useState } from 'react'
import { IoSearchOutline, IoTimeOutline } from 'react-icons/io5'
import { useLocation, useNavigate } from 'react-router-dom'

function Search() {
    const [search, setsearch] = useState("")
    const [suggesions, setsuggesions] = useState([]) // هنا هنخزن كلمات مش منتجات
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
    const handlsubnt = (e) => {
        e.preventDefault();
        executeSearch(search);
    }

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await fetch(`https://dummyjson.com/products/search?q=${search}`);
                const data = await res.json();
                
                if (data.products) {
                    // تحويل المنتجات إلى "كلمات بحث" فريدة ومختصرة
                    const keywords = new Set();
                    data.products.forEach(item => {
                        // بناخد أول كلمتين من العنوان عشان تكون "جملة بحث" احترافية
                        const shortTitle = item.title.split(' ').slice(0, 2).join(' ');
                        keywords.add(shortTitle.toLowerCase());
                    });
                    
                    setsuggesions(Array.from(keywords).slice(0, 6));
                }
            } catch (error) {
                setsuggesions([]);
            }
        };

        const time = setTimeout(() => {
            if (search.trim() !== "") {
                fetchSuggestions();
            } else {
                setsuggesions([]);
            }
        }, 300);

        return () => clearTimeout(time);
    }, [search]);

    useEffect(() => {
        setShowDropdown(false);
    }, [locachan])

    return (
        <div className='search desktop-search' onBlur={() => setTimeout(() => setShowDropdown(false), 200)}>
            <form onSubmit={handlsubnt} className='search-pox'>
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

            {showDropdown && (suggesions.length > 0 || (search === "" && history.length > 0)) && (
                <ul className="suggesions">
                    {/* سجل البحث الشخصي */}
                    {search === "" && history.map((item, index) => (
                        <li key={`hist-${index}`} onMouseDown={() => executeSearch(item)}>
                           <IoTimeOutline /> {item}
                        </li>
                    ))}

                    {/* مقترحات كلمات البحث الشائعة (مستخرجة من البيانات) */}
                    {search !== "" && suggesions.map((word, index) => (
                        <li key={`word-${index}`} onMouseDown={() => executeSearch(word)}>
                            <IoSearchOutline style={{fontSize: '0.9em', opacity: 0.6}} /> {word}
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

//     const [suggesions ,setsuggesions] = useState([])

//     const locachan = useLocation()

//     const navigat = useNavigate()


//     const handlsubnt = (e) => {
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
//           setsuggesions(data.produts.slice(0, 5) || []);
//         } catch (error) {
//           console.error("search error", error);
//           setsuggesions([]);
//         }
//       };
    
      
//       const time = setTimeout(() => {
//         if (search.trim() !== "") {
//           fetchSuggestions();
//         } else {
//           setsuggesions([]);
//         }
//       }, 300);
    
     
//       return () => clearTimeout(time);
    
//     }, [search]); 

  
//     useEffect(()=>{
//       setsuggesions([]);
//     },[locachan])

//   return (
//     <div className='search'>
//         <form onSubmit={handlsubnt} className='search-pox'>

//             <button type='submit' ><IoSearchOutline /></button>
//             <input type='text' name='search' id='search' placeholder='ما المنتج اللني تبحث' onChange={(e) => setsearch(e.target.value)} autoComplete='off'/>

//         </form>
//         {suggesions.length > 0 && (

//   <ul className="suggesions">

//     {suggesions.map((item) => (

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