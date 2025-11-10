require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();

// === Middleware cơ bản ===
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// === Thư mục uploads ===
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// === Mount routes ===
// try {
const routes = require('./src/routers'); // index.js export router
app.use('/api', routes);
console.log('Routes loaded successfully');
// } catch (err) {
//   console.error('Cannot load routes:', err.message);
//   app.use('/api', (req, res) => res.status(500).json({ message: 'Router module unavailable' }));
// }

// === Swagger (nếu có) ===
try {
  const { setupSwagger, swaggerPath } = require('./src/config/swagger');
  if (typeof setupSwagger === 'function') {
    setupSwagger(app);
    console.log(`Swagger UI available at ${swaggerPath || '/api-docs'}`);
  }
} catch (err) {
  console.warn('Cannot load swagger:', err.message);
}

// === Error handler ===
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// === Start server ===
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/api-docs`);
  });
}

module.exports = app;
