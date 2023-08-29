import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase-config";
import { doc, onSnapshot } from 'firebase/firestore';

const AuthDetails = () => {
  const [session, setSession] = useState(null)
  const [authUser, setAuthUser] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

    function getUserInfo(uid){
      onSnapshot(doc(db, "users", uid), (doc) => {
        setUserInfo(doc.data())
      })
    }

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if(user){
        getUserInfo(user.uid)
        setSession(true)
        setAuthUser(user)
      }else {
        setSession(false)
        setAuthUser(null)
      }
    })

    return() => {
      listen()
    }
  }, [])

  return { authUser, session, userInfo }
}

export default AuthDetails