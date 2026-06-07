const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const client = require('prom-client');

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://mongodb:27017/3tierapp';

// Prometheus Metrics setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

app.use(cors());
app.use(express.json());

// Middleware to measure request duration
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    // Label values must be strings. res.statusCode is a number.
    end({ 
      method: req.method, 
      route: req.path, 
      code: String(res.statusCode) 
    });
  });
  next();
});

// MongoDB Connection
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected to:', mongoUri))
  .catch(err => console.error('MongoDB connection error:', err));

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
});
const Item = mongoose.model('Item', ItemSchema);

// Routes
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/items', async (req, res) => {
  console.log('Received POST request with body:', req.body);
  const { name, value } = req.body;
  
  if (!name || !value) {
    return res.status(400).json({ message: 'Name and value are required' });
  }

  const item = new Item({ name, value });
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error saving item:', err);
    res.status(500).json({ message: err.message });
  }
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/', (req, res) => {
  res.send('3-Tier App Backend is running');
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
