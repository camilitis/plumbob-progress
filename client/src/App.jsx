import { useEffect, useState } from 'react';
import NavBar from './components/navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from '@nextui-org/react';
import AuthDetails from './auth/authDetails';
import Home from './routes/home';
import SignIn from './routes/signin';
import SignUp from './routes/signup';
import WebApp from './routes/webapp';

function App(){
  const [userId, setUserId] = useState(null)
  const { authUser, session, userInfo } = AuthDetails()

  useEffect(() => {
    if(userInfo){setUserId(authUser.uid)}
  }, [userInfo])

  //* If remove pack and progress made => remove everything in the DB from pack || function everytime you delete a pack

  return (
    <>
    {
      (session != null  && userInfo) || session === false ?

      <div className="app">
        <header className="app-header">
          <NavBar authUser={authUser} userInfo={userInfo}/>
        </header>
          <Routes>
            {!authUser ? <Route exact path='/signin' element={<SignIn/>}/> : <Route exact path='/signin' element={<Navigate to='/webapp' />}/>}
            {!authUser ? <Route exact path='/signup' element={<SignUp/>}/> : <Route exact path='/signup' element={<Navigate to='/webapp' />}/>}

            <Route exact path='/home' element={<Home authUser={authUser} userInfo={userInfo}/>}/>

            {authUser && <Route exact path='/webapp' element={<WebApp userId={userId}/>}/>}

            {authUser && <Route exact path='/' element={<Navigate to='/webapp'/>}/>}
            {!authUser && <Route exact path='/' element={<Navigate to='/home'/>}/>}

            <Route path='*' element={<Navigate to='/home'/>}/>
          </Routes>
      </div>

      : <Spinner color="success" size="lg" style={{margin: "0px auto", display: "block", marginTop: "20%", width: "100px", height: "100px"}}/>

      }
    </>
  )
}

export default App