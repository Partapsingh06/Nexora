import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryBarSkeleton } from './SkeletonLoader';
import api from '../services/api';

const CategoryBar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('[CategoryBar Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (catId) => {
    navigate(`/products?category=${catId}`);
  };

  return (
    <div className="bg-white shadow-card border-b border-nexora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {loading ? (
          <CategoryBarSkeleton />
        ) : (
          <div className="flex items-center justify-start sm:justify-around overflow-x-auto gap-6 sm:gap-4 no-scrollbar scroll-smooth px-1 sm:px-0 py-0.5">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryClick(cat._id)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0 focus:outline-none touch-manipulation"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-50 border border-gray-100 p-0.5 shadow-sm group-hover:scale-105 group-hover:border-nexora-blue transition-all">
                  <img
                    src={cat.image || 'https://via.placeholder.com/80'}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-nexora-blue transition text-center max-w-[90px] truncate">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBar;
