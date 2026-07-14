import app, { ensureDatabaseReady } from '../backend/server.js';

export default async function handler(req, res) {
  await ensureDatabaseReady();
  return app(req, res);
}
