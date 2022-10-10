
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const readXlsxFile = require('read-excel-file/node')


function AdminService(objectCollection) {

    // const util = objectCollection.util;
    // const db = objectCollection.db;

    // this.addHolidaysUploadList = async function (request) {

    //     let responseData = [],
    //         error = true;
    //     const paramsArr = new Array(
    //         request.project_id.toString(),
    //     );


    //     const queryString = util.getQueryString('project_remove_project_delete', paramsArr);

    //     if (queryString !== '') {
    //         await db.executeQuery(1, queryString, request)
    //             .then(async (data) => {
    //                 let data1 = await util.addUniqueIndexesToArrayOfObject(data)
    //                 console.log('=========removeProjectDelete===========')
    //                 console.log(data)
    //                 console.log('====================================')
    //                 responseData = data1;
    //                 error = false
    //             }).catch((err) => {
    //                 console.log("err-------" + err);
    //                 error = err
    //             })
    //         return [error, responseData];
    //     }


    // }






    const storage = multer.diskStorage({
        destination: './public/uploads/',
        filename: function (req, file, cb) {
            cb(
                null,
                file.fieldname +
                (Math.floor(Math.random() * 1000) + 1000) +
                path.extname(file.originalname),
            )
        },
    })

    // Init Upload
    const upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 },
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb)
        },
    }).single('images')

    // Check File Type
    function checkFileType(file, cb) {
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        // Check mime
        const mimetype = filetypes.test(file.mimetype)

        if (mimetype && extname) {
            return cb(null, true)
        } else {
            cb({
                status: 404,
                ' Error': 'Images Only!',
            })
        }
    }

    this.uploadImages = (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    // Too many images exceeding the allowed limit
                    res.send({ message: 'Too many images exceeding' })
                }
            } else if (err) {
                res.send(err)
            } else {
                next()
            }
        })


    }
    
}



module.exports = AdminService;
