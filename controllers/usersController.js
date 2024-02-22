const User= require('../models/User')
const Link= require('../models/Link')
const asyncHandler= require('express-async-handler')
const bcrypt= require('bcrypt')

const getAllUsers= asyncHandler (async (req, res) => {
    const users= await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
})


const createNewUser= asyncHandler (async (req, res) => {
    const { email, password }= req.body

    //confirm data
    if (!email || !password) {
        return res.status(400).json({message: 'All fields are required'})
    }

    //check for duplicates
    const duplicate= await User.findOne({email}).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate) {
        return res.status(409).json({message: 'Duplicate email'})
    }

    //hash password
    const hashedPwd= await bcrypt.hash(password, 10) //salt rounds

    const userObject= { email, "password": hashedPwd }

    //create and store new user
    const user= await User.create(userObject)

    if (user) { //created
        res.status(201).json(user)
    } else {
        res.status(400).json({message: 'Invalid user data received'})
    }
})


const updateUser= asyncHandler (async (req, res) => {
    const { id, firstname, lastname, email, profilepic, password } = req.body

    //confirm data
    if (!id || !firstname || !lastname || !profilepic) {
        return res.status(400).json({message: 'All fields are required'})
    }

    const user= await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }

    //check for duplicates
    const duplicate= await User.findOne({email}).collation({ locale: 'en', strength: 2 }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate email'})
    }
    
    
    user.firstname= firstname
    user.lastname= lastname
    user.profilepic= profilepic 

    if (password) {
        //Hash password
        user.password= await bcrypt.hash(password, 10) //salt rounds 
    }

    const updatedUser= await user.save()

    res.json({message: `${updatedUser.email} updated`})
})


const deleteUser= asyncHandler (async (req, res) => {
    const { id }= req.body

    if (!id) {
        return res.status(400).json({message: 'User ID Required'})
    }

        const user= await User.findById(id).exec()

        if (!user) {
            return res.status(400).json({message: 'User not found'})
        }

        const result= await user.deleteOne()

        const reply= `email ${result.email} with ID ${result._id} deleted`

        res.json(reply)
})

module.exports= {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}