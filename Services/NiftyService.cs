using AutoMapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using Niftified.Entities;
using Niftified.Helpers;
using Niftified.Models.Accounts;
using System.Linq;

namespace Niftified.Services
{
	public interface INiftyService
	{
		// edition
		IEnumerable<EditionResponse> GetAllEditions();
		EditionResponse GetEditionById(int id);
		EditionResponse CreateEdition(CreateEditionRequest model);
		EditionResponse UpdateEdition(int id, UpdateEditionRequest model);
		void DeleteEdition(int id);

		// collection
		CollectionResponse CreateCollecton(CreateCollectionRequest model);
		IEnumerable<CollectionResponse> GetAllCollections();
		IEnumerable<CollectionResponse> GetAllCollectionsByAccountId(int accountId);
		IEnumerable<CollectionResponse> GetCollectionsByAccountId(int accountId, string query);

		// tag
		TagResponse CreateTag(CreateTagRequest model);
		IEnumerable<TagResponse> GetAllTags();
	}

	public class NiftyService : INiftyService
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;
		private readonly AppSettings _appSettings;

		public NiftyService(
			DataContext context,
			IMapper mapper,
			IOptions<AppSettings> appSettings)
		{
			_context = context;
			_mapper = mapper;
			_appSettings = appSettings.Value;
		}

		public IEnumerable<EditionResponse> GetAllEditions()
		{
			var accounts = _context.Accounts;
			return _mapper.Map<IList<EditionResponse>>(accounts);
		}

		public EditionResponse GetEditionById(int id)
		{
			var edition = _context.Editions.Find(id);
			if (edition == null) throw new KeyNotFoundException("Edition not found");
			return _mapper.Map<EditionResponse>(edition);
		}

		public EditionResponse CreateEdition(CreateEditionRequest model)
		{
			// validate
			if (_context.Editions.Any(x => x.Name == model.Name))
				throw new AppException($"Name '{model.Name}' is already registered");

			// map model to new edition object
			var edition = _mapper.Map<Edition>(model);
			edition.Created = DateTime.UtcNow;

			// add one volume up to VolumeTotal
			var volumes = new List<Volume>();
			for (int i = 0; i < model.VolumeTotal; i++)
			{
				var volume = new Volume();
				volume.Created = DateTime.UtcNow;

				// owner
				var owner = new Person();
				owner.Alias = "owner1";
				owner.Status = Status.Active;
				owner.Type = PersonType.Owner;

				// owners wallet
				// var wallet = new Wallet();

				volume.Owner = owner;
				volume.Status = VolumeStatus.ForSale;
				volume.Type = VolumeType.FixedPrice;
				volume.EditionNumber = i;
				// _context.Volumes.Add(volume);
			}
			edition.Volumes = volumes;

			// creator
			var creators = new List<Person>();
			var creator = new Person();
			creator.Alias = "creator1";
			creator.Status = Status.Active;
			creator.Type = PersonType.Creator;
			creators.Add(creator);

			edition.Creators = creators;

			// save edition
			_context.Editions.Add(edition);
			_context.SaveChanges();

			return _mapper.Map<EditionResponse>(edition);
		}

		public EditionResponse UpdateEdition(int id, UpdateEditionRequest model)
		{
			var edition = _context.Editions.Find(id);
			if (edition == null) throw new KeyNotFoundException("Edition not found");

			// validate
			if (_context.Editions.Any(x => x.Name == model.Name))
				throw new AppException($"Name '{model.Name}' is already registered");

			// copy model to edition and save
			_mapper.Map(model, edition);
			edition.Updated = DateTime.UtcNow;
			_context.Editions.Update(edition);
			_context.SaveChanges();

			return _mapper.Map<EditionResponse>(edition);
		}

		public void DeleteEdition(int id)
		{
			var edition = _context.Editions.Find(id);
			if (edition == null) throw new KeyNotFoundException("Edition not found");
			_context.Editions.Remove(edition);
			_context.SaveChanges();
		}

		// collection
		public CollectionResponse CreateCollecton(CreateCollectionRequest model)
		{
			// validate
			if (_context.Collections.Any(x => x.Name == model.Name))
				throw new AppException($"Name '{model.Name}' is already registered");

			// map model to new object
			var collection = _mapper.Map<Collection>(model);

			// save 
			_context.Collections.Add(collection);
			_context.SaveChanges();

			return _mapper.Map<CollectionResponse>(collection);
		}

		public IEnumerable<CollectionResponse> GetAllCollections()
		{
			var collections = _context.Collections;
			return _mapper.Map<IList<CollectionResponse>>(collections);
		}

		public IEnumerable<CollectionResponse> GetAllCollectionsByAccountId(int accountId)
		{
			var collections = _context.Collections.Where(entity => entity.AccountId == accountId);
			return _mapper.Map<IList<CollectionResponse>>(collections);
		}

		public IEnumerable<CollectionResponse> GetCollectionsByAccountId(int accountId, string query)
		{
			var collections = _context.Collections
			.Where(entity => entity.AccountId == accountId && entity.Name.ToLower().Contains(query.ToLower()));
			return _mapper.Map<IList<CollectionResponse>>(collections);
		}

		// tag
		public TagResponse CreateTag(CreateTagRequest model)
		{
			// validate
			if (_context.Tags.Any(x => x.Name == model.Name))
				throw new AppException($"Name '{model.Name}' is already registered");

			// map model to new object
			var tag = _mapper.Map<Tag>(model);

			// save 
			_context.Tags.Add(tag);
			_context.SaveChanges();

			return _mapper.Map<TagResponse>(tag);
		}

		public IEnumerable<TagResponse> GetAllTags()
		{
			var tags = _context.Tags;
			return _mapper.Map<IList<TagResponse>>(tags);
		}

	}
}
