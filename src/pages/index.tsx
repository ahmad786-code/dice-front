
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css'
import { useEffect, useState } from 'react'
import 'swiper/css'
import { ethers } from 'ethers'
import { PuffLoader } from 'react-spinners';

import USDTABI from '../context/USDT.json'

import { metadata, mainnet, projectId, changeNetwork, usdtContractAddress, gameContractAddress } from "../context/web3";
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider
} from '@web3modal/ethers5/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import Navbar from '@/components/Navbar'


createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId
})

//const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  const { open } = useWeb3Modal()

  const { address = '', chainId, isConnected } = useWeb3ModalAccount()

  const { walletProvider } = useWeb3ModalProvider()
  const [usdt_contract, setUSDTContract] = useState<any>({})

  const [joinLoading, setJoinLoading] = useState(false)
  const [approveLoading, setApproveLoading] = useState(false)
  const [tgUserNameState, setTgUserName] = useState('')
  const [txhashState, setTxhash] = useState('txhash')
  const openWeb3Modal = async () => {
    await changeNetwork()
    await open()
  };


  useEffect(() => {
    if (isConnected && walletProvider) {
      const provider = new ethers.providers.Web3Provider(walletProvider)
      const signer = provider.getSigner()
      const usdtContract = new ethers.Contract(usdtContractAddress,
        USDTABI,
        signer
      )
      setUSDTContract(usdtContract)
    }
  }, [isConnected, walletProvider, address])

  const handleApproveClick = async () => {
    if (!address.length || !usdt_contract.address.length || !isConnected) {
      toast.warning(`Please connect your wallet`)
      return
    }

    setApproveLoading(true)
    try {
      const _decimals = await usdt_contract.decimals()
      const cal_decimals = Number(_decimals)
      const _allowance = await usdt_contract.allowance(address, gameContractAddress)
      const cal_allowance = Number(ethers.utils.formatUnits(_allowance, cal_decimals))
      const _tokenBalance = await usdt_contract.balanceOf(address)
      const cal_tokenBalance = Number(ethers.utils.formatUnits(_tokenBalance, cal_decimals))
      if (cal_allowance < cal_tokenBalance) {
        toast.info(`You will approve ${(cal_tokenBalance) - cal_allowance}`)
        const txhash = await usdt_contract.approve(gameContractAddress, cal_tokenBalance - cal_allowance)
        console.log(txhash)
        setTxhash(txhash)
        const resolveApprove = new Promise((r) => setTimeout(r, 20000));

        await toast.promise(
          resolveApprove,
          {
            pending: 'Approving Tokens',
            error: 'Approve rejected 🤯',
            success: 'Approved!',
          }
        )
      } else {
        toast.info(`You already have max allowance - ${cal_allowance}`)
      }

    } catch (error) {
      console.log(error)
      toast.error(`ERR : Approving`)
    }
    setApproveLoading(false)

  }
  const handleRegisterClick = async () => {
    if (!address.length) {
      toast.warning(`Please connect your wallet`)
      return
    }
    if (!tgUserNameState.length) {
      toast.warning(`Please input your Telegram username`)
      return
    }
    setJoinLoading(true)
    try {
      await axios.post("http://127.0.0.1:3333/api/register", { address, txhash: txhashState, username: tgUserNameState }).then(res => toast.info(res.data.message)).catch((err) => toast.error(err.message))
      // toast.success(`Successfully registered!`)
    } catch (error) {
      console.log(error)

    }
    setJoinLoading(false)

  }
  const reducedAddress = (_address = '') => {
    return _address.slice(0, 5) + '...' + _address?.slice(_address.length - 5)
  }

  return (
    <main className='main-background '>
      <Navbar/>
      <div className="main-bg">
        

        {approveLoading || joinLoading ? <div className='fixed w-full h-[100vh] top-0 flex items-center justify-center bg-[#000000] text-[#F3F3F3] opacity-70 z-50' ><PuffLoader color="#fafafa" className='mr-5' />Please wait...</div> : <></>}

        <div className='absolute w-full top-[50%] transform translate-y-[-50%] '>
          <div className=' flex  justify-center items-center  text-white	'>
            <p> Your telegram ID</p>
          </div>
          <div className=' flex  justify-center items-center 	'>
            <input type="string" placeholder='Your telegram username' value={tgUserNameState} onChange={(e) => setTgUserName(e.target.value)} />
          </div>
          <div className=' flex  justify-center items-center 	'>
            <button
              onClick={() => openWeb3Modal()}
              className='bg-black text-white lg:block hidden text-sm p-3 lg:px-4 px-4  font-bold m-5'
            >
              {isConnected ? reducedAddress(address) : 'Connect Wallet'}
            </button>
            <button
              onClick={() => handleApproveClick()}
              className='bg-black text-white lg:block hidden text-sm p-3 lg:px-4 px-4  font-bold m-5'
            >
              Approve
            </button>
            <button
              onClick={() => handleRegisterClick()}
              className='bg-black text-white lg:block hidden text-sm p-3 lg:px-4 px-4  font-bold m-5'
            >
              Register game
            </button>


          </div>
          <div className=' flex  justify-center items-center  text-white	'>
            <p> Copy this txhash to telegram DM chat after approving</p>
          </div>
          <div className=' flex  justify-center items-center 	'>
            <input type="string" value={txhashState} />
          </div>
        </div>
        <ToastContainer />
      </div>

    </main>
  )
}
