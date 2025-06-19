import { DataTypes, Op } from 'sequelize';
//import Section from './Menu.js';
import sequelize from '../../config/postgres.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    sale_price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    is_on_sale: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    stock_available: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: true,
    }/*,
    sectionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Section,
            key: 'id'
        },
        allowNull: false,
    }*/
}, {
    tableName: 'Product',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

//Section.hasMany(Product, { foreignKey: 'sectionId' });
//Product.belongsTo(Section, { foreignKey: 'sectionId' });

// Méthodes statiques
Product.getProducts = async () => {
    return Product.findAll();
};

Product.getProductById = async (id) => {
    return Product.findByPk(id);
};

Product.createProduct = async (productData) => {
    try {
        const newProduct = await Product.create({
            name: productData.name,
            description: productData.description,
            category: productData.category,
            category_id: productData.category_id,
            brand: productData.brand,
            price: parseFloat(productData.price),
            stock_available: parseInt(productData.stock_available),
            status: productData.status,
            image: productData.images || []
        });
        return newProduct;
    } catch (error) {
        console.error('Erreur détaillée lors de la création du produit:', error);
        throw error;
    }
};

Product.updateProduct = async (id, updates) => {
    try {
        const [updatedRowsCount, updatedProducts] = await Product.update(updates, {
            where: { id: id },
            returning: true,
        });
        return updatedProducts[0];
    } catch (error) {
        throw error;
    }
};

Product.deleteProduct = async (id) => {
    try {
        const deletedRowCount = await Product.destroy({
            where: { id: id },
        });
        return deletedRowCount > 0;
    } catch (error) {
        throw error;
    }
};

Product.searchProducts = async (criteria) => {
    const whereClause = {};
    if (criteria.name) whereClause.name = { [Op.iLike]: `%${criteria.name}%` };
    if (criteria.description) whereClause.description = { [Op.iLike]: `%${criteria.description}%` };
    if (criteria.category) whereClause.category = criteria.category;
    if (criteria.category_id) whereClause.category_id = criteria.category_id;
    if (criteria.brand) whereClause.brand = criteria.brand;
    if (criteria.minPrice) whereClause.price = { ...whereClause.price, [Op.gte]: criteria.minPrice };
    if (criteria.maxPrice) whereClause.price = { ...whereClause.price, [Op.lte]: criteria.maxPrice };
    if (criteria.minSalePrice) whereClause.sale_price = { ...whereClause.sale_price, [Op.gte]: criteria.minSalePrice };
    if (criteria.maxSalePrice) whereClause.sale_price = { ...whereClause.sale_price, [Op.lte]: criteria.maxSalePrice };
    if (criteria.is_on_sale !== undefined) whereClause.is_on_sale = criteria.is_on_sale;
    if (criteria.in_stock !== undefined) {
        whereClause.stock_available = criteria.in_stock ? { [Op.gt]: 0 } : { [Op.lte]: 0 };
    }

    return Product.findAll({ where: whereClause });
};

Product.getProductsByCategory = async (category) => {
    return Product.findAll({
        where: { category: category },
    });
};

Product.updateProductStock = async (id, newStock) => {
    try {
        const [updatedRowsCount, updatedProducts] = await Product.update(
            { stock_available: newStock },
            {
                where: { id: id },
                returning: true,
            }
        );
        return updatedProducts[0];
    } catch (error) {
        throw error;
    }
};

export default Product;