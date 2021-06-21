import React, { useState } from 'react';

import Item from "./Item/Item";
import Cart from "./Cart/Cart";

import Drawer from '@material-ui/core/Drawer';
import LinearProgress  from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import  AddShoppingCartIcon  from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';

//style
import { Wrapper, StyledButton } from './App.styles';
import { useQuery } from 'react-query';
import { ArtTrack } from '@material-ui/icons';


//types

export type CartItemType={
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}
const getProducts=async () : Promise<CartItemType[]> => {
 return await (await fetch('https://fakestoreapi.com/products')).json();
}
const App=()=> {
  //state for the cart
  const [cartOpen, setCartOpen]=useState(false);
  const [cartItems, setCartItems]=useState([] as CartItemType[]);

  const {data, isLoading, error} =useQuery<CartItemType[]>(
    'products',
    getProducts
  );
  console.log(data);

  const getTotalItems=(items: CartItemType[])=>items.reduce((ack:number, item)=>ack+ item.amount, 0);


  const handleAddToCart=(clickItem: CartItemType)=>{
    setCartItems(prev=>{
      //is the tiem already in the cart?
      const isItemInCart=prev.find(item =>item.id===clickItem.id);
      if(isItemInCart){
         return prev.map(item=>
          item.id===clickItem.id ? {...item, amount: item.amount+1}
          : item);  
      }
      return [...prev, {...clickItem, amount: 1}];
    });
  };

  const handleRemoveFromCart=(id: number)=>{
    setCartItems(prev =>
      // prev.reduce((ack, item) => {
      //   if (item.id === id) {
      //     if (item.amount === 1) return ack;
      //     return [...ack, { ...item, amount: item.amount - 1 }];
      //   } else {
      //     return [...ack, item];
      //   }
      // }, [] as CartItemType[])
      prev.reduce((ack, item)=>{
        if(item.id===id){
          if(item.amount===1) return ack;
          return [...ack, {...item, amount: item.amount-1}];
        }else{
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  // prev=>(prev.reduce(ack, item)=>{
  //   if(Item.id===id){
  //     if(Item.amount===1) return ArtTrack;
  //     return [...ack, {...item, amount: item.amount-1}];
  //   }
  //   else{
  //     [...ack, item]
  //   }
  // }));

  if(isLoading) return <LinearProgress />;
  if(error) return <p>something went wrong....</p>;

  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={()=>setCartOpen(false)}>
         <Cart 
            cartItems={cartItems}
            addToCart={handleAddToCart}
            removeFromCart={handleRemoveFromCart}
         />
      </Drawer>
      {/* <StyleButton onClick={()=>setCartOpen(true)}>
      <Badge badgeContent={getTotalItem(carItems)} color='error'>
          <AddShoppingCarIcon />
      </Badge>
      </StyleButton> */}
        <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
       <Grid container spacing={3}>
        {data?.map(item=>(
          <Grid item key={item.id} xs={12} sm={4}>
              <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
      </Wrapper> 
  );
};

export default App;