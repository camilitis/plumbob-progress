import "../styles/careers.scss"
import { useEffect, useState } from 'react';
import { Spinner, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import data from '../local-db/TheSimsDB.json';
import { findPackIcon } from '../js/findPackIcon';
import { db } from '../firebase-config';
import { doc, setDoc } from "firebase/firestore";
import AuthDetails from '../auth/authDetails';

function Careers({ownedPacks, userId, packs}){
  const [careers, setCareers] = useState(null)
  const [ownedCareers, setOwnedCareers] = useState([])
  const [careersProgress, setCareersProgress] = useState(null)

  const { userInfo } = AuthDetails()
  const ownedCareersRef = doc(db, "users", userId)

  useEffect(() => {
    setCareers(Object.values(data["The-Sims4"]["Careers"]))

    if(userInfo){setCareersProgress(userInfo.careers_progress)}
  }, [userInfo])


  useEffect(() => {
    if(ownedPacks && careers){
      const baseGameCareers = Object.values(careers).filter(career => career.pack === "Base Game")

      const filteredCareers = [
        ...baseGameCareers,
        ...careers.filter(career => ownedPacks.includes(career.pack))
      ]

      setOwnedCareers(filteredCareers.sort((a, b) => a.name.localeCompare(b.name)))
    }
  }, [ownedPacks, careers])


  // const handleCompleteCareer = (careerId) => {
  //   if(!ownedCareers[careerId].completed && !ownedCareers[careerId].branches){
  //     setOwnedCareers(prevData => {
  //       const newData = { ...prevData }
  //       newData[careerId].completed = true
  //       return newData
  //     })
  //   }else if(ownedCareers[careerId].completed === true && !ownedCareers[careerId].branches){
  //     setOwnedCareers(prevData => {
  //       const newData = { ...prevData }
  //       newData[careerId].completed = false
  //       return newData
  //     })
  //   }
  // }

  // const handleCompleteBranch = (careerId, branch) => {
  //   if(!ownedCareers[careerId].branches[branch].completed){
  //     setOwnedCareers(prevData => {
  //       const newData = { ...prevData }
  //       newData[careerId].branches[branch].completed = true
  //       return newData
  //     })
  //   }else if(ownedCareers[careerId].branches[branch].completed === true){
  //     setOwnedCareers(prevData => {
  //       const newData = { ...prevData }
  //       newData[careerId].branches[branch].completed = false
  //       return newData
  //     })
  //   }

  //   //TODO TOGGLE!!

  //   if(ownedCareers[careerId].branches[0].completed === true && ownedCareers[careerId].branches[1].completed === true){
  //     setOwnedCareers(prevData => {
  //       const newData = { ...prevData }
  //       newData[careerId].completed = true
  //       return newData
  //     })
  //   }else if(ownedCareers[careerId].branches[0].completed === false || ownedCareers[careerId].branches[1].completed === false){
  //     setOwnedCareers(prevData => {
  //       const newData = { ...prevData }
  //       newData[careerId].completed = false
  //       return newData
  //     })
  //   }
  // }

  return(
    <>
      {
      ownedCareers !== null ? 
        <section className="aspirations-container">
          <div className="packs-container-title"><p>Careers</p></div>

          <div className="container-percentage">
          <p>Careers Completed: {Object.keys(ownedCareers).filter(careerId => ownedCareers[careerId].completed === true).length}/{Object.keys(ownedCareers).length}</p>
          </div>

          <div className="careers-container">
            {
              Object.keys(ownedCareers).map((careerId, index) => {
                const career = ownedCareers[careerId]

                return(
                  <div
                    key={index}
                    // className={career.completed === true || career.branches && career.branches[1].completed === true && career.branches[0].completed ? "skill-complete career-degree career" : "career-degree career"}
                    className="career-degree career"
                    // onClick={() => handleCompleteCareer(careerId)}
                  >
                    <div className="career-level-container">
                      <img src={career.icon} alt={career.name} 
                        className="career-icon"
                        />

                      <div style={{display: "flex", flexDirection: "row"}} className="career-name">
                        <Tooltip key={index} content={career.pack} placement="top">
                          <div>
                            {
                              career.pack !== "Base Game" ? <img src={findPackIcon(career.pack, packs)} alt={career.pack} className="career-icon-pack"/> : null
                            }
                          </div>
                        </Tooltip>

                        {career.name}
                      </div>

                      <div>
                        {/* {handleProgress()} */}
                         / {career.branches ? "2" : "1"}
                      </div>

                      {
                      career.branches ?
                      <Dropdown>
                        <DropdownTrigger>
                          <Button 
                            variant="bordered" 
                          >
                            Branches
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem key="new">
                            <div 
                              // onClick={() => handleCompleteBranch(careerId, 0)}
                              className={career.branches[0].completed && career.branches[0].completed ? "career-branch skill-complete" : "career-branch"}
                            >
                            <img src={career.branches[0].icon} alt={career.branches[0].name} className="career-branch-icon"/>
                            <p className="career-branch-name">
                              {career.branches[0].name}
                            </p>
                            </div>
                          </DropdownItem>
                          <DropdownItem key="copy">
                            <div
                              // onClick={() => handleCompleteBranch(careerId, 1)}
                              className={career.branches[1].completed && career.branches[1].completed ? "career-branch skill-complete" : "career-branch"}
                            >
                            <img src={career.branches[1].icon} alt={career.branches[1].name} className="career-branch-icon"/>
                            <p className="career-branch-name">
                              {career.branches[1].name}
                            </p>
                            </div>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                      : null
                    }
                    </div>
                  </div>
                )
              })
            }
          </div>
        </section>
        : <Spinner color="success" size="lg" style={{margin: "0px auto", display: "block", marginTop: "20%", width: "100px", height: "100px"}}/>
      }
    </>
  )
}

export default Careers;