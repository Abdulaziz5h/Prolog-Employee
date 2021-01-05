using System;
using System.Collections.Generic;
using System.Text;
using TheCompany.Model.Base;

namespace TheCompany.Model.Main
{
    public class Employee : EntityBase
    {
        public string Name { get; set; }
        public int Salary { get; set; }
        public int Experience { get; set; }
        public ICollection<Employeeknowledge> Knowledges { get; set; }
    }
}
