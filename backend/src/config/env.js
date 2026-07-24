require('dotenv').config();

const requiredEnvVars = ['DB_URL', 'JWT_SECRET_KEY', 'REFRESH_TOKEN_SECRET', 'CLIENT_URL'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`[CRITICAL] Thiếu biến môi trường bắt buộc: ${envVar}. Vui lòng kiểm tra file backend/.env`);
  }
}

const env = {
  PORT: process.env.PORT || 6001,
  DB_URL: process.env.DB_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  SERVER_URL: process.env.SERVER_URL || `http://localhost:${process.env.PORT || 6001}`,
};

module.exports = env;
