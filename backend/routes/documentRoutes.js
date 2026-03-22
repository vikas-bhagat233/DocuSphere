const express = require('express');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  getDocumentFile,
  deleteDocument,
  getPublicDocumentById,
  getPublicDocumentFile,
  togglePublicStatus,
  getPublicPortfolio,
  updateDocumentFile,
  getDeletedDocuments,
  restoreDocument,
  permanentlyDeleteDocument
} = require('../controllers/documentController');

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/trash/deleted', protect, getDeletedDocuments);
router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocumentById);
router.put('/:id/file', protect, upload.single('file'), updateDocumentFile);
router.get('/:id/file', protect, getDocumentFile);
router.delete('/:id', protect, deleteDocument);
router.put('/:id/restore', protect, restoreDocument);
router.delete('/:id/permanent', protect, permanentlyDeleteDocument);
router.put('/:id/public', protect, togglePublicStatus);

// Public Routes
router.get('/public/:id', getPublicDocumentById);
router.get('/public/:id/file', getPublicDocumentFile);
router.get('/portfolio/:userId', getPublicPortfolio);

module.exports = router;