import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  // Backend URL - in production this might be the server IP or a relative path if proxied
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/items`)
      setItems(res.data)
    } catch (err) {
      console.error('Error fetching items:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/api/items`, { name, value })
      setName('')
      setValue('')
      fetchItems()
    } catch (err) {
      console.error('Error adding item:', err)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>3-Tier MERN App</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Add Item</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ marginRight: '10px' }}
          />
          <input 
            type="text" 
            placeholder="Value" 
            value={value} 
            onChange={(e) => setValue(e.target.value)} 
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <div>
        <h2>Items</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <strong>{item.name}</strong>: {item.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
