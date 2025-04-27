import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductList from "../../components/ProductList/ProductList.jsx";
import About from "../../components/About/About.jsx"

const Collection = () => {
  const { categoryURL } = useParams();
  const [category, setCategory] = useState('');

  useEffect(() => {
    const normalizedCategoryURL = decodeURIComponent(categoryURL);
    switch (normalizedCategoryURL) {
      case 'cameras-embarquée':
        setCategory('a55ddd8a-a7f4-401a-a631-1c7db03733b8');
        break;
      case 'appareils-photos':
        setCategory('b2a067e2-813d-48be-9e09-8bff2b85b90c');
        break;
      case 'accessoires':
        setCategory('76e1d025-90a0-4185-9af2-f4d3465a463a');
        break;
      case 'drones':
        setCategory('02c9ee6c-242a-4175-9c37-24d6cbc56dba');
        break;
      default:
        setCategory(normalizedCategoryURL);
    }
  }, [categoryURL]);
  

  return (
    <div>
      <ProductList category={category} />
      <About/>
    </div>
  );
};

export default Collection;