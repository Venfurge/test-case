using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TestCase.Interfaces;
using TestCase.Models;
using TestCase.Models.Transaction;
using static TestCase.Entities.Enums;

namespace TestCase.Controllers
{
    [ApiController]
    [Route("api/transaction")]
    public class TransactionController : AppControllerBase
    {
        #region Private Members

        private ITransactionService _transactionService;

        #endregion

        #region Constructors

        public TransactionController
        (
            ITransactionService transactionService
        )
        {
            _transactionService = transactionService;
        }

        #endregion

        #region API Calls

        /// <summary>
        /// Get Transactions
        /// </summary>
        /// <param name="pn">Page number</param>
        /// <param name="ps">Page size</param>
        /// <param name="sort">Sort by column (id, name)</param>
        /// <param name="sortDir">Sort direction (asc, desc)</param>
        /// <param name="find">Search string</param>
        /// <param name="status">Filter by status</param>
        /// <param name="type">Filter by type</param>
        /// <response code="200">Transaction list</response>
        [HttpGet]
        [Route("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<PagingList<TransactionModel>>> GetTransactions
        (
            [FromQuery] int pn          = 0,
            [FromQuery] int ps          = 10,
            [FromQuery] string sort     = "id",
            [FromQuery] string sortDir  = "asc",
            [FromQuery] string find     = null,
            [FromQuery] Status? status  = null,
            [FromQuery] Type? type      = null
        )
        {
            return await ExecuteWithOkResponse(async () => await _transactionService.GetTransactions(pn, ps, sort, sortDir, find, status, type));
        }

        /// <summary>
        /// Add Transactions
        /// </summary>
        /// <param name="request">File</param>
        /// <response code="200">Transactions added</response>
        /// <response code="400">File is empty or bad</response>
        [HttpPost]
        [Route("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddTransactions([FromForm] TransactionsFileRequest request)
        {
            return await ExecuteWithOkResponse(async () => await _transactionService.AddTransactions(request.File));
        }


        /// <summary>
        /// Edit Transaction
        /// </summary>
        /// <param name="id">Transaction id</param>
        /// <param name="model">Transaction model</param>
        /// <response code="200">Transaction edited</response>
        /// <response code="404">Transaction doesnt exist</response>
        [HttpPut]
        [Route("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TransactionModel>> EditTransaction(int id, [FromBody] AddTransactionRequest model)
        {
            return await ExecuteWithOkResponse(async () => await _transactionService.EditTransaction(id, model));
        }

        /// <summary>
        /// Delete Transaction
        /// </summary>
        /// <param name="id">Transaction id</param>
        /// <response code="200">Transaction deleted</response>
        /// <response code="404">Transaction doesnt exist</response>
        [HttpDelete]
        [Route("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteTransaction(int id)
        {
            return await ExecuteWithOkResponse(async () => await _transactionService.DeleteTransaction(id));
        }

        #endregion
    }
}
