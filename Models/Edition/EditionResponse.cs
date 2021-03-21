using System;
using System.Collections.Generic;
using Niftified.Entities;

namespace Niftified.Models.Editions
{
	public class EditionResponse
	{
		public int Id { get; set; }
		public int AccountId { get; set; } // account

		public string LanguageCode { get; set; }
		public string HashId { get; set; } // connection to nifty chain
		public string ExternalHashId { get; set; } // id on external block chain?

		public List<Person> Creators { get; set; } // note the sales commision will have to add up to 100%

		public DateTime Created { get; set; } // minted when?
		public DateTime? ExternalCreated { get; set; } // minted in external block chain?
		public DateTime? Updated { get; set; }

		public double SalesCommisionToCreators { get; set; }
		public double SalesCommisionToBlockchain { get; set; }

		public int VolumesCount { get; set; }  // number of volumes, should be the same as Volumes.Count		
		public List<Volume> Volumes { get; set; } // at least one needs to exist

		public string Name { get; set; }
		public string Description { get; set; }
		public string Version { get; set; }
		public string Notes { get; set; }

		public string Series { get; set; }
		public string BoxName { get; set; }
		public string Theme { get; set; }

		public Collection Collection { get; set; } // what collection is this part of

		public List<Tag> Tags { get; set; } // relevant tags for grouping

		public string DataSourcePath { get; set; } // copy of the source when the data is stored in the blockchain
		public string DataSourceFileType { get; set; }
		public string DataSourceFileName { get; set; }
		public long DataSourceFileSize { get; set; }
		public byte[] DataSourceRawData { get; set; } // raw source data (i.e. an image or the protocol that references externally)

		public string ExternalDataSourcePath { get; set; } // source if the data is external to the blockchain (not stored in the blockchain)
		public string ExternalDataSourceFileType { get; set; }
		public string ExternalDataSourceFileName { get; set; }
		public long ExternalDataSourceFileSize { get; set; }
	}
}