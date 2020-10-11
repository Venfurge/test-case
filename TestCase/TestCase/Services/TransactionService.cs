using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TestCase.Entities;
using TestCase.Exceptions;
using TestCase.Interfaces;
using TestCase.Models;
using TestCase.Models.Transaction;
using static TestCase.Entities.Enums;

namespace TestCase.Services
{
    public class TransactionService : ITransactionService
    {
        #region Private Members

        private ApplicationContext _db;

        #endregion

        #region Constructors

        public TransactionService
        (
            ApplicationContext db
        )
        {
            _db = db;
        }

        #endregion

        #region ITransactionService implementation

        public async Task<PagingList<TransactionModel>> GetTransactions(int pn = 0, int ps = 10, string sort = "id", string sortDir = "asc", string find = null, Status? status = null, Type? type = null)
        {
            //Create response
            var response = new PagingList<TransactionModel>();

            //Create query
            var query = _db.Transactions
                .AsNoTracking();

            //Filter by status
            if (status != null)
                query = query.Where(v => v.Status == status);

            //Filter by type
            if (type != null)
                query = query.Where(v => v.Type == type);

            //Filter by search
            if (!string.IsNullOrEmpty(find))
                query = query.Where(v =>
                    EF.Functions.Like(v.ClientName, $"%{find}%") ||
                    EF.Functions.Like(v.Amount.ToString(), $"%{find}%") ||
                    EF.Functions.Like(v.Id.ToString(), $"%{find}%")
                );

            //Order query
            query = OrderTransactions(query, sort, sortDir);

            //Total count of items
            response.TotalCount = await query.CountAsync();

            //If ps = 0 get all categories
            if (ps != 0)
            {
                //Adding paging
                query = query
                    .Skip(pn * ps)
                    .Take(ps);
            }

            //Converting Items to List<TransactionModel>
            response.Items = await query
                .Select(v => new TransactionModel(v))
                .ToListAsync();

            //Return response
            return response;
        }

        public async Task AddTransactions(IFormFile file)
        {
            string type = file.ContentType;

            //Check if file null
            if (file == null)
                throw new BadRequestException("File");

            //Result list
            var result = new List<TransactionEntity>();

            //Creating stringList to parse
            List<string> stringList = new List<string>();

            //Reading string list
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                while (reader.Peek() >= 0)
                    stringList.Add(await reader.ReadLineAsync());
            }

            //Parsing stringList
            stringList.ForEach(v => { 
                var splitResult = v.Split(',');

                //Checking that id is int
                int id;
                if (int.TryParse(splitResult[0], out id))
                {
                    //Creating entity
                    TransactionEntity transaction = new TransactionEntity();

                    //Parsing entity properties
                    transaction.Id = id;
                    transaction.Status = (Status)System.Enum.Parse(typeof(Status), splitResult[1]);
                    transaction.Type = (Type)System.Enum.Parse(typeof(Type), splitResult[2]);
                    transaction.ClientName = splitResult[3];
                    transaction.Amount = System.Decimal.Parse(System.String.Concat(splitResult[4].Skip(1)), CultureInfo.InvariantCulture);

                    //Adding entity to list
                    result.Add(transaction);
                }
            });

            //Searching entities to update
            var entitiesToUpdate = result.Where(v => _db.Transactions.Any(en => en.Id == v.Id));

            //Update entities
            if (entitiesToUpdate.Count() != 0)
                _db.Transactions.UpdateRange(entitiesToUpdate);

            //Searching entities to add
            var entitiesToAdd = result.Except(entitiesToUpdate);

            //Adding entities
            if (entitiesToAdd.Count() != 0)
                await _db.Transactions.AddRangeAsync(entitiesToAdd);

            //Saving database changes
            await _db.SaveChangesAsync();
        }

        public async Task<TransactionModel> EditTransaction(int id, AddTransactionRequest model)
        {
            //Get entity
            var entity = await _db.Transactions
                .FirstOrDefaultAsync(v => v.Id == id);

            //Check if null
            if (entity == null)
                throw new NotFoundException("Transaction");

            //Update data
            entity.Status = model.Status;
            entity.Type = model.Type;
            entity.ClientName = model.ClientName;
            entity.Amount = model.Amount;

            //Update entity in database
            _db.Transactions.Update(entity);
            await _db.SaveChangesAsync();

            //return new Entity
            return new TransactionModel(entity);
        }

        public async Task DeleteTransaction(int id)
        {
            //Get entity
            var entity = await _db.Transactions
                .FirstOrDefaultAsync(v => v.Id == id);

            //Check if null
            if (entity == null)
                throw new NotFoundException("Transaction");

            //Remove data
            _db.Transactions.Remove(entity);
            await _db.SaveChangesAsync();
        }

        #endregion

        #region Private Methods

        private IQueryable<TransactionEntity> OrderTransactions(IQueryable<TransactionEntity> query, string sort, string sortDir)
            => (sort, sortDir) switch
            {
                ("id", "desc") => query.OrderByDescending(v => v.Id),
                ("id", _) => query.OrderBy(v => v.Id),
                ("status", "desc") => query.OrderByDescending(v => v.Status),
                ("status", "asc") => query.OrderBy(v => v.Status),
                ("type", "desc") => query.OrderByDescending(v => v.Type),
                ("type", "asc") => query.OrderBy(v => v.Type),
                ("clientName", "desc") => query.OrderByDescending(v => v.ClientName),
                ("clientName", "asc") => query.OrderBy(v => v.ClientName),
                ("amount", "desc") => query.OrderByDescending(v => v.Amount),
                ("amount", "asc") => query.OrderBy(v => v.Amount),
                _ => query.OrderBy(v => v.Id)
            };

        #endregion
    }
}
