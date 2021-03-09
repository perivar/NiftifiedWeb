using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class EditionHistory
	{
		public int Id { get; set; }
		public string LanguageCode { get; set; }
		public DateTime Created { get; set; } // minted when?
		public string Description { get; set; }
	}

}