const SliderService = require("../service/slider");


const createSlider = async (req, res) => {
    try {
        const {image} = req.body;
        const response = await SliderService.createSlider(image);
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

const getSlider = async (req, res) => {
    try {
        const response = await SliderService.getSlider();
        return res.status(200).json({
            success: true,
            response: response.slider,
        });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const updateSlider = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await SliderService.updateSlider(id, req.body);
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

const deleteSlider = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await SliderService.deleteSlider(id);
        if (response)
            return res.status(200).json({
                response,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

module.exports = {
    createSlider,
    getSlider,
    updateSlider,
    deleteSlider,
};
