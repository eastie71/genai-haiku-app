"use client"

import Link from "next/link"
import { deleteHaiku } from "../actions/haikuController"
import { CldImage } from 'next-cloudinary'

export default function Haiku(props) {
    return (
        <div>
            <CldImage
                width="650"
                height="300"
                fillBackground
                crop={{type: "pad", source: true}}
                src={props.haiku.image}
                sizes="650px"
                alt="Description of my image"
                overlays={[{
                    position: {
                       x: 34,
                       y: 154,
                       angle: -10,
                       gravity: "north_west"
                    },
                    text: {
                        color: "black",
                        fontFamily: "Source Sans Pro",
                        fontSize: 42,
                        fontWeight: "bold",
                        text: `${props.haiku.line1}%0A${props.haiku.line2}%0A${props.haiku.line3}`
                    }
                },
                {
                    position: {
                       x: 30,
                       y: 150,
                       angle: -10,
                       gravity: "north_west"
                    },
                    text: {
                        color: "white",
                        fontFamily: "Source Sans Pro",
                        fontSize: 42,
                        fontWeight: "bold",
                        text: `${props.haiku.line1}%0A${props.haiku.line2}%0A${props.haiku.line3}`
                    }
                }]}
            />
            {props.haiku.line1}
            <br />
            {props.haiku.line2}
            <br />
            {props.haiku.line3}
            <br />
            <Link href={`/edit-haiku/${props.haiku._id.toString()}`}>Edit</Link>
            <form action={deleteHaiku}>
                <input name="id" type="hidden" defaultValue={props.haiku._id.toString()}/>
                <button>Delete</button>
            </form>
            <hr />
        </div>
    )
}