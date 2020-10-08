using TestCase.Entities;
using static TestCase.Entities.Enums;

namespace TestCase.Models.Transaction
{
    public class TransactionModel
    {
        #region Properies

        public int Id { get; set; }
        public Status Status { get; set; }
        public Type Type { get; set; }
        public string ClientName { get; set; }
        public decimal Amount { get; set; }

        #endregion

        #region Constructors

        public TransactionModel()
        { 
        
        }

        public TransactionModel(TransactionEntity entity)
        {
            Id = entity.Id;
            Status = entity.Status;
            Type = entity.Type;
            ClientName = entity.ClientName;
            Amount = entity.Amount;
        }

        #endregion
    }
}
