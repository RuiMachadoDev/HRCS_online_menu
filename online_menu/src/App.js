import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './App.css';
import './index.css';

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(items);
    };

    fetchMenuItems();
  }, []);

  const handleDropdownClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="container">
      <h1>Menu online</h1>
      <div className="menu">
        {categories.map(category => (
          <div key={category} className="menu-section">
            <button onClick={() => handleDropdownClick(category)} className="dropdown-btn">
              {category} {openCategory === category ? '▲' : '▼'}
            </button>
            {openCategory === category && (
              <div className="dropdown-content">
                {menuItems.filter(item => item.category === category).map(item => (
                  <div key={item.id} className="card">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} />
                    )}
                    <h2>{item.name || "Prato Sem Nome"}</h2>
                    <p>{item.description || "Descrição não disponível."}</p>
                    <p className="price">
                      {typeof item.price === 'number' ? item.price.toFixed(2) : "Preço não disponível"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
