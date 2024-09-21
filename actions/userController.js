"use server"

import { getCollection } from "../lib/db"
import bcrypt from "bcrypt"
import {cookies} from "next/headers"
import jwt from "jsonwebtoken"

function isAlphaNumeric(text) {
    const regex = /^[a-zA-Z0-9]*$/
    return regex.test(text)
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
    const usersCollection = await getCollection("users")
    const newUser = await usersCollection.insertOne(ourUser)
    const userId = newUser.insertedId.toString()

    // create the JWT value
    const ourTokenValue = jwt.sign({skyColour: "blue", userId: userId, exp: Math.floor((Date.now() / 1000) + 60 * 60 * 24)}, process.env.JWTSECRET)

    // Log user in
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