using System.ComponentModel.DataAnnotations.Schema;
using static TestCase.Entities.Enums;

namespace TestCase.Entities
{
    public class TransactionEntity
    {
        public int Id { get; set; }
        public Status Status { get; set; }
        public Type Type { get; set; }
        public string ClientName { get; set; }
        public decimal Amount { get; set; }
    }
}
