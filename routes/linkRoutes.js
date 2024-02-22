const express= require('express')
const router= express.Router()
const linksController= require('../controllers/linksController') 

router.route('/')
    .get(linksController.getAllLinks)
    .post(linksController.createNewLink)
    .patch(linksController.updateLink)
    .delete(linksController.deleteLink)


    module.exports= router