using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using TheCompany.Model.Base;

namespace TheCompany.Model.Main
{
    public class Employeeknowledge : EntityBase
    {
        [ForeignKey(nameof(knowledgeId))]
        public Knowledge Knowledge { get; set; }

        public int knowledgeId { get; set; }
        [ForeignKey(nameof(EmployeeId))]
        public Employee Employee { get; set; }
        public int EmployeeId { get; set; }
    }
}
