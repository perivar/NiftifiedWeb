using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class CreateEditionRequest
	{
		[Required]
		public string LanguageCode { get; set; }

		public string HashId { get; set; } // connection to nifty chain
		public string ExternalHashId { get; set; } // id on external block chain?

		[Required]
		public List<int> CreatorIds { get; set; } // note the sales commision will have to add up to 100%

		public double SalesCommisionToCreators { get; set; }
		public double SalesCommisionToBlockchain { get; set; }


		[Required]
		public int VolumeTotal { get; set; } // how many volumes to create, could be only one

		[Required]
		public string Name { get; set; }
		[Required]
		public string Description { get; set; }

		public string Version { get; set; }
		public string Notes { get; set; }

		public string Series { get; set; }
		public string BoxName { get; set; }
		public string Theme { get; set; }

		public int CollectionId { get; set; } // what collection is this part of

		public List<int> TagIds { get; set; } // relevant tags for grouping

		public string DataSource { get; set; } // copy of the source when the data is stored in the blockchain
		public byte[] DataSourceRawData { get; set; } // raw source data (i.e. an image or the protocol that references externally)

		public string ExternalDataSource { get; set; } // source if the data is external to the blockchain (not stored in the blockchain)
		public string ExternalDataSourceFileType { get; set; }
	}
}