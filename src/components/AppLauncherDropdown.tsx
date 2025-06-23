import React from 'react'
import { Link } from 'react-router-dom'

import { IoChatbubblesOutline } from 'react-icons/io5'
import { IoImageOutline } from 'react-icons/io5'
import { IoCalendarOutline } from 'react-icons/io5'
import { BsListCheck } from 'react-icons/bs'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { MdOutlineCalculate } from "react-icons/md";
import { BsAward } from 'react-icons/bs'

interface AppLauncherDropdownProps{
  isAppLauncherToggled:boolean;
}

const AppLauncherDropdown:React.FC<AppLauncherDropdownProps> = ({isAppLauncherToggled}) => {
    const linkStyle="flex flex-col items-center justify-center gap-1.5 hover:text-gray  "
  return (
    <div className={`absolute  font-nunito grid grid-cols-3 text-[13px] top-13 text-gray-700 justify-center  border-gray-200 border shadow z-10 gap-6 py-5 px-4.5 bg-white rounded-md right-2      w-83.5 ${isAppLauncherToggled?"block":"hidden"} `}>
        <Link to="/" className={linkStyle}>
            <IoChatbubblesOutline className='text-gray-500' size={36} />
            <p className='text-gray-500'>Réclamation</p>
        </Link>
        <Link to="/" className={linkStyle}>
            <IoImageOutline className='text-gray-500 ' size={36} />
            <p className='text-gray-500'>Médias</p>
        </Link>
          <Link to="/" className={linkStyle}>
            <IoCalendarOutline className='text-gray-500 ' size={36} />
            <p className='text-gray-500'>Réservations</p>
        </Link>
         <Link to="/" className={linkStyle}>
            <BsListCheck className='text-gray-500 ' size={36} />
            <p className='text-gray-500'>Taches</p>
        </Link>
        <Link to="/" className={linkStyle}>
            <IoDocumentTextOutline className='text-gray-500 ' size={36} />
            <p className='text-gray-500'>Ordres de mission</p>
        </Link>
         <Link to="/" className={linkStyle}>
            <MdOutlineCalculate className='text-gray-500 ' size={36} />
            <p className='text-gray-500'>Notes de frais </p>
        </Link>
          <Link to="/" className={linkStyle}>
            <BsAward  className='text-gray-500 ' size={36} />
            <p className='text-gray-500'>Evaluations </p>
        </Link>
        
          
    </div>
  )
}

export default AppLauncherDropdown