const OrderService = require("../service/order");


const createOrder = async (req, res) => {
    try {
        const response = await OrderService.createOrder(req.body);
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

const getOrders = async (req, res) => {
    try {
        const response = await OrderService.getOrders();
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

const getOrderUser = async (req, res) => {
    try {
        const response = await OrderService.getOrderUser(req.params.id);
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

const cancleOrder = async (req, res) => {
    try {
        const response = await OrderService.cancleOrder(req.params.id);
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

const deleteOrder = async (req, res) => {
    try {
        const response = await OrderService.deleteOrder(req.params.id);
        if (response)
            return res.status(200).json({
                success: true,
                mes: "Xóa đơn hàng thành công !",
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const updateStatusOrder = async (req, res) => {
    try {
        const response = await OrderService.updateStatusOrder(
            req.params.id,
            req.body
        );
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

module.exports = {
    createOrder,
    getOrderUser,
    getOrders,
    cancleOrder,
    deleteOrder,
    updateStatusOrder,
};
