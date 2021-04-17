const cloudinary = require('cloudinary');
const config = require('config');

cloudinary.config({
    cloud_name: config.get('cloudinaryConfig.cloud_name'),
    api_key: config.get('cloudinaryConfig.api_key'),
    api_secret: config.get('cloudinaryConfig.api_secret')
});

exports.uploads = (file, folder) => {
    return new Promise((resolve, reject) => {
        try {
            if (file) {
                cloudinary.uploader.upload(file, (result) => {
                    resolve({
                        url: result.url,
                        id: result.public_id
                    })
                }, {
                    resource_type: "auto",
                    folder: folder
                })
            }
            else
                reject({ message: "An error occurred while uploading the Image." });
        }
        catch (error) {
            reject(error.message);
        }
    })
}

exports.remove = (cloudinaryId) => {
    return new Promise((resolve, reject) => {
        try {
            if (cloudinaryId) {
                cloudinary.uploader.destroy(cloudinaryId, (result) => {
                    resolve({
                        url: result.url,
                        id: result.public_id
                    });
                })
            }
            else
                reject({ message: "An error occurred while removing the Image." });
        }
        catch (error) {
            reject(error.message);
        }
    })
}

exports.removeVideo = (cloudinaryId) => {
    return new Promise((resolve, reject) => {
        try {
            if (cloudinaryId) {
                cloudinary.v2.uploader.destroy(cloudinaryId, { resource_type: "video" }, (result) => {
                    resolve();
                })
            }
            else
                reject({ message: "An error occurred while removing the Video." });
        }
        catch (error) {
            reject(error.message);
        }
    })
}