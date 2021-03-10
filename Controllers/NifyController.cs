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

		[HttpGet]
		public ActionResult<IEnumerable<EditionResponse>> GetAllEditions()
		{
			var editions = _niftyService.GetAllEditions();
			return Ok(editions);
		}

		[HttpGet("{id:int}")]
		public ActionResult<EditionResponse> GetEditionById(int id)
		{
			var edition = _niftyService.GetEditionById(id);
			return Ok(edition);
		}

		[Authorize]
		[HttpPost]
		public ActionResult<EditionResponse> CreateEdition(CreateEditionRequest model)
		{
			var edition = _niftyService.CreateEdition(model);
			return Ok(edition);
		}

		[Authorize]
		[HttpPut("{id:int}")]
		public ActionResult<EditionResponse> UpdateEdition(int id, UpdateEditionRequest model)
		{
			// TODO: only owners can update their own?

			var edition = _niftyService.UpdateEdition(id, model);
			return Ok(edition);
		}

	}
}
