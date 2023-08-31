import { useEffect, useState } from "react"
import AuthDetails from "../auth/authDetails"
import PacksList from "../webapp-sections/packsList"
import { Spinner } from '@nextui-org/react'
import data from '../local-db/TheSimsDB.json';

import Aspirations from "../webapp-sections/aspirations"
import Skills from "../webapp-sections/skills"

function WebApp({userId}){
  const [ownedPacks, setOwnedPacks] = useState(null)
  const [packs, setPacks] = useState(null)

  const { userInfo } = AuthDetails()

  useEffect(() => {
    if(userInfo){setOwnedPacks(userInfo.owned_packs)}

    setPacks(Object.entries(data["The-Sims4"]["Packs"]))
  }, [userInfo])


  return(
    <>
    {
      userInfo ?
        <section className="webapp">
          <PacksList ownedPacks={ownedPacks} userId={userId} packs={packs}/>

          <Aspirations ownedPacks={ownedPacks} userId={userId} packs={packs}/>

          <Skills ownedPacks={ownedPacks} userId={userId} packs={packs}/>
        </section>
      : <Spinner color="success" size="lg" style={{margin: "20px auto", display: "block", width: "100px", height: "50px"}}/>
    }
    </>
  )
}

export default WebApp