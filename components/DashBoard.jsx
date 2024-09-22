import { getCollection } from "../lib/db"
import { ObjectId } from "mongodb"
import Haiku from "./Haiku"

async function getHaikus(userId) {
    const collection = await getCollection("haikus")
    // Sort haikus by ID descending (newest first (ie. -1))
    const results = await collection.find({author: ObjectId.createFromHexString(userId)}).sort({_id: -1}).toArray()
    return results
}

export default async function DashBoard(props) {
    const haikus = await getHaikus(props.user.userId)

    return (
        <div>
            <h2 className="text-center text-2xl text-gray-600 mb-5">Your Haikus</h2>
            {haikus.map((haiku, index) => {
                return <Haiku haiku={haiku} key={index} />
            })}
        </div>
    )
}