using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheCompany.Base;
using TheCompany.Main.DTO.DTO;
using TheCompany.Main.IData.Interfaces;
using TheCompany.Model.Main;
using TheCompany.SQLServer.DataBase;

namespace TheCompany.Main.Data.Repository
{
    public class MyRepository : TheCompanyRepository, MyRepositoryInterface
    {
        public MyRepository(TheCompanyDBContext Context) : base(Context)
        {

        }
        public async Task<OperationResult<KnowledgeDto>> GetAllKnowledges()
        {
            OperationResult<KnowledgeDto> operation = new OperationResult<KnowledgeDto>();
            try
            {
                operation.IEnumerableResult = await Context.Knowledges.Where(f => (!f.DateDeleted.HasValue)).Select(f => new KnowledgeDto
                {
                    Name = f.Name
                }).ToListAsync();
                operation.OperationResultType = OperationResultTypes.Success;
                return operation;
            }
            catch (Exception ex)
            {
                operation.OperationResultType = OperationResultTypes.Exception;
                operation.Exception = ex;
                return operation;
            }
        }
        public async Task<OperationResult<RequireToLearnDto>> GetAllRequireToLearns()
        {
            OperationResult<RequireToLearnDto> operation = new OperationResult<RequireToLearnDto>();
            try
            {
                operation.IEnumerableResult = await Context.RequireToLearns.Include(s => s.KnowledgeBefore).Include(s => s.KnowledgeNext)
                    .Where(f => (!f.DateDeleted.HasValue)).Select(f => new RequireToLearnDto
                    {
                        First = f.KnowledgeBefore.Name,
                        Second = f.KnowledgeNext.Name
                    }).ToListAsync();
                operation.OperationResultType = OperationResultTypes.Success;
                return operation;
            }
            catch (Exception ex)
            {
                operation.OperationResultType = OperationResultTypes.Exception;
                operation.Exception = ex;
                return operation;
            }
        }
        public async Task<OperationResult<EmployeeDto>> GetAllEmployees()
        {
            OperationResult<EmployeeDto> operation = new OperationResult<EmployeeDto>();
            try
            {
                operation.IEnumerableResult = await Context.Employees.Where(f => (!f.DateDeleted.HasValue)).Select(f => new EmployeeDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Salary = f.Salary,
                    Experience = f.Experience,
                    knowledgeDtos = f.Knowledges.Select(k => new KnowledgeDto { Name = k.Knowledge.Name }).ToList()
                }).ToListAsync();
                operation.OperationResultType = OperationResultTypes.Success;
                return operation;
            }
            catch (Exception ex)
            {
                operation.OperationResultType = OperationResultTypes.Exception;
                operation.Exception = ex;
                return operation;
            }
        }
        public async Task<OperationResult<EmployeeDto>> AddEmployee(EmployeeDto employeeDto)
        {
            OperationResult<EmployeeDto> operation = new OperationResult<EmployeeDto>();
            using (var transaction = Context.Database.BeginTransaction())
            {
                try
                {
                    Employee employee = new Employee
                    {
                        Name = employeeDto.Name,
                        Salary = employeeDto.Salary,
                        Experience = employeeDto.Experience
                    };
                    var result = Context.Employees.Add(employee);
                    if (result != null)
                    {
                        await Context.SaveChangesAsync();
                        employeeDto.Id = employee.Id;
                        foreach (var item in employeeDto.knowledgeDtos)
                        {
                            var idx = Context.Knowledges.Where(x => x.Name.Equals(item.Name)).Select(y => y.Id).SingleOrDefault();
                            if(idx == 0)
                            {
                                var know = new Knowledge { Name = item.Name };
                                Context.Knowledges.Add(know);
                                await Context.SaveChangesAsync();
                                idx = know.Id;
                            }
                            Context.Employeeknowledges.Add(new Employeeknowledge
                            {
                                EmployeeId = employee.Id,
                                knowledgeId = idx
                            });
                            await Context.SaveChangesAsync();
                        }
                        operation.OperationResultType = OperationResultTypes.Success;
                        operation.Result = employeeDto;
                        transaction.Commit();
                    }
                    else operation.OperationResultType = OperationResultTypes.Failed;
                    return operation;
                }
                catch (Exception ex)
                {
                    operation.OperationResultType = OperationResultTypes.Exception;
                    operation.Exception = ex;
                    transaction.Rollback(); 
                    return operation;
                }
            }
        }
        public async Task<OperationResult<ReturnOfRequireToLearn>> AddRequireToLearn(RequireToLearnDto requireToLearnDto)
        {
            OperationResult<ReturnOfRequireToLearn> operation = new OperationResult<ReturnOfRequireToLearn>();
            using (var transaction = Context.Database.BeginTransaction())
            {
                try
                {
                    var idx1 = Context.Knowledges.Where(a => a.Name.Equals(requireToLearnDto.First)).Select(b => b.Id).SingleOrDefault();
                    var idx2 = Context.Knowledges.Where(a => a.Name.Equals(requireToLearnDto.Second)).Select(b => b.Id).SingleOrDefault();
                    ReturnOfRequireToLearn returnOfRequireToLearn = new ReturnOfRequireToLearn
                    {
                        First = requireToLearnDto.First,
                        Second = requireToLearnDto.Second
                    };

                    if (idx1 == 0)
                    {
                        var know1 = new Knowledge { Name = requireToLearnDto.First };
                        Context.Knowledges.Add(know1);
                        await Context.SaveChangesAsync();
                        idx1 = know1.Id;
                        returnOfRequireToLearn.ReturningNode = requireToLearnDto.First;

                    }
                    if (idx2 == 0)
                    {
                        var know2 = new Knowledge { Name = requireToLearnDto.Second };
                        Context.Knowledges.Add(know2);
                        await Context.SaveChangesAsync();
                        idx2 = know2.Id;
                        returnOfRequireToLearn.ReturningNode = requireToLearnDto.Second;
                    }
                    RequireToLearn requireToLearn = new RequireToLearn
                    {
                        knowledgeBeforeId = idx1,
                        knowledgeNextId = idx2
                    };
                    var result = Context.RequireToLearns.Add(requireToLearn);
                    if (result != null)
                    {
                        await Context.SaveChangesAsync();
                        operation.OperationResultType = OperationResultTypes.Success;
                        operation.Result = returnOfRequireToLearn;
                        transaction.Commit();
                    }
                    else
                    {
                        operation.OperationResultType = OperationResultTypes.Failed;
                        transaction.Rollback(); 
                    }
                    return operation;
                }
                catch (Exception ex)
                {
                    operation.OperationResultType = OperationResultTypes.Exception;
                    operation.Exception = ex;
                    transaction.Rollback(); 
                    return operation;
                }
            }
        }
    }
}
