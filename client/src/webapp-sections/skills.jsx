import { useEffect, useState } from 'react';
import { Spinner, Tooltip } from "@nextui-org/react";
import data from '../local-db/TheSimsDB.json';
import { findPackIcon } from '../js/findPackIcon';
import { db } from '../firebase-config';
import { arrayUnion, doc, updateDoc, arrayRemove, setDoc } from "firebase/firestore";
import AuthDetails from '../auth/authDetails';

function Skills({ownedPacks, userId, packs}){
  const [skills, setSkills] = useState(null)

  const [ownedSkills, setOwnedSkills] = useState([])

  const [skillsProgress, setSkillsProgress] = useState(null)

  const { userInfo } = AuthDetails()
  const ownedSkillsRef = doc(db, "users", userId)

  useEffect(() => {
    setSkills(Object.values(data["The-Sims4"]["Skills"]))

    if(userInfo){setSkillsProgress(userInfo.skills_level)}
  }, [userInfo])


  useEffect(() => {
    if(ownedPacks && skills){
      const baseGameSkills = Object.values(skills).filter(skill => skill.pack === "Base Game")

      const filteredSkills = [
        ...baseGameSkills,
        ...skills.filter(skill => ownedPacks.includes(skill.pack))
      ]

      setOwnedSkills(filteredSkills.sort((a, b) => a.name.localeCompare(b.name)))
    }
  }, [ownedPacks, skills])


  const updateSkillProgress = async (skillName) => {
    const skillToUpdate = skillsProgress[skillName]
    const skillToLevelUp = ownedSkills.find(skill => skill.name === skillName)

    if(skillToUpdate){
      const newLevel = skillToUpdate + 1

      if(newLevel <= skillToLevelUp.max_level){

        setDoc(ownedSkillsRef, {
          skills_level: {
          [skillName]: newLevel
          }
        }, { merge: true })
      }else if(newLevel >= skillToLevelUp.max_level){
        setDoc(ownedSkillsRef, {
          skills_level: {
          [skillName]: 0
          }
        }, { merge: true })
      }
    }else if(!skillToUpdate){
      setDoc(ownedSkillsRef, {
        skills_level: {
          [skillName]: 1
        }
      }, { merge: true })
    }
  }


  return(
    <>
      {
      ownedSkills !== null && skillsProgress ? 
        <section className="aspirations-container">
          <div className="packs-container-title"><p>Skills</p></div>

          <div className="container-percentage">
            Skills Completed: {ownedSkills.filter(skill => (skillsProgress[skill.name] ? skillsProgress[skill.name] : 0) === skill.max_level).length}/{ownedSkills.length}
          </div>

          <div className="skills-container">
            {
              ownedSkills.map((skill, index) => {
                return(
                <div
                  key={index}
                  className={(skillsProgress[skill.name] ? skillsProgress[skill.name] : 0) === skill.max_level ? "skill-complete skills" : "skills"}
                  onClick={() => updateSkillProgress(skill.name)}
                >

                  <img src={skill.icon} alt={skill.name} 
                    className={(skillsProgress[skill.name] ? skillsProgress[skill.name] : 0) === skill.max_level ? "skill-complete skills-icon" : "skills-icon"}/>

                  <div style={{display: "flex", flexDirection: "row"}} className="skills-name">
                    <Tooltip key={index} content={skill.pack} placement="top">
                      <div>
                        {
                          skill.pack !== "Base Game" ? <img src={findPackIcon(skill.pack, packs)} alt={skill.pack} className="skills-icon-pack"/> : null
                        }
                      </div>
                    </Tooltip>

                    {skill.name}
                  </div>

                    <div className="skill-bar">
                        <div
                          style={{ width: `${((skillsProgress[skill.name] ? skillsProgress[skill.name] : 0) / skill.max_level) * 100}%` }}
                          className={(skillsProgress[skill.name] ? skillsProgress[skill.name] : 0) === skill.max_level ? "skill-complete fill-bar" : "skill-incomplete fill-bar"}
                        ></div>
                      </div>

                    <div 
                      className={(skillsProgress[skill.name] ? skillsProgress[skill.name] : 0) === skill.max_level ? "skill-complete skills-level" : "skills-level"}>
                        {skillsProgress[skill.name] ? skillsProgress[skill.name] : 0}
                    </div>

                </div>
              )})}
          </div>

        </section>
        : <Spinner color="success" size="lg" style={{margin: "0px auto", display: "block", marginTop: "20%", width: "100px", height: "100px"}}/>
      }
    </>
  )
}

export default Skills