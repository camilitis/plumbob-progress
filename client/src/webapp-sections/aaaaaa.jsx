function Skills({ownedPacks, userId, packs}){

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