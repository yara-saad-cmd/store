import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingBtmHeader from './LoadingBtmhader';

function BtmHeader() {
  const [categories, setCategorys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategorys(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="btm-header">
      <div className="container">
        <nav className='btm-nav'>
          
          {loading ? (
           <LoadingBtmHeader />
          ) : (
            /* هنا شيلنا الـ <ul> ورجعنا الـ map مباشرة زي كودك القديم */
            categories.map((category) => (

             
                
             
                <span  key={category.slug}>
                     <Link to={`/category/${category.slug}`}> {category.name} </Link>
                </span>
             
             
            ))
          )}

        </nav>
      </div>
    </div>
  );
}

export default BtmHeader;