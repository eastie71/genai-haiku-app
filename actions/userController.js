"use server"

import { getCollection } from "../lib/db"
import bcrypt from "bcrypt"
import {cookies} from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"

function isAlphaNumeric(text) {
    const regex = /^[a-zA-Z0-9]*$/
    return regex.test(text)
}

export const logout = async function() {
    cookies().delete("haikuapp")
    redirect("/")
}

export const login = async function(prevState, formData) {
    const failLoginResult = {
        success: false,
        message: "Invalid username / password"
    }
    const ourUser = {
        username: formData.get("username"),
        password: formData.get("password")
    }

    // Make sure its string - MongoDB will have security issues if not string
    if (typeof ourUser.username != "string") ourUser.username = ""
    if (typeof ourUser.password != "string") ourUser.password = ""

    // check if the user exists
    const collection = await getCollection("users")
    const user = await collection.findOne({username: ourUser.username})
    if (!user) {
        return failLoginResult 
    }

    // check password
    const passwordCorrect = bcrypt.compareSync(ourUser.password, user.password)
    if (!passwordCorrect) {
        return failLoginResult
    }     

    // create jwt value
    const ourTokenValue = jwt.sign({skyColour: "blue", userId: user._id, exp: Math.floor((Date.now() / 1000) + 60 * 60 * 24)}, process.env.JWTSECRET)

    // Log user in - set a cookie with 24 hour expiry
    cookies().set("haikuapp", ourTokenValue, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        secure: true
    })

    // Successful login - redirect to home page
    redirect("/")
}

export const register = async function(prevState, formData) {
    const errors = {}

    const ourUser = {
        username: formData.get("username"),
        password: formData.get("password")
    }

    // Make sure its string - MongoDB will have security issues if not string
    if (typeof ourUser.username != "string") ourUser.username = ""
    if (typeof ourUser.password != "string") ourUser.password = ""

    ourUser.username = ourUser.username.trim()
    ourUser.password = ourUser.password.trim()

    // Username validation
    if (ourUser.username == "") errors.username = "Username must be provided."
    else if (ourUser.username.length < 3) errors.username = "Username must be at least 3 characters long."
    else if (ourUser.username.length > 30) errors.username = "Username cannot exceed 30 characters."
    else if (!isAlphaNumeric(ourUser.username)) errors.username = "Username can only contain letters or numbers."

    // Check if user already exists
    const usersCollection = await getCollection("users")
    const usernameExists = await usersCollection.findOne({username: ourUser.username})
    if (usernameExists) {
        errors.username = "Username already in use"
    }

    // Password validation
    if (ourUser.password == "") errors.password = "Password must be provided."
    else if (ourUser.password.length < 8) errors.password = "Password must be at least 8 characters long."
    else if (ourUser.password.length > 50) errors.password = "Password cannot exceed 50 characters."
 
    if (errors.username || errors.password) {
        return {
            errors: errors,
            success: false
        }
    }

    // hash the password first
    const salt = bcrypt.genSaltSync(10)
    ourUser.password = bcrypt.hashSync(ourUser.password, salt)

    // Store new user
    const newUser = await usersCollection.insertOne(ourUser)
    const userId = newUser.insertedId.toString()

    // create the JWT value
    const ourTokenValue = jwt.sign({skyColour: "blue", userId: userId, exp: Math.floor((Date.now() / 1000) + 60 * 60 * 24)}, process.env.JWTSECRET)

    // Log user in - set a cookie with 24 hour expiry
    cookies().set("haikuapp", ourTokenValue, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        secure: true
    })

    return {
        success: true
    }
}