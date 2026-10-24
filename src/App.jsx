import './App.css'
import Header from './shared/components/Header'
import Footer from './shared/components/Footer'
import { TicketCheck } from "lucide-react";

function App() {

  return (
    <>
      <Header/>
      <main>
        <div className="flex flex-col gap-1 place-items-center m-2">
             <TicketCheck className="size-12 text-white bg-amber-500 p-2 rounded-3xl"/> 
             <h1 className="text-2xl">Bienvenido a TIKETEKA</h1>
        </div>
      </main>
      <Footer/>
    </>
  )
}

export default App
