import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import TopHeader from "../components/header/topHeader";
import BtmHeader from "../components/header/btmHeader";
import PageTransition from "../components/PageTransaction";
import ProductLoading from "../components/body/product-loading";
import Goods from "../components/body/product";
import Footertwo from "../components/footer/footer2";
import { supabase } from "../supabaseClient";
import { normalizeAr } from "../components/utils/normalizeAr";

function Pgsearch() {
  const [loading, setloading] = useState(true);
  const [results, setresults] = useState([]);

  const query = new URLSearchParams(useLocation().search).get("query");

  useEffect(() => {
    const cleanQuery = (query || "").trim();

    let cancelled = false;

    const fetchResults = async () => {
      setloading(true);

      try {
        // البحث والتقريب بيحصلوا في القاعدة (search_products)، والمخفي مش بيرجع
        const { data, error } = await supabase.rpc("search_products", { q: cleanQuery });

        if (cancelled) return;

        if (error) {
          console.error("خطأ أثناء البحث في سوبابيز:", error);
          setresults([]);
        } else {
          setresults(data || []);
        }
      } catch (error) {
        console.error("search error", error);
        if (!cancelled) setresults([]);
      } finally {
        if (!cancelled) setloading(false);
      }
    };

    if (cleanQuery.length >= 2) {
      fetchResults();
    } else {
      setresults([]);
      setloading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [query]);

  // لو مفيش منتج فيه الكلمة زي ما هي، يبقى النتايج جت بالتقريب
  const isApproximate = useMemo(() => {
    const normalizedQuery = normalizeAr((query || "").trim().slice(0, 60));
    if (!normalizedQuery || results.length === 0) return false;

    return !results.some((product) =>
      normalizeAr(
        `${product.title} ${(product.keywords || []).join(" ")} ${product.description || ""}`
      ).includes(normalizedQuery)
    );
  }, [results, query]);

  const searchResults = results.length > 0 ? (
    <div className="goods">
      {isApproximate && (
        <p className="search-approx-note container">
          لم نجد تطابقاً تاماً لـ «{query}»، دي أقرب النتائج
        </p>
      )}
      <Goods
        products={results}
        title={`نتائج البحث عن: ${query}`}
      />
    </div>
  ) : (
    <h3 className="no-data-prudact container">
      لا توجد منتجات مطابقة للبحث
    </h3>
  );

  return (
    <PageTransition key={query}>
      <TopHeader />
      <BtmHeader />

      <div className="page-category">
        {loading ? (
          <ProductLoading key={query} />
        ) : (
          searchResults
        )}
      </div>

      <Footertwo />
    </PageTransition>
  );
}

export default Pgsearch;