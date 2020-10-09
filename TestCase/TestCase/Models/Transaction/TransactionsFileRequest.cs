using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace TestCase.Models.Transaction
{
    public class TransactionsFileRequest
    {
        [Required]
        public IFormFile File { get; set; }
    }
}
