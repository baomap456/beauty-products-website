require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

// load routers an toàn (hỗ trợ CommonJS hoặc default export từ ESM)
let routes;
try {
  const routesMod = require('./src/routers/index.js');
  routes = routesMod && (routesMod.default || routesMod.router || routesMod);
} catch (err) {
  console.error('Không thể load routers:', err.message);
  // tạo router rỗng thay thế để server không crash
  routes = express.Router();
  routes.get('/', (req, res) => res.status(500).json({ message: 'Router module unavailable' }));
}

// load swagger setup an toàn (nếu file dùng import sẽ bị bắt và chỉ warn)
let setupSwagger = () => { };
let swaggerPath = '/api-docs';
try {
  const swaggerMod = require('./src/config/swagger.js');
  setupSwagger = swaggerMod.setupSwagger || swaggerMod.default || swaggerMod;
  // nếu module export đường dẫn mount cho swagger, dùng nó
  swaggerPath = swaggerMod.swaggerPath || swaggerMod.path || swaggerPath;
} catch (err) {
  // nếu file swagger dùng ESM "import" thì require sẽ fail — chỉ warn và tiếp tục
  console.warn('Không tìm thấy hoặc không thể load swagger setup:', err.message);
}

const app = express();
app.use(cors());
app.use(express.json());

// đảm bảo routes là middleware/Router hợp lệ trước khi mount
if (typeof routes === 'function' || (routes && typeof routes.use === 'function')) {
  app.use('/api', routes);
} else {
  console.warn('routes không phải middleware hợp lệ, dùng fallback router');
  const fallback = express.Router();
  fallback.use((req, res) => res.status(500).json({ message: 'Invalid router module' }));
  app.use('/api', fallback);
}

if (typeof setupSwagger === 'function') {
  try {
    setupSwagger(app);
  } catch (err) {
    console.warn('Lỗi khi khởi tạo Swagger:', err.message);
  }
}

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// nếu chạy file này trực tiếp thì start server
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    if (typeof setupSwagger === 'function') {
      console.log(`Swagger UI available at http://localhost:${port}${swaggerPath}`);
    } else {
      console.log('Swagger UI not available');
    }
  });
}

module.exports = app;
