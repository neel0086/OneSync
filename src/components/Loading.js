import React from 'react'

const Loading = ({ value }) => {
    return (
        <div className='m-80 flex flex-col justify-center items-center'>

            <div className='flex flex-col justify-center items-center'>
                <div className='flex mb-0'>
                    <ul className='loader-list'>
                        <li className='dot-1'></li>
                        <li className='dot-2'></li>
                        <li className='dot-3'></li>
                        <li className='dot-4'></li>
                    </ul>
                </div>
                <h1 className=' text-xl sm:text-2xl text-gray-200 font-light translate-y-3 tracking-wider w-72 flex justify-center items-center'>{value}</h1>
            </div>

        </div>
    )
}

export default Loading