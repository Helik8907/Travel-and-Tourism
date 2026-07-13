import DestinationSection from '../components/DestinationSection'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'

function Home() {
    return (
        <>
            <div className="min-h-screen bg-bgLight font-sans">
                <Hero/>
                <DestinationSection/>
            </div>
        </>
    )
}

export default Home