using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Conversion.Commands;
using HasanHabibSeyda.Application.Features.Conversion.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/conversion-settings")]
public class AdminConversionSettingsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<ConversionSettingDto?>>> Get(CancellationToken ct) =>
        Ok(ApiResponse<ConversionSettingDto?>.Ok(await Mediator.Send(new GetConversionSettingQuery(), ct)));

    [HttpPut]
    public async Task<ActionResult<ApiResponse<ConversionSettingDto>>> Update(
        [FromBody] UpdateConversionSettingCommand command, CancellationToken ct) =>
        Ok(ApiResponse<ConversionSettingDto>.Ok(await Mediator.Send(command, ct), "Dönüşüm ayarları güncellendi."));
}
