import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import record from '../assets/record.jpg'
import download from "../assets/download.png"
import { saveAs } from "file-saver";
import { useStateContext } from '../context';
import { ethers } from 'ethers';

const Details = () => {
    const location = useLocation();
    const { address, contractAddress, contractABI  } = useStateContext();
    const [ownersArray, setOwnersArray] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newAddress, setNewAddress] = useState();

    const data = location.state?.data;
    const img = data.imageURL
    const handleClick = () => {
        let url = { img }
        saveAs(url, "report");
    }

    const setNewOwner = async () => {
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress.address,
                    contractABI,
                    signer
                )
                setIsLoading(true);
                const newTx = await contract.newOwner(newAddress);
                newTx.wait()
                alert("You successfully give the access of the records to this adress: ", newAddress)
                setIsLoading(false);

            } else {
                console.log('eth object not found')

            }
        } catch (e) {
            console.log(e)

        }
    }

    const setRemoveOwner = async () => {
        try {
          if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
              contractAddress.address,
              contractABI,
              signer
            );
            setIsLoading(true);
            console.log(newAddress)
            const removeTx = await contract.removeOwner(newAddress);
            await removeTx.wait();
            console.log(removeTx)
            alert("Successfully removed owner with address: " + newAddress);
            setIsLoading(false);
          } else {
            console.log('eth object not found');
          }
        } catch (e) {
          console.log(e);
        }
      }
    return (
        <>
            <div className=' pb-20 lg:pb-40'>
                <div className='pt-36 w-screen  flex  justify-center items-center overflow-hidden '>
                    <div className='flex lg:space-x-24 w-11/12 flex-col lg:flex-row justify-center items-center lg:items-start px-3 lg:px-20 '>
                        <div className='min-w-max'>
                            <a href={data.imageURL} >
                                <img src={data.imageURL} alt="" className=' h-72 w-72 sm:h-96 sm:w-96 md:h-80 lg:h-[30rem] lg:w-[30rem] border-4 border-black' />
                            </a>
                        </div>

                        <div className='text-white mt-12 mb-20'>
                            <p className='tracking-wider font-bold text-4xl break-all pb-4'>{data.title}</p>
                            <p className='tracking-wider font-bold text-xl break-all'>Click on the image to download it!</p>

                            <hr />
                            <p className='text-justify text-lg mt-6 tracking-wider font-light'>Description: {data.description}</p>
                            <p className='text-justify mt-6 tracking-wider text-lg'>Recordtime: {data.timestamp}</p>
                        </div>
                    </div>

                </div>
                <div className='flex justify-center items-center mt-10 text-white'>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-2xl sm:text-3xl text-white underline underline-offset-8 pb-10 '>Give Access to someone</h1>
                <div className=' flex sm:space-x-4 flex-col space-y-8 sm:space-y-0 justify-center items-center sm:flex-row'>
                    <input onChange={e => setNewAddress(e.target.value)} type="text" className=' p-2 w-60 sm:w-96 rounded-lg bg-slate-600 outline-none text-white tracking-wider' placeholder='Enter the account address' />
                    <button onClick={setNewOwner} className='text-white bg-blue-600 sm:px-6 w-32 sm:w-40 py-[0.6rem] rounded-lg tracking-wider hover:scale-105 transition duration-200 font-semibold text-sm sm:text-[1rem] '>Give Access</button>
                    <button onClick={setRemoveOwner} className='text-white bg-blue-600 sm:px-6 w-32 sm:w-40 py-[0.6rem] rounded-lg tracking-wider hover:scale-105 transition duration-200 font-semibold text-sm sm:text-[1rem] '>Remove Access</button>
                </div>
                <hr />
            </div>

            <div className='flex justify-center items-center'>
                <div className='bg-gradient-to-tr from-neutral-800 via-gray-900 to-neutral-800 text-white  mt-20 lg:w-1/2 rounded-lg py-10 px-12 tracking-wide '>
                    <h1 className='text-xl sm:text-2xl underline underline-offset-4 mb-7 font-bold'>Owners</h1>
                    {ownersArray.map((owner, i) => {
                        return (
                            <ul key={i}>
                                <li className='list-disc font-light text-lg'>{owner}</li>
                            </ul>
                        )
                    })}
                </div>
            </div>





        </>
    )
}

export default Details