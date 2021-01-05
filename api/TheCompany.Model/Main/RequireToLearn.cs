using System;
using System.Collections.Generic;
using System.Text;
using TheCompany.Model.Base;

namespace TheCompany.Model.Main
{
    public class RequireToLearn : EntityBase
    {
        // [ForeignKey("KnowledgeBefore")]
        public Knowledge KnowledgeBefore { get; set; }
        public int? knowledgeBeforeId { get; set; }
        // [ForeignKey("KnowledgeNext")]
        public Knowledge KnowledgeNext { get; set; }
        public int? knowledgeNextId { get; set; }

    }
}
