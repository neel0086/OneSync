import React, { useState, useEffect } from 'react'
import { useStateContext } from '../context';
import { useStorageUpload } from "@thirdweb-dev/react";
import { useContract, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';

const Publish = ({ contract }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filePath, setFilePath] = useState("");
  const { address, contractAddress, contractABI } = useStateContext();
  const { mutateAsync: upload } = useStorageUpload();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const uploadToIpfs = async (e) => {
    const uploadUrl = await upload({
      data: [filePath],
      options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
    });
    return uploadUrl[0]
  };

  const uploadData = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      if (window.ethereum) {

        const imageURI = await uploadToIpfs();

        const msgTx = await contract.NewRrecord(
          `${title}`,
          `${description}`,
          `${imageURI}`
        )

        await msgTx.wait();
        alert("The data is succesfully uploaded!!");
        setIsLoading(false);
        navigate('/records');

      } else {
        console.log('eth object not found')

      }
    } catch (e) {
      console.log(e);
    }



  }




  return (
    <div className='pt-8  pb-20 w-screen flex justify-center items-center '>
      {!isLoading ? (
        <div className='p-10 bg-[#24133d] bg-gradient-to-tr from-neutral-800 via-gray-800 to-neutral-900 w-11/12  lg:w-4/6 xl:w-1/3 tracking-wide rounded-3xl mt-20 '>

          <h1 className='text-2xl text-white tracking-wider font-bold'>Post a new Record</h1>
          <div className=' h-[0.125rem] bg-slate-600 my-2'></div>
          <form action="" className='flex flex-col justify-center' onSubmit={uploadData}>
            <div className='mb-4'>
              <label className='text-white ml-3'>Title</label>
              <input
                onChange={e => setTitle(e.target.value)}
                type="text" name='title' placeholder='Enter Title of a record' className='w-full p-2 rounded-lg mt-2 outline-none text-lg' required />
            </div>

            <div className='mb-4'>
              <label className='text-white ml-3'>Description</label>
              <textarea
                onChange={e => setDescription(e.target.value)}
                type="text" required name='desc' rows="4" placeholder='Enter description of record' className='w-full p-2 rounded-lg mt-2 outline-none text-lg' />
            </div>

            <div>
              <h1 className='text-white mb-3'>Choose a File</h1>
              {/* <input type='file'
                className='font-semibold tracking-wide cursor-pointer text-white'
                placeholder='Select'
                onChange={e => setFilePath(e.target.files[0])}
                required
              /> */}
            </div>
            <div class="flex items-center justify-center w-full">
              <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type='file'
                  className='hidden'
                  placeholder='Select'
                  onChange={e => setFilePath(e.target.files[0])}
                  required />
              </label>
            </div>


            <div className='h-[0.02rem] bg-gray-300 w-full mt-5'></div>

            <div className='mt-5 flex justify-center'>
              <button
                type='submit'
                className="bg-blue-600 text-white p-2 w-40 rounded-full tracking-wide font-bold text-lg hover:scale-105 transition duration-200"
              >
                Post
              </button>
            </div>

          </form>
        </div>

      ) : (
        <Loading value='Wait for the transaction' />
      )}
    </div>
  )
}

export default Publish