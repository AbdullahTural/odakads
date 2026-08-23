using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.About.Commands;
using HasanHabibSeyda.Application.Features.About.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/about-settings")]
public class AdminAboutSettingsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<AboutSettingDto?>>> Get(CancellationToken ct) =>
        Ok(ApiResponse<AboutSettingDto?>.Ok(await Mediator.Send(new GetAboutSettingQuery(), ct)));

    [HttpPut]
    public async Task<ActionResult<ApiResponse<AboutSettingDto>>> Update(
        [FromBody] UpdateAboutSettingCommand command, CancellationToken ct) =>
        Ok(ApiResponse<AboutSettingDto>.Ok(await Mediator.Send(command, ct), "Hakkımızda ayarları güncellendi."));
}
