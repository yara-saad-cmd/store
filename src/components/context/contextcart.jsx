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

    const increaseQuantity = (item) => {
      setcartItems((prevItems) =>
        prevItems.map((i) =>
          i.id === item.id &&
          (i.selectedSize || "") === (item.selectedSize || "") &&
          (i.selectedColor || "") === (item.selectedColor || "")
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    };


//-
const decreaseQuantity = (item) => {
  setcartItems((prevItems) =>
    prevItems.map((i) =>
      i.id === item.id &&
      (i.selectedSize || "") === (item.selectedSize || "") &&
      (i.selectedColor || "") === (item.selectedColor || "")
        ? {
            ...i,
            quantity: Math.max(1, i.quantity - 1),
          }
        : i
    )
  );
};

//delet

const delet = (item) => {
  setcartItems((prevItems) =>
    prevItems.filter(
      (i) =>
        !(
          i.id === item.id &&
          (i.selectedSize || "") === (item.selectedSize || "") &&
          (i.selectedColor || "") === (item.selectedColor || "")
        )
    )
  );
};




const AddToCart = (item) => {
  setcartItems((prevItems) => {
    const existingItem = prevItems.find(
      (i) =>
        i.id === item.id &&
        (i.selectedSize || "") === (item.selectedSize || "") &&
        (i.selectedColor || "") === (item.selectedColor || "")
    );

    if (existingItem) {
      return prevItems.map((i) =>
        i.id === item.id &&
        (i.selectedSize || "") === (item.selectedSize || "") &&
        (i.selectedColor || "") === (item.selectedColor || "")
          ? {
              ...i,
              quantity: i.quantity + item.quantity,
            }
          : i
      );
    }

    return [
      ...prevItems,
      {
        ...item,
        quantity: item.quantity || 1,
      },
    ];
  });
};
    useEffect (()=>{
        localStorage.setItem("cartItems",JSON.stringify(cartItems))
    }, [cartItems])


    /*اللون - و المقاس */
    const onSizeChange = (id, newSize, oldColor = "") => {
      setcartItems((prev) =>
        prev.map((item) =>
          item.id === id &&
          (item.selectedColor || "") === oldColor
            ? {
                ...item,
                selectedSize: newSize,
              }
            : item
        )
      );
    };
    
    const onColorChange = (id, newColor, oldSize = "") => {
      setcartItems((prev) =>
        prev.map((item) =>
          item.id === id &&
          (item.selectedSize || "") === oldSize
            ? {
                ...item,
                selectedColor: newColor,
              }
            : item
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
