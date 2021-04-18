const db = require("../../Model");
const imagedata = db.imageData;
exports.getAllimagesByTypeAndTypeId = async (type, typeid) => {
    let ids = [];
    let getImages = await imagedata.findAll({
        raw: true,
        where: {
            imageType: type,
            typeId: typeid
        }
    });
    getImages.map(x => ids.push(x.imageId));

    return {
        getImages
    }

}