import { signOut } from "firebase/auth";
import { Link, Button } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase-config";

export default function NavBar({authUser, userInfo}){
  const navigate = useNavigate()

  const userSignOut = () => {
    navigate('/')
    signOut(auth).catch(error => console.log(error))
  }


  return(
    <header className="navbar">
      <div className="navbar-home">
      </div>

      <div className="navbar-title">
        <Link href="/" color="foreground" size="lg" underline="hover">
          Plumbob Progress
        </Link>
      </div>

      {
        authUser && userInfo ? 
          <div className="navbar-user">
            <p>{userInfo.username}</p>
            <Button href="/" as={Link} onClick={userSignOut} color="danger">
              Sign Out
            </Button>
          </div>
        : null
      }
    </header>
  )
}