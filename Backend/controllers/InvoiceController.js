const User = require("../models/postgres_models/UserPg");
const Order = require("../models/postgres_models/Commande");
const OrderDetail = require("../models/postgres_models/DetailsCommande");
const Product = require("../models/postgres_models/ProductPg");
const Invoice = require("../models/postgres_models/Invoice");

const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid");

const calculateAmounts = (totalAmount) => {
  const vatRate = 0.20;
  const grossAmount = totalAmount;
  const netAmount = grossAmount / (1 + vatRate);
  const vatAmount = grossAmount - netAmount;
  return { netAmount, vatAmount, grossAmount };
};

const createInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderDetail,
          include: [{ model: Product }],
        },
        {
          model: User,
        },
      ],
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { netAmount, vatAmount, grossAmount } = calculateAmounts(order.total_amount);

    const invoice = await Invoice.create({
      uniref: uuidv4(),
      net_amount: netAmount,
      vat_amount: vatAmount,
      gross_amount: grossAmount,
      orderId: order.id,
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id, {
      include: {
        model: Order,
        include: [
          {
            model: OrderDetail,
            include: [{ model: Product }],
          },
          {
            model: User,
          },
        ],
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const doc = new PDFDocument();
    let filename = `invoice_${invoice.uniref}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', 'application/pdf');

    // Add styles
    doc.fontSize(25).text('Invoice', { align: 'center' });
    doc.fontSize(12).text(`Invoice Ref: ${invoice.uniref}`, { align: 'right' });
    doc.text(`Issue Date: ${invoice.issue_date}`, { align: 'right' });
    doc.text(`Order ID: ${invoice.orderId}`, { align: 'right' });
    doc.text(`Net Amount: €${invoice.net_amount.toFixed(2)}`, { align: 'right' });
    doc.text(`VAT Amount: €${invoice.vat_amount.toFixed(2)}`, { align: 'right' });
    doc.text(`Gross Amount: €${invoice.gross_amount.toFixed(2)}`, { align: 'right' });

    const user = invoice.Order.User;
    doc.text(`Customer: ${user ? user.name : 'Guest'}`, { align: 'left' });

    doc.text('Products:', { align: 'left' });
    invoice.Order.OrderDetails.forEach(detail => {
      doc.text(`${detail.Product.name} - €${detail.unit_price.toFixed(2)} x ${detail.quantity}`, { align: 'left' });
    });

    doc.end();
    doc.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createInvoice,
  downloadInvoice,
};
