using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using TheCompany.Model.Base;

namespace TheCompany.Model.Main
{
    public class Knowledge : EntityBase
    {
        public string Name { get; set; }
        public ICollection<Employeeknowledge> Employees { get; set; }
        [InverseProperty("KnowledgeBefore")]
        public ICollection<RequireToLearn> EmployeesStart { get; set; }
        [InverseProperty("KnowledgeNext")]
        public ICollection<RequireToLearn> EmployeesEnd { get; set; }

    }
}
