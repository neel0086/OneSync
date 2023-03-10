import React from 'react'
import { useStateContext } from '../context'
import image from "../assets/main.png"
import { Link } from "react-router-dom"

const Home = () => {

  const { address } = useStateContext()
  return (
    <div className='flex items-center justify-center text-lg pb-40 w-screen '>
      {/* <p>
          You are connected to: {address != null ? <span>{address}</span> : <span>Not connected</span>}
        </p> */}

      <div className='text-white lg:px-48 flex flex-col-reverse lg:flex-row lg:space-x-10 items-center justify-center mx-auto mt-32'>
        <div> <p className='text-justify mx-5 text-[1.35rem] font-light' >
          One-Sync is a decentralized record-keeping application that aims to revolutionize the whole system.
          Unlike traditional record-keeping systems that are centralized and vulnerable to hacking,
          One-Sync utilizes blockchain technology to create a secure and immutable record of user data and other organisations could use the data which you allow them to use.</p>
          <button className='mx-5 mt-5 p-2 px-5 rounded-lg bg-blue-800 text-white font-semibold  hover:scale-105 transition duration-200 text-xl tracking-wider'><Link to='/records' className=' '>Records</Link></button>
        </div>
        <img src={image} alt="" className=' h-72 lg:h-[30rem]' />
      </div>
    </div>
  )
}

export default Home


// from-blue-900 via-gray-900 to-red-900