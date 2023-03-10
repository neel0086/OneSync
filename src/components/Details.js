import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Details = ({ contract }) => {
    const { id } = useParams();
    console.log(id);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [newAddress, setNewAddress] = useState();
    const [record, setRecord] = useState({});

    useEffect(() => {
        const fetchRecord = async () => {
            setIsLoading(true);
            console.log('function is called')
            try {
                const record = await contract.getOneRecord(parseInt(id.split(':')[1]));
                console.log('from use effect')
                console.log(record);
                setRecord(record);
            } catch (error) {
                if (error.data.message.includes("you don't have access to this file")) {
                    alert("you don't have access to this file");
                } else if (error.data.message.includes("given file id is not exists")) {
                    alert("given file id is not exists");
                }
                navigate('/records');
            }
            setIsLoading(false);
        }
        contract && fetchRecord();
    }, [contract, id]);

    const setNewOwner = async () => {
        setIsLoading(true);
        try {
            if (window.ethereum) {
                const newTx = await contract.newOwner(newAddress, parseInt(id.split(':')[1]));
                console.log(newTx);
                const temp = await newTx.wait();
                const accessList = await contract.getAccessList(parseInt(id.split(':')[1]));
                console.log(temp)
                setRecord(prevState => ({ ...prevState, accessibleBy: accessList }));
                alert("You successfully give the access of the records to this adress: ", newAddress)
                console.log(await contract.getOneRecord(record.id))
            } else {
                console.log('eth object not found')
            }
        } catch (error) {
            if (error.data.message.includes("given file id is not exists")) {
                alert("given file id is not exists");
            } else if (error.data.message.includes("you are not owner of this file")) {
                alert("you are not owner of this file");
            } else if (error.data.message.includes("as owner of this file you alread have a access")) {
                alert("as owner of this file you alread have a access");
            }
        }
        setIsLoading(false);
    }

    const setRemoveOwner = async () => {
        setIsLoading(true);
        console.log('here')
        try {
            if (window.ethereum) {

                console.log(newAddress)
                const removeTx = await contract.removeOwner(newAddress, parseInt(id.split(':')[1]));
                await removeTx.wait();
                const accessList = await contract.getAccessList(parseInt(id.split(':')[1]));
                setRecord(prevState => ({ ...prevState, accessibleBy: accessList }));
                console.log(removeTx)
                alert("Successfully removed owner with address: " + newAddress);
            } else {
                console.log('eth object not found');
            }
        } catch (error) {
            if (error.data.message.includes("given file id is not exists")) {
                alert("given file id is not exists");
            } else if (error.data.message.includes("you are not owner of this file")) {
                alert("you are not owner of this file");
            } else if (error.data.message.includes("as owner of the file and you can't remove your self from access to this file")) {
                alert("as owner of the file and you can't remove your self from access to this file");
            }
        }
        setIsLoading(false);
    }
    return (
        <>
            {isLoading && <>it is loading</>}
            {!isLoading &&
                <>
                    <div className=' pb-20 lg:pb-40'>
                        <div className='pt-36 w-screen  flex  justify-center items-center overflow-hidden '>
                            <div className='flex lg:space-x-24 w-11/12 flex-col lg:flex-row justify-center items-center lg:items-start px-3 lg:px-20 '>
                                <div className='min-w-max'>
                                    <a href={record.imageURL} >
                                        <img src={record.imageURL} alt="" className=' h-72 w-72 sm:h-96 sm:w-96 md:h-80 lg:h-[30rem] lg:w-[30rem] border-4 border-black' />
                                    </a>
                                </div>

                                <div className='text-white mt-12 mb-20'>
                                    <p className='tracking-wider font-bold text-4xl break-all pb-4'>{record.title}</p>
                                    <p className='tracking-wider font-bold text-xl break-all'>Click on the image to download it!</p>

                                    <hr />
                                    <p className='text-justify text-lg mt-6 tracking-wider font-light'>Description: {record.description}</p>
                                    {/* <p className='text-justify mt-6 tracking-wider text-lg'>Recordtime: {data.timestamp}</p> */}
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
                            <h1 className='text-xl sm:text-2xl underline underline-offset-4 mb-7 font-bold'>accessible </h1>
                            {record?.accessibleBy?.map((owner, i) => {
                                return (
                                    <ul key={i}>
                                        <li className='list-disc font-light text-lg'>{owner}</li>
                                    </ul>
                                )
                            })}
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default Details