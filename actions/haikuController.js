"use server"

import { redirect } from "next/navigation"
import { getUserFromCookie } from "../lib/getUser"
import { ObjectId } from "mongodb"
import { getCollection } from "../lib/db"
import cloudinary from 'cloudinary'

const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

function isAlphaNumericWithSomeGrammer(text) {
    const regex = /^[a-zA-Z0-9 .,;]*$/
    return regex.test(text)
}

async function sharedHaikuLogic(formData, user) {
    // console.log(formData.get("signature"))
    // console.log(formData.get("public_id"))
    // console.log(formData.get("version"))

    const errors = {}

    const ourHaiku = {
        line1: formData.get("line1"),
        line2: formData.get("line2"),
        line3: formData.get("line3"),
        author: ObjectId.createFromHexString(user.userId)
    }

    if (typeof ourHaiku.line1 != "string") ourHaiku.line1 = ""
    if (typeof ourHaiku.line2 != "string") ourHaiku.line2 = ""
    if (typeof ourHaiku.line3 != "string") ourHaiku.line3 = ""

    ourHaiku.line1 = ourHaiku.line1.replace(/(\r\n|\n|\r)/g, " ")
    ourHaiku.line2 = ourHaiku.line2.replace(/(\r\n|\n|\r)/g, " ")
    ourHaiku.line3 = ourHaiku.line3.replace(/(\r\n|\n|\r)/g, " ")

    ourHaiku.line1 = ourHaiku.line1.trim()
    ourHaiku.line2 = ourHaiku.line2.trim()
    ourHaiku.line3 = ourHaiku.line3.trim()

    if (ourHaiku.line1.length == 0) errors.line1 = "This line is required."
    else if (ourHaiku.line1.length < 5) errors.line1 = "Too few syllables; must be 5."
    else if (ourHaiku.line1.length > 25) errors.line1 = "Too many syllables; must be 5"
    if (ourHaiku.line2.length == 0) errors.line2 = "This line is required."
    else if (ourHaiku.line2.length < 7) errors.line2 = "Too few syllables; must be 7."
    else if (ourHaiku.line2.length > 30) errors.line2 = "Too many syllables; must be 7"
    if (ourHaiku.line3.length == 0) errors.line3 = "This line is required."
    else if (ourHaiku.line3.length < 5) errors.line3 = "Too few syllables; must be 5."
    else if (ourHaiku.line3.length > 25) errors.line3 = "Too many syllables; must be 5"

    if (!isAlphaNumericWithSomeGrammer(ourHaiku.line1)) errors.line1 = "Only letters, numbers and grammer characters allowed"
    if (!isAlphaNumericWithSomeGrammer(ourHaiku.line2)) errors.line2 = "Only letters, numbers and grammer characters allowed"
    if (!isAlphaNumericWithSomeGrammer(ourHaiku.line3)) errors.line3 = "Only letters, numbers and grammer characters allowed"

    // verify image signature
    const expectedSignature = cloudinary.utils.api_sign_request({public_id: formData.get("public_id"), version: formData.get("version")}, cloudinaryConfig.api_secret)
    if (expectedSignature === formData.get("signature")) {
        ourHaiku.image = formData.get("public_id")
    }
    
    return {
        errors,
        ourHaiku
    }
}

export const createHaiku = async function(prevState, formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect("/")
    }

    const results = await sharedHaikuLogic(formData, user)

    if (results.errors.line1 || results.errors.line2 || results.errors.line3) {
        return {errors: results.errors}
    }

    // OK to save to DB
    const haikusCollection = await getCollection("haikus")
    const newHaiku = await haikusCollection.insertOne(results.ourHaiku)

    // Redirect back to Home page after save
    return redirect("/")
}

export const editHaiku = async function(prevState, formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect("/")
    }

    const results = await sharedHaikuLogic(formData, user)

    if (results.errors.line1 || results.errors.line2 || results.errors.line3) {
        return {errors: results.errors}
    }

    const haikusCollection = await getCollection("haikus")

    // Get the ID
    let haikuId = formData.get("haikuId")
    if (typeof haikuId != "string") haikuId = ""

    // Make sure only authors can update their own haiku
    const haikuToCheck = await haikusCollection.findOne({_id: ObjectId.createFromHexString(haikuId)})
    if (haikuToCheck.author.toString() !== user.userId) {
        return redirect("/")
    }

    console.log("ready to update: " + haikuId)
    // OK to save to DB
    await haikusCollection.findOneAndUpdate({_id: ObjectId.createFromHexString(haikuId)}, {$set: results.ourHaiku})

    // Redirect back to Home page after save
    return redirect("/")
}

export const deleteHaiku = async function(formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect("/")
    }

    const haikusCollection = await getCollection("haikus")

    // Get the ID
    let haikuId = formData.get("id")
    if (typeof haikuId != "string") haikuId = ""

     // Make sure only authors can update their own haiku
     const haikuToCheck = await haikusCollection.findOne({_id: ObjectId.createFromHexString(haikuId)})
     if (haikuToCheck.author.toString() !== user.userId) {
         return redirect("/")
     }
 
     // OK to delete from DB
     await haikusCollection.deleteOne({_id: ObjectId.createFromHexString(haikuId)})
 
     // Redirect back to Home page after delete
     return redirect("/")
 }