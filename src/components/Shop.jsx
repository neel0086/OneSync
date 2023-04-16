import React, { useEffect, useState } from 'react'
import Loading from './Loading';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

function Shop({ contract }) {

    const [recordsArray, setRecordsArray] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const getAllRecords = async () => {
            setIsLoading(true);
            try {
                if (contract) {
                    const records = await contract.getSellingRecord();
                    let recordsClean = [];
                    records.forEach((record) => {
                        recordsClean.push({
                            id: record.id,
                            title: record.title,
                            description: record.description,
                            timestamp: new Date(record.timestamp * 1000).toString(),
                            imageURL: record.imageURL,
                            price: "" + parseInt(record.price),
                            owner: record.owner
                        })
                    })
                    let recordsNew = []
                    for (let i = 0; i < recordsClean.length; i++) {
                        if (recordsClean[i].title !== "") {
                            recordsNew.push(recordsClean[i])
                        }
                    }
                    setRecordsArray(recordsNew);
                }
            } catch (error) {
                if (error.data.message.includes("no records")) {
                    alert("no records");
                    setRecordsArray([]);
                }
            }
            setIsLoading(false);
        }
        contract && getAllRecords();

    }, [contract])

    const buyFile = async (id, ind) => {
        const amount = { value: ethers.utils.parseEther(recordsArray[ind].price) }
        const temp = await contract.buyFileId(id, amount);
        await temp.wait();
        setRecordsArray(prevState => prevState.filter(record => record.id != id));
    }

    const [searchAddress, setSearchAddress] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        const tempArray = recordsArray.filter(record => record.owner == searchAddress);
        setRecordsArray(tempArray);
    }

    return (
        <div className='h-screen w-screen  overflow-x-hidden  pb-40'>
            {!isLoading ? (
                <div>
                    <div className="flex flex-col justify-center items-center">
                        {!isLoading ? (
                            <div>
                                <div className='flex  mt-2 tracking-wider pt-28 xl:px-20 pb-5'>
                                    <label for="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
                                    <button id="dropdown-button" data-dropdown-toggle="dropdown" className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">All categories <svg aria-hidden="true" className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button>
                                    <div id="dropdown" className="z-1000 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                        {/* <ul onChange={(e) => setSubscription(e.target.value)} className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                                        <li>
                                            <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" value="free">free</button>
                                        </li>
                                        <li>
                                            <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" value="paid">Paid</button>
                                        </li>

                                    </ul> */}
                                    </div>

                                    <div className="relative w-6/12">
                                        <input type="search" onChange={(e) => setSearchAddress(e.target.value)} id="search-dropdown" className="block p-2.5 w-full z-20 outline:0 focus:outline-none text-base text-white bg-black rounded-r-lg  " placeholder="Search Mockups, Logos, Design Templates..." spellCheck="false" autocomplete="off" required />
                                        <button type="submit" onClick={handleSearch} className="absolute top-1 right-0 p-2.5 text-sm font-medium text-white bg-inherit rounded-r-lg  ">
                                            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                            <span className="sr-only">Search</span>
                                        </button>
                                    </div>

                                    {/* <div className='flex justify-center mt-2'>
                                    <h1 className='text-white text-lg md:text-xl lg:text-3xl tracking-wider uppercase pt-28 lg:px-32 pb-5 underline underline-offset-8 font-bold '>YOUR RECORDS</h1>
                                    <h1 className='text-white text-lg md:text-xl lg:text-3xl tracking-wider uppercase pt-28 lg:px-32 pb-5 underline underline-offset-8 font-bold '>
                                        <input type="text" placeholder="give owner address" onChange={(e) => setSearchAddress(e.target.value)} />
                                        <button onClick={handleSearch}>search</button>
                                    </h1>
                                </div> */}
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
                                                        <Link to={`/records/details/:${record.id}`} state={{ data: record }}>
                                                            <img src={record.imageURL} alt="" className=' hover:scale-110 hover:z-0 transition duration-500 ease-in-out h-56' />
                                                        </Link>
                                                    </div>
                                                    <h1 className='tracking-wider font-bold text-2xl '>{record.title}</h1>
                                                    <h1 className='font-roboto text-ellipsis--2'>{record.description}</h1>
                                                    <button onClick={(e) => { e.preventDefault(); buyFile(record.id, i) }} className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
                                                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-zinc-900 rounded-full group-hover:w-56 group-hover:h-56"></span>
                                                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                                                        <span className="relative">BUY</span>
                                                    </button>
                                                    <button onClick={(e) => { e.preventDefault(); contract.redeemCoupon(record.id, "abcdef") }} className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
                                                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-zinc-900 rounded-full group-hover:w-56 group-hover:h-56"></span>
                                                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                                                        <span className="relative">CODE</span>
                                                    </button>
                                                    {/* <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l" onClick={(e) => { e.preventDefault(); buyFile(record.id, i) }}>buy</button> */}
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

export default Shop