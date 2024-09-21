"use server"

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

    // Store new user
    // Log user in
    return {
        success: true
    }
}