import { useEffect, useState } from 'react';
import { Spinner } from "@nextui-org/react";
import data from '../local-db/TheSimsDBcopy.json';
import { findPackIcon } from '../js/findPackIcon';
import { db } from '../firebase-config';
import { arrayUnion, doc, updateDoc, arrayRemove } from "firebase/firestore";
import AuthDetails from '../auth/authDetails';

function Aspirations({ownedPacks, userId, packs}){
  const [aspirations, setAspirations] = useState(null)
  const [ownedAspirations, setOwnedAspirations] = useState([])

  const [currentAspiration, setCurrentAspiration] = useState(null)

  const { userInfo } = AuthDetails()
  const [completedAspirations, setCompletedAspirations] = useState([])
  const ownedPacksRef = doc(db, "users", userId)

  useEffect(() => {
    setAspirations(Object.values(data["The-Sims4"]["Aspirations_Type"]))

    if(userInfo){setCompletedAspirations(userInfo.completed_aspirations)}
  }, [userInfo])


  useEffect(() => {
    if(ownedPacks && aspirations){
      const baseGameAspirationTypes = Object.values(aspirations).filter(aspiration => aspiration.pack === "Base Game")
      const filteredAspirationTypes = [
        ...baseGameAspirationTypes,
        ...aspirations.filter(aspiration => ownedPacks.includes(aspiration.pack))
      ]

      setOwnedAspirations(filteredAspirationTypes.sort((a, b) => a.name.localeCompare(b.name)))
    }
  }, [ownedPacks])


  const totalAspirationsLength = ownedAspirations.reduce((total, aspirationObj) => {
    const matchingAspirations = Object.values(aspirationObj.aspirations)
      .filter(aspiration => aspiration.pack === "Base Game" || ownedPacks.includes(aspiration.pack))
  
    return total + matchingAspirations.length;
  }, 0)


  const handleCompleteAspirationContent = async (aspirationCompleted) => {
    if(completedAspirations.includes(aspirationCompleted)){
      updateDoc(ownedPacksRef, {
        completed_aspirations: arrayRemove(aspirationCompleted)
      })
    }else{
      updateDoc(ownedPacksRef, {
        completed_aspirations: arrayUnion(aspirationCompleted)
      })
    }
  }


  return(
    <>
    {
      aspirations !== null ? 
        <section className="aspirations-container">
          <div className="packs-container-title"><p>Aspirations</p></div>

          <div className="container-percentage">
          Aspirations Completed: {completedAspirations.length}/{totalAspirationsLength}
          </div>

          <div className="aspirations-list">
            {ownedAspirations.map((aspirationtype, index) => (
              <div
                className={currentAspiration === aspirationtype.name ? "aspirations-list-item aspirations-list-item-current" : "aspirations-list-item aspirations-list-item-all"}
                onClick={() => setCurrentAspiration(aspirationtype.name)}
                key={index}
              >

              {
                // console.log(completedAspirations.includes(aspirationtype.aspirations.name))
              }
                <img src={aspirationtype.icon} alt={aspirationtype.name} />

                <div className="aspirations-list-item-name">
                  {aspirationtype.name}
                </div>
              </div>
            ))}
          </div>

          <div className="aspirations-content">
          {
            ownedAspirations.map((aspiration) => {
              if (aspiration.name === currentAspiration) {
                const sortedAspirations = Object.values(aspiration.aspirations).sort((a, b) => {
                  return a.name.localeCompare(b.name)
                })
                return sortedAspirations.map((aspirationContent, index) => {

                  if(ownedPacks.includes(aspirationContent.pack) || aspirationContent.pack === "Base Game"){
                    return(
                      <div 
                        className={completedAspirations.includes(aspirationContent.name) ? "aspirations-content-item aspirations-content-item-complete" : "aspirations-content-item aspirations-content-item-incomplete"}
                        key={index}
                        onClick={() => handleCompleteAspirationContent(aspirationContent.name)}
                      >
                      <div className="aspirations-content-item-packimg">
                        {
                          aspirationContent.pack !== "Base Game" ? <img src={findPackIcon(aspirationContent.pack, packs)} alt={aspirationContent.pack}/> : null
                        }
                      </div>
  
                      <img src={aspirationContent.icon} alt={aspirationContent.name} />
  
                      <div className="aspirations-content-item-name">
                        {aspirationContent.name}
                      </div>
                    </div>
                    )
                  }
                  return null
                })
              }
              return null
            })
          }
          </div>
        </section>
        : <Spinner color="success" size="lg" style={{margin: "0px auto", display: "block", marginTop: "20%", width: "100px", height: "100px"}}/>
      }
    </>
  )
}

export default Aspirations