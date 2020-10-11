using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using TestCase.Models;
using TestCase.Models.Transaction;
using static TestCase.Entities.Enums;

namespace TestCase.Interfaces
{
    public interface ITransactionService
    {
        /// <summary>
        /// Get Transactions
        /// </summary>
        /// <param name="pn">Page number</param>
        /// <param name="ps">Page size</param>
        /// <param name="sort">Sort column</param>
        /// <param name="sortDir">Sort direction</param>
        /// <param name="find">Search string</param>
        /// <param name="status">Filter by status</param>
        /// <param name="type">Filter by type</param>
        /// <returns><see cref="TransactionModel"/></returns>
        Task<PagingList<TransactionModel>> GetTransactions(int pn = 0, int ps = 0, string sort = "id", string sortDir="asc", string find = null, Status? status=null, Type? type=null);

        /// <summary>
        /// Add Transactions
        /// </summary>
        /// <param name="file">Csv file with transactions</param>
        Task AddTransactions(IFormFile file);

        /// <summary>
        /// Edit Transaction
        /// </summary>
        /// <param name="id">Transaction id</param>
        /// <param name="model">Transaction model</param>
        /// <returns><see cref="TransactionModel"/></returns>
        Task<TransactionModel> EditTransaction(int id, AddTransactionRequest model);

        /// <summary>
        /// Delete Transaction
        /// </summary>
        /// <param name="id">Transactiond id</param>
        Task DeleteTransaction(int id);
    }
}
