using System;
using System.Collections.Generic;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class CollectionResponse
	{
		public int Id { get; set; }
		public int AccountId { get; set; }
		public string LanguageCode { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public int Year { get; set; }
	}
}