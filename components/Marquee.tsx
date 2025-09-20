import Image from 'next/image';
import React from 'react'
import Marquee from "react-fast-marquee";

const Marque =() => {
  return (
    <div className=' overflow-hidden mask-fade'>
        <h2 className={`text-center relative z-30 mb-4 text-base uppercase font-bold`}>
            Our trustees
        </h2>
        <div className='mask-x-from-80% max-w-3xl mx-auto'>
        <Marquee autoFill={true} speed={10} direction='right' pauseOnHover>
            {
                [...Array(10)].map((_,i)=>(
                    <div className='ml-5' key={i}>
                        <Image src={`/${i+1}.svg`} width={50} height={50} className='w-[50px]' alt="" />
                    </div>
                ))
            }
        </Marquee>
        </div>
    </div>
  )
}

export default Marque