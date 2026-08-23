using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Seo.Commands;
using HasanHabibSeyda.Application.Features.Seo.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/seo-settings")]
public class AdminSeoSettingsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<SeoSettingDto>>>> GetAll(CancellationToken ct) =>
        Ok(ApiResponse<List<SeoSettingDto>>.Ok(await Mediator.Send(new GetSeoSettingsQuery(), ct)));

    [HttpGet("{pageKey}")]
    public async Task<ActionResult<ApiResponse<SeoSettingDto>>> GetByKey(string pageKey, CancellationToken ct) =>
        Ok(ApiResponse<SeoSettingDto>.Ok(await Mediator.Send(new GetSeoSettingByKeyQuery(pageKey), ct)));

    [HttpPut("{pageKey}")]
    public async Task<ActionResult<ApiResponse<SeoSettingDto>>> Update(
        string pageKey, [FromBody] UpdateSeoSettingCommand command, CancellationToken ct) =>
        Ok(ApiResponse<SeoSettingDto>.Ok(
            await Mediator.Send(command with { PageKey = pageKey }, ct),
            "SEO ayarı güncellendi. Değişikliklerin canlı sitede görünmesi için static rebuild gerekir (npm run build:deploy)."));
}
