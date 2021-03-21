using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Niftified.Entities;

namespace Niftified.Models.Editions
{
	public class UpdateEditionRequest
	{
		public int AccountId { get; set; } // account
		public string LanguageCode { get; set; }

		public string HashId { get; set; } // connection to nifty chain
		public string ExternalHashId { get; set; } // id on external block chain?

		public ICollection<int> CreatorIds { get; set; } = new List<int>();

		// TODO: how can we update the volumes after they are created?
		// public List<Volume> Volumes { get; set; } // at least one needs to exist
		public int VolumesCount { get; set; }  // number of volumes, should be the same as Volumes.Count		

		public string Name { get; set; }
		public string Description { get; set; }

		public string Version { get; set; }
		public string Notes { get; set; }

		public string Series { get; set; }
		public string BoxName { get; set; }
		public string Theme { get; set; }

		public int? CollectionId { get; set; } // what collection is this part of

		public ICollection<int> TagIds { get; set; } = new List<int>(); // relevant tags for grouping

		public IFormFile File { get; set; }
	}
}