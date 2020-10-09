using System.ComponentModel.DataAnnotations;
using static TestCase.Entities.Enums;

namespace TestCase.Models.Transaction
{
    public class AddTransactionRequest
    {
        #region Properties

        [Required]
        public Status Status { get; set; }

        [Required]
        public Type Type { get; set; }

        [Required]
        public string ClientName { get; set; }

        [Required]
        public decimal Amount { get; set; }

        #endregion
    }
}
