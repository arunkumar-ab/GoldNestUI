// components/PawnedItemsList.jsx
import { useState } from "react";
import PawnedItemForm from "./PawnedItemForm";

export default function PawnedItemsList({ loanData, setLoanData, items }) {
  const [showItemSuggestions, setShowItemSuggestions] = useState(Array(loanData.items.length).fill(false));
  const [filteredItems, setFilteredItems] = useState(Array(loanData.items.length).fill([]));

  const addItem = () => {
    setLoanData({
      ...loanData,
      items: [...loanData.items, { itemID: null, name: "", grossWeight: "", netWeight: "", amount: "", itemType: "gold" }]
    });
    setShowItemSuggestions([...showItemSuggestions, false]);
    setFilteredItems([...filteredItems, []]);
  };

  const removeItem = (index) => {
    if (loanData.items.length > 1) {
      const newItems = loanData.items.filter((_, i) => i !== index);
      setLoanData({
        ...loanData,
        items: newItems
      });
      
      const newShowItemSuggestions = showItemSuggestions.filter((_, i) => i !== index);
      setShowItemSuggestions(newShowItemSuggestions);
      
      const newFilteredItems = filteredItems.filter((_, i) => i !== index);
      setFilteredItems(newFilteredItems);
    }
  };

  const handleItemInputChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...loanData.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setLoanData({
      ...loanData,
      items: newItems
    });

    if (name === "name") {
      const filtered = items.filter(item => 
        item.itemName.toLowerCase().includes(value.toLowerCase()) && 
        item.itemType.toLowerCase() === newItems[index].itemType.toLowerCase()
      );
      
      const newFilteredItems = [...filteredItems];
      newFilteredItems[index] = filtered;
      setFilteredItems(newFilteredItems);
      
      const newShowItemSuggestions = [...showItemSuggestions];
      newShowItemSuggestions[index] = filtered.length > 0 && value.length > 0;
      setShowItemSuggestions(newShowItemSuggestions);
      console.log(loanData.items);
    }
  };

  const selectItem = (index, item) => {
    const newItems = [...loanData.items];
    newItems[index] = { 
      ...newItems[index], 
      name: item.itemName,
      itemID: item.itemID,
      itemType: item.itemType
    };
    setLoanData({
      ...loanData,
      items: newItems
    });
    
    const newShowItemSuggestions = [...showItemSuggestions];
    newShowItemSuggestions[index] = false;
    setShowItemSuggestions(newShowItemSuggestions);
    console.log("inside select", loanData);
  };

  return (
    <>
      <h3 className="text-md font-medium mb-2 text-purple-600">Pawned Items</h3>
      {loanData.items.map((item, index) => (
        <PawnedItemForm 
          key={index}
          index={index}
          item={item}
          handleItemInputChange={handleItemInputChange}
          removeItem={removeItem}
          showItemSuggestions={showItemSuggestions[index]}
          filteredItems={filteredItems[index]}
          selectItem={selectItem}
        />
      ))}
      
      <button
        type="button"
        onClick={addItem}
        className="mb-4 flex items-center text-purple-600 hover:text-purple-800"
      >
        + Add Another Item
      </button>
    </>
  );
}