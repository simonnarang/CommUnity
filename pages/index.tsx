import Header from '../components/Header'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="flex justify-between">
        <h1 className="header">Welcome to CommUnity</h1>
        <p>
          Maintain engagement within your own community by exploring what events CommUnity has to
          offer!
        </p>
      </div>
      <Footer />
    </>
  )
}
