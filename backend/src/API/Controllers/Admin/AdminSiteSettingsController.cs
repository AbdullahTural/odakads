using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.SiteSettings.Commands;
using HasanHabibSeyda.Application.Features.SiteSettings.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/site-settings")]
public class AdminSiteSettingsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<SiteSettingsDto>>> Get(CancellationToken ct) =>
        Ok(ApiResponse<SiteSettingsDto>.Ok(await Mediator.Send(new GetSiteSettingsQuery(), ct)));

    [HttpPut]
    public async Task<ActionResult<ApiResponse<SiteSettingsDto>>> Update(
        [FromBody] UpdateSiteSettingsCommand command, CancellationToken ct) =>
        Ok(ApiResponse<SiteSettingsDto>.Ok(await Mediator.Send(command, ct), "Site ayarları güncellendi."));
}
