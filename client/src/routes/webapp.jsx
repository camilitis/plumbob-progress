import { useEffect, useState } from "react"
import AuthDetails from "../auth/authDetails"
import PacksList from "../webapp-sections/packsList"
import { Spinner, Accordion, AccordionItem } from '@nextui-org/react'
import data from '../local-db/TheSimsDB.json';
import "../styles/app.scss"

import Aspirations from "../webapp-sections/aspirations"
import Skills from "../webapp-sections/skills"
import Careers from "../webapp-sections/careers"
import Degrees from "../webapp-sections/degrees"

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
          <Accordion variant="splitted" selectionMode="multiple" className="accordion">
            <AccordionItem key="1" aria-label="My packs" title="My packs" indicator={({ isOpen }) => (isOpen ? "|" : "+")}>
              <PacksList ownedPacks={ownedPacks} userId={userId} packs={packs}/>
            </AccordionItem>
          </Accordion>

          <Aspirations ownedPacks={ownedPacks} userId={userId} packs={packs}/>

          <Skills ownedPacks={ownedPacks} userId={userId} packs={packs}/>

          <Careers ownedPacks={ownedPacks} userId={userId} packs={packs}/>

          <Degrees ownedPacks={ownedPacks} userId={userId} packs={packs}/>
        </section>
      : <Spinner color="success" size="lg" style={{margin: "20px auto", display: "block", width: "100px", height: "50px"}}/>
    }
    </>
  )
}

export default WebApp