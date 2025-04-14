
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
    return result;

  } catch (error) {
    console.error("Error in submitLoanData:", error.response?.data || error.message);
    throw error;
  }
};



//using GoldNest.Data;
//using GoldNest.Model.Entity;
//using Microsoft.AspNetCore.Mvc;
//using GoldNest.Model.DTO;
//using Microsoft.EntityFrameworkCore;
//using Newtonsoft.Json;

//namespace GoldNest.Controllers
//{
//    [Route("api/")]
//    [ApiController]
//    public class LoanController : ControllerBase
//    {
//        private readonly ApplicationDbContext _dbContext;
//        private readonly ILogger<LoanController> _logger;

//        public LoanController(ApplicationDbContext dbContext, ILogger<LoanController> logger)
//        {
//            _dbContext = dbContext;
//            _logger = logger;
//        }

//        #region Customer Operations

//        /// Get all customers
//        [HttpGet("customers")]
//        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
//        {
//            _logger.LogInformation("Starting GetCustomers operation");
//            try
//            {
//                var customers = await _dbContext.Customer.ToListAsync();
//                _logger.LogInformation($"Successfully retrieved {customers.Count} customers");
//                return Ok(customers);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error fetching customers");
//                return StatusCode(500, new { message = "An error occurred while fetching customers.", error = ex.Message });
//            }
//        }

//        /// Get customer by ID
//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetCustomerById(int id)
//        {
//            _logger.LogInformation($"Starting GetCustomerById operation for ID: {id}");
//            try
//            {
//                var customer = await _dbContext.Customer.FindAsync(id);
//                if (customer == null)
//                {
//                    _logger.LogWarning($"Customer with ID {id} not found");
//                    return NotFound(new { message = "Customer not found." });
//                }
//                _logger.LogInformation($"Successfully retrieved customer with ID: {id}");
//                return Ok(customer);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, $"Error fetching customer with ID: {id}");
//                return StatusCode(500, new { message = "An error occurred while fetching the customer.", error = ex.Message });
//            }
//        }

//        /// Create a new customer
//        [HttpPost("customers")]
//        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerDto request)
//        {
//            _logger.LogInformation("Starting CreateCustomer operation");
//            if (!ModelState.IsValid)
//            {
//                _logger.LogWarning("Invalid model state in CreateCustomer");
//                return BadRequest(ModelState);
//            }

//            try
//            {
//                var customer = new Customer
//                {
//                    CustomerName = request.CustomerName,
//                    FatherName = request.FatherName,
//                    Address = request.Address,
//                    Pincode = request.Pincode,
//                    MobileNumber = request.MobileNumber,
//                    Email = request.Email
//                };

//                _dbContext.Customer.Add(customer);
//                await _dbContext.SaveChangesAsync();
//                _logger.LogInformation($"Successfully created customer with ID: {customer.CustomerID}");

//                return CreatedAtAction(nameof(GetCustomerById), new { id = customer.CustomerID }, customer);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error creating customer");
//                return StatusCode(500, new { message = "An error occurred while creating the customer.", error = ex.Message });
//            }
//        }

//        /// Update customer details
//        [HttpPut("customer/{id:int}")]
//        public async Task<ActionResult<Customer>> UpdateCustomer(int id, [FromBody] CreateCustomerDto request)
//        {
//            _logger.LogInformation($"Starting UpdateCustomer operation for ID: {id}");
//            if (request == null)
//            {
//                _logger.LogWarning("Invalid customer data in UpdateCustomer");
//                return BadRequest(new { message = "Invalid customer data" });
//            }

//            try
//            {
//                var existingCustomer = await _dbContext.Customer.FindAsync(id);
//                if (existingCustomer == null)
//                {
//                    _logger.LogWarning($"Customer with ID {id} not found for update");
//                    return NotFound(new { message = "Customer not found" });
//                }

//                var validationError = ValidationHelper.ValidateUpdateCustomerData(request);
//                if (validationError != null)
//                {
//                    _logger.LogWarning($"Validation failed in UpdateCustomer: {validationError}");
//                    return BadRequest(new { message = validationError });
//                }

//                // Update fields
//                existingCustomer.CustomerName = request.CustomerName;
//                existingCustomer.FatherName = request.FatherName;
//                existingCustomer.Email = request.Email;
//                existingCustomer.MobileNumber = request.MobileNumber;
//                existingCustomer.Address = request.Address;
//                existingCustomer.Area = request.Area;
//                existingCustomer.Pincode = request.Pincode;

//                await _dbContext.SaveChangesAsync();
//                _logger.LogInformation($"Successfully updated customer with ID: {id}");

//                return Ok(existingCustomer);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, $"Error updating customer {id}");
//                return StatusCode(500, new { message = "An error occurred while updating the customer.", error = ex.Message });
//            }
//        }

//        /// Get loan history for a customer
//        [HttpGet("loanhistory/{id}")]
//        public async Task<ActionResult<IEnumerable<Loan>>> GetCustomerLoans(int id)
//        {
//            _logger.LogInformation($"Starting GetCustomerLoans operation for customer ID: {id}");
//            try
//            {
//                var customerExists = await _dbContext.Customer.AnyAsync(c => c.CustomerID == id);
//                if (!customerExists)
//                {
//                    _logger.LogWarning($"Customer with ID {id} not found for loan history");
//                    return NotFound(new { message = $"Customer with ID {id} not found." });
//                }

//                var loans = await _dbContext.Loan
//                    .Where(l => l.CustomerID == id)
//                    .Select(l => new
//                    {
//                        Loanid = l.LoanID,
//                        loanAmount = l.AmountLoaned,
//                        interestRate = l.InterestRate,
//                        status = l.Status,
//                        date = l.LoanIssueDate.ToString("yyyy-MM-dd")
//                    })
//                    .ToListAsync();

//                _logger.LogInformation($"Successfully retrieved {loans.Count} loans for customer ID: {id}");
//                return Ok(loans);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error fetching loans for customer {CustomerId}", id);
//                return StatusCode(500, new { message = "An error occurred while fetching the customer's loans.", error = ex.Message });
//            }
//        }

//        #endregion

//        #region Loan Operations

//        /// Get all loans with filtering options
//        [HttpGet("loans")]
//        public async Task<ActionResult> GetLoans(
//            [FromQuery] DateTime? fromDate,
//            [FromQuery] DateTime? toDate,
//            [FromQuery] string status = "all",
//            [FromQuery] string search = null)
//        {
//            _logger.LogInformation("Starting GetLoans operation");
//            try
//            {
//                var query = _dbContext.Loan
//                    .Include(l => l.Customer)
//                    .AsQueryable();

//                if (fromDate.HasValue)
//                    query = query.Where(l => l.LoanIssueDate >= fromDate.Value);

//                if (toDate.HasValue)
//                    query = query.Where(l => l.LoanIssueDate <= toDate.Value);

//                if (status.ToLower() != "all")
//                    query = query.Where(l => l.Status.ToLower() == status.ToLower());

//                if (!string.IsNullOrEmpty(search))
//                    query = query.Where(l =>
//                        l.BillNo.Contains(search) ||
//                        l.Customer.CustomerName.Contains(search));

//                var allLoans = await query.ToListAsync();
//                var closedLoans = allLoans.Where(l => l.CloseDate != null).ToList();

//                decimal totalPrincipalReceived = closedLoans.Sum(l => l.AmountLoaned);
//                decimal totalInterestReceived = closedLoans.Sum(l =>
//                    l.AmountLoaned * 0.01m * CalculateInterestMonths(l.LoanIssueDate, l.CloseDate.Value));

//                var loanResults = allLoans.Select(l => new
//                {
//                    l.LoanID,
//                    l.BillNo,
//                    CustomerId = l.Customer.CustomerID,
//                    CustomerName = l.Customer.CustomerName,
//                    OpenDate = l.LoanIssueDate,
//                    l.CloseDate,
//                    Amount = l.AmountLoaned,
//                    l.Status,
//                    InterestMonths = l.CloseDate != null ?
//                        CalculateInterestMonths(l.LoanIssueDate, l.CloseDate.Value) : (int?)null,
//                    Interest = l.CloseDate != null ?
//                        l.AmountLoaned * 0.01m * CalculateInterestMonths(l.LoanIssueDate, l.CloseDate.Value) : (decimal?)null,
//                    AmountReceived = l.CloseDate != null ?
//                        l.AmountLoaned + (l.AmountLoaned * 0.01m * CalculateInterestMonths(l.LoanIssueDate, l.CloseDate.Value))
//                        : (decimal?)null
//                }).ToList();

//                var result = new
//                {
//                    Loans = loanResults,
//                    Summary = new
//                    {
//                        TotalLoanAmount = allLoans.Sum(l => l.AmountLoaned),
//                        TotalPrincipalReceived = totalPrincipalReceived,
//                        TotalInterestReceived = totalInterestReceived,
//                        TotalAmountReceived = totalPrincipalReceived + totalInterestReceived,
//                        ActiveLoansCount = allLoans.Count(l => l.CloseDate == null),
//                        ClosedLoansCount = closedLoans.Count
//                    }
//                };

//                _logger.LogInformation($"Successfully retrieved {allLoans.Count} loans");
//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error fetching loans");
//                return StatusCode(500, new
//                {
//                    message = "An error occurred while fetching loans.",
//                    error = ex.Message
//                });
//            }
//        }

//        /// Create a new loan
//        [HttpPost("createloan")]
//        public async Task<ActionResult<Loan>> CreateLoan([FromBody] CreateLoanDto request)
//        {
//            _logger.LogInformation("Starting CreateLoan operation");
//            if (request == null)
//            {
//                _logger.LogWarning("Invalid loan data in CreateLoan");
//                return BadRequest(new { message = "Invalid loan data" });
//            }

//            try
//            {
//                _logger.LogInformation("Checking customer selection");
//                if (request.CustomerID > 0)
//                {
//                    _logger.LogInformation($"Validating existing customer with ID: {request.CustomerID}");
//                    var customerExists = await _dbContext.Customer.AnyAsync(c => c.CustomerID == request.CustomerID);
//                    if (!customerExists)
//                    {
//                        _logger.LogWarning($"Customer with ID {request.CustomerID} not found");
//                        return BadRequest(new { message = "Customer not found with provided ID" });
//                    }
//                }
//                else
//                {
//                    _logger.LogInformation("Creating new customer for loan");
//                    var validationError = ValidationHelper.ValidateLoanData(request);
//                    if (validationError != null)
//                    {
//                        _logger.LogWarning($"Loan validation failed: {validationError}");
//                        return BadRequest(new { message = validationError });
//                    }

//                    var customer = new Customer
//                    {
//                        CustomerName = request.Customer.CustomerName,
//                        FatherName = request.Customer.FatherName,
//                        MobileNumber = request.Customer.MobileNumber,
//                        Address = request.Customer.Address,
//                        Pincode = request.Customer.Pincode,
//                        Email = request.Customer.Email,
//                        Area = request.Customer.Area
//                    };

//                    await _dbContext.Customer.AddAsync(customer);
//                    await _dbContext.SaveChangesAsync();
//                    request.CustomerID = customer.CustomerID;
//                    _logger.LogInformation($"Created new customer with ID: {customer.CustomerID}");
//                }

//                var loan = new Loan
//                {
//                    BillNo = request.BillNo,
//                    CustomerID = request.CustomerID,
//                    Status = "active",
//                    InterestRate = 1,
//                    LoanIssueDate = request.LoanIssueDate,
//                    AmountLoaned = request.AmountLoaned,
//                    Description = request.Description
//                };

//                await _dbContext.Loan.AddAsync(loan);
//                await _dbContext.SaveChangesAsync();

//                var pawnedItems = request.PawnedItems.Select(item => new PawnedItem
//                {
//                    ItemID = item.ItemID,
//                    ItemType = item.ItemType,
//                    LoanID = loan.LoanID,
//                    GrossWeight = item.GrossWeight,
//                    NetWeight = item.NetWeight,
//                    Amount = item.Amount
//                }).ToList();

//                await _dbContext.PawnedItems.AddRangeAsync(pawnedItems);
//                await _dbContext.SaveChangesAsync();

//                _logger.LogInformation($"Successfully created loan with ID: {loan.LoanID} and {pawnedItems.Count} pawned items");
//                return Ok(new { message = "Loan created successfully", loanID = loan.LoanID });
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error creating loan");
//                return StatusCode(500, new { message = "An error occurred while creating the loan", error = ex.Message });
//            }
//        }

//        /// Get loan details by ID
//        [HttpGet("loans/{id}")]
//        public async Task<ActionResult<LoanDetailsDto>> GetLoanDetails(int id)
//        {
//            _logger.LogInformation($"Starting GetLoanDetails operation for loan ID: {id}");
//            try
//            {
//                var loan = await _dbContext.Loan
//                    .Include(l => l.Customer)
//                    .FirstOrDefaultAsync(l => l.LoanID == id);

//                if (loan == null)
//                {
//                    _logger.LogWarning($"Loan with ID {id} not found");
//                    return NotFound(new { message = "Loan not found" });
//                }

//                var loanItems = await _dbContext.PawnedItems
//                    .Include(p => p.Item)
//                    .Where(item => item.LoanID == id)
//                    .ToListAsync();

//                var today = DateTime.Now;
//                var interestMonths = CalculateInterestMonths(loan.LoanIssueDate, today);
//                var principal = loan.AmountLoaned;
//                var interestAmount = principal * (loan.InterestRate / 100) * interestMonths;

//                _logger.LogInformation($"Successfully retrieved loan details for ID: {id}");
//                return new LoanDetailsDto
//                {
//                    LoanID = loan.LoanID,
//                    BillNo = loan.BillNo,
//                    LoanIssueDate = loan.LoanIssueDate,
//                    Status = loan.Status,
//                    InterestRate = loan.InterestRate,
//                    AmountLoaned = loan.AmountLoaned,
//                    Customer = new CustomerDto
//                    {
//                        CustomerID = loan.Customer.CustomerID,
//                        CustomerName = loan.Customer.CustomerName,
//                        FatherName = loan.Customer.FatherName,
//                        Address = loan.Customer.Address,
//                        MobileNumber = loan.Customer.MobileNumber
//                    },
//                    PawnedItems = loanItems.Select(item => new PawnedItemDto
//                    {
//                        PawnedItemID = item.PawnedItemID,
//                        ItemID = item.ItemID,
//                        ItemName = item.Item.ItemName,
//                        grossWeight = item.GrossWeight,
//                        netWeight = item.NetWeight,
//                        Amount = item.Amount
//                    }).ToList(),
//                    Calculation = new LoanCalculationDto
//                    {
//                        Principal = principal,
//                        InterestRate = loan.InterestRate,
//                        Months = interestMonths,
//                        InterestAmount = interestAmount,
//                        TotalPayable = principal + interestAmount
//                    }
//                };
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, $"Error fetching loan details for ID: {id}");
//                return StatusCode(500, new { message = "An error occurred while fetching loan details", error = ex.Message });
//            }
//        }

//        /// Close a loan
//        [HttpPost("close/{id}")]
//        public async Task<ActionResult<object>> CloseLoan(int id)
//        {
//            _logger.LogInformation($"Starting CloseLoan operation for loan ID: {id}");
//            try
//            {
//                var loan = await _dbContext.Loan
//                    .FirstOrDefaultAsync(l => l.LoanID == id);

//                if (loan == null)
//                {
//                    _logger.LogWarning($"Loan with ID {id} not found for closing");
//                    return NotFound(new { message = "Loan not found" });
//                }

//                var today = DateTime.Now;
//                var startDate = loan.LoanIssueDate;
//                var interestMonths = CalculateInterestMonths(startDate, today);
//                var principal = loan.AmountLoaned;
//                var interestRate = loan.InterestRate;
//                var interestAmount = principal * (interestRate / 100) * interestMonths;
//                var totalPayable = principal + interestAmount;

//                loan.Status = "closed";
//                loan.CloseDate = DateTime.Now;
//                loan.InterestAmount = interestAmount;

//                await _dbContext.SaveChangesAsync();
//                _logger.LogInformation($"Successfully closed loan with ID: {id}");

//                return Ok(new
//                {
//                    message = "Loan closed successfully",
//                    loanId = id,
//                    amountPaid = totalPayable,
//                    interestAmount = interestAmount
//                });
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, $"Error closing loan with ID: {id}");
//                return StatusCode(500, new { message = "An error occurred while closing the loan", error = ex.Message });
//            }
//        }

//        /// Search loans by bill number
//        [HttpGet("loans/search")]
//        public async Task<ActionResult<IEnumerable<object>>> SearchLoansByBillNo([FromQuery] string billNo)
//        {
//            _logger.LogInformation($"Starting SearchLoansByBillNo operation for bill number: {billNo}");
//            try
//            {
//                if (string.IsNullOrEmpty(billNo))
//                {
//                    _logger.LogWarning("Empty bill number in search request");
//                    return BadRequest(new { message = "Bill number is required" });
//                }

//                var loans = await _dbContext.Loan
//                    .Include(l => l.Customer)
//                    .Where(l => l.BillNo.Contains(billNo))
//                    .OrderByDescending(l => l.LoanIssueDate)
//                    .ToListAsync();

//                if (loans == null || !loans.Any())
//                {
//                    _logger.LogWarning($"No loans found with bill number: {billNo}");
//                    return NotFound(new { message = "No loans found with the provided bill number" });
//                }

//                var formattedLoans = loans.Select(loan => new
//                {
//                    loan.LoanID,
//                    loan.BillNo,
//                    loan.Customer.CustomerName,
//                    LoanIssueDate = loan.LoanIssueDate.ToString("yyyy-MM-dd"),
//                    AmountLoaned = "₹" + loan.AmountLoaned.ToString("N0"),
//                    status = loan.Status,
//                    customerID = loan.CustomerID
//                });

//                _logger.LogInformation($"Found {loans.Count} loans matching bill number: {billNo}");
//                return Ok(formattedLoans);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, $"Error searching loans by bill number: {billNo}");
//                return StatusCode(500, new { message = "An error occurred while searching for loans", error = ex.Message });
//            }
//        }

//        #endregion

//        #region Item Operations

//        /// Get all items
//        [HttpGet("items")]
//        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
//        {
//            _logger.LogInformation("Starting GetItems operation");
//            try
//            {
//                var items = await _dbContext.Item.ToListAsync();
//                _logger.LogInformation($"Successfully retrieved {items.Count} items");
//                return Ok(items); // Returns empty array if no items exist
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error fetching items");
//                return StatusCode(500, new { message = "An error occurred while fetching items.", error = ex.Message });
//            }
//        }

//        #endregion

//        #region Helper Methods

//        private static int CalculateInterestMonths(DateTime startDate, DateTime endDate)
//        {
//            if (endDate < startDate) return 0;

//            int months = (endDate.Year - startDate.Year) * 12 + endDate.Month - startDate.Month;

//            if (months == 0) return 1;

//            if (endDate.Day > startDate.Day + 2 ||
//                (endDate.Day >= startDate.Day && endDate > startDate.AddMonths(months)))
//            {
//                months++;
//            }

//            return Math.Max(1, months);
//        }

//        #endregion
//    }
//}