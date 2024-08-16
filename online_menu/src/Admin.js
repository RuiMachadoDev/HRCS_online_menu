import React, { useState, useEffect } from 'react';
import { FaPlus, FaList, FaSignOutAlt } from 'react-icons/fa';
import { db, auth } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './Admin.css'; // Importe o CSS aqui

function Admin() {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '', imageUrl: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [activePage, setActivePage] = useState('add');

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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Erro ao fazer logout:', error);
      });
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Painel de Administração</h2>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="admin-nav">
        <button onClick={() => setActivePage('add')} className={activePage === 'add' ? 'active' : ''}>
          <FaPlus /> Adicionar Novo Item
        </button>
        <button onClick={() => setActivePage('list')} className={activePage === 'list' ? 'active' : ''}>
          <FaList /> Lista de Itens
        </button>
      </div>

      {activePage === 'add' && (
        <div className="form">
          <h2>Adicionar Novo Item</h2>
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
      )}

      {activePage === 'list' && (
        <div className="item-list">
          <h2>Lista de Itens do Cardápio</h2>
          {menuItems.map(item => (
            <div key={item.id} className="menu-item">
              <div className="item-info">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p>Preço: €{item.price}</p>
                  <p>Categoria: {item.category}</p>
                </div>
              </div>
              <div className="item-actions">
                <button className="edit-btn" onClick={() => setEditingItem(item)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingItem && (
        <div className="edit-form">
          <h4>Editando: {editingItem.name}</h4>
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
          <button onClick={handleEditItem}>Salvar Alterações</button>
          <button onClick={() => setEditingItem(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default Admin;
