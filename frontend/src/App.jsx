import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

function App() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const API_URL = 'http://3.6.160.64:5000'

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/api/items`)
      setItems(res.data)
      setStatus('')
    } catch (err) {
      console.error('Error fetching items:', err)
      setStatus('Error connecting to backend')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !value) return
    
    setLoading(true)
    try {
      await axios.post(`${API_URL}/api/items`, { name, value })
      setName('')
      setValue('')
      fetchItems()
    } catch (err) {
      console.error('Error adding item:', err)
      setStatus('Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>3-Tier MERN Explorer</h1>
        
        <form onSubmit={handleSubmit} className="form-group">
          <h2>Add New Entry</h2>
          <input 
            type="text" 
            placeholder="Item Name (e.g. Server)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Description (e.g. t3.medium)" 
            value={value} 
            onChange={(e) => setValue(e.target.value)} 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Add to Database'}
          </button>
        </form>

        <div className="list-section">
          <h2>Stored Items</h2>
          {status && <div className={`status-msg status-error`}>{status}</div>}
          
          {items.length === 0 && !loading ? (
            <div className="status-msg">No items found in MongoDB.</div>
          ) : (
            <ul className="item-list">
              {items.map((item, index) => (
                <li key={index} className="item-row">
                  <span className="item-name">{item.name}</span>
                  <span className="item-value">{item.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
