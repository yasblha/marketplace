export interface InvoiceProduct {
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface InvoiceOrder {
  id: number;
  dateOrder: string | Date;
  totalAmount: number;
  OrderDetails: InvoiceProduct[];
}

export function printInvoice(order: InvoiceOrder) {
  const win = window.open('', '_blank');
  if (!win) return;
  const date = new Date(order.dateOrder).toLocaleDateString();
  const rows = order.OrderDetails.map(p =>
    `<tr><td>${p.productName}</td><td>${p.unitPrice}</td><td>${p.quantity}</td></tr>`
  ).join('');
  const html = `
    <html>
    <head>
      <title>Invoice ${order.id}</title>
      <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>Invoice #${order.id}</h1>
      <p>Date: ${date}</p>
      <table>
        <thead><tr><th>Product</th><th>Price</th><th>Qty</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <h3>Total: ${order.totalAmount}</h3>
    </body>
    </html>
  `;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
