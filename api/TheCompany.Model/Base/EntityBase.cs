using ServiceStack.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Text;

namespace TheCompany.Model.Base
{
    public class EntityBase
    {
        [PrimaryKey]
        public int Id { get; set; }
        public DateTime? DateDeleted { get; set; }
        public DateTime? DateCreate { get; set; }
    }
}
