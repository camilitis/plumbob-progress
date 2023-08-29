import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { Input, Button, Link, Divider } from "@nextui-org/react";

function SignIn(){
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        console.log(error)
      })
  }

  return(
    <div className="signin-container">
      <h2>Sign In</h2>

        <form onSubmit={handleSubmit}>
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

          <Button type="submit" color="success" variant="shadow" className="form-input">
            Sign In
          </Button>
        </form>

        <div>
          <Divider/>

          <p>Don't have an account?</p>
            <Link href="/signup" color="success">
              Sign Up
            </Link>
        </div>
    </div>
  )
}

export default SignIn