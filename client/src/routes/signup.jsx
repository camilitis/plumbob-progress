import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { Input, Button, Link, Divider, Chip, Spinner } from "@nextui-org/react";

function SignUp(){
  const [username, setUsername] = useState(null) 
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try{
      if(password !== confirmPassword){
        setError("Passwords do not match")
        return
      }else if(password.length < 6){
        setError("Password must be at least 6 characters")
        return
      }else if(username.length < 3){
        setError("Username must be at least 3 characters")
        return
      }

      const { user } = await createUserWithEmailAndPassword(auth, email, password)

      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        owned_packs: [],
        completed_aspirations: [],
        skills_level: {}
      })

      setLoading(false)

    }catch(err){
      console.log(err)
    }
  }

  return(
    <>
      {loading ? <Spinner color="success" size="lg" style={{margin: "0px auto", display: "block", marginTop: "20%", width: "100px", height: "100px"}}/> :
      <div className="signup-container">
        <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <Input
              required={true}
              onChange={(e) => setUsername(e.target.value)}
              value={username ?? ''}
              id="username"
              label="Username"
              variant="bordered"
              placeholder="VladislausStraud99"
              color="success"
              className="form-input"
              maxlength="15"
            />

            <Input
              required={true}
              onChange={(e) => setEmail(e.target.value)}
              value={email ?? ''}
              label="Email"
              type="email" 
              variant="bordered" 
              placeholder="countVlad@example.com"
              color="success"
              className="form-input"
            />

            <Input
              required={true}
              onChange={(e) => setPassword(e.target.value)}
              value={password ?? ''}
              label="Password"
              variant="bordered"
              placeholder="Enter your password"
              color="success"
              className="form-input"
              type="password"
            />

            <Input
              required={true}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              value={confirmPassword ?? ''}
              label="Password"
              variant="bordered"
              placeholder="Confirm your password"
              color="success"
              className="form-input"
              type="password"
            />

          {error ? <Chip color="danger" style={{ margin: "0px auto"}}>{error}</Chip> : null}

            <Button color="success" type="submit" variant="shadow" className="form-input">
              Sign Up
            </Button>
          </form>

          <div>
            <Divider/>

            <p>Already have an account?</p>
              <Link href="/signin" color="success">
                Sign In
              </Link>
          </div>
      </div>
      }
    </>
  )
}

export default SignUp