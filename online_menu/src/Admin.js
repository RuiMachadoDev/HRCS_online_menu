import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importar ícones

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
      
      {/* Formulário de Adição de Novo Item */}
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

      {/* Lista de Itens do Cardápio */}
      <h3>Itens do Cardápio</h3>
      <div className="item-list">
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

      {/* Formulário de Edição */}
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
