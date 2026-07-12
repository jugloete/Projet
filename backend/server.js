import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { collectionNames, models } from './src/models.js';
import { seedData } from './src/seedData.js';

const app = express();
const PORT = Number(process.env.PORT || 5000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internship_platform';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

function sanitizeDocument(document) {
  if (!document) return document;
  const value = document.toObject ? document.toObject() : { ...document };
  delete value._id;
  return value;
}

async function ensureSeedData() {
  const usersCount = await models.users.countDocuments();
  if (usersCount > 0) return;

  for (const name of collectionNames) {
    const payload = seedData[name] || [];
    if (payload.length) {
      await models[name].insertMany(payload, { ordered: false });
    }
  }
}

async function getSnapshot() {
  const entries = await Promise.all(
    collectionNames.map(async (name) => [name, (await models[name].find({}).lean()).map(sanitizeDocument)])
  );
  return Object.fromEntries(entries);
}

async function replaceCollection(name, rows = []) {
  if (!models[name]) throw new Error(`Collection inconnue: ${name}`);
  await models[name].deleteMany({});
  if (Array.isArray(rows) && rows.length > 0) {
    await models[name].insertMany(rows, { ordered: false });
  }
}

app.get('/api/health', async (_req, res) => {
  const state = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ ok: true, service: 'internship-platform-api', database: state, collections: collectionNames });
});

app.get('/api/snapshot', async (_req, res, next) => {
  try {
    res.json(await getSnapshot());
  } catch (error) {
    next(error);
  }
});

app.put('/api/snapshot', async (req, res, next) => {
  try {
    const snapshot = req.body || {};
    for (const name of collectionNames) {
      if (Array.isArray(snapshot[name])) {
        await replaceCollection(name, snapshot[name]);
      }
    }
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

app.get('/api/supervisors/:id/students', async (req, res, next) => {
  try {
    const supervisor = await models.users.findOne({ id: req.params.id, role: 'SUPERVISOR' }).lean();
    if (!supervisor) return res.status(404).json({ message: 'Superviseur introuvable.' });
    const assignedIds = Array.isArray(supervisor.assignedStudentIds) ? supervisor.assignedStudentIds : [];
    const rows = await models.students.find({
      id: { $in: assignedIds },
      supervisorId: req.params.id,
      isArchived: { $ne: true },
      status: { $in: ['accepte', 'en_stage'] }
    }).lean();
    res.json(rows.map(sanitizeDocument));
  } catch (error) {
    next(error);
  }
});

app.get('/api/:collection', async (req, res, next) => {
  try {
    const model = models[req.params.collection];
    if (!model) return res.status(404).json({ message: 'Collection introuvable.' });
    if (req.params.collection === 'students' && req.query.supervisorId) {
      const supervisor = await models.users.findOne({ id: req.query.supervisorId, role: 'SUPERVISOR' }).lean();
      const assignedIds = Array.isArray(supervisor?.assignedStudentIds) ? supervisor.assignedStudentIds : [];
      const rows = await model.find({
        id: { $in: assignedIds },
        supervisorId: req.query.supervisorId,
        isArchived: { $ne: true },
        status: { $in: ['accepte', 'en_stage'] }
      }).lean();
      return res.json(rows.map(sanitizeDocument));
    }
    res.json((await model.find({}).lean()).map(sanitizeDocument));
  } catch (error) {
    next(error);
  }
});

app.post('/api/:collection', async (req, res, next) => {
  try {
    const model = models[req.params.collection];
    if (!model) return res.status(404).json({ message: 'Collection introuvable.' });
    const document = await model.create(req.body);
    res.status(201).json(sanitizeDocument(document));
  } catch (error) {
    next(error);
  }
});

app.patch('/api/:collection/:id', async (req, res, next) => {
  try {
    const model = models[req.params.collection];
    if (!model) return res.status(404).json({ message: 'Collection introuvable.' });
    const document = await model.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: false }).lean();
    if (!document) return res.status(404).json({ message: 'Document introuvable.' });
    res.json(sanitizeDocument(document));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/:collection/:id', async (req, res, next) => {
  try {
    const model = models[req.params.collection];
    if (!model) return res.status(404).json({ message: 'Collection introuvable.' });
    await model.deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: error.message || 'Erreur interne du serveur.' });
});

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    await ensureSeedData();
    app.listen(PORT, () => {
      console.log(`API MongoDB prête sur http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('Impossible de se connecter à MongoDB:', error.message);
    process.exit(1);
  });
