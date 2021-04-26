using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Likes
{
	public class CreateLikesRequest
	{
		[Required]
		public int AccountId { get; set; }

		public ICollection<int> LikedEditionIds { get; set; } = new List<int>();
		public ICollection<int> LikedVolumeIds { get; set; } = new List<int>();
		public ICollection<int> LikedWalletIds { get; set; } = new List<int>();
	}
}