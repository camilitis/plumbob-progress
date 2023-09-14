import "../styles/careers.scss"
import { useEffect, useState } from 'react';
import { Spinner, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import data from '../local-db/TheSimsDB.json';
import { findPackIcon } from '../js/findPackIcon';
import { db } from '../firebase-config';
import { doc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
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

  const handleCompleteCareer = (careerId ,careerName) => {
    if(!ownedCareers[careerId].branches){
      if(!careersProgress[careerName] || !careersProgress[careerName].completed || careersProgress[careerName].completed === false){
        setDoc(ownedCareersRef, {
          careers_progress:{
            [careerName]:{ 
              completed: true
            }
          }
        }, {merge: true})
      }else if(careersProgress[careerName].completed === true){
        setDoc(ownedCareersRef, {
          careers_progress:{ 
            [careerName]:{
              completed: false
            }
          }
        }, {merge: true})
      }
    }
  }


  const handleCompleteBranch = async (careerName, branchName) => {
    if(careersProgress[careerName] === undefined || (careersProgress[careerName].branches && !careersProgress[careerName].branches.includes(branchName))){
      setDoc(ownedCareersRef, {
        careers_progress:{
          [careerName]:{ 
            branches: arrayUnion(branchName)
          }
        }
      }, { merge: true })
    }else if(careersProgress[careerName].branches && careersProgress[careerName].branches.includes(branchName)){
      await setDoc(ownedCareersRef, {
        careers_progress:{
          [careerName]:{ 
            branches: arrayRemove(branchName)
          }
        }
      }, { merge: true })
    }
  }

  function handleProgress(careerName){
    if(careersProgress[careerName] && !careersProgress[careerName].branches){
      if(careersProgress[careerName].completed === true){
        return 1
      }else if(careersProgress[careerName].completed === false){
        return 0
      }
    }else if(careersProgress[careerName] && careersProgress[careerName].branches){
//TODO careersProgress[careerName].completed === false 
      if(careersProgress[careerName].branches.length === 0){
        return 0
      }else if(careersProgress[careerName].branches.length === 1){
        return 1
      }else if(careersProgress[careerName].branches.length === 2){
        return 2
      }

    }else{
      return 0
    }
  }

  const [completedCareers, setCompletedCareers] = useState(0)

  useEffect(() => {
    if(careersProgress){
      const filteredCareers = Object.entries(careersProgress).filter(([career, progress]) => {
        return (
          (progress && progress.completed === true) ||
          (progress && progress.branches && progress.branches.length === 2)
        )
      })
  
      setCompletedCareers(filteredCareers.length)
    }
  }, [careersProgress])


  return(
    <>
      {
      ownedCareers !== null && userInfo && careersProgress ? 
        <section className="aspirations-container">
          <div className="packs-container-title"><p>Careers</p></div>

          <div className="container-percentage">
          <p>
            Careers Completed: {completedCareers}/{Object.keys(ownedCareers).length}</p>
          </div>

          <div className="careers-container">
            {
              Object.keys(ownedCareers).map((careerId, index) => {
                const career = ownedCareers[careerId]

                return(
                  <div
                    key={index}
                    className={(careersProgress[career.name] && careersProgress[career.name].completed === true )
                      ||
                    (careersProgress[career.name] && careersProgress[career.name].branches && careersProgress[career.name].branches.length === 2)
                      ? "skill-complete career-degree career" : "career-degree career"}
                    onClick={() => handleCompleteCareer(careerId, career.name)}
                  >
                    <div className="career-level-container">
                      <img src={career.icon} alt={career.name} 
                        className={(careersProgress[career.name] && careersProgress[career.name].completed === true )
                          ||
                        (careersProgress[career.name] && careersProgress[career.name].branches && careersProgress[career.name].branches.length === 2)
                          ? "skill-complete career-icon" : "career-icon"}
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
                        {handleProgress(career.name)} / {career.branches ? "2" : "1"}
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
                              onClick={() => handleCompleteBranch(career.name, career.branches[0].name)}
                              className={careersProgress[career.name] && careersProgress[career.name].branches.includes(career.branches[0].name) ? "career-branch skill-complete" : "career-branch"}
                            >
                            <img src={career.branches[0].icon} alt={career.branches[0].name} className="career-branch-icon"/>
                            <p className="career-branch-name">
                              {career.branches[0].name}
                            </p>
                            </div>
                          </DropdownItem>
                          <DropdownItem key="copy">
                            <div
                              onClick={() => handleCompleteBranch(career.name, career.branches[1].name)}
                              className={careersProgress[career.name] && careersProgress[career.name].branches.includes(career.branches[1].name) ? "career-branch skill-complete" : "career-branch"}
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

export default Careers