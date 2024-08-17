import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './css/Menu.css';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);

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

  return (
    <div className="menu-container">
      <h1>Cardápio</h1>
      <div className="menu">
        {menuItems.map(item => (
          <div key={item.id} className="card">
            <img src={item.imageUrl} alt={item.name} />
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p className="price">€{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
