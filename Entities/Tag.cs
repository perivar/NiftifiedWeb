using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Tag
	{
		public int Id { get; set; }
		public string LanguageCode { get; set; } // what language
		public string Name { get; set; }
		public string Description { get; set; }
	}
}