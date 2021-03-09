using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Collection
	{
		public int Id { get; set; }
		public string LanguageCode { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public int Year { get; set; }
	}
}