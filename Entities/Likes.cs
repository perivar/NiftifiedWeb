using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Niftified.Entities
{
	public class Likes
	{
		[Key]
		public int AccountId { get; set; }

		public int[] LikedEditionIds { get; set; }
		public int[] LikedVolumeIds { get; set; }
		public int[] LikedWalletIds { get; set; }
	}
}