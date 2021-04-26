using System.Linq;
using AutoMapper;
using Niftified.Entities;
using Niftified.Models.Accounts;
using Niftified.Models.Wallets;
using Niftified.Models.Editions;
using Niftified.Models.Volumes;
using Niftified.Models.Tags;
using Niftified.Models.Collections;
using Niftified.Models.Likes;

namespace Niftified.Helpers
{
	public class AutoMapperProfile : Profile
	{
		// mappings between model and entity objects
		public AutoMapperProfile()
		{
			// account and authentication
			CreateMap<Account, AccountResponse>();

			CreateMap<Account, AuthenticateResponse>();

			CreateMap<RegisterRequest, Account>();

			CreateMap<CreateRequest, Account>();

			CreateMap<UpdateRequest, Account>()
				.ForAllMembers(x => x.Condition(
					(src, dest, prop) =>
					{
						// ignore null & empty string properties
						if (prop == null) return false;
						if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

						// ignore null role
						if (x.DestinationMember.Name == "Role" && src.Role == null) return false;

						return true;
					}
				));

			// edition
			CreateMap<Edition, EditionResponse>();

			CreateMap<CreateEditionRequest, Edition>();

			CreateMap<UpdateEditionRequest, Edition>()
				.ForAllMembers(x => x.Condition(
					(src, dest, prop) =>
					{
						// ignore null & empty string properties
						if (prop == null) return false;
						if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

						return true;
					}
				));

			// collection
			CreateMap<Collection, CollectionResponse>();

			CreateMap<CreateCollectionRequest, Collection>();

			// tag
			CreateMap<Tag, TagResponse>();

			CreateMap<CreateTagRequest, Tag>();

			// likes
			CreateMap<Likes, LikesResponse>();

			CreateMap<CreateLikesRequest, Likes>();

			CreateMap<UpdateLikesRequest, Likes>();

			// volume
			CreateMap<Volume, VolumeResponse>();

			CreateMap<CreateVolumeRequest, Volume>();

			CreateMap<UpdateVolumeRequest, Volume>()
				.ForAllMembers(x => x.Condition(
					(src, dest, prop) =>
					{
						// ignore null & empty string properties
						if (prop == null) return false;
						if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

						return true;
					}
				));

			// wallet
			CreateMap<Wallet, WalletResponse>();

			CreateMap<CreateWalletRequest, Wallet>();

			CreateMap<UpdateWalletRequest, Wallet>()
				.ForAllMembers(x => x.Condition(
					(src, dest, prop) =>
					{
						// ignore null & empty string properties
						if (prop == null) return false;
						if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

						return true;
					}
				));

		}
	}
}