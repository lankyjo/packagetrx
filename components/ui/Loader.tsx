import Image from 'next/image'
import React from 'react'

const Loader = () => {
  return (
    <figure className='fixed z-1000000000 inset-0 w-full h-dvh bg-background grid place-items-center'>
        <Image height={80} width={80} alt='' className='animate-bounce' src={'/icon.png'}/>
    </figure>
  )
}

export default Loader