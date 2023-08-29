import { Tooltip } from '@nextui-org/react'
import '../styles/sims-button.scss'
import { db } from '../firebase-config';
import { arrayUnion, doc, updateDoc, arrayRemove } from "firebase/firestore";

function PacksList({ownedPacks, userId, packs}){
  const ownedPacksRef = doc(db, "users", userId)

  const handleAddPack = async (pack) => {
    if(ownedPacks.includes(pack)){
      updateDoc(ownedPacksRef, {
        owned_packs: arrayRemove(pack)
      })
    }else{
      updateDoc(ownedPacksRef, {
        owned_packs: arrayUnion(pack)
      })
    }
  }

  // function handleAddAllPacks(){
  //   const allPackNames = []

  //   packs.forEach((packType) => {
  //     const packTypeData = packType[1]
  //     Object.values(packTypeData).forEach((pack) => {
  //       allPackNames.push(pack.name)
  //     })
  //   })
  // }

  return(
    <div className="packs-container">

      <div className="packs-container-title"><p>The Sims 4 Packs</p></div>

      {
        packs && ownedPacks && packs.map((packtype, index) => (
          <div key={'packType' + index} className="packs-list">
            {
              Object.values(packtype[1]).map((pack, index) => (
                <Tooltip key={index} content={pack.name} placement="top">
                  <div
                    onClick={() => handleAddPack(pack.name)}
                    className="packs-list-icon"
                  >
                    <img 
                      src={pack.icon} 
                      alt={pack.name} 
                      style={ownedPacks && ownedPacks.find((ownedPack) => ownedPack === pack.name) ? {opacity: 1} : {opacity: .25}}
                    />
                  </div>
                </Tooltip>
              ))
            }
          </div>
        ))
      }

        {/* <div className="sims-button-container">
          <button onClick={() => handleAddAllPacks()}
            className="sims-button"
          >Select All</button>
          <button className="sims-button" onClick={() => handleDeleteAllPacks()}>Deselect All</button>
        </div> */}
    </div>
  )
}

export default PacksList