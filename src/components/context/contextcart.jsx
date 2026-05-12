import React , { createContext,useEffect,useState} from 'react'

export const ContxetCart = createContext()


export default function Cartprovider({children}) {

//like ----------------------------------------
const [liketitems ,setliketitems] = useState(()=>{
    const savelike = localStorage.getItem("liketitems")
    return savelike ? JSON.parse(savelike):[]
})


const AddToLike = (product) => {
    setliketitems((prev) => {
        if(prev.some((i)=> i.id === product.id)) return prev
        return[...prev, product]
   } )
}
useEffect(()=>{
    localStorage.setItem("liketitems" , JSON.stringify(liketitems))
},[liketitems])


const removelike = (id) => {
    setliketitems((prev) => prev.filter((i) => i.id !== id));
  };










// cart -------------------------------------------


    const [cartitems ,setcartitems] = useState(()=>{
        const savecard = localStorage.getItem("cartitems")
        return savecard ? JSON.parse(savecard):[]
    })

    //+ item

    const increassQuntity = (id) =>{
        setcartitems(prevItme => prevItme.map(item =>
            item.id === id ? {...item ,quantity : item.quantity + 1} : item
        )) 
    }


//-
    const dncreassQuntity = (id) =>{
        setcartitems(prevItme => prevItme.map(item =>
            item.id === id  && item.quantity > 1 ? {...item ,quantity : item.quantity - 1} : item
        )) 
    }

//delet

const delet = (id) =>{
    setcartitems(priveitem => priveitem.filter(itme => itme.id !== id))
}





    const AddToCart = (item)=>{
        setcartitems ((priveitem)=>[...priveitem ,{...item , quantity : 1}])
    }

    useEffect (()=>{
        localStorage.setItem("cartitems",JSON.stringify(cartitems))
    }, [cartitems])


    /*اللون - و المقاس */
    const onSizeChange = (id, newSize) => {
        setcartitems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, size: newSize } : item
          )
        );
      };
      
      const onColorChange = (id, newColor) => {
        setcartitems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, color: newColor } : item
          )
        );
      };
      
    /*اللون - و المقاس */

  return (
    <ContxetCart.Provider value={{cartitems , AddToCart ,increassQuntity ,dncreassQuntity ,delet ,liketitems ,AddToLike,removelike,onSizeChange,onColorChange}}>
        {children}
    </ContxetCart.Provider>
  
  )
}
