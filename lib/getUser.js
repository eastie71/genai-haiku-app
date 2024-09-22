import {cookies} from "next/headers"
import jwt from "jsonwebtoken"

export async function getUserFromCookie() {
    const theCookie = cookies().get("haikuapp")?.value

    if (theCookie) {
        try {
            const decoded = jwt.verify(theCookie, process.env.JWTSECRET)
            return decoded
        } catch (errors) {
            return null
        }
    }
    return null
}