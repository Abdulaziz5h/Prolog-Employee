using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TheCompany.Base;
using TheCompany.Main.DTO.DTO;

namespace TheCompany.Main.IData.Interfaces
{
    public interface MyRepositoryInterface
    {
        public Task<OperationResult<KnowledgeDto>> GetAllKnowledges();
        public Task<OperationResult<RequireToLearnDto>> GetAllRequireToLearns();
        public Task<OperationResult<EmployeeDto>> GetAllEmployees();
        public Task<OperationResult<EmployeeDto>> AddEmployee(EmployeeDto employeeDto);
        public Task<OperationResult<ReturnOfRequireToLearn>> AddRequireToLearn(RequireToLearnDto requireToLearnDto);
    }
}
