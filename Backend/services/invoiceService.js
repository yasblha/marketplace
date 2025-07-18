import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import { jsPDF } from 'jspdf';
import Order from '../models/postgres_models/Commande.js';
import UserPg from '../models/postgres_models/UserPg.js';
import emailService from './emailService.js';

// Pour résoudre __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Service de gestion des factures
 */
class InvoiceService {
  /**
   * Compile le template HTML de la facture avec les données
   * @param {Object} data - Les données pour remplir le template
   * @returns {String} - Le HTML compilé
   */
  async compileTemplate(data) {
    try {
      const templatePath = path.join(__dirname, '../templates/invoice.html');
      const source = fs.readFileSync(templatePath, 'utf8');
      const template = ejs.compile(source);
      
      return template(data);
    } catch (error) {
      console.error('Error compiling invoice template:', error);
      throw new Error('Failed to compile invoice template');
    }
  }

  /**
   * Génère un PDF à partir du HTML
   * @param {String} html - Le HTML à convertir en PDF
   * @param {String} outputPath - Le chemin du fichier PDF à créer
   * @returns {String} - Le chemin du fichier PDF généré
   */
  async generatePDF(html, outputPath) {
    try {
      // Créer le dossier de destination si nécessaire
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Créer un document PDF
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4'
      });
      
      // Pipe son sortie vers un fichier
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);
      
      // Fonction pour attendre la fin de l'écriture
      const endWriteStream = () => {
        return new Promise((resolve, reject) => {
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });
      };
      
      // Extraire les données importantes du HTML (très simplifié)
      const invoiceData = this.extractDataFromHTML(html);
      
      // Dessiner l'en-tête
      doc.fontSize(20).text('FACTURE', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Facture N° : ${invoiceData.invoiceNumber}`, { align: 'right' });
      doc.text(`Date : ${invoiceData.invoiceDate}`, { align: 'right' });
      doc.moveDown(2);
      
      // Informations client
      doc.fontSize(14).text('Informations Client', { underline: true });
      doc.fontSize(10);
      doc.text(`Client : ${invoiceData.customerName}`);
      doc.text(`Email : ${invoiceData.customerEmail}`);
      doc.text(`Adresse : ${invoiceData.customerAddress}`);
      doc.moveDown(2);
      
      // Tableau des articles
      doc.fontSize(14).text('Détails de la commande', { underline: true });
      doc.moveDown();
      
      // En-tête du tableau
      let yPos = doc.y;
      const tableTop = yPos;
      const itemX = 50;
      const qtyX = 300;
      const priceX = 350;
      const totalX = 450;
      
      doc.fontSize(10);
      doc.text('Article', itemX, yPos);
      doc.text('Qté', qtyX, yPos);
      doc.text('Prix', priceX, yPos);
      doc.text('Total', totalX, yPos);
      
      yPos += 20;
      doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
      yPos += 10;
      
      // Lignes du tableau
      invoiceData.items.forEach(item => {
        doc.text(item.name, itemX, yPos);
        doc.text(item.quantity.toString(), qtyX, yPos);
        doc.text(`${item.unitPrice}€`, priceX, yPos);
        doc.text(`${item.itemTotal}€`, totalX, yPos);
        yPos += 20;
      });
      
      // Bas du tableau
      doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
      yPos += 10;
      
      // Total
      doc.text('Sous-total:', 350, yPos);
      doc.text(`${invoiceData.subtotal.toFixed(2)}€`, totalX, yPos);
      yPos += 20;
      
      doc.text('TVA (20%):', 350, yPos);
      doc.text(`${invoiceData.vatAmount.toFixed(2)}€`, totalX, yPos);
      yPos += 20;
      
      doc.fontSize(12).text('Total:', 350, yPos);
      doc.text(`${invoiceData.totalAmount.toFixed(2)}€`, totalX, yPos);
      
      // Pied de page
      doc.fontSize(10);
      const bottomOfPage = doc.page.height - 100;
      doc.text('Merci pour votre confiance!', 50, bottomOfPage, { align: 'center' });
      doc.text('Pour toute question concernant cette facture, contactez notre service client.', 50, bottomOfPage + 15, { align: 'center' });
      
      // Finaliser le document
      doc.end();
      
      // Attendre que l'écriture soit terminée
      await endWriteStream();
      
      return outputPath;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate invoice PDF');
    }
  }

  /**
   * Génère un PDF directement à partir des données
   * @param {Object} data - Les données pour la facture
   * @param {String} outputPath - Le chemin du fichier PDF à créer
   * @returns {String} - Le chemin du fichier PDF généré
   */
  async generatePDFFromData(data, outputPath) {
    try {
      // Créer le dossier de destination si nécessaire
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Créer un document PDF simplifié avec moins de risque d'erreur
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(outputPath);
      
      // Promise pour attendre la fin de l'écriture
      const streamFinished = new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });
      
      // Pipe le PDF vers le fichier
      doc.pipe(stream);
      
      // Créer une facture très basique
      doc.fontSize(25).text('FACTURE', { align: 'center' });
      doc.moveDown();
      doc.fontSize(15).text(`Facture N°: ${data.invoiceNumber || `INV-${Date.now()}`}`, { align: 'right' });
      doc.fontSize(12).text(`Date: ${data.invoiceDate || new Date().toLocaleDateString()}`, { align: 'right' });
      doc.moveDown(2);
      
      // Informations client
      doc.fontSize(12);
      doc.text(`CLIENT: ${data.customerName || 'Client'}`, { bold: true });
      doc.text(`Email: ${data.customerEmail || 'Non disponible'}`);
      doc.text(`Adresse: ${data.customerAddress || 'Non disponible'}`);
      doc.moveDown();
      
      // Commande
      doc.text(`Commande #${data.orderId || 'N/A'}`, { bold: true });
      doc.moveDown();
      
      // Tableau simplifié des articles
      let y = doc.y;
      doc.text("Article", 50, y);
      doc.text("Quantité", 250, y);
      doc.text("Prix", 350, y);
      doc.text("Total", 450, y);
      
      y += 20;
      doc.moveTo(50, y).lineTo(550, y).stroke();
      y += 10;
      
      // Articles
      if (Array.isArray(data.items) && data.items.length > 0) {
        data.items.forEach(item => {
          doc.text(String(item.name || 'Produit'), 50, y);
          doc.text(String(item.quantity || '1'), 250, y);
          doc.text(`${String(item.unitPrice || '0')}€`, 350, y);
          doc.text(`${String(item.itemTotal || '0')}€`, 450, y);
          y += 20;
        });
      } else {
        doc.text("Aucun détail disponible", 50, y);
        y += 20;
      }
      
      // Totaux
      y += 10;
      doc.moveTo(50, y).lineTo(550, y).stroke();
      y += 10;
      
      doc.text("Sous-total:", 350, y);
      doc.text(`${String(data.subtotal || '0')}€`, 450, y);
      y += 20;
      
      doc.text("TVA (20%):", 350, y);
      doc.text(`${String(data.vatAmount || '0')}€`, 450, y);
      y += 20;
      
      doc.fontSize(14);
      doc.text("Total:", 350, y, { bold: true });
      doc.text(`${String(data.totalAmount || '0')}€`, 450, y);
      
      // Pied de page
      doc.fontSize(10);
      doc.text('Merci pour votre commande', 50, doc.page.height - 100, { align: 'center' });
      
      // Finaliser le document proprement
      doc.end();
      
      // Attendre que l'écriture soit terminée
      await streamFinished;
      
      console.log(`PDF généré avec succès: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate invoice PDF');
    }
  }

  /**
   * Génère un PDF avec jsPDF (alternative à PDFKit)
   * @param {Object} data - Les données pour la facture
   * @param {String} outputPath - Le chemin du fichier PDF à créer
   * @returns {String} - Le chemin du fichier PDF généré
   */
  async generatePDFWithJSPDF(data, outputPath) {
    try {
      // Créer le dossier de destination si nécessaire
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Créer un document PDF - utiliser 'p' pour portrait, 'a4' pour A4
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Définir des positions initiales
      const margin = 20;
      const pageWidth = 210; // A4 width in mm
      const tableWidth = pageWidth - (2 * margin);
      let yPosition = 20;
      
      // Titre
      doc.setFontSize(20);
      doc.text('FACTURE', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;
      
      // Informations de facture - à droite
      doc.setFontSize(11);
      const invoiceNumber = `Facture N° : ${data.invoiceNumber || `INV-${Date.now()}`}`;
      const invoiceDate = `Date : ${data.invoiceDate || new Date().toLocaleDateString()}`;
      
      doc.text(invoiceNumber, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 6;
      doc.text(invoiceDate, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 15;
      
      // Informations client - à gauche
      doc.setFontSize(12);
      doc.text('Informations Client:', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(11);
      doc.text(`Nom: ${data.customerName || 'Client'}`, margin, yPosition);
      yPosition += 6;
      doc.text(`Email: ${data.customerEmail || 'Non disponible'}`, margin, yPosition);
      yPosition += 6;
      doc.text(`Adresse: ${data.customerAddress || 'Non disponible'}`, margin, yPosition);
      yPosition += 15;
      
      // Commande
      doc.text(`Commande #${data.orderId || 'N/A'}`, margin, yPosition);
      yPosition += 15;
      
      // Tableau des articles
      // En-tête du tableau
      const columnWidths = {
        article: tableWidth * 0.5,
        qte: tableWidth * 0.1,
        prix: tableWidth * 0.2,
        total: tableWidth * 0.2
      };
      
      const columnPositions = {
        article: margin,
        qte: margin + columnWidths.article,
        prix: margin + columnWidths.article + columnWidths.qte,
        total: margin + columnWidths.article + columnWidths.qte + columnWidths.prix
      };
      
      // Dessiner le fond gris de l'en-tête
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition, tableWidth, 8, 'F');
      
      // En-tête du tableau
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      
      doc.text('Article', columnPositions.article + 2, yPosition + 5.5);
      doc.text('Qté', columnPositions.qte + 2, yPosition + 5.5);
      doc.text('Prix', columnPositions.prix + 2, yPosition + 5.5);
      doc.text('Total', columnPositions.total + 2, yPosition + 5.5);
      
      yPosition += 8;
      doc.setFont('helvetica', 'normal');
      
      // Lignes du tableau
      if (Array.isArray(data.items) && data.items.length > 0) {
        data.items.forEach((item, index) => {
          // Ligne de séparation
          if (index > 0) {
            doc.setDrawColor(220, 220, 220);
            doc.line(margin, yPosition, margin + tableWidth, yPosition);
          }
          
          const name = String(item.name || 'Produit');
          const quantity = String(item.quantity || '1');
          const unitPrice = String(item.unitPrice || '0');
          const itemTotal = String(item.itemTotal || '0');
          
          // Calculer la hauteur de ligne nécessaire pour l'article (si nom trop long)
          const maxLineLength = 35; // caractères max par ligne
          const lineHeight = 6;
          let textLines = [];
          
          // Découper le nom de l'article en plusieurs lignes si nécessaire
          if (name.length > maxLineLength) {
            let currentLine = '';
            name.split(' ').forEach(word => {
              if (currentLine.length + word.length + 1 <= maxLineLength) {
                currentLine += (currentLine.length ? ' ' : '') + word;
              } else {
                textLines.push(currentLine);
                currentLine = word;
              }
            });
            if (currentLine.length > 0) {
              textLines.push(currentLine);
            }
          } else {
            textLines.push(name);
          }
          
          // Dessiner chaque ligne de texte
          const startY = yPosition + 5;
          textLines.forEach((line, lineIndex) => {
            doc.text(line, columnPositions.article + 2, startY + (lineIndex * lineHeight));
          });
          
          // Ajouter les autres colonnes
          doc.text(quantity, columnPositions.qte + 2, startY);
          doc.text(`${unitPrice}€`, columnPositions.prix + 2, startY);
          doc.text(`${itemTotal}€`, columnPositions.total + 2, startY);
          
          // Ajuster la position Y pour la prochaine ligne
          const rowHeight = Math.max(textLines.length * lineHeight, lineHeight) + 4;
          yPosition += rowHeight;
          
          // Si la page devient trop longue, ajouter une nouvelle page
          if (yPosition > 250 && index < data.items.length - 1) {
            doc.addPage();
            yPosition = 20;
          }
        });
      } else {
        doc.text('Aucun détail disponible', columnPositions.article + 2, yPosition + 5);
        yPosition += 10;
      }
      
      // Ligne de séparation finale
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, margin + tableWidth, yPosition);
      yPosition += 10;
      
      // Totaux - alignés à droite
      const rightColumnX = columnPositions.total - 20;
      
      doc.text('Sous-total:', rightColumnX, yPosition);
      doc.text(`${String(data.subtotal || '0')}€`, columnPositions.total + 15, yPosition, { align: 'right' });
      yPosition += 7;
      
      doc.text('TVA (20%):', rightColumnX, yPosition);
      doc.text(`${String(data.vatAmount || '0')}€`, columnPositions.total + 15, yPosition, { align: 'right' });
      yPosition += 7;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total:', rightColumnX, yPosition);
      doc.text(`${String(data.totalAmount || '0')}€`, columnPositions.total + 15, yPosition, { align: 'right' });
      
      // Pied de page
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Merci pour votre commande.', pageWidth / 2, 270, { align: 'center' });
      
      // Enregistrer le PDF sur disque
      const pdfOutput = doc.output();
      fs.writeFileSync(outputPath, pdfOutput, 'binary');
      
      console.log(`PDF généré avec succès avec jsPDF: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error generating PDF with jsPDF:', error);
      throw new Error('Failed to generate invoice PDF with jsPDF');
    }
  }

  /**
   * Prépare les données de la facture à partir d'une commande
   * @param {Object} order - La commande
   * @returns {Object} - Les données formatées pour la facture
   */
  async prepareInvoiceData(order) {
    try {
      if (!order) {
        throw new Error('Order is required');
      }
      
      if (!order.details || !Array.isArray(order.details)) {
        console.warn(`La commande ${order.id} n'a pas de détails valides. Créer une facture avec des détails vides.`);
      }
      
      // Formater la date de la commande
      const orderDate = new Date(order.createdAt);
      const formattedDate = orderDate.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      // Récupérer l'utilisateur
      const user = await UserPg.findByPk(order.userId);
      if (!user) {
        console.warn(`Utilisateur non trouvé pour la commande ${order.id}`);
      }
      
      const fullName = user ? `${user.firstname} ${user.lastname}` : 'Client';
      const email = user ? user.email : 'Non disponible';
      const address = 'Adresse non disponible'; // À compléter si vous avez une table d'adresses
      
      // Préparer les détails des articles
      const items = [];
      let subtotal = 0;
      
      if (order.details && Array.isArray(order.details)) {
        order.details.forEach(detail => {
          // Calcul du total de la ligne
          const quantity = parseInt(detail.quantity) || 0;
          const unitPrice = parseFloat(detail.unitPrice) || 0;
          const itemTotal = quantity * unitPrice;
          
          // Ajouter l'article à la liste
          items.push({
            name: detail.productName || 'Produit',
            quantity: quantity,
            unitPrice: unitPrice.toFixed(2),
            itemTotal: itemTotal.toFixed(2)
          });
          
          // Ajouter au sous-total
          subtotal += itemTotal;
        });
      }
      
      // Calcul des taxes et du total
      const vatRate = 0.20; // 20% de TVA
      const vatAmount = subtotal * vatRate;
      const totalAmount = subtotal + vatAmount;
      
      // Numéro de facture unique
      const invoiceNumber = `INV-${order.id}-${Date.now().toString().slice(-6)}`;
      
      return {
        invoiceNumber,
        invoiceDate: formattedDate,
        customerName: fullName,
        customerEmail: email,
        customerAddress: address,
        orderDate: formattedDate,
        orderId: order.id,
        items,
        subtotal: subtotal.toFixed(2),
        vatAmount: vatAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
      };
    } catch (error) {
      console.error('Error preparing invoice data:', error);
      throw new Error(`Failed to prepare invoice data: ${error.message}`);
    }
  }

  /**
   * Génère une facture pour une commande
   * @param {Number|String} orderId - L'ID de la commande
   * @param {Boolean} sendEmail - Indique si la facture doit être envoyée par email
   * @returns {String} - Le chemin du fichier PDF généré
   */
  async generateInvoice(orderId, sendEmail = false) {
    try {
      // Récupérer la commande avec ses détails
      const order = await Order.findByPk(orderId, {
        include: 'details'
      });
      
      if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
      
      // Préparer le répertoire de sortie
      const invoicesDir = path.join(__dirname, '../invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }
      
      // Chemin du fichier PDF de sortie
      const outputPath = path.join(invoicesDir, `invoice-${orderId}.pdf`);
      
      // Préparer les données pour la facture
      const invoiceData = await this.prepareInvoiceData(order);
      
      // Utiliser jsPDF au lieu de PDFKit pour une meilleure compatibilité
      await this.generatePDFWithJSPDF(invoiceData, outputPath);
      
      console.log(`Invoice generated successfully for order ${orderId} at ${outputPath}`);
      
      // Envoyer la facture par email si demandé
      if (sendEmail) {
        await this.sendInvoiceByEmail(orderId, outputPath, invoiceData);
      }
      
      return outputPath;
    } catch (error) {
      console.error(`Failed to generate invoice for order ${orderId}:`, error);
      throw new Error(`Failed to generate invoice: ${error.message}`);
    }
  }

  /**
   * Envoie la facture par email
   * @param {Number|String} orderId - L'ID de la commande
   * @param {String} pdfPath - Le chemin du fichier PDF à envoyer
   * @param {Object} invoiceData - Les données de la facture
   * @returns {Boolean} - Indique si l'envoi a réussi
   */
  async sendInvoiceByEmail(orderId, pdfPath, invoiceData) {
    try {
      // Récupérer les informations d'email
      const order = await Order.findByPk(orderId);
      
      if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
      
      let userEmail = '';
      
      if (order.userId) {
        const user = await UserPg.findByPk(order.userId);
        if (user) {
          userEmail = user.email;
        }
      } else if (order.contactEmail) {
        userEmail = order.contactEmail;
      }
      
      if (!userEmail) {
        throw new Error('No email address found for this order');
      }
      
      // Configurer le transporteur d'email
      const transporter = emailService.getTransporter();
      
      // Envoyer l'email avec la facture en pièce jointe
      const info = await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to: userEmail,
        subject: `Votre facture #${invoiceData.invoiceNumber} - E-Commerce Marketplace`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2c3e50;">Votre facture est prête</h1>
            <p>Bonjour ${invoiceData.customerName},</p>
            <p>Nous vous remercions pour votre commande n°${order.id}.</p>
            <p>Veuillez trouver ci-joint votre facture.</p>
            <p>Vous pouvez également consulter et télécharger vos factures à tout moment depuis votre espace client.</p>
            <p>Montant total : <strong>${invoiceData.totalAmount}€</strong></p>
            <p>Date de la commande : ${invoiceData.invoiceDate}</p>
            <p>Pour toute question, n'hésitez pas à contacter notre service client à l'adresse suivante : ${invoiceData.supportEmail}</p>
            <p style="margin-top: 30px;">Cordialement,</p>
            <p><strong>L'équipe E-Commerce Marketplace</strong></p>
          </div>
        `,
        attachments: [
          {
            filename: `facture-${order.id}.pdf`,
            path: pdfPath
          }
        ]
      });
      
      console.log(`Invoice email sent to ${userEmail}: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Error sending invoice email:', error);
      throw new Error(`Failed to send invoice email: ${error.message}`);
    }
  }

  extractDataFromHTML(html) {
    // Cette méthode est très simplifiée et devrait être adaptée en fonction de la structure réelle de votre HTML
    const invoiceNumber = html.match(/Facture N° : (.*)/)[1];
    const invoiceDate = html.match(/Date : (.*)/)[1];
    const customerName = html.match(/Client : (.*)/)[1];
    const customerEmail = html.match(/Email : (.*)/)[1];
    const customerAddress = html.match(/Adresse : (.*)/)[1];
    const items = [];
    const itemRegex = /<tr><td>(.*)<\/td><td>(.*)<\/td><td>(.*)<\/td><td>(.*)<\/td><\/tr>/g;
    let match;
    while ((match = itemRegex.exec(html)) !== null) {
      items.push({
        name: match[1],
        quantity: match[2],
        unitPrice: match[3],
        itemTotal: match[4]
      });
    }
    const subtotal = html.match(/Sous-total: (.*)/)[1];
    const vatAmount = html.match(/TVA \(20%\): (.*)/)[1];
    const totalAmount = html.match(/Total: (.*)/)[1];
    
    return {
      invoiceNumber,
      invoiceDate,
      customerName,
      customerEmail,
      customerAddress,
      items,
      subtotal,
      vatAmount,
      totalAmount
    };
  }
}

export default new InvoiceService();
