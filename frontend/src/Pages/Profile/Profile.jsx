import { useAuth } from "../../context/AuthContext";
import './Profile.css';
import pfp from '../../assets/placeholders/profile-img.jpg';
import { useFindUser } from "../../api/user/userHooks";
import { useEffect, useState } from "react";
import { dateStringToDateText } from "../../utils/Parsers";

const Profile = () => {
    const {user,logout} = useAuth();
    const [userInformation, setUserInformation] = useState({});
    const {mutateAsync: findUser, isLoading, error} = useFindUser();

   useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user?.usu_id) {
                    const data = await findUser(user.usu_id);
                    setUserInformation(data.data.user);
                    console.log(data.data.user);
                }
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };

        fetchUserData();
    }, [user?.usu_id, findUser]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return(
        <div className="profile__page container">
            <div className="grid__profile">
                <div className="tall-rect">
                    <img src={pfp} className="pfp" alt="profile picture"/>

                   <div className="user-info">
                        <h3 className="my__profile">Mi perfil</h3>
                        <p>{userInformation.nombre} {userInformation.apellido}</p>
                        <div className="line-division"/>
                         <p>{userInformation.email}</p>
                         <div className="line-division"/>
                         <p>{dateStringToDateText(userInformation.fecha_nacimiento)}</p>
                        <div className="line-division"/>
                         <p>{dateStringToDateText(userInformation.fecha_creacion)}</p>

                         
                   </div>
                   <button className="btn logout" onClick={logout}>
                            Cerrar sesión
                         </button>
                </div>
                <div className="small-rect"></div>
                 <div className="small-rect"></div>
            </div>
        </div>
    );
}

export default Profile;