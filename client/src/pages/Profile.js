import { useSelector } from "react-redux";

const Profile = () => {
    const user = useSelector((state) => state.auth.user)

    return (
        <div>
            <h3 className="ph-6 text-2xl text-center text-white">
                Profile { user ? <h4 className="text-xl text-center text-white">Hi {user}!</h4> : null}
            </h3>
        </div>
    )
}


export default Profile