import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import './Menu.css';
import './Admin.css';


function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password} /* Corrigido: Removido o atributo duplicado */
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function Admin() {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '', imageUrl: '' });
  const [editingItem, setEditingItem] = useState(null);

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

  const handleAddItem = async () => {
    await addDoc(collection(db, 'menuItems'), {
      ...newItem,
      price: parseFloat(newItem.price),
    });
    setNewItem({ name: '', description: '', price: '', category: '', imageUrl: '' });
    window.location.reload();
  };

  const handleEditItem = async () => {
    await updateDoc(doc(db, 'menuItems', editingItem.id), {
      ...editingItem,
      price: parseFloat(editingItem.price),
    });
    setEditingItem(null);
    window.location.reload();
  };

  const handleDeleteItem = async (id) => {
    await deleteDoc(doc(db, 'menuItems', id));
    window.location.reload();
  };

  return (
    <div className="admin-container">
      <h2>Administração do Cardápio</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Nome"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descrição"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Preço"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Categoria"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL da Imagem"
          value={newItem.imageUrl}
          onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
        />
        <button onClick={handleAddItem}>Adicionar Item</button>
      </div>
      <h3>Itens do Cardápio</h3>
      {menuItems.map(item => (
        <div key={item.id} className="menu-item">
          {editingItem?.id === item.id ? (
            <>
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              />
              <input
                type="text"
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              />
              <input
                type="number"
                value={editingItem.price}
                onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
              />
              <input
                type="text"
                value={editingItem.category}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
              />
              <input
                type="text"
                value={editingItem.imageUrl}
                onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
              />
              <button onClick={handleEditItem}>Salvar</button>
              <button onClick={() => setEditingItem(null)}>Cancelar</button>
            </>
          ) : (
            <>
              <p>{item.name}</p>
              <p>{item.description}</p>
              <p>{item.price}</p>
              <p>{item.category}</p>
              <img src={item.imageUrl} alt={item.name} />
              <button onClick={() => setEditingItem(item)}>Editar</button>
              <button onClick={() => handleDeleteItem(item.id)}>Remover</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function Menu() {
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
      <h1>Bem-vindo ao Hotel Rural Casa de Samaiões</h1>
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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/admin" element={user ? <Admin /> : <Login onLogin={() => setUser(true)} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
