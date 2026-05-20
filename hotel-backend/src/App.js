const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth',  require('./routes/Auth.routes'));
app.use('/api/admin', require('./routes/Admin.routes'));
// Các role khác thêm sau:
// app.use('/api/le-tan',       require('./routes/leitan.routes'));
// app.use('/api/housekeeping', require('./routes/housekeeping.routes'));
// app.use('/api/ke-toan',      require('./routes/ketoan.routes'));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});