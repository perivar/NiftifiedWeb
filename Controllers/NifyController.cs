using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Niftified.Entities;
using Niftified.Models.Accounts;
using Niftified.Services;
using System.Linq;
using System.Security.Claims;
using Niftified.Helpers;

using Niftified.Models.Persons;
using Niftified.Models.Wallets;
using Niftified.Models.Editions;
using Niftified.Models.Volumes;
using Niftified.Models.Tags;
using Niftified.Models.Collections;
using Niftified.Models.Likes;

namespace Niftified.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class NiftyController : BaseController
	{
		private readonly INiftyAccountService _accountService;
		private readonly INiftyService _niftyService;
		private readonly IMapper _mapper;

		public NiftyController(
  			INiftyAccountService accountService,
			INiftyService niftyService,
			IMapper mapper)
		{
			_accountService = accountService;
			_niftyService = niftyService;
			_mapper = mapper;
		}

		[Authorize]
		[HttpGet("/api/collections/")]
		public ActionResult<IEnumerable<CollectionResponse>> GetCollections()
		{
			var collections = _niftyService.GetCollections();
			return Ok(collections);
		}

		[Authorize]
		[HttpGet("/api/collections/{accountId:int}")]
		public ActionResult<IEnumerable<CollectionResponse>> GetCollectionsByAccountId(int accountId)
		{
			var collections = _niftyService.GetCollectionsByAccountId(accountId);
			return Ok(collections);
		}

		[Authorize]
		[HttpGet("/api/collections/{accountId:int}/{query}")]
		public ActionResult<IEnumerable<CollectionResponse>> GetCollectionsByAccountId(int accountId, string query)
		{
			var collections = _niftyService.GetCollectionsByAccountId(accountId, query);
			return Ok(collections);
		}

		[Authorize]
		[HttpPost("/api/collection/")]
		public ActionResult<CollectionResponse> CreateCollection(CreateCollectionRequest model)
		{
			var collection = _niftyService.CreateCollecton(model);
			return Ok(collection);
		}

		[Authorize]
		[HttpGet("/api/tags/")]
		public ActionResult<IEnumerable<TagResponse>> GetTags()
		{
			var tags = _niftyService.GetTags();
			return Ok(tags);
		}

		[Authorize]
		[HttpPost("/api/tag/")]
		public ActionResult<TagResponse> CreateTag(CreateTagRequest model)
		{
			var tag = _niftyService.CreateTag(model);
			return Ok(tag);
		}

		[HttpGet("/api/editions/")]
		public ActionResult<IEnumerable<EditionResponse>> GetEditions()
		{
			var editions = _niftyService.GetEditions();
			return Ok(editions);
		}

		[HttpGet("/api/editions/{query}")]
		public ActionResult<IEnumerable<EditionResponse>> GetEditionsByQuery(string query)
		{
			var editions = _niftyService.GetEditionsByQuery(query);
			return Ok(editions);
		}

		[Authorize]
		[HttpGet("/api/editions/{accountId:int}")]
		public ActionResult<IEnumerable<EditionResponse>> GetEditionsByAccountId(int accountId)
		{
			var editions = _niftyService.GetEditionsByAccountId(accountId);
			return Ok(editions);
		}

		[HttpGet("/api/edition/{id:int}")]
		public ActionResult<EditionResponse> GetEditionById(int id)
		{
			var edition = _niftyService.GetEditionById(id);
			return Ok(edition);
		}

		[Authorize]
		[HttpGet("/api/edition/iseditable/{id:int}")]
		public ActionResult<bool> GetEditionIsEditable(int id)
		{
			var isEditable = _niftyService.GetEditionIsEditable(id);
			return Ok(new { id, isEditable });
		}

		[Authorize]
		[HttpPost("/api/edition/")]
		public ActionResult<EditionResponse> CreateEdition([FromForm] CreateEditionRequest model)
		{
			// check raw parameters
			// var form = Request.Form;

			// Check if the request contains multipart / form - data.
			if (model.File == null)
			{
				return new UnsupportedMediaTypeResult();
			}

			var edition = _niftyService.CreateEdition(model);
			// to avoid the potential very large return
			// remove the volumes before returning
			edition.Volumes = null;
			return Ok(edition);
		}

		[Authorize]
		[HttpPut("/api/edition/{id:int}")]
		public ActionResult<EditionResponse> UpdateEdition(int id, UpdateEditionRequest model)
		{
			// TODO: only owners can update their own?
			var edition = _niftyService.UpdateEdition(id, model);
			return Ok(edition);
		}

		[Authorize]
		[HttpDelete("/api/edition/{id:int}")]
		public ActionResult<EditionResponse> DeleteEdition(int id)
		{
			// get the current logged in user 
			// and verify that the edition is owned by this user
			var accountId = Account.Id;
			var edition = _niftyService.GetEditionById(id);
			if (edition.AccountId != accountId)
			{
				throw new KeyNotFoundException("Cannot delete an edition you don't own!");
			}
			else
			{
				_niftyService.DeleteEdition(id);
			}

			return Ok(true);
		}

		[HttpGet("/api/volumes/{editionId:int}")]
		public ActionResult<IEnumerable<VolumeResponse>> GetVolumesByEditionId(int editionId,
			int? pageNumber, int? pageSize)
		{
			var volumes = _niftyService.GetVolumesByEditionId(editionId, pageNumber ?? 1, pageSize ?? 10);
			return Ok(volumes);
		}

		[HttpGet("/api/volume/{id:int}")]
		public ActionResult<VolumeResponse> GetVolumeById(int id)
		{
			var volumes = _niftyService.GetVolumeById(id);
			return Ok(volumes);
		}

		[Authorize(Role.Admin)]
		[HttpGet("/api/persons/")]
		public ActionResult<IEnumerable<PersonResponse>> GetPersons()
		{
			var persons = _niftyService.GetPersons();
			return Ok(persons);
		}

		[Authorize]
		[HttpGet("/api/person/{id:int}")]
		public ActionResult<PersonResponse> GetPersonById(int id)
		{
			var person = _niftyService.GetPersonById(id);
			return Ok(person);
		}

		[Authorize]
		[HttpGet("/api/persons/{accountId:int}")]
		public ActionResult<IEnumerable<PersonResponse>> GetPersonsByAccountId(int accountId)
		{
			var persons = _niftyService.GetPersonsByAccountId(accountId);
			return Ok(persons);
		}

		[Authorize]
		[HttpPost("/api/person/")]
		public ActionResult<PersonResponse> CreatePerson(CreatePersonRequest model)
		{
			var person = _niftyService.CreatePerson(model);
			return Ok(person);
		}

		[Authorize]
		[HttpPut("/api/person/{id:int}")]
		public ActionResult<PersonResponse> UpdatePerson(int id, UpdatePersonRequest model)
		{
			// TODO: only owners can update their own?

			var person = _niftyService.UpdatePerson(id, model);
			return Ok(person);
		}

		[Authorize]
		[HttpDelete("/api/person/{id:int}")]
		public ActionResult<PersonResponse> DeletePerson(int id)
		{
			// get the current logged in user 
			// and verify that the edition is owned by this user
			var accountId = Account.Id;
			var person = _niftyService.GetPersonById(id);
			if (person.Account.Id != accountId)
			{
				throw new KeyNotFoundException("Cannot delete a person you don't own!");
			}
			else
			{
				_niftyService.DeletePerson(id);
			}

			return Ok(true);
		}

		[Authorize]
		[HttpGet("/api/likes/{accountId:int}")]
		public ActionResult<LikesResponse> GetLikesByAccountId(int accountId)
		{
			var likes = _niftyService.GetLikesByAccountId(accountId);
			return Ok(likes);
		}

		[Authorize]
		[HttpPost("/api/likes/")]
		public ActionResult<LikesResponse> CreateLikes(CreateLikesRequest model)
		{
			try
			{
				var likes = _niftyService.CreateLikes(model);
				return Ok(likes);
			}
			catch (System.Exception)
			{
				// likes already exist - so update
				var updateRequest = new UpdateLikesRequest();
				updateRequest.AccountId = model.AccountId;
				updateRequest.LikedEditionIds = model.LikedEditionIds;
				updateRequest.LikedPersonIds = model.LikedPersonIds;
				updateRequest.LikedVolumeIds = model.LikedVolumeIds;

				var likes = _niftyService.UpdateLikes(updateRequest.AccountId, updateRequest);
				return Ok(likes);
			}
		}

		[Authorize(Role.Admin)]
		[HttpGet("/api/wallets/")]
		public ActionResult<IEnumerable<WalletResponse>> GetWallets()
		{
			var wallets = _niftyService.GetWallets();
			return Ok(wallets);
		}

		[Authorize]
		[HttpGet("/api/wallet/{id:int}")]
		public ActionResult<WalletResponse> GetWalletById(int id)
		{
			var wallet = _niftyService.GetWalletById(id);
			return Ok(wallet);
		}

		[Authorize]
		[HttpGet("/api/wallets/{personId:int}")]
		public ActionResult<IEnumerable<WalletResponse>> GetWalletsByPersonId(int personId)
		{
			var wallets = _niftyService.GetWalletsByPersonId(personId);
			return Ok(wallets);
		}

		[Authorize]
		[HttpPost("/api/wallet/")]
		public ActionResult<WalletResponse> CreateWallet(CreateWalletRequest model)
		{
			var wallet = _niftyService.CreateWallet(model);
			return Ok(wallet);
		}

		[Authorize]
		[HttpPut("/api/wallet/{id:int}")]
		public ActionResult<WalletResponse> UpdateWallet(int id, UpdateWalletRequest model)
		{
			// TODO: only owners can update their own?
			var wallet = _niftyService.UpdateWallet(id, model);
			return Ok(wallet);
		}

		[Authorize]
		[HttpDelete("/api/wallet/{id:int}")]
		public ActionResult<WalletResponse> DeleteWallet(int id)
		{
			// get the current logged in user 
			// and verify that the wallet is owned by this user
			var accountId = Account.Id;
			var wallet = _niftyService.GetWalletById(id);
			var person = _niftyService.GetPersonById(wallet.PersonId);
			if (person.Account.Id != accountId)
			{
				throw new KeyNotFoundException("Cannot delete a wallet you don't own!");
			}
			else
			{
				_niftyService.DeleteWallet(id);
			}

			return Ok(true);
		}


	}
}
