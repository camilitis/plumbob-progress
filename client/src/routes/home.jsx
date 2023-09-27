import { Link, Button } from "@nextui-org/react";

function Home({authUser, userInfo}){
  return(
    <section className="home">
      <div className="home-header">
        <h1>Welcome to the Sims 4 Plumbob Progress</h1>
        <h2>A Sim's Progress Tracker</h2>
      </div>
  
      <p>Embark on a journey of achievement and virtual growth with our cutting-edge Sims 4 Progress Tracker. Whether you're a seasoned simmer or just starting out, our app is your companion in conquering the vast world of The Sims 4 challenges. Say goodbye to scattered notes and hello to organized progress monitoring like never before.</p>

      <h2>Explore, Excel, and Conquer:</h2>
      <p>Dive into an immersive experience where you can effortlessly record and manage your Sim's skills, careers, degrees, and aspirations. Our intuitive interface empowers you to track your Sim's journey with precision, ensuring no milestone goes unnoticed.</p>

      <h2>Tailored to Your Journey:</h2>
      <p>Create a personalized account, select the expansion, game, and stuff packs you own, and witness your virtual world expand in the app.</p>

      <div className="keyfeatures-container">
        <h2>Key Features:</h2>
        <p>
          <span>Skills:</span> Monitor skill levels and progress, turning novices into masters.
        </p>
        <p>
          <span>Careers:</span> Strategize career advancement and keep tabs on promotions.
        </p>
        <p><span>Degrees:</span> Pursue higher education and reach new heights academically.</p>
        <p>
          <span>Aspirations:</span> Embark on personal journeys and witness dreams turn into reality.
        </p>
        {/* <p>
          <span>Challenge Tracking:</span> From Legacy Challenges to Rags to Riches, conquer every challenge systematically.
        </p> */}
        {/* <p>
          <span>Pack Integration:</span> Seamlessly incorporates all your owned packs, ensuring no content is left behind.
        </p> */}
        <p>
          <span>User-Friendly:</span> Intuitive design that makes tracking progress a breeze for players of all levels.
        </p>
      </div>

      <p>Don't just play The Sims 4 - own it, conquer it, and thrive in it. Join us in shaping the ultimate Sims 4 challenge experience. Get started now!</p>

      {
        authUser && userInfo ? 
          <Button href="/webapp" as={Link} color="success">
            Go to app
          </Button>
        :
          <div className="home-links">
          <Button color="success" variant="flat" radius="full" size="lg" href="/signin" as={Link}>
            Enter
          </Button>
          <Button variant="flat" radius="full" size="lg" href="/signup" as={Link}>
            I don't have an account
          </Button>
        </div>
      }
    </section>
  )
}

export default Home