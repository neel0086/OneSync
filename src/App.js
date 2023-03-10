import React, { useEffect, useState } from 'react'
import { StateContextProvider } from './context'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home';
import NewData from '././components/NewData';
import Publish from './components/Publish';
import Navbar from './components/Navbar';
import Details from './components/Details'
import Footer from './components/Footer';
import Loading from './components/Loading';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import contractAddress from './contractsData/meddata-address.json'
import abi from './contractsData/meddata.json';

const reload = () => {
  window.location.reload();
}

const App = () => {

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {

        window.ethereum.on("chainChanged", reload);
        // is it sufficient ?? OR WE NEED TO DO window.location.reload();
        // see description from chatgpt


        window.ethereum.on("accountsChanged", reload);
        // is it sufficient ?? OR WE NEED TO DO window.location.reload();


        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log(address);
        console.log(contractAddress)
        const contract = new ethers.Contract(contractAddress.address, abi.abi, signer);
        setContract(contract);
        setProvider(provider);
        console.log(contract)
      } else {
        console.log("please provide support of metamask");
      }
    }
    console.log(provider)
    provider && loadProvider(); // i have doubt over here IT SHOULD NOT BE LIKE THIS => loadProvider();
    //  what if metamask is not installed in browser
    return () => {
      window.ethereum.removeListener("chainChanged", reload);
      window.ethereum.removeListener("accountsChanged", reload);
    }
  }, []);

  return (
    <div className='overflow-hidden bg-gradient-to-tr from-neutral-700 via-gray-800 to-neutral-900'>
      <StateContextProvider>
        <Navbar />
        <ThirdwebProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/records' element={<NewData contract={contract} />} />
            <Route path='/Publish' element={<Publish contract={contract} />} />
            <Route path='/records/details/:id' element={<Details contract={contract} />} />
            <Route path='/loading' element={<Loading />} />
          </Routes>
        </ThirdwebProvider>
        <Footer />
      </StateContextProvider>
    </div>


  )
}

export default App