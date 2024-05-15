const ProductService = require("../service/product");


const createProduct = async (req, res) => {
    try {
        const response = await ProductService.createProduct(req.body);
        if (response)
            return res.status(200).json({
                success: true,
                response,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const {name, page, category} = req.query;
        let limit = process.env.LIMIT;
        const options = {
            page,
            limit,
            category,
        };
        if (name) {
            options.name = name;
        }
        if (page) {
            options.page = page;
        }
        if (category) {
            options.category = category;
        }
        const response = await ProductService.getProducts({...options});
        if (response)
            return res.status(200).json({
                success: true,
                products: response.product,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const getProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await ProductService.getProduct(id);
        if (response)
            return res.status(200).json({
                success: true,
                product: response.product,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await ProductService.deleteProduct(id);
        if (response)
            return res.status(200).json({
                success: true,
                mes: "Xóa thành công",
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await ProductService.updateProduct(id, req.body);
        if (response)
            return res.status(200).json({
                success: true,
                product: response.product,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const createReviews = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await ProductService.createReviews(
            id,
            req.body,
            req.user.id
        );
        if (response.success) {
            return res.status(200).json({
                success: true,
                product: response.product,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: response.message,
            });
        }
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    createReviews,
};
