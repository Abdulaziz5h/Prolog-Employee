using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TheCompany.Base;
using TheCompany.Main.DTO.DTO;
using TheCompany.Main.IData.Interfaces;

namespace TheCompany.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MyController : ControllerBase
    {
        private readonly MyRepositoryInterface myRepositoryInterface;
        public MyController(MyRepositoryInterface myRepositoryInterface)
        {
            this.myRepositoryInterface = myRepositoryInterface;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllKnowledges()
        {
            var result = await myRepositoryInterface.GetAllKnowledges();
            switch (result.OperationResultType)
            {
                case OperationResultTypes.Exception:
                    return new JsonResult("Exception") { StatusCode = 400 };
                case OperationResultTypes.Success:
                    return new JsonResult(result.IEnumerableResult) { StatusCode = 200 };
            }
            return new JsonResult("Unknown Error") { StatusCode = 500 };
        }
        [HttpGet]
        public async Task<IActionResult> GetAllRequireToLearns()
        {
            var result = await myRepositoryInterface.GetAllRequireToLearns();
            switch (result.OperationResultType)
            {
                case OperationResultTypes.Exception:
                    return new JsonResult("Exception") { StatusCode = 400 };
                case OperationResultTypes.Success:
                    return new JsonResult(result.IEnumerableResult) { StatusCode = 200 };
            }
            return new JsonResult("Unknown Error") { StatusCode = 500 };
        }
        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var result = await myRepositoryInterface.GetAllEmployees();
            switch (result.OperationResultType)
            {
                case OperationResultTypes.Exception:
                    return new JsonResult("Exception") { StatusCode = 400 };
                case OperationResultTypes.Success:
                    return new JsonResult(result.IEnumerableResult) { StatusCode = 200 };
            }
            return new JsonResult("Unknown Error") { StatusCode = 500 };
        }
        [HttpPost]
        public async Task<IActionResult> AddEmployee(EmployeeDto employeeDto)
        {
            var result = await myRepositoryInterface.AddEmployee(employeeDto);
            switch (result.OperationResultType)
            {
                case OperationResultTypes.Exception:
                    return new JsonResult("Exception") { StatusCode = 400 };
                case OperationResultTypes.Success:
                    return new JsonResult(result.Result) { StatusCode = 200 };
                case OperationResultTypes.Failed:
                    return new JsonResult("Failed") { StatusCode = 404 };
            }
            return new JsonResult("Unknown Error") { StatusCode = 500 };
        }
        [HttpPost]
        public async Task<IActionResult> AddRequireToLearn(RequireToLearnDto requireToLearnDto)
        {
            var result = await myRepositoryInterface.AddRequireToLearn(requireToLearnDto);
            switch (result.OperationResultType)
            {
                case OperationResultTypes.Exception:
                    return new JsonResult("Exception") { StatusCode = 400 };
                case OperationResultTypes.Success:
                    return new JsonResult(result.Result) { StatusCode = 200 };
                case OperationResultTypes.Failed:
                    return new JsonResult("Failed") { StatusCode = 404 };
            }
            return new JsonResult("Unknown Error") { StatusCode = 500 };
        }
    }
}
