using System.Collections.Generic;

namespace TestCase.Models
{
    public class PagingList<T>
    {
        public int TotalCount { get; set; }
        public List<T> Items { get; set; }
    }
}
