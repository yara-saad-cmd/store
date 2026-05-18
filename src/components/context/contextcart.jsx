import React , { createContext,useEffect,useState} from 'react'

export const ContextCart = createContext()


export default function Cartprovider({children}) {

//like ----------------------------------------
const [likeItems ,setlikeItems] = useState(()=>{
    const savelike = localStorage.getItem("likeItems")
    return savelike ? JSON.parse(savelike):[]
})


const AddToLike = (product) => {
    setlikeItems((prev) => {
        if(prev.some((i)=> i.id === product.id)) return prev
        return[...prev, product]
   } )
}
useEffect(()=>{
    localStorage.setItem("likeItems" , JSON.stringify(likeItems))
},[likeItems])


const removelike = (id) => {
    setlikeItems((prev) => prev.filter((i) => i.id !== id));
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
    <ContextCart.Provider value={{cartitems , AddToCart ,increassQuntity ,dncreassQuntity ,delet ,likeItems ,AddToLike,removelike,onSizeChange,onColorChange}}>
        {children}
    </ContextCart.Provider>
  
  )
}
