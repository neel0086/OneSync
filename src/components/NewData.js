import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import Loading from './Loading';
import NothingToShow from '../assets/nothing.png'
import { ethers } from 'ethers';

const NewRecords = ({ contract }) => {
    const [recordsArray, setRecordsArray] = useState([]);
    const [ownerRecords, SetOwnerRecords] = useState([]);
    const recordArrayHelper = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paidOrFree, setPaidOrFree] = useState(false)

    useEffect(() => {

        const getAllRecords = async () => {
            setIsLoading(true);
            try {
                if (contract) {
                    const records = await contract.getAllRecords();
                    console.log(records)
                    let recordsClean = [];
                    records.forEach((record) => {
                        recordsClean.push({
                            id: record.id,
                            title: record.title,
                            description: record.description,
                            timestamp: new Date(record.timestamp * 1000).toString(),
                            imageURL: record.imageURL,
                            price: parseInt(record.price),
                            owner: record.owner
                        })
                    })
                    let recordsNew = []
                    for (let i = 0; i < recordsClean.length; i++) {
                        if (recordsClean[i].title !== "") {
                            recordsNew.push(recordsClean[i])
                        }
                    }
                    console.log(recordsNew)
                    setRecordsArray(recordsNew);
                    recordArrayHelper.current = recordsNew;
                } else {
                    console.log("ethreuem object not found")
                }
            } catch (error) {
                // if (error.data.message.includes("no records")) {
                //     alert("no records");
                //     setRecordsArray([]);
                // }
            }
            setIsLoading(false);
        }
        const getOwnerRecords = async () => {
            const records = await contract.getOwnersRecords();
            SetOwnerRecords(records)
        };
        const getOneRecords = async () => {
            const records = await contract.getOneRecords();
            // SetOwnerRecords(records  )
        };
        contract && getAllRecords();
        contract && getOwnerRecords();
        // contract && getOneRecords();

    }, [contract])

    const [searchAddress, setSearchAddress] = useState('');
    const [subscription, setSubscription] = useState('free')

    const handleSearch = (event) => {
        event.preventDefault();
        console.log(searchAddress);
        var tempArray = recordArrayHelper.current;
        if ('' !== searchAddress)
            if ('free' === subscription)
                tempArray = recordArrayHelper.current.filter(record => ((record.owner == searchAddress) && (record.price == 0)));
            else
                tempArray = recordArrayHelper.current.filter(record => ((record.owner == searchAddress) && (record.price != 0)));
        else
            if ('free' === subscription)
                tempArray = recordArrayHelper.current.filter(record => ((record.price == 0)));
            else
                tempArray = recordArrayHelper.current.filter(record => ((record.price != 0)));
        console.log(tempArray)
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
                                    {/* <h1 className='text-white text-lg md:text-xl lg:text-3xl tracking-wider uppercase pt-28 lg:px-32 pb-5 underline underline-offset-8 font-bold '>YOUR RECORDS</h1>
                                    <div className='  tracking-wider pt-28 lg:px-32 pb-5 '>
                                        
                                        <input type="text" placeholder="give owner address" onChange={(e) => setSearchAddress(e.target.value)} />
                                    </div>
                                    <div className=' tracking-wider uppercase pt-28 lg:px-32 pb-5'>
                                        <select name="subscription" onChange={(e) => setSubscription(e.target.value)}>
                                            <option value="free">Free</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>
                                    <div className='tracking-wider  pt-28 lg:px-32 pb-5 '>
                                        <button onClick={handleSearch}>search</button>
                                    </div> */}
                                    <div className='flex flex-col'>
                                        <label for="search-dropdown" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
                                        <button id="dropdown-button" onClick={(e) => setPaidOrFree(!paidOrFree)} class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100  rounded-tl-lg focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">
                                            All categories
                                            <svg aria-hidden="true" class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd">
                                            </path>
                                            </svg>

                                        </button>

                                        <div id="dropdown" style={{ display: `${paidOrFree ? "block" : 'none'}` }} >
                                            <ul onClick={(e) => { setSubscription(e.target.value); setPaidOrFree(false) }} class="py-2 absolute text-sm text-gray-700 bg-white dark:text-gray-200 bg-white divide-y divide-gray-100 rounded-b-lg shadow w-44 dark:bg-gray-700" aria-labelledby="dropdown-button">
                                                <li>
                                                    <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" value="free">free</button>
                                                </li>
                                                <li>
                                                    <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" value="paid">Paid</button>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                    <div class="relative w-6/12">
                                        <input type="search" onChange={(e) => setSearchAddress(e.target.value)} id="search-dropdown" class="block p-2.5 w-full z-20 outline:0 focus:outline-none text-base text-white bg-black rounded-r-lg  " placeholder="Search Mockups, Logos, Design Templates..." spellCheck="false" autocomplete="off" required />
                                        <button type="submit" onClick={handleSearch} class="absolute top-1 right-0 p-2.5 text-sm font-medium text-white bg-inherit rounded-r-lg  ">
                                            <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                            <span class="sr-only">Search</span>
                                        </button>
                                    </div>

                                </div>
                                <div className="xl:px-20 mt-2">
                                    <h1 className='border-b-2 border-b-zinc-900 border-opacity-10 invert-0.5'>PURCHASED</h1>
                                </div>
                                <div className='grid xl:grid-cols-4 xl:gap-x-28 xl:px-20 xl:gap-y-14 xl:pb-32 gap-y-6 lg:grid-cols-3 md:grid-cols-3 md:gap-x-4 pb-20 pt-10 justify-center'>
                                    {recordsArray.length < 1 ? (
                                        <div>
                                            {/* <img src={NothingToShow} className="w-16"></img> */}
                                            <span className='text-white text-lg md:text-xl lg:text-2xl tracking-wider set-8 font-bold'>No records to show</span>
                                        </div>
                                    ) : (
                                        recordsArray.map((record, i) => {
                                            return (
                                                <div className='lg:h-42 w-64 bg-black rounded-xl text-white p-3 flex flex-col space-y-3 tracking-wide text-lg h-42' key={i}>
                                                    <div className='overflow-hidden rounded-xl cursor-pointer  '>
                                                        <Link to={`/records/details/:${record.id}`} state={{ data: record }}>
                                                            <img src={record.imageURL} alt="" className=' hover:scale-110 hover:z-0 transition duration-500 ease-in-out h-56' />
                                                        </Link>
                                                    </div>
                                                    <h1 className='tracking-wider font-roboto text-lg m-2'><span className="invert-0.7 text-base pr-2">Title: </span>{record.title}</h1>
                                                    <h1 className='font-roboto text-ellipsis--2 m-2'><span className="invert-0.7 text-base pr-2">Desc: </span>{record.description}</h1>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                                <div className="xl:px-20 mt-2">
                                    <h1 className='border-b-2 border-b-zinc-900 border-opacity-10 invert-0.5'>PEROSNAL</h1>
                                </div>
                                <div className='grid xl:grid-cols-4 xl:gap-x-28 xl:px-20 xl:gap-y-14 xl:pb-32 gap-y-6 lg:grid-cols-3 md:grid-cols-3 md:gap-x-4 pb-20 pt-10 justify-center'>
                                    {ownerRecords.length < 1 ? (
                                        <div>
                                            <span className='text-white text-lg md:text-xl lg:text-2xl tracking-wider set-8 font-bold'>Upload to see</span>
                                        </div>
                                    ) : (
                                        ownerRecords.map((record, i) => {
                                            return (
                                                <div className='lg:h-42 w-64 bg-black rounded-xl text-white p-3 flex flex-col space-y-3 tracking-wide text-lg h-42' key={i}>
                                                    <div className='overflow-hidden rounded-xl cursor-pointer  '>
                                                        <Link to={`/records/details/:${record.id}`} state={{ data: record }}>
                                                            <img src={record.imageURL} alt="" className=' hover:scale-110 hover:z-0 transition duration-500 ease-in-out h-56' />
                                                        </Link>
                                                    </div>
                                                    <h1 className='tracking-wider font-roboto text-lg m-2'><span className="invert-0.7 text-base pr-2">Title: </span>{record.title}</h1>
                                                    <h1 className='font-roboto text-ellipsis--2 m-2'><span className="invert-0.7 text-base pr-2">Desc: </span>{record.description}</h1>
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

export default NewRecords;