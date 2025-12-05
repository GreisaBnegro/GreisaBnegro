using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace FinanceTracker
{
    // Delegate & event
    public delegate void TransactionAddedHandler(Transaction transaction);

    public class Transaction
    {
        public DateTime Date { get; set; }
        public string Type { get; set; }  // Income or Expense
        public string Category { get; set; }
        public decimal Amount { get; set; }
        public bool IsRemoved { get; set; } = false;

        public override string ToString()
        {
            return $"{Date:yyyy/MM/dd} | {Type} | {Category} | {Amount:C}";
        }
    }

    public class FinanceManager
    {
        public event Action<Transaction> TransactionAdded;
        public event Action<Transaction> TransactionRemoved;
        private List<Transaction> transactions = new List<Transaction>();
        

        public void AddTransaction(Transaction t)
        {
            transactions.Add(t);
            TransactionAdded?.Invoke(t);
        }
        
        public void RemoveTransaction(Transaction t)
        {
            t.IsRemoved = true;
            TransactionRemoved?.Invoke(t);
        }

        public List<Transaction> GetAllTransactions() => transactions;

        public void SaveToCSV(string filePath, string userComment)
        {
            using (StreamWriter sw = new StreamWriter(filePath))
            {
                if (!string.IsNullOrWhiteSpace(userComment))
                {
                    sw.WriteLine("# " + userComment);
                }

                sw.WriteLine("Date,Type,Category,Amount");

                foreach (var t in transactions)
                {
                    sw.WriteLine($"{t.Date},{t.Type},{t.Category},{t.Amount}");
                }
            }
        }

        public void ShowTotalsByCategory()
        {
            if (!transactions.Any())
            {
                Console.WriteLine("\nCurrently Empty!");
                Console.WriteLine("Check other options!");
                return;
            }
        
            var totals = transactions
                .GroupBy(t => t.Category)
                .Select(group => new
                {
                    Category = group.Key,
                    Total = group.Sum(t =>
                    {
                        // Removed Income → subtract the amount
                        if (t.Type.Equals("Income", StringComparison.OrdinalIgnoreCase))
                            return -t.Amount;
        
                        // Removed Expense → add the amount back
                        if (t.IsRemoved && t.Type.Equals("Expense", StringComparison.OrdinalIgnoreCase))
                            return +t.Amount;
        
                        // Normal transaction
                        return t.Amount;
                    })
                });
        
            Console.WriteLine("\nTotals per Category:");
            foreach (var total in totals)
            {
                Console.WriteLine($"{total.Category}: - {total.Total:C}");
            }
        }

    }

    class Program
    {
        static void Main()
        {
            FinanceManager manager = new FinanceManager();
            manager.TransactionAdded += (t) =>
                Console.WriteLine($"[EVENT] New transaction added: - {t.Amount:C} ({t.Category})");
                
            manager.TransactionRemoved += (t) =>
                Console.WriteLine($"[EVENT] New transaction removed: {t.Amount:C} ({t.Category})");

            int invalidMenuAttempts = 0;

            while (true)
            {
                Console.WriteLine("\n ✎ ᝰ . 📓 🗒 ˎˊ˗ Personal ˗ `ˏ $ ˎˊ ˗ Finance ˗ `ˏ $ ˎˊ ˗ Tracker ✎ ᝰ . 📓 🗒 ˎˊ˗ ");
                Console.WriteLine("     1. Add Transaction");
                Console.WriteLine("     2. View All Transactions");
                Console.WriteLine("     3. Show Totals per Category");
                Console.WriteLine("     4. Export to CSV");
                Console.WriteLine("     5. Exit");
                Console.Write("Choose option: ");

                string choice = Console.ReadLine();

                if (choice == "1" || choice == "2" || choice == "3" || choice == "4" || choice == "5")
                {
                    invalidMenuAttempts = 0; // reset
                }
                else
                {
                    invalidMenuAttempts++;
                    Console.WriteLine($"Invalid choice! Attempts left: {8 - invalidMenuAttempts}");

                    if (invalidMenuAttempts >= 8)
                    {
                        Console.WriteLine("\nToo many invalid attempts. Exiting program...");
                        return;
                    }

                    continue;
                }

                switch (choice)
                {
                    case "1":
                        AddTransaction(manager);
                        break;

                    case "2":
                        if (!manager.GetAllTransactions().Any())
                        {
                            Console.WriteLine("\nCurrently Empty!");
                            Console.WriteLine("Check other options!");
                        }
                        else
                        {
                            foreach (var t in manager.GetAllTransactions())
                                Console.WriteLine(t);
                        }
                        break;

                    case "3":
                        manager.ShowTotalsByCategory();
                        break;

                    case "4":
                        if (!manager.GetAllTransactions().Any())
                        {
                            Console.WriteLine("\nCurrently Empty!");
                            Console.WriteLine("Check other options!");
                        }
                        else
                        {
                            Console.Write("\nEnter a comment for your CSV (or leave blank): ");
                            string comment = Console.ReadLine();

                            manager.SaveToCSV("transactions.csv", comment);
                            Console.WriteLine("Exported to transactions.csv");
                        }
                        break;

                    case "5":
                        return;
                }
            }
        }

        static void AddTransaction(FinanceManager manager)
        {
            try
            {
                // --- TYPE INPUT & CORRECTION LOOP ---
                string type = "";
                while (true)
                {
                    Console.Write("\nType (Income/Expense): ");
                    string input = Console.ReadLine();
        
                    if (string.IsNullOrWhiteSpace(input))
                    {
                        Console.WriteLine("Input empty! Try again.");
                        continue;
                    }
        
                    string lower = input.ToLower();
        
                    // Detect Expense
                    if (lower.Contains("exp") || lower.Contains("expense") || lower.Contains("expence"))
                    {
                        type = "Expense";
                        break;
                    }
        
                    // Detect Income
                    if (lower.Contains("inc") || lower.Contains("income"))
                    {
                        type = "Income";
                        break;
                    }
        
                    Console.WriteLine("❌ Could not determine type (Income/Expense). Try again.");
                }
        
        
                // --- CATEGORY INPUT ---
                Console.Write("Category: ");
                string category = Console.ReadLine();
                if (string.IsNullOrWhiteSpace(category))
                {
                    Console.WriteLine("Category empty! Operation cancelled.");
                    return;
                }
        
        
                // --- AMOUNT INPUT WITH VALIDATION & RETRIES ---
                decimal amount = 0;
                int retries = 0;
        
                while (retries < 3)
                {
                    Console.Write("Amount: ");
                    string amountInput = Console.ReadLine();
        
                    if (string.IsNullOrWhiteSpace(amountInput))
                    {
                        Console.WriteLine("Input empty! Operation cancelled.");
                        return;
                    }
        
                    if (decimal.TryParse(amountInput, out amount))
                        break;
        
                    retries++;
                    if (retries < 3)
                        Console.WriteLine($"Invalid amount! Attempts left: {3 - retries}");
                }
        
                if (retries >= 3)
                {
                    Console.WriteLine("Too many invalid attempts. Transaction canceled.");
                    return;
                }
        
        
                // --- ADD TRANSACTION ---
                manager.AddTransaction(new Transaction
                {
                    Date = DateTime.Now,
                    Type = type,
                    Category = category,
                    Amount = amount
                });
        
                Console.WriteLine("\nTransaction successfully added!");
            }
            
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
            }
        }

        }
    }
