import React from 'react'
import { motion } from 'framer-motion'



function PageTransition({children}) {
  return (

<motion.div className='page-transition'
    initial={{opacity:0, y: 20}}
    animate={{opacity:1 , y:0}}
    exit={{opacity:0 ,y: -20}}
    transition={{duration:0.3}}
>
   

    {children}
</motion.div>
  )
}

export default PageTransition;