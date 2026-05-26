import React , { createContext,useEffect,useState} from 'react'

export const ContextCart = createContext()


export default function CartProvider({children}) {

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


    const [cartItems ,setcartItems] = useState(()=>{
        const savecard = localStorage.getItem("cartItems")
        return savecard ? JSON.parse(savecard):[]
    })

    //+ item

    const increaseQuantity = (id) =>{
        setcartItems(prevItems => prevItems.map(item =>
            item.id === id ? {...item ,quantity : item.quantity + 1} : item
        )) 
    }


//-
    const decreaseQuantity = (id) =>{
        setcartItems(prevItems => prevItems.map(item =>
            item.id === id  && item.quantity > 1 ? {...item ,quantity : item.quantity - 1} : item
        )) 
    }

//delet

const delet = (id) =>{
    setcartItems(prevItems => prevItems.filter(item => item.id !== id))
}





    const AddToCart = (item)=>{
        setcartItems ((prevItems)=>[...prevItems ,{...item , quantity : 1}])
    }

    useEffect (()=>{
        localStorage.setItem("cartItems",JSON.stringify(cartItems))
    }, [cartItems])


    /*اللون - و المقاس */
    const onSizeChange = (id, newSize) => {
        setcartItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, size: newSize } : item
          )
        );
      };
      
      const onColorChange = (id, newColor) => {
        setcartItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, color: newColor } : item
          )
        );
      };
      
    /*اللون - و المقاس */

  return (
    <ContextCart.Provider value={{cartItems , AddToCart ,increaseQuantity ,decreaseQuantity ,delet ,likeItems ,AddToLike,removelike,onSizeChange,onColorChange}}>
        {children}
    </ContextCart.Provider>
  
  )
}
