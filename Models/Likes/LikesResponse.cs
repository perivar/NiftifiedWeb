using System;
using System.Collections.Generic;
using Niftified.Entities;

namespace Niftified.Models.Likes
{
	public class LikesResponse
	{
		public int AccountId { get; set; }

		public List<int> LikedEditionIds { get; set; }
		public List<int> LikedVolumeIds { get; set; }
		public List<int> LikedWalletIds { get; set; }
	}
}