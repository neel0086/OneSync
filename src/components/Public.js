import React, { useEffect, useState } from 'react'
import { useStateContext } from '../context'
import Loading from './Loading'
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';


function Public() {
    const [isLoading, setIsLoading] = useState()
    const [recordsArray, setRecordsArray] = useState([]);
    const { address, contractAddress, contractABI  } = useStateContext();
    useEffect(() => {
        setIsLoading(true);
        getAllRecords();
        setIsLoading(false);
    }, [])

    const getAllRecords = async () => {
        try {
            if (window.ethereum) {
                setIsLoading(true);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress.address,
                    contractABI,
                    signer
                )
                const records = await contract.getAllRecords();
                // console.log(records)
                let recordsClean = [];
                records.forEach((record) => {
                    recordsClean.push({
                        id: record.id,
                        title: record.title,
                        description: record.description,
                        timestamp: new Date(record.timestamp * 1000).toString(),
                        owners:record.owners,
                        imageURL: record.imageURI
                    })
                })

                let recordsNew = []
                for (let i = 0; i < recordsClean.length; i++) {
                    if (recordsClean[i].title !== "") {
                        recordsNew.push(recordsClean[i])
                    }
                }
                setRecordsArray(recordsNew);
                setIsLoading(false)
            } else {
                console.log("ethreuem object not found")
            }



        } catch (e) {
            console.log(e);
        }

    }

    return (
        <div className='h-screen w-screen  overflow-x-hidden  pb-40'>
            {!isLoading ? (
                <div>
                    <div className="flex flex-col justify-center items-center">
                        {!isLoading ? (
                            <div>
                                <div className='flex justify-center mt-2'>
                                    <h1 className='text-white text-lg md:text-xl lg:text-3xl tracking-wider uppercase pt-28 lg:px-32 pb-5 underline underline-offset-8 font-bold '>YOUR RECORDS</h1>
                                </div>
                                <div className='grid xl:grid-cols-4 xl:gap-x-28 xl:px-20 xl:gap-y-14 xl:pb-32 gap-y-6 lg:grid-cols-3 md:grid-cols-3 md:gap-x-4 pb-20 pt-10 justify-center'>
                                    {recordsArray.length < 1 ? (
                                        <div>
                                            <span className='text-white text-lg md:text-xl lg:text-2xl tracking-wider set-8 font-bold'>No records to show</span>
                                        </div>
                                    ) : (
                                        recordsArray.map((record, i) => {
                                            return (
                                                <div className='lg:h-42 w-64 bg-black rounded-xl text-white p-6 flex flex-col space-y-3 tracking-wide text-lg h-42' key={i}>
                                                    <div className='overflow-hidden rounded-xl cursor-pointer  '>
                                                        <Link to='/records/details' state={{ data: record }}>
                                                            <img src={record.imageURL} alt="" className=' hover:scale-110 hover:z-0 transition duration-500 ease-in-out h-52' />
                                                        </Link>
                                                    </div>
                                                    <h1 className='tracking-wider font-bold text-2xl '>{record.title}</h1>
                                                    <h1 className='font-roboto text-ellipsis--2'>{record.description}</h1>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>

                            </div>

                        ) : (
                            <Loading value='Getting the Records' />
                        )}
                    </div>
                    

                    
                </div>
            ) : (
                <Loading value='connecting...' />
            )}
        </div>
    )
}

export default Public
