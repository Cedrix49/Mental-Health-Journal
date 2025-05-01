import express from 'express';
import { createEntry, getLastEntry, getAllEntries, updateEntry, deleteEntry } from '../controller/journalController.js';
import userAuth from '../middleware/userAuth.js';

const journalRouter = express.Router();

journalRouter.post('/new', userAuth, createEntry);
journalRouter.get('/last-entry', userAuth, getLastEntry);
journalRouter.get('/', userAuth, getAllEntries);
journalRouter.put('/:id', userAuth, updateEntry);
journalRouter.delete('/:id', userAuth, deleteEntry);


export default journalRouter;