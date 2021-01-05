using System;
using System.Collections.Generic;
using System.Text;

namespace TheCompany.Main.DTO.DTO
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Salary { get; set; }
        public int Experience { get; set; }
        public ICollection<KnowledgeDto> knowledgeDtos { get; set; }
    }
}
