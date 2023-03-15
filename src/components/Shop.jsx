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
                    console.log(records);
                    records.forEach((record) => {
                        recordsClean.push({
                            id: record.id,
                            title: record.title,
                            description: record.description,
                            timestamp: new Date(record.timestamp * 1000).toString(),
                            imageURL: record.imageURL,
                            price: ""+parseInt(record.price),
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
                } else {
                    console.log("ethreuem object not found")
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

    const buyFile = async (id,ind) => {
        const amount = { value: ethers.utils.parseEther(recordsArray[ind].price) }
        const temp = await contract.buyFileId(id,amount);
        await temp.wait();
        setRecordsArray(prevState => prevState.filter(record => record.id != id));
    }

    const [searchAddress, setSearchAddress] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        console.log(searchAddress);
        const tempArray = recordsArray.filter(record => record.owner == searchAddress);
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
                                <div className='flex justify-center mt-2'>
                                    <h1 className='text-white text-lg md:text-xl lg:text-3xl tracking-wider uppercase pt-28 lg:px-32 pb-5 underline underline-offset-8 font-bold '>YOUR RECORDS</h1>
                                    <h1 className='text-white text-lg md:text-xl lg:text-3xl tracking-wider uppercase pt-28 lg:px-32 pb-5 underline underline-offset-8 font-bold '>
                                        <input type="text" placeholder="give owner address" onChange={(e) => setSearchAddress(e.target.value)} />
                                        <button onClick={handleSearch}>search</button>
                                    </h1>
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
                                                            <img src={record.imageURL} alt="" className=' hover:scale-110 hover:z-0 transition duration-500 ease-in-out h-52' />
                                                        </Link>
                                                    </div>
                                                    <h1 className='tracking-wider font-bold text-2xl '>{record.title}</h1>
                                                    <h1 className='font-roboto text-ellipsis--2'>{record.description}</h1>
                                                    <button onClick={(e) => { e.preventDefault(); buyFile(record.id,i) }}>buy</button>
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