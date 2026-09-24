import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingBtmHeader from './LoadingBtmhader';
import { supabase } from '../../supabaseClient'; 
import "./BtmHeader.css";

function BtmHeader() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // دالة جلب الأقسام مباشرة من جدول categories في سوبابيز
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*'); // جلب كل الأعمدة (id, name, slug)

        if (error) {
          throw error;
        }

        if (data) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Error fetching categories from Supabase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="btm-header">
      <div className="container">
        <nav className='btm-nav'>
          
        {loading ? (
           <LoadingBtmHeader />
          ) : categories.length === 0 ? (
            null // أو أي رسالة بسيطة لو حابة، لكن الأفضل يفضل الشريط فاضي بهدوء بدل ما يبان له مساحة فاضية غريبة
          ) : (
            categories.map((category) => (
              <span key={category.id}>
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