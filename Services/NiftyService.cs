using AutoMapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using Niftified.Entities;
using Niftified.Helpers;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.IO;

using Niftified.Models.Wallets;
using Niftified.Models.Editions;
using Niftified.Models.Volumes;
using Niftified.Models.Tags;
using Niftified.Models.Collections;
using Niftified.Models.Likes;

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
		KeyValuePair<int, IEnumerable<VolumeResponse>> GetVolumesByEditionId(int editionId, int pageNumber, int pageSize);

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
		IEnumerable<WalletResponse> GetWalletsByAccountId(int accountId);
		void DeleteWallet(int id);

		// file
		FileResponse CreateFile(CreateFileRequest model);

		// token icon
		TokenIconResponse CreateTokenIcon(CreateTokenIconRequest model);
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
			var editionsByAccountId = _context.Editions.Where(entity => entity.AccountId == accountId);

			// return with volume count instead of the actual volumes
			var editionsVolumeCount = editionsByAccountId.Select(e => new { Edition = e, VolumeCount = e.Volumes.Count() }).ToList();

			var editionsRes = new List<EditionResponse>();
			foreach (var editionGroup in editionsVolumeCount)
			{
				// map model to new edition object
				var editionRes = _mapper.Map<EditionResponse>(editionGroup.Edition);
				editionRes.VolumeCount = editionGroup.VolumeCount;
				editionsRes.Add(editionRes);
			}

			return editionsRes;
		}

		public IEnumerable<EditionResponse> GetEditionsByQuery(string query)
		{
			// TODO support querying tags?

			var editions = _context.Editions
			.Where(
				e => EF.Functions.Like(e.Name, $"%{query}%")
				|| EF.Functions.Like(e.Description, $"%{query}%")
				|| EF.Functions.Like(e.Series, $"%{query}%")
				|| EF.Functions.Like(e.Collection.Name, $"%{query}%")
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

			// Don't load the volumes related to a given edition 
			// _context.Entry(edition).Collection(p => p.Volumes).Load();
			// but load the count
			var volumeCount = _context.Entry(edition).Collection(p => p.Volumes).Query().Count();

			// Load the * related to a given edition 
			_context.Entry(edition).Collection(p => p.Tags).Load();

			// load creator with wallet
			_context.Entry(edition).Collection(p => p.Creators)
			.Query()
			.Include(c => c.Wallet)
			.Load();

			// and collection
			_context.Entry(edition).Reference(p => p.Collection).Load();

			var response = _mapper.Map<EditionResponse>(edition);
			response.VolumeCount = volumeCount;

			return response;
		}

		public EditionResponse CreateEdition(CreateEditionRequest model)
		{
			// validate
			if (model.AccountId == 0)
			{
				throw new AppException($"AccountId '{model.AccountId}' cannot be zero");
			}
			if (_context.Editions.Any(x => x.Name == model.Name && x.AccountId == model.AccountId))
			{
				throw new AppException($"Name '{model.Name}' has already been registered by the same account");
			}

			// map model to new edition object
			var edition = _mapper.Map<Edition>(model);
			edition.Created = DateTime.UtcNow;

			// store file
			if (model.File != null && model.File.Length > 0)
			{
				edition.DataSourceFileType = model.File.ContentType;
				edition.DataSourceFileSize = model.File.Length;

				// get extensions
				var extension = Path.GetExtension(model.File.FileName);

				// random filename with extension
				var fileName = string.Format("{0}{1}", Path.GetRandomFileName().Replace(".", string.Empty), extension);
				var filePath = Path.Combine(_appSettings.StoredFilesPath, fileName);

				// create the StoredFilesPath directory, if it doesn't already exist
				string storedFilesDir = Path.GetDirectoryName(filePath);
				if (!Directory.Exists(storedFilesDir))
				{
					Directory.CreateDirectory(storedFilesDir);
				}

				using (var stream = System.IO.File.Create(filePath))
				{
					model.File.CopyTo(stream);
				}

				edition.DataSourceFileName = fileName;
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

			/// OWNER
			Wallet ownerWallet = null;
			if (model.OwnerWalletId > 0)
			{
				ownerWallet = _context.Wallets.Find(model.OwnerWalletId);
			}
			if (ownerWallet == null)
			{
				// var owner = _context.Wallets.Where(p => p.AccountId == model.AccountId).Include(p => p.Wallets).FirstOrDefault();
				throw new AppException("Owner not found!");
			}

			// CREATORS
			var creators = new List<Creator>();
			if (model.CreatorWalletIds.Any() &&
				model.CreatorCommissionShares.Any() &&
				model.CreatorWalletIds.Count == model.CreatorCommissionShares.Count)
			{
				// we don't need to check if any creators already exist, since the edition and wallet id is unique
				for (int i = 0; i < model.CreatorWalletIds.Count; i++)
				{
					var walletId = model.CreatorWalletIds[i];
					var salesCommissionShare = model.CreatorCommissionShares[i];
					var creatorType = model.CreatorWalletTypes[i];

					var creatorWallet = _context.Wallets.Find(walletId);

					var creator = new Creator();
					creator.Edition = edition;
					creator.WalletId = walletId;
					creator.SalesCommissionShare = salesCommissionShare;
					creator.Type = (CreatorType)creatorType;
					creators.Add(creator);
				}
			}
			else
			{
				// something is wrong
				throw new AppException("The Creators ids and the Creators commision shares needs to exist and have the same count!");
			}

			// add volumes up to VolumeTotal
			var volumes = new List<Volume>();
			for (int i = 0; i < model.VolumeCount; i++)
			{
				var volume = new Volume();
				volume.Created = DateTime.UtcNow;
				volume.EditionNumber = i + 1;

				volume.OwnerWallet = ownerWallet;
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

			// set commission
			edition.SalesCommissionToCreators = edition.SalesCommissionToCreators > 0 ? edition.SalesCommissionToCreators : _appSettings.DefaultSalesCommissionToCreators;
			edition.SalesCommissionToBlockchain = _appSettings.DefaultSalesCommissionToBlockchain;

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

			var creators = new List<Creator>();
			if (model.CreatorWalletIds.Any() &&
				model.CreatorCommissionShares.Any() &&
				model.CreatorWalletIds.Count == model.CreatorCommissionShares.Count)
			{
				// we don't need to check if any creators already exist, since the edition and wallet id is unique
				for (int i = 0; i < model.CreatorWalletIds.Count; i++)
				{
					var walletId = model.CreatorWalletIds[i];
					var salesCommissionShare = model.CreatorCommissionShares[i];
					var creatorType = model.CreatorWalletTypes[i];

					var creatorWallet = _context.Wallets.Find(walletId);

					var creator = new Creator();
					creator.Edition = edition;
					creator.WalletId = walletId;
					creator.SalesCommissionShare = salesCommissionShare;
					creator.Type = (CreatorType)creatorType;
					creators.Add(creator);
				}

				if (creators.Count > 0) edition.Creators = creators;
			}
			else
			{
				// something is wrong
				throw new AppException("The creators ids and the creators shares needs to exist and have the same count!");
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
			if (_context.Wallets.Any(x => x.AccountId == model.AccountId))
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
			var volumes = _context.Volumes.Include(v => v.OwnerWallet);
			return _mapper.Map<IList<VolumeResponse>>(volumes);
		}

		public IEnumerable<VolumeResponse> GetVolumesByEditionId(int editionId)
		{
			var volumes = _context.Volumes.Where(entity => entity.EditionId == editionId)
			.Include(v => v.OwnerWallet);
			return _mapper.Map<IList<VolumeResponse>>(volumes);
		}

		public KeyValuePair<int, IEnumerable<VolumeResponse>> GetVolumesByEditionId(int editionId, int pageIndex, int pageSize)
		{
			// this method supports paging, and returns the total count as well
			var query = _context.Volumes.Where(entity => entity.EditionId == editionId);

			// get total result count prior to sorting
			int count = query.Count();

			// sort and paginate
			var page = query.OrderBy(v => v.EditionNumber)
			.Skip((pageIndex - 1) * pageSize)
			.Take(pageSize)
			.Include(v => v.OwnerWallet);

			var volumes = page.Select(p => p);

			return new KeyValuePair<int, IEnumerable<VolumeResponse>>(count, _mapper.Map<IList<VolumeResponse>>(volumes));
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
			if (_context.Wallets.Any(x => x.PublicAddress == model.PublicAddress))
				throw new AppException($"Wallet '{model.PublicAddress}' is already registered");

			// map model to new object
			var wallet = _mapper.Map<Wallet>(model);
			wallet.Created = DateTime.UtcNow;

			// check that all the crypto values exist
			string[] inputs = {
				model.PrivateKeyEncrypted,
				model.PrivateKeyWIFEncrypted,
				model.PrivateMnemonicEncrypted,
				model.PublicAddress,
				model.PublicKey,
				model.PublicKeyHash};


			if (!_appSettings.IgnoreWindowsCryptoHttpsRequirement && inputs.Any(cryptoValue => string.IsNullOrWhiteSpace(cryptoValue)))
			{
				throw new AppException($"None of the wallet crypto values can be empty", model);
			}

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
			// if (_context.Wallets.Any(x => x.Name == model.Name))
			// 	throw new AppException($"Wallet '{model.Name}' is already registered");

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

		public IEnumerable<WalletResponse> GetWalletsByAccountId(int accountId)
		{
			var wallets = _context.Wallets.Where(entity => entity.AccountId == accountId);
			return _mapper.Map<IList<WalletResponse>>(wallets);
		}

		public void DeleteWallet(int id)
		{
			var wallet = _context.Wallets.Find(id);
			if (wallet == null) throw new KeyNotFoundException("Wallet not found");
			_context.Wallets.Remove(wallet);
			_context.SaveChanges();
		}

		public FileResponse CreateFile(CreateFileRequest model)
		{
			// store file
			var file = new FileResponse();
			if (model.File != null && model.File.Length > 0)
			{
				file.DataSourceFileType = model.File.ContentType;
				file.DataSourceFileSize = model.File.Length;

				// get extensions
				var extension = Path.GetExtension(model.File.FileName);

				string fileNameNoExtension = "";
				if ("".Equals(model.FileId))
				{
					fileNameNoExtension = model.FileId;
				}
				else
				{
					fileNameNoExtension = Path.GetRandomFileName().Replace(".", string.Empty);
				}

				var fileName = string.Format("{0}{1}", fileNameNoExtension, extension);
				var filePath = Path.Combine(_appSettings.StoredFilesPath, fileName);

				// create the StoredFilesPath directory, if it doesn't already exist
				string storedFilesDir = Path.GetDirectoryName(filePath);
				if (!Directory.Exists(storedFilesDir))
				{
					Directory.CreateDirectory(storedFilesDir);
				}

				using (var stream = System.IO.File.Create(filePath))
				{
					model.File.CopyTo(stream);
				}

				file.DataSourceFileName = fileName;
			}
			return file;
		}

		public TokenIconResponse CreateTokenIcon(CreateTokenIconRequest model)
		{
			// store file
			var file = new TokenIconResponse();
			if (model.TokenIcon != null && model.TokenIcon.Length > 0)
			{
				file.DataSourceFileType = model.TokenIcon.ContentType;
				file.DataSourceFileSize = model.TokenIcon.Length;

				// get extensions
				var extension = Path.GetExtension(model.TokenIcon.FileName);
				var fileName = string.Format("{0}{1}", model.TokenId, extension);
				var filePath = Path.Combine(_appSettings.StoredFilesPath, fileName);

				// create the StoredFilesPath directory, if it doesn't already exist
				string storedFilesDir = Path.GetDirectoryName(filePath);
				if (!Directory.Exists(storedFilesDir))
				{
					Directory.CreateDirectory(storedFilesDir);
				}

				using (var stream = System.IO.File.Create(filePath))
				{
					model.TokenIcon.CopyTo(stream);
				}

				file.DataSourceFileName = fileName;

				// the original mint.niftycoin.org expects the approvalRequested to be set
				file.ApprovalRequested = true;
			}
			return file;
		}
	}
}
