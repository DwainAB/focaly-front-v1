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
        setCategory('onBoardCamera');
        break;
      case 'appareils-photos':
        setCategory('photo');
        break;
      case 'accessoires':
        setCategory('accessories');
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