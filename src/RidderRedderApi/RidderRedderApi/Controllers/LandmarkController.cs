﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RidderRedderApi.Models;
using RidderRedderApi.ViewModels;
using RidderRedderApi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RidderRedderApi.Web.Api.Controllers {
	[Route("api/v1/[controller]")]
	[ApiController]
	public class LandmarkController : BaseController {
		private LandmarkService landmarkService;

		/// <summary>
		/// Initializes a new instance of the <see cref="T:RidderRedderApi.Web.Api.Controllers.LandmarkController"/> class.
		/// </summary>
		/// <param name="landmarkService">Landmark service.</param>
		public LandmarkController(LandmarkService landmarkService) {
			this.landmarkService = landmarkService;
		}

		/// <summary>
		/// Gets all landmarks
		/// </summary>
		/// <returns>The all.</returns>
		[HttpGet]
		public IActionResult GetAll() {
			Console.Out.WriteLine("get landmarks");
			return Ok(landmarkService.GetAll());
		}

		/// <summary>
		/// Update the specified landmark with given landmarkId
		/// </summary>
		/// <returns>The update.</returns>
		/// <param name="landmarkId">LandmarkId.</param>
		/// <param name="l">L.</param>
		[HttpPut("{landmarkId}")]
		public IActionResult Update(string landmarkId, [FromBody]Landmark l) {
			return Ok(landmarkService.Update(l));
		}
	}
}
