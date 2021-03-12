using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Niftified.Entities;
using Niftified.Models.Accounts;
using Niftified.Services;

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
		[HttpGet("/api/collection/")]
		public ActionResult<IEnumerable<CollectionResponse>> GetAllCollections()
		{
			var collections = _niftyService.GetAllCollections();
			return Ok(collections);
		}

		[Authorize]
		[HttpGet("/api/collection/{accountId:int}")]
		public ActionResult<IEnumerable<CollectionResponse>> GetAllCollectionsByAccountId(int accountId)
		{
			var collections = _niftyService.GetAllCollectionsByAccountId(accountId);
			return Ok(collections);
		}

		[Authorize]
		[HttpGet("/api/collection/{accountId:int}/{query}")]
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
		[HttpGet("/api/tag/")]
		public ActionResult<IEnumerable<TagResponse>> GetAllTags()
		{
			var tags = _niftyService.GetAllTags();
			return Ok(tags);
		}

		[Authorize]
		[HttpPost("/api/tag/")]
		public ActionResult<TagResponse> CreateTag(CreateTagRequest model)
		{
			var tag = _niftyService.CreateTag(model);
			return Ok(tag);
		}

		[HttpGet("/api/edition/")]
		public ActionResult<IEnumerable<EditionResponse>> GetAllEditions()
		{
			var editions = _niftyService.GetAllEditions();
			return Ok(editions);
		}

		[HttpGet("/api/edition/{id:int}")]
		public ActionResult<EditionResponse> GetEditionById(int id)
		{
			var edition = _niftyService.GetEditionById(id);
			return Ok(edition);
		}

		[Authorize]
		[HttpPost("/api/edition/")]
		public ActionResult<EditionResponse> CreateEdition(CreateEditionRequest model)
		{
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

	}
}
