import "../styles/degrees.scss"
import { Spinner, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from 'react';
import data from '../local-db/TheSimsDB.json';
import { findPackIcon } from '../js/findPackIcon';
import { db } from '../firebase-config';
import { doc, setDoc, arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import AuthDetails from '../auth/authDetails';

function Degrees({ownedPacks, userId, packs}){
  const [degrees, setDegrees] = useState(null)
  const [ownedDegrees, setOwnedDegrees] = useState([])
  const [degreesProgress, setDegreesProgress] = useState(null)

  const { userInfo } = AuthDetails()
  const ownedDegreesRef = doc(db, "users", userId)

  useEffect(() => {
    setDegrees(Object.values(data["The-Sims4"]["Degrees"]))

    if(userInfo){setDegreesProgress(userInfo.degrees_progress)}
  }, [userInfo])

  useEffect(() => {
    if(ownedPacks && degrees){
      const filteredDegrees = [
        ...degrees.filter(degrees => ownedPacks.includes(degrees.pack))
      ]

      setOwnedDegrees(filteredDegrees.sort((a, b) => a.name.localeCompare(b.name)))
    }
  }, [ownedPacks, degrees])

  const handleCompleteDegree = async (degreeName) => {
    if(degreesProgress.includes(degreeName)){
      updateDoc(ownedDegreesRef, {
        degrees_progress: arrayRemove(degreeName)
      })
    }else{
      updateDoc(ownedDegreesRef, {
        degrees_progress: arrayUnion(degreeName)
      })
    }
  }

  return(
    <>
      {
      ownedDegrees !== null && degreesProgress ?
        <section className="aspirations-container">
          <div className="packs-container-title"><p>Degrees</p></div>

          <div className="container-percentage">
            <p>Degrees Completed: {degreesProgress.length}/{Object.keys(ownedDegrees).length}
            </p>
          </div>

          <div className="careers-container">
              {
                ownedDegrees.map((degree, index) => (
                  <div
                    key={index}
                    className={degreesProgress.includes(degree.name) ? "skill-complete career-degree degree" : "career-degree degree"}
                    onClick={() => handleCompleteDegree(degree.name)}
                  >
                    <div className="degree-level-container">
                      <img src={degree.icon} alt={degree.name} 
                          className={degreesProgress.includes(degree.name) ? "skill-complete degree-icon" : "degree-icon"}
                          />

                      <div style={{display: "flex", flexDirection: "row"}} className="degree-name">
                        <Tooltip key={index} content={degree.pack} placement="top">
                          <div>
                            {
                              degree.pack !== "Base Game" ? <img src={findPackIcon(degree.pack, packs)} alt={degree.pack} className="degree-icon-pack"/> : null
                            }
                          </div>
                        </Tooltip>

                        {degree.name}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>

        </section>
        : <Spinner color="success" size="lg" style={{margin: "0px auto", display: "block", marginTop: "20%", width: "100px", height: "100px"}}/>
      }
    </>
  )
}

export default Degrees