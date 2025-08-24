import React, { createContext, useContext, useState } from 'react';

const ItemContext = createContext();

export function ItemProvider({ children }) {
  const [items, setItems] = useState([]);
  return (
    <ItemContext.Provider value={{ items, setItems }}>
      {children}
    </ItemContext.Provider>
  );
}

export function useItems() {
  return useContext(ItemContext);
}