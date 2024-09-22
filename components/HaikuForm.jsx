"use client"

import {useFormState} from "react-dom"
import { createHaiku, editHaiku } from "../actions/haikuController"

export default function HaikuForm(props) {
    let actualAction

    if (props.action === "create") {
        actualAction = createHaiku
    } else if (props.action === "edit") {
        actualAction = editHaiku
    }
    const [formState, formAction] = useFormState(actualAction, {})

    return (
        <form action={formAction} className="max-w-xs mx-auto">
            <div className="mb-3">
                <input name="line1" defaultValue={props.haiku?.line1} autoComplete='off' type="text" placeholder="Line #1" className="input input-bordered w-full max-w-xs" />
                {formState.errors?.line1 && (
                    <div role="alert" className="alert alert-warning">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{formState.errors?.line1}</span>
                </div>
                )}
            </div>
            <div className="mb-3">
                <input name="line2" defaultValue={props.haiku?.line2} autoComplete='off' type="text" placeholder="Line #2" className="input input-bordered w-full max-w-xs" />
                {formState.errors?.line2 && (
                    <div role="alert" className="alert alert-warning">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{formState.errors?.line2}</span>
                </div>
                )}
            </div>
            <div className="mb-3">
                <input name="line3" defaultValue={props.haiku?.line3} autoComplete='off' type="text" placeholder="Line #2" className="input input-bordered w-full max-w-xs" />
                {formState.errors?.line3 && (
                    <div role="alert" className="alert alert-warning">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{formState.errors?.line3}</span>
                </div>
                )}
            </div>
            <input type="hidden" name="haikuId" defaultValue={props.haiku?._id.toString()}/>
            <button className='btn btn-primary'>Submit</button>
        </form>
    )
}