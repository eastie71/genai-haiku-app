import RegisterForm from '../components/RegisterForm'
import { getUserFromCookie } from '../lib/getUser'
import DashBoard from '../components/DashBoard'

export default async function Page() {
    const user = await getUserFromCookie()

    return (
        <>
            {user && (
                <DashBoard user={user} />
            )}
            {!user && (
                <>
                    <p className="text-center text-2xl text-gray-600 mb-5">Don&rsquo;t have an account? <strong>Create One</strong></p>
                    <RegisterForm/>
                </>
            )}
            
        </>
    )
}