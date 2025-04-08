// import axios from "axios";

// // Fetch data on component mount
// export const fetchAllData = async (setCustomers, setItems, setLoading, setError) => {
//   try {
//     setLoading(true);
    
//     // Using axios for API calls
//     const [customersResponse, itemsResponse] = await Promise.all([
//       axios.get('http://localhost:5016/api/customers'),
//       axios.get('http://localhost:5016/api/items')
//     ]);
    
//     setCustomers(customersResponse.data);
//     setItems(itemsResponse.data);
//     setLoading(false);
//   } catch (err) {
//     setError(err.response?.data?.message || err.message);
//     setLoading(false);
//   }
// };

// // Calculate total amount from all items
// export const calculateTotalAmount = (loanData) => {
//   return loanData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
// };

// // Submit loan data to API
// export const submitLoanData = async (loanData, customers) => {
//   let customerId = null;
  
//   // Check if this is a new customer or an existing one
//   const existingCustomer = customers.find(c => c.customerName === loanData.customerName);
  
//   if (!existingCustomer) {
//     // Create a new customer first
//     const newCustomerData = {
//       customerName: loanData.customerName,
//       fatherName: loanData.fatherName,
//       address: loanData.address,
//       pincode: loanData.pincode,
//       mobileNumber: loanData.phone,
//       email: loanData.email
//     };
    
//     const customerResponse = await axios.post('http://localhost:5016/api/customers', newCustomerData);
//     customerId = customerResponse.data.customerId;
//   } else {
//     customerId = existingCustomer.customerId;
//   }
  
//   // Prepare loan data for submission
//   const loanPayload = {
//     billNo: loanData.billNo,
//     customerId: customerId,
//     loanIssueDate: loanData.issueDate,
//     interestRate: parseFloat(loanData.interestRate),
//     amountLoaned: calculateTotalAmount(loanData),
//     pawnedItems: loanData.items.map(item => ({
//       itemId: item.itemId,
//       itemType: item.itemType,
//       grossWeight: parseFloat(item.grossWeight),
//       netWeight: parseFloat(item.netWeight),
//       amount: parseFloat(item.amount)
//     }))
//   };
  
//   return await axios.post('http://localhost:5016/api/createloan', loanPayload);
// };
import axios from "axios";

// Fetch data on component mount
export const fetchAllData = async (setCustomers, setItems, setLoading, setError) => {
  try {
    setLoading(true);
    
    // Using axios for API calls
    const [customersResponse, itemsResponse] = await Promise.all([
      axios.get('http://localhost:5016/api/customers'),
      axios.get('http://localhost:5016/api/items')
    ]);
    
    setCustomers(customersResponse.data);
    setItems(itemsResponse.data);
    setLoading(false);
  } catch (err) {
    setError(err.response?.data?.message || err.message);
    setLoading(false);
  }
};
// Calculate total amount from all items
export const calculateTotalAmount = (loanData) => {
  // Safely handle undefined/null loanData or items array
  if (!loanData?.items || !Array.isArray(loanData.items)) {
    return 0;
  }

  return loanData.items.reduce((sum, item) => {
    // Safely parse amount (handle undefined/null/NaN)
    const amount = parseFloat(item?.amount) || 0;
    return sum + amount;
  }, 0);
};  
// const API_BASE_URL = "http://localhost:5016/api";

// export const submitLoanData = async (loanData) => {
//   try {
//     console.log("Original loanData items:", loanData.items); // Debug: Check input items

//     // Process items (create new ones if needed)
//     const processedItems = await Promise.all(
//       loanData.items.map(async (item) => {
//         // CASE 1: Item already has an ID → Use as-is (existing item)
//         if (item.itemID && item.itemID !== 0) {
//           console.log(`Using existing item (ID: ${item.itemID})`);
//           return item;
//         }

//         // CASE 2: New item → Create via API
//         console.log(`Creating new item: ${item.name}`); // Debug

//         if (!item.name || !item.itemType) {
//           throw new Error(`New item missing required fields (Name/Type): ${JSON.stringify(item)}`);
//         }

//         const itemPayload = {
//           ItemName: item.name,
//           ItemType: item.itemType,
//           // Include other required fields for `/api/item` if needed
//         };

//         console.log("Calling /api/item with:", itemPayload); // Debug API input
//         const response = await axios.post(`${API_BASE_URL}/api/item`, itemPayload);
//         console.log("API Response:", response.data); // Debug API response

//         if (!response.data?.itemID) {
//           throw new Error("Item creation failed: No itemID in response");
//         }

//         return {
//           ...item,
//           itemID: response.data.itemID, // Assign the new ID
//         };
//       })
//     );

//     console.log("Processed items with IDs:", processedItems); // Debug final items

//     // Prepare loan payload
//     const payload = {
//       BillNo: loanData.billNo,
//       AmountLoaned: calculateTotalAmount(processedItems),
//       LoanIssueDate: loanData.issueDate,
//       Description: loanData.description || "",
//       CustomerID: loanData.customerID || 0,
//       Customer: loanData.customerID ? { /* existing customer */ } : { /* new customer */ },
//       pawnedItems: processedItems.map((item) => ({
//         ItemID: item.itemID,
//         ItemType: item.itemType,
//         GrossWeight: parseFloat(item.grossWeight),
//         NetWeight: parseFloat(item.netWeight),
//         Amount: parseFloat(item.amount),
//       })),
//     };

//     console.log("Final loan payload:", payload); // Debug before submission
//     const loanResponse = await axios.post(`${API_BASE_URL}/createloan`, payload);
//     return loanResponse;

//   } catch (error) {
//     console.error("Error in submitLoanData:", error.response?.data || error.message);
//     throw error;
//   }
// };  

// import axios from "axios";

const API_BASE_URL = "http://localhost:5016/api";

export const submitLoanData = async (loanData, customers) => {
  try {
    console.log("Original loanData:", loanData); // Debug input

    // STEP 1: Handle Customer (check if existing or new)
    let customerId = loanData.customerID;
    
    // If no customerID provided, check if customer exists by name/phone
    if (!customerId || customerId === 0) {
      const existingCustomer = customers.find(c => 
        c.mobileNumber === loanData.phone || 
        c.customerName === loanData.customerName
      );
      
      if (existingCustomer) {
        customerId = existingCustomer.customerID;
        console.log("Found existing customer with ID:", customerId);
      }
    }

    // STEP 2: Create new customer if needed
    if (!customerId || customerId === 0) {
      console.log("Creating new customer");
      const newCustomer = {
        CustomerName: loanData.customerName,
        FatherName: loanData.fatherName,
        MobileNumber: loanData.phone,
        Address: loanData.address,
        Pincode: loanData.pincode,
        Email: loanData.email,
        Area: loanData.area
      };
      
      const customerResponse = await axios.post(`${API_BASE_URL}/customers`, newCustomer);
      customerId = customerResponse.data.customerID;
      console.log("Created new customer with ID:", customerId);
    }

    // STEP 3: Process items (create new ones if needed)
    const processedItems = await Promise.all(
      loanData.items.map(async (item) => {
        if (item.itemID && item.itemID !== 0) {
          console.log(`Using existing item (ID: ${item.itemID})`);
          return item;
        }

        console.log(`Creating new item: ${item.name}`);
        const itemPayload = {
          ItemName: item.name,
          ItemType: item.itemType,
        };

        const response = await axios.post(`${API_BASE_URL}/items`, itemPayload);
        if (!response.data?.itemID) {
          throw new Error("Item creation failed: No itemID in response");
        }

        return {
          ...item,
          itemID: response.data.itemID,
        };
      })
    );

    // STEP 4: Prepare final loan payload
    const payload = {
      BillNo: loanData.billNo,
      CustomerID: customerId, // This will now always have a valid ID
      LoanIssueDate: loanData.issueDate,
      AmountLoaned: calculateTotalAmount(loanData),
      Description: loanData.description || "",
      PawnedItems: processedItems.map((item) => ({
        ItemID: item.itemID,
        ItemType: item.itemType,
        GrossWeight: parseFloat(item.grossWeight),
        NetWeight: parseFloat(item.netWeight),
        Amount: parseFloat(item.amount),
      })),
    };

    console.log("Submitting loan with payload:", payload);
    return await axios.post(`${API_BASE_URL}/createloan`, payload);

  } catch (error) {
    console.error("Error in submitLoanData:", error.response?.data || error.message);
    throw error;
  }
};