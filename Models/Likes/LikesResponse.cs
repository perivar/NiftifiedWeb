using System;
using System.Collections.Generic;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class LikesResponse
	{
		public int AccountId { get; set; }

		public List<int> LikedEditionIds { get; set; }
		public List<int> LikedVolumeIds { get; set; }
		public List<int> LikedPersonIds { get; set; }
	}
}