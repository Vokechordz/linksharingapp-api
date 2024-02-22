const User= require('../models/User')
const Link= require('../models/Link')
const asyncHandler= require('express-async-handler')

// @desc Get all links
// @route Get /links
// @access Private

const getAllLinks= asyncHandler(async (req, res) => {
    // Get all links from MongoDB
    const links= await Link.find().lean()
    //if no links
    if (!links?.length) {
        return res.status(400).json({ message: 'No links found' })
    }

        // Add email to each link before sending the response
        const linksWithUser= await Promise.all(links.map(async (link) => {
            const user= await User.findById(link.user).lean().exec()
            return { ...link, email: user.email }
        }))
        res.json(linksWithUser)
})

// @desc Create new link
// @route POST /links
// @access Private

const createNewLink= asyncHandler(async (req, res)=> {
    const { user, selectValue, textValue, index }= req.body

    // confirm data
    if (!user || !selectValue || !textValue ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    //check for duplicate selectValue
    const duplicate= await Link.findOne({ selectValue, user }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Platform' })
    }

    // create and store the new link
    const link= await Link.create({ user, selectValue, textValue, index })

    if (link) { //created
        return res.status(201).json(link)
    } else {
        return res.status(400).json({ message: 'Invalid link data received' })
    }
})

// @desc Update a link
// @route PATCH /links
// @access Private

const updateLink= asyncHandler(async (req, res) => {
    const { id, user, selectValue, textValue, index }= req.body

    //confirm data
    if (!id || !user || !selectValue || !textValue, !index) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    //confirm link exists to update
    const link= await Link.findById(id).exec()

    if (!link) {
        return res.status(400).json({ message: 'Link not found' })
    }

    //check for duplicate selectValue
    const duplicate= await Link.findOne({ selectValue }).lean().exec()

    // Allow renaming of the original link
    if (duplicate && duplicate?._id.toString() !==id) {
        return res.status(409).json({ message: 'Duplicate platform' })
    }

    link.user= user
    link.selectValue= selectValue
    link.textValue= textValue
    link.index= index

    const updatedLink= await link.save()

    res.json(`'${updatedLink.selectValue}' updated`)
})

// @desc Delete a link
// @route DELETE /links
// @access Private

const deleteLink= asyncHandler(async (req, res) => {
    const { id }= req.body

    // confirm data
    if (!id) {
        return res.status(400).json({ message: 'Link ID required' })
    }

    // confirm link exists to delete
    const link= await Link.findById(id).exec()

        if (!link) {
            return res.status(400).json({ message: 'Link not found' })
        }

        const result= await link.deleteOne()

        const reply= `Link ${result.selectValue} with ID ${result._id} deleted`

        res.json(reply)
    
})

module.exports= {
    getAllLinks,
    createNewLink,
    updateLink,
    deleteLink
}