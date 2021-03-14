using System.Linq;
using AutoMapper;
using Niftified.Entities;
using Niftified.Models.Accounts;

namespace Niftified.Helpers
{
	public class AutoMapperProfile : Profile
	{
		// mappings between model and entity objects
		public AutoMapperProfile()
		{
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

			// person
			CreateMap<Person, PersonResponse>();

			CreateMap<CreatePersonRequest, Person>();

			CreateMap<UpdatePersonRequest, Person>()
				.ForAllMembers(x => x.Condition(
					(src, dest, prop) =>
					{
						// ignore null & empty string properties
						if (prop == null) return false;
						if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

						return true;
					}
				));

			// likes
			CreateMap<Likes, LikesResponse>();

			CreateMap<CreateLikesRequest, Likes>();

			CreateMap<UpdateLikesRequest, Likes>();

		}
	}
}