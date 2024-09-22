import HaikuForm from "../../../components/HaikuForm"
import { getCollection } from "../../../lib/db"
import { ObjectId } from "mongodb"
import { getUserFromCookie } from "../../../lib/getUser"
import { redirect } from "next/navigation"

async function getDoc(id) {
    const haikusCollection = await getCollection("haikus")
    const result = await haikusCollection.findOne({_id: ObjectId.createFromHexString(id)})
    return result
}

export default async function Page(props) {
    const haikuDoc = await getDoc(props.params.id)

    // Check the Author matches the User Id, else reject back Home page
    const user = await getUserFromCookie()
    if (user.userId !== haikuDoc.author.toString()) {
        redirect("/")
    }

    return (
        <div>
            <h2 className="text-center text-4xl text-gray-600 mb-7">Edit Haiku</h2>
            <HaikuForm haiku={haikuDoc} action="edit" />
        </div>
    )
}