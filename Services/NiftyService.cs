using AutoMapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using Niftified.Entities;
using Niftified.Helpers;
using Niftified.Models.Accounts;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace Niftified.Services
{
	public interface INiftyService
	{
		// edition
		EditionResponse GetEditionById(int id);
		bool GetEditionIsEditable(int id);
		EditionResponse CreateEdition(CreateEditionRequest model);
		EditionResponse UpdateEdition(int id, UpdateEditionRequest model);
		IEnumerable<EditionResponse> GetEditions();
		IEnumerable<EditionResponse> GetEditionsByAccountId(int accountId);
		IEnumerable<EditionResponse> GetEditionsByQuery(string query);
		void DeleteEdition(int id);

		// volume
		VolumeResponse GetVolumeById(int id);
		VolumeResponse CreateVolume(CreateVolumeRequest model);
		VolumeResponse UpdateVolume(int id, UpdateVolumeRequest model);
		IEnumerable<VolumeResponse> GetVolumes();
		IEnumerable<VolumeResponse> GetVolumesByEditionId(int editionId);
		void DeleteVolume(int id);

		// collection
		CollectionResponse CreateCollecton(CreateCollectionRequest model);
		IEnumerable<CollectionResponse> GetCollections();
		IEnumerable<CollectionResponse> GetCollectionsByAccountId(int accountId);
		IEnumerable<CollectionResponse> GetCollectionsByAccountId(int accountId, string query);
		void DeleteCollection(int id);

		// tag
		TagResponse CreateTag(CreateTagRequest model);
		IEnumerable<TagResponse> GetTags();
		void DeleteTag(int id);

		// person
		PersonResponse GetPersonById(int id);
		PersonResponse CreatePerson(CreatePersonRequest model);
		PersonResponse UpdatePerson(int id, UpdatePersonRequest model);
		IEnumerable<PersonResponse> GetPersons();
		IEnumerable<PersonResponse> GetPersonsByAccountId(int accountId);
		void DeletePerson(int id);

		// likes
		IEnumerable<LikesResponse> GetLikes();
		LikesResponse GetLikesByAccountId(int accountId);
		LikesResponse CreateLikes(CreateLikesRequest model);
		LikesResponse UpdateLikes(int id, UpdateLikesRequest model);
		void DeleteLikes(int id);

		// wallet
		WalletResponse GetWalletById(int id);
		WalletResponse CreateWallet(CreateWalletRequest model);
		WalletResponse UpdateWallet(int id, UpdateWalletRequest model);
		IEnumerable<WalletResponse> GetWallets();
		IEnumerable<WalletResponse> GetWalletsByPersonId(int personId);
		void DeleteWallet(int id);
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

		public IEnumerable<EditionResponse> GetEditions()
		{
			var editions = _context.Editions
			// .Include(a => a.Volumes)
			;
			return _mapper.Map<IList<EditionResponse>>(editions);
		}

		public IEnumerable<EditionResponse> GetEditionsByAccountId(int accountId)
		{
			var editions = _context.Editions.Where(entity => entity.AccountId == accountId)
			// .Include(a => a.Volumes)
			;
			return _mapper.Map<IList<EditionResponse>>(editions);
		}

		public IEnumerable<EditionResponse> GetEditionsByQuery(string query)
		{
			// TODO support querying tags?

			var editions = _context.Editions
			.Where(
				e => EF.Functions.Like(e.Name, query)
				|| EF.Functions.Like(e.Description, query)
				|| EF.Functions.Like(e.Series, query)
				|| EF.Functions.Like(e.Collection.Name, query)
			)
			// .Include(a => a.Volumes)
			;
			return _mapper.Map<IList<EditionResponse>>(editions);
		}

		public bool GetEditionIsEditable(int id)
		{
			var edition = _context.Editions.Find(id);
			if (edition == null) throw new KeyNotFoundException("Edition not found");

			// Load the volumes related to a given edition 
			_context.Entry(edition).Collection(p => p.Volumes).Load();

			// check if any of the volumes are in "non pending", i.e. minted already
			var isEditable = !edition.Volumes.Any(v => v.Status != VolumeStatus.Pending);
			return isEditable;
		}

		public EditionResponse GetEditionById(int id)
		{
			var edition = _context.Editions.Find(id);
			if (edition == null) throw new KeyNotFoundException("Edition not found");

			// Load the volumes related to a given edition 
			// _context.Entry(edition).Collection(p => p.Volumes).Load();

			// Load the * related to a given edition 
			_context.Entry(edition).Collection(p => p.Tags).Load();
			_context.Entry(edition).Collection(p => p.Creators).Load();
			_context.Entry(edition).Reference(p => p.Collection).Load();

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

			if (model.AccountId == 0)
			{
				throw new AppException($"AccountId '{model.AccountId}' cannot be zero");
			}

			// store file
			if (model.File.Length > 0)
			{
				edition.DataSourceFileType = model.File.ContentType;
				edition.DataSourceFileSize = model.File.Length;

				// get extensions
				var extension = Path.GetExtension(model.File.FileName);

				// random filename with extension
				var fileName = string.Format("{0}{1}", Path.GetRandomFileName().Replace(".", string.Empty), extension);
				var filePath = Path.Combine(_appSettings.StoredFilesPath, fileName);

				using (var stream = System.IO.File.Create(filePath))
				{
					model.File.CopyTo(stream);
				}

				edition.DataSourceFileName = fileName;
				edition.DataSourcePath = filePath;
			}

			// add missing lists that the auto mapper didn't fix
			if (model.CollectionId.HasValue)
			{
				var collection = _context.Collections.Find(model.CollectionId.Value);
				if (collection != null) edition.Collection = collection;
			}

			if (model.TagIds.Any())
			{
				var tags = _context.Tags.Where(r => model.TagIds.Contains(r.Id)).ToList();
				if (tags != null) edition.Tags = tags;
			}

			// owner and creators
			var owner = new Person();
			owner.Created = DateTime.UtcNow;
			var creators = new List<Person>();
			if (model.AccountIsCreator)
			{
				// check if the person object isn't already created
				var person = _context.Persons.Where(p => p.AccountId == model.AccountId).FirstOrDefault();
				if (person != null)
				{
					// reuse existing
					owner = person;
				}
				else
				{
					// create
					var account = _context.Accounts.Find(model.AccountId);
					if (account == null) throw new KeyNotFoundException("Account not found");

					owner.Alias = string.Format("{0} {1}", account.FirstName, account.LastName);
					owner.Status = Status.Active;
					owner.Type = PersonType.Owner;
					owner.AccountId = account.Id;
					owner.SalesCommisionShare = 100;

					// create a person that is both the Sole Creator and original Owner of all volumes
					// owners wallet
				}

				// creators
				creators.Add(owner);
			}
			else
			{
				throw new NotImplementedException("Only AccountIsCreator is Supported at the moment!");
			}

			// add one volume up to VolumeTotal
			var volumes = new List<Volume>();
			for (int i = 0; i < model.VolumesCount; i++)
			{
				var volume = new Volume();
				volume.Created = DateTime.UtcNow;
				volume.EditionNumber = i + 1;

				volume.Owner = owner;
				volume.Status = VolumeStatus.Pending;
				volume.Type = VolumeType.Auction;
				volume.CurrencyUniqueId = model.CurrencyUniqueId;
				volume.Amount = model.Amount;
				volumes.Add(volume);

				// _context.Volumes.Add(volume);
			}

			// set all volumes
			edition.Volumes = volumes;

			// set creators
			edition.Creators = creators;

			// set account
			edition.AccountId = model.AccountId;

			// set commision
			edition.SalesCommisionToCreators = edition.SalesCommisionToCreators > 0 ? edition.SalesCommisionToCreators : _appSettings.DefaultSalesCommissionToCreators;
			edition.SalesCommisionToBlockchain = _appSettings.DefaultSalesCommissionToBlockchain;

			// save edition
			_context.Editions.Add(edition);
			_context.SaveChanges();

			return _mapper.Map<EditionResponse>(edition);
		}

		public EditionResponse UpdateEdition(int id, UpdateEditionRequest model)
		{
			var edition = _context.Editions.Find(id);
			if (edition == null) throw new KeyNotFoundException("Edition not found");

			// Load the * related to a given edition 
			_context.Entry(edition).Collection(p => p.Tags).Load();
			_context.Entry(edition).Collection(p => p.Creators).Load();
			_context.Entry(edition).Reference(p => p.Collection).Load();

			// copy model to edition and save
			_mapper.Map(model, edition);
			edition.Updated = DateTime.UtcNow;

			// add missing lists that the auto mapper didn't fix
			if (model.CollectionId.HasValue)
			{
				var collection = _context.Collections.Find(model.CollectionId.Value);
				if (collection != null) edition.Collection = collection;
			}

			if (model.TagIds.Any())
			{
				var tags = _context.Tags.Where(r => model.TagIds.Contains(r.Id)).ToList();
				if (tags != null) edition.Tags = tags;
			}

			_context.Editions.Update(edition);
			_context.SaveChanges();

			return _mapper.Map<EditionResponse>(edition);
		}

		public void DeleteEdition(int id)
		{
			// cannot delete if any of the volumes are already published/ minted
			if (GetEditionIsEditable(id))
			{
				var edition = _context.Editions.Find(id);
				if (edition == null) throw new KeyNotFoundException("Edition not found");

				// Load the volumes related to a given edition 
				_context.Entry(edition).Collection(p => p.Volumes).Load();

				// and delete
				edition.Volumes.Clear();
				// _context.SaveChanges();

				_context.Editions.Remove(edition);
				_context.SaveChanges();
			}
			else
			{
				throw new KeyNotFoundException("Cannot delete edition if volumes are in a non-pending state");
			}
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

		public CollectionResponse GetCollectionById(int id)
		{
			var collection = _context.Collections.Find(id);
			if (collection == null) throw new KeyNotFoundException("Collection not found");
			return _mapper.Map<CollectionResponse>(collection);
		}

		public IEnumerable<CollectionResponse> GetCollections()
		{
			var collections = _context.Collections;
			return _mapper.Map<IList<CollectionResponse>>(collections);
		}

		public IEnumerable<CollectionResponse> GetCollectionsByAccountId(int accountId)
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
		public void DeleteCollection(int id)
		{
			var collection = _context.Collections.Find(id);
			if (collection == null) throw new KeyNotFoundException("Collection not found");
			_context.Collections.Remove(collection);
			_context.SaveChanges();
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

		public IEnumerable<TagResponse> GetTags()
		{
			var tags = _context.Tags;
			return _mapper.Map<IList<TagResponse>>(tags);
		}

		public void DeleteTag(int id)
		{
			var tag = _context.Tags.Find(id);
			if (tag == null) throw new KeyNotFoundException("Tag not found");
			_context.Tags.Remove(tag);
			_context.SaveChanges();
		}

		// persons
		public IEnumerable<PersonResponse> GetPersons()
		{
			var persons = _context.Persons;
			return _mapper.Map<IList<PersonResponse>>(persons);
		}

		public PersonResponse GetPersonById(int id)
		{
			var person = _context.Persons.Find(id);
			if (person == null) throw new KeyNotFoundException("Person not found");
			return _mapper.Map<PersonResponse>(person);
		}

		public IEnumerable<PersonResponse> GetPersonsByAccountId(int accountId)
		{
			var persons = _context.Persons.Where(entity => entity.AccountId == accountId);
			return _mapper.Map<IList<PersonResponse>>(persons);
		}

		public PersonResponse CreatePerson(CreatePersonRequest model)
		{
			// validate
			if (_context.Persons.Any(x => x.Alias == model.Alias))
				throw new AppException($"Alias '{model.Alias}' is already registered");

			// map model to new object
			var person = _mapper.Map<Person>(model);
			person.Created = DateTime.UtcNow;

			// create wallet
			var wallet = new Wallet();
			wallet.PrivateKeyEncrypted = model.PrivateKeyEncrypted;
			wallet.PrivateKeyWIFEncrypted = model.PrivateKeyWIFEncrypted;
			wallet.PublicAddress = model.PublicAddress;
			wallet.PublicKey = model.PublicKey;
			wallet.PublicKeyHash = model.PublicKeyHash;

			var wallets = new List<Wallet>();
			wallets.Add(wallet);

			// and add to person
			person.Wallets = wallets;

			// save 
			_context.Persons.Add(person);
			_context.SaveChanges();

			return _mapper.Map<PersonResponse>(person);
		}

		public PersonResponse UpdatePerson(int id, UpdatePersonRequest model)
		{
			var person = _context.Persons.Find(id);
			if (person == null) throw new KeyNotFoundException("Person not found");

			// validate
			if (_context.Persons.Any(x => x.Alias == model.Alias))
				throw new AppException($"Alias '{model.Alias}' is already registered");

			// copy model to edition and save
			_mapper.Map(model, person);
			person.Updated = DateTime.UtcNow;
			_context.Persons.Update(person);
			_context.SaveChanges();

			return _mapper.Map<PersonResponse>(person);
		}

		public void DeletePerson(int id)
		{
			var person = _context.Persons.Find(id);
			if (person == null) throw new KeyNotFoundException("Person not found");
			_context.Persons.Remove(person);
			_context.SaveChanges();
		}

		// likes
		public IEnumerable<LikesResponse> GetLikes()
		{
			var likes = _context.Likes;
			return _mapper.Map<IList<LikesResponse>>(likes);
		}

		public LikesResponse GetLikesByAccountId(int id)
		{
			var likes = _context.Likes.Find(id);
			if (likes == null) throw new KeyNotFoundException("Likes not found");
			return _mapper.Map<LikesResponse>(likes);
		}

		public LikesResponse CreateLikes(CreateLikesRequest model)
		{
			// validate
			if (_context.Likes.Any(x => x.AccountId == model.AccountId))
				throw new AppException($"Likes '{model.AccountId}' is already registered");

			// map model to new object
			var likes = _mapper.Map<Likes>(model);

			// save 
			_context.Likes.Add(likes);
			_context.SaveChanges();

			return _mapper.Map<LikesResponse>(likes);
		}

		public LikesResponse UpdateLikes(int id, UpdateLikesRequest model)
		{
			var likes = _context.Likes.Find(id);
			if (likes == null) throw new KeyNotFoundException("Likes not found");

			// validate
			if (_context.Persons.Any(x => x.AccountId == model.AccountId))
				throw new AppException($"Likes '{model.AccountId}' is already registered");

			// copy model to edition and save
			_mapper.Map(model, likes);
			_context.Likes.Update(likes);
			_context.SaveChanges();

			return _mapper.Map<LikesResponse>(likes);
		}

		public void DeleteLikes(int id)
		{
			var likes = _context.Likes.Find(id);
			if (likes == null) throw new KeyNotFoundException("Likes not found");
			_context.Likes.Remove(likes);
			_context.SaveChanges();
		}

		// volume
		public VolumeResponse GetVolumeById(int id)
		{
			var volume = _context.Volumes.Find(id);
			if (volume == null) throw new KeyNotFoundException("Volume not found");
			return _mapper.Map<VolumeResponse>(volume);
		}

		public VolumeResponse CreateVolume(CreateVolumeRequest model)
		{
			// validate
			if (_context.Volumes.Any(x => x.EditionId == model.EditionId && x.EditionNumber == model.EditionNumber))
				throw new AppException($"Volume '{model.EditionId}:{model.EditionNumber}' is already registered");

			// map model to new object
			var volume = _mapper.Map<Volume>(model);
			volume.Created = DateTime.UtcNow;

			// save 
			_context.Volumes.Add(volume);
			_context.SaveChanges();

			return _mapper.Map<VolumeResponse>(volume);
		}

		public VolumeResponse UpdateVolume(int id, UpdateVolumeRequest model)
		{
			var volume = _context.Volumes.Find(id);
			if (volume == null) throw new KeyNotFoundException("Volume not found");

			// validate
			if (_context.Volumes.Any(x => x.EditionId == model.EditionId && x.EditionNumber == model.EditionNumber))
				throw new AppException($"Volume '{model.EditionId}:{model.EditionNumber}' is already registered");

			// copy model to edition and save
			_mapper.Map(model, volume);
			volume.Updated = DateTime.UtcNow;
			_context.Volumes.Update(volume);
			_context.SaveChanges();

			return _mapper.Map<VolumeResponse>(volume);
		}

		public IEnumerable<VolumeResponse> GetVolumes()
		{
			var volumes = _context.Volumes.Include(v => v.Owner);
			return _mapper.Map<IList<VolumeResponse>>(volumes);
		}

		public IEnumerable<VolumeResponse> GetVolumesByEditionId(int editionId)
		{
			var volumes = _context.Volumes.Where(entity => entity.EditionId == editionId)
			.Include(v => v.Owner);
			return _mapper.Map<IList<VolumeResponse>>(volumes);
		}

		public void DeleteVolume(int id)
		{
			var volume = _context.Volumes.Find(id);
			if (volume == null) throw new KeyNotFoundException("Volume not found");
			_context.Volumes.Remove(volume);
			_context.SaveChanges();
		}

		// wallet
		public WalletResponse GetWalletById(int id)
		{
			var wallet = _context.Wallets.Find(id);
			if (wallet == null) throw new KeyNotFoundException("Wallet not found");
			return _mapper.Map<WalletResponse>(wallet);
		}

		public WalletResponse CreateWallet(CreateWalletRequest model)
		{
			// validate
			if (_context.Wallets.Any(x => x.Name == model.Name))
				throw new AppException($"Wallet '{model.Name}:{model.Name}' is already registered");

			// map model to new object
			var wallet = _mapper.Map<Wallet>(model);
			wallet.Created = DateTime.UtcNow;

			// save 
			_context.Wallets.Add(wallet);
			_context.SaveChanges();

			return _mapper.Map<WalletResponse>(wallet);
		}

		public WalletResponse UpdateWallet(int id, UpdateWalletRequest model)
		{
			var wallet = _context.Wallets.Find(id);
			if (wallet == null) throw new KeyNotFoundException("Wallet not found");

			// validate
			if (_context.Wallets.Any(x => x.Name == model.Name))
				throw new AppException($"Wallet '{model.Name}:{model.Name}' is already registered");

			// copy model to edition and save
			_mapper.Map(model, wallet);
			wallet.Updated = DateTime.UtcNow;
			_context.Wallets.Update(wallet);
			_context.SaveChanges();

			return _mapper.Map<WalletResponse>(wallet);
		}

		public IEnumerable<WalletResponse> GetWallets()
		{
			var wallets = _context.Wallets;
			return _mapper.Map<IList<WalletResponse>>(wallets);
		}

		public IEnumerable<WalletResponse> GetWalletsByPersonId(int personId)
		{
			var wallets = _context.Wallets.Where(entity => entity.PersonId == personId);
			return _mapper.Map<IList<WalletResponse>>(wallets);
		}

		public void DeleteWallet(int id)
		{
			var wallet = _context.Wallets.Find(id);
			if (wallet == null) throw new KeyNotFoundException("Wallet not found");
			_context.Wallets.Remove(wallet);
			_context.SaveChanges();
		}
	}
}