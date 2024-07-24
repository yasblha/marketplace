const express = require('express');
const router = express.Router();
const InvoiceController = require('../../controllers/InvoiceController');

router.post('/invoices', InvoiceController.createInvoice);
router.get('/invoices/:id/download', InvoiceController.downloadInvoice);

module.exports = router;
