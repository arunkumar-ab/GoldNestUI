// components/PawnedItemForm.jsx
export default function PawnedItemForm({ 
    index, 
    item, 
    handleItemInputChange, 
    removeItem, 
    showItemSuggestions, 
    filteredItems, 
    selectItem 
  }) {
    return (
      <div className="mb-4 p-3 border border-purple-200 rounded-lg bg-purple-50">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium mb-2 text-purple-700">Item {index + 1}</h4>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
        
        <div className="mb-2 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={(e) => handleItemInputChange(index, e)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
            placeholder="Enter item name"
          />
          {showItemSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-purple-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 hover:bg-purple-50 cursor-pointer"
                  onClick={() => selectItem(index, item)}
                >
                  {item.itemName} ({item.itemType})
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name={`itemType-${index}`}
                value="gold"
                checked={item.itemType === "gold"}
                onChange={(e) => handleItemInputChange(index, {target: {name: "itemType", value: e.target.value}})}
                className="form-radio h-4 w-4 text-purple-600"
              />
              <span className="ml-2">Gold</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name={`itemType-${index}`}
                value="silver"
                checked={item.itemType === "silver"}
                onChange={(e) => handleItemInputChange(index, {target: {name: "itemType", value: e.target.value}})}
                className="form-radio h-4 w-4 text-purple-600"
              />
              <span className="ml-2">Silver</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Weight</label>
            <input
              type="number"
              name="grossWeight"
              value={item.grossWeight}
              onChange={(e) => handleItemInputChange(index, e)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
              placeholder="Enter gross weight"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Net Weight</label>
            <input
              type="number"
              name="netWeight"
              value={item.netWeight}
              onChange={(e) => handleItemInputChange(index, e)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
              placeholder="Enter net weight"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={item.amount}
              onChange={(e) => handleItemInputChange(index, e)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
              placeholder="Enter amount"
              step="0.01"
            />
          </div>
        </div>
      </div>
    );
  }