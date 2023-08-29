import { signOut } from "firebase/auth";
import { Link, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";

export default function NavBar({authUser, userInfo}){
  const navigate = useNavigate()

  const userSignOut = () => {
    navigate('/')
    signOut(auth).catch(error => console.log(error))
  }

  return(
    <header className="navbar">
      <Link href="/" color="foreground" size="lg" underline="hover">
        Plumbob Progress
      </Link>

      {
        authUser && userInfo ? 
          <><p>{userInfo.username}</p>
            <Button radius="full" size="lg" href="/" as={Link} onClick={userSignOut}>
              Sign Out
            </Button></> 
        :
        <Button variant="flat" radius="full" size="lg" href="/signin" as={Link} style={{color: "white"}}>
          Sign In
        </Button>
      }
    </header>
  )
}