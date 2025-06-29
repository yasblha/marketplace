import type { Product as APIProduct } from '@/types/product';

// Définir le type localement pour éviter l'import circulaire
interface CardProduct {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  brand: string;
  category?: string;
  price: number;
  discount?: number;
  stock_available: number;
  stock_total?: number;
  images?: string[];
  created_at?: string | Date;
  free_shipping?: boolean;
  rating?: number;
  reviewCount?: number;
  slug?: string;
  sale_price?: number;
  stock_status?: string;
  stock_status_class?: string;
  shipping_info?: string;
  is_new?: boolean;
  image?: string;
  discount_percentage?: number;
  is_on_sale?: boolean;
  status?: string;
  category_id?: number | null;
}

/**
 * Extrait les chemins d'images d'un produit, en gérant différents formats
 * Les images sont déjà traitées dans le store products.ts
 */
function extractImagePaths(apiProduct: APIProduct): string[] {
    // Si images est déjà un tableau non vide, on le retourne directement
    if (Array.isArray(apiProduct.images)) {
        return apiProduct.images.map(img => String(img || ''));
    }
    
    // Si image est défini, on l'utilise
    if (apiProduct.image) {
        return [String(apiProduct.image)];
    }
    
    return [];
}

/**
 * Adapte un produit de l'API vers le format attendu par le composant ProductCard
 */
export function adaptProductForCard(apiProduct: APIProduct): CardProduct {
    // Les images sont déjà traitées dans le store
    const images = extractImagePaths(apiProduct);
    
    // Gestion du prix
    const price = typeof apiProduct.price === 'string' 
        ? parseFloat(apiProduct.price) 
        : Number(apiProduct.price) || 0;
    
    // Calcul de la remise si nécessaire
    const salePrice = typeof apiProduct.sale_price === 'string'
        ? parseFloat(apiProduct.sale_price)
        : Number(apiProduct.sale_price) || 0;
    
    const discount = apiProduct.is_on_sale && salePrice > 0 && price > salePrice
        ? Math.round(((price - salePrice) / price) * 100)
        : 0;

    // Calcul du statut de stock
    const stockAvailable = Number(apiProduct.stock_available) || 0;
    const stockStatus = stockAvailable > 10 
        ? 'En stock' 
        : stockAvailable > 0 
            ? `Plus que ${stockAvailable} en stock` 
            : 'Rupture de stock';
    
    // Calcul de la classe CSS pour le statut de stock
    const stockStatusClass = stockAvailable > 10 
        ? 'text-green-600' 
        : stockAvailable > 0 
            ? 'text-yellow-600' 
            : 'text-red-600';
    
    // Vérification si le produit est nouveau (moins de 30 jours)
    const createdDate = apiProduct.created_at ? new Date(apiProduct.created_at) : new Date();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isNew = diffDays <= 30;

    return {
        id: String(apiProduct.id || apiProduct._id || ''),
        name: apiProduct.name || 'Sans nom',
        description: apiProduct.description || '',
        brand: apiProduct.brand || 'Marque inconnue',
        category: apiProduct.category || 'Non catégorisé',
        price: price,
        sale_price: salePrice || undefined,
        stock_available: stockAvailable,
        stock_total: Number(apiProduct.stock_total || apiProduct.stock_available) || 0,
        stock_status: stockStatus,
        stock_status_class: stockStatusClass,
        shipping_info: 'Livraison gratuite',
        is_new: isNew,
        images: images.filter(Boolean),
        image: images[0], // Pour la rétrocompatibilité
        created_at: apiProduct.created_at || new Date().toISOString(),
        discount: discount,
        discount_percentage: discount,
        rating: 4.5,
        reviewCount: 0,
        is_on_sale: apiProduct.is_on_sale || false,
        status: apiProduct.status || 'active',
        category_id: apiProduct.category_id || null
    };
}

/**
 * Adapte un tableau de produits de l'API
 */
export function adaptProductsForCards(apiProducts: APIProduct[]): CardProduct[] {
    return apiProducts.map(adaptProductForCard);
}
