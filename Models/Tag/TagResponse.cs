using System;
using System.Collections.Generic;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class TagResponse
	{
		public int Id { get; set; }
		public string LanguageCode { get; set; } // what language
		public string Name { get; set; }
		public string Description { get; set; }
	}
}