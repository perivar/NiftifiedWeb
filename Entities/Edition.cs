using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Edition
	{
		public int Id { get; set; }
		public string LanguageCode { get; set; }
		public string HashId { get; set; } // connection to nifty chain
		public string ExternalHashId { get; set; } // id on external block chain?
		public int CreatorId { get; set; }
		public Person Creator { get; set; }
		public List<Person> CoCreators { get; set; }

		public DateTime Created { get; set; } // minted when?
		public DateTime? ExternalCreated { get; set; } // minted in external block chain?

		public double SalesCommisionToCreator { get; set; } // note that all commisions for creator and co-creators cannot exceed 100%
		public double SalesCommisionToBlockchain { get; set; }

		public int EditionTotal { get; set; } // 35

		public string Name { get; set; }
		public string Description { get; set; }
		public string Version { get; set; }
		public string Notes { get; set; }

		public string Series { get; set; }
		public string BoxName { get; set; }
		public string Theme { get; set; }

		public int CollectionId { get; set; }
		public Collection Collection { get; set; }

		public List<Tag> Tags { get; set; }

		public string DataSource { get; set; } // copy of the source when the data is stored in the blockchain
		public string ExternalDataSource { get; set; } // source if the data is external to the blockchain (stored in the blockchain)
		public string ExternalDataSourceFileType { get; set; }

		// Other owners
		// 4 editions on sale for 0.4 ETH by razzilcrypto
		// 3 editions in wallet. Not for sale by Janus-Faced
		// => find out through same edition id

		// History
		// Bought 3 editions for 0.15 ETH 2 minutes ago by Janus-Faced
		// Offer cancelled 1 days ago by 0x54ec6aa23...0be4
		// Offered 1 WETH for 1 edition 1 days ago by 0x2ace7105b...345c
		// Offered 0.3 WETH for 1 edition 1 days ago by 0x54ec6aa23...0be4
		// Offered 1.01 WETH for 1 edition 1 days ago by 0x9fd2f92b9...3600
		// Put on Sale for 0.15 NFY 19 minutes ago by lakshepassion
		// Minted 2 hours ago by Silvia Puff cuties (a whole batch)
		// => find out through same edition id (note edition needs minted date)

		// Bids
		// Last Bid
		// 3 editions in wallet, not for sale by storm
		// 0.16 WETH by The Collector
		// 1.5 WETH expired by 0xb52e2dbf7...ae06
		// 1.25 WETH by C.Camaro
		// 1.01 WETH expired by 0x9fd2f92b9...3600

		// Service fee 2.5%. 0.246 ETH $430.37
	}

}