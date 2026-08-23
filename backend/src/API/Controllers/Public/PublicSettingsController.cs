using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.About.Queries;
using HasanHabibSeyda.Application.Features.Analytics.Queries;
using HasanHabibSeyda.Application.Features.Conversion.Queries;
using HasanHabibSeyda.Application.Features.Seo.Queries;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Public;

/// <summary>Public ayar uclari (SEO / analytics / conversion / about) — frontend ISR ile tuketir.</summary>
[Route("api")]
[ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
public class PublicSettingsController : BaseApiController
{
    [HttpGet("seo-settings/{pageKey}")]
    public async Task<ActionResult<ApiResponse<SeoSettingDto>>> GetSeo(string pageKey, CancellationToken ct) =>
        Ok(ApiResponse<SeoSettingDto>.Ok(await Mediator.Send(new GetSeoSettingByKeyQuery(pageKey), ct)));

    [HttpGet("analytics-settings")]
    public async Task<ActionResult<ApiResponse<AnalyticsSettingDto?>>> GetAnalytics(CancellationToken ct) =>
        Ok(ApiResponse<AnalyticsSettingDto?>.Ok(await Mediator.Send(new GetAnalyticsSettingQuery(), ct)));

    [HttpGet("conversion-settings")]
    public async Task<ActionResult<ApiResponse<ConversionSettingDto?>>> GetConversion(CancellationToken ct) =>
        Ok(ApiResponse<ConversionSettingDto?>.Ok(await Mediator.Send(new GetConversionSettingQuery(), ct)));

    [HttpGet("about-settings")]
    public async Task<ActionResult<ApiResponse<AboutSettingDto?>>> GetAbout(CancellationToken ct) =>
        Ok(ApiResponse<AboutSettingDto?>.Ok(await Mediator.Send(new GetAboutSettingQuery(), ct)));
}
