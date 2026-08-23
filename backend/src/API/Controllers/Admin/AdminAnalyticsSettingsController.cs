using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Analytics.Commands;
using HasanHabibSeyda.Application.Features.Analytics.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/analytics-settings")]
public class AdminAnalyticsSettingsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<AnalyticsSettingDto?>>> Get(CancellationToken ct) =>
        Ok(ApiResponse<AnalyticsSettingDto?>.Ok(await Mediator.Send(new GetAnalyticsSettingQuery(), ct)));

    [HttpPut]
    public async Task<ActionResult<ApiResponse<AnalyticsSettingDto>>> Update(
        [FromBody] UpdateAnalyticsSettingCommand command, CancellationToken ct) =>
        Ok(ApiResponse<AnalyticsSettingDto>.Ok(await Mediator.Send(command, ct), "Analytics ayarları güncellendi."));
}
