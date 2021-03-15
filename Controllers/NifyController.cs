using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Niftified.Entities;
using Niftified.Models.Accounts;
using Niftified.Services;
using System.Linq;

namespace Niftified.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class NiftyController : BaseController
	{
		private readonly INiftyService _niftyService;
		private readonly IMapper _mapper;

		public NiftyController(
			INiftyService niftyService,
			IMapper mapper)
		{
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
			var editions = _niftyService.GetEditions();
			return Ok(editions);
		}

		[HttpGet("/api/edition/{id:int}")]
		public ActionResult<EditionResponse> GetEditionById(int id)
		{
			var edition = _niftyService.GetEditionById(id);
			return Ok(edition);
		}

		[Authorize]
		[HttpGet("/api/edition/{id:int}/iseditable")]
		public ActionResult<bool> GetEditionIsEditable(int id)
		{
			var isEditable = _niftyService.GetEditionIsEditable(id);
			return Ok(isEditable);
		}

		[Authorize]
		[HttpPost("/api/edition/")]
		public ActionResult<EditionResponse> CreateEdition([FromForm] CreateEditionRequest model)
		{
			// check raw parameters
			// var form = Request.Form;

			// Check if the request contains multipart/form-data.
			if (model.File == null)
			{
				return new UnsupportedMediaTypeResult();
			}

			var edition = _niftyService.CreateEdition(model);
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

	}
}
