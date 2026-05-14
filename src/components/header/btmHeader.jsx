import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingBtmhedat from './LoadingBtmhedat';

function BtmHeader() {
  const [categorys, setCategorys] = useState([]);
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
    <div className="btm-hedar">
      <div className="continar">
        <nav className='ptm-nav'>
          
          {loading ? (
           <LoadingBtmhedat />
          ) : (
            /* هنا شيلنا الـ <ul> ورجعنا الـ map مباشرة زي كودك القديم */
            categorys.map((category) => (
              <li key={category.slug}>
                <Link to={`/category/${category.slug}`}> {category.name} </Link>
              </li>
            ))
          )}

        </nav>
      </div>
    </div>
  );
}

export default BtmHeader;