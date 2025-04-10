
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

export const fetchAfterSubmit = async (setCustomers, setItems,setError) => {
  try {
    setLoading(true);
    
    // Using axios for API calls
    const [customersResponse, itemsResponse] = await Promise.all([
      axios.get('http://localhost:5016/api/customers'),
      axios.get('http://localhost:5016/api/items')
    ]);
    
    setCustomers(customersResponse.data);
    setItems(itemsResponse.data);
  } catch (err) {
    setError(err.response?.data?.message || err.message);
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

const API_BASE_URL = "http://localhost:5016/api";

export const submitLoanData = async (loanData,setCustomers, setItems,setError) => {
  try {
    console.log("Original loanData:", loanData);

    // STEP 1: Fetch latest customers list
    const customersResponse = await axios.get(`${API_BASE_URL}/customers`);
    const tempCustomers = customersResponse.data || [];

    // STEP 2: Try to find matching customer by name and phone
    let customerId = loanData.customerID;

    if (!customerId || customerId === 0) {
      const matchingCustomer = tempCustomers.find(c =>
        c.customerName.toLowerCase() === loanData.customerName.toLowerCase() &&
        c.mobileNumber === loanData.phone
      );

      if (matchingCustomer) {
        console.log("Found existing customer:", matchingCustomer);
        customerId = matchingCustomer.customerID;
      }
    }

    // STEP 3: Create new customer if still not found
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

    // STEP 4: Process items (create if needed)
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

    // STEP 5: Submit loan
    const payload = {
      BillNo: loanData.billNo,
      CustomerID: customerId,
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
    const result = await axios.post(`${API_BASE_URL}/createloan`, payload);
    fetchAfterSubmit(setCustomers, setItems,setError);
    console.log(customers)
    return result;

  } catch (error) {
    console.error("Error in submitLoanData:", error.response?.data || error.message);
    throw error;
  }
};
