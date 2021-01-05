using System;
using System.Collections.Generic;
using System.Text;
using TheCompany.SQLServer.DataBase;

namespace TheCompany.Base
{
    public class TheCompanyRepository
    {
        protected TheCompanyDBContext Context;
        public TheCompanyRepository(TheCompanyDBContext Context)
        {
            this.Context = Context;
        }
    }
}
