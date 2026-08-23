using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.CaseStudies.Queries;
using HasanHabibSeyda.Application.Features.ProcessSteps.Queries;
using HasanHabibSeyda.Application.Features.ReferenceCompanies.Queries;
using HasanHabibSeyda.Application.Features.Reviews.Queries;
using HasanHabibSeyda.Application.Features.Services.Queries;
using HasanHabibSeyda.Application.Features.SiteSettings.Queries;
using HasanHabibSeyda.Application.Features.Stats.Queries;
using HasanHabibSeyda.Application.Features.Testimonials.Queries;
using HasanHabibSeyda.Application.Features.Values.Queries;
using HasanHabibSeyda.Application.Features.VideoTestimonials.Queries;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Public;

/// <summary>
/// Public icerik uclari — frontend ile birebir. Hepsi ApiResponse&lt;T[]&gt; (duz dizi) doner.
/// </summary>
[Route("api")]
[ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
public class PublicController : BaseApiController
{
    [HttpGet("services")]
    public async Task<ActionResult<ApiResponse<List<ServiceDto>>>> GetServices(CancellationToken ct) =>
        Ok(ApiResponse<List<ServiceDto>>.Ok(await Mediator.Send(new GetServicesQuery(), ct)));

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<List<StatDto>>>> GetStats(CancellationToken ct) =>
        Ok(ApiResponse<List<StatDto>>.Ok(await Mediator.Send(new GetStatsQuery(), ct)));

    [HttpGet("process-steps")]
    public async Task<ActionResult<ApiResponse<List<ProcessStepDto>>>> GetProcessSteps(CancellationToken ct) =>
        Ok(ApiResponse<List<ProcessStepDto>>.Ok(await Mediator.Send(new GetProcessStepsQuery(), ct)));

    [HttpGet("values")]
    public async Task<ActionResult<ApiResponse<List<ValueDto>>>> GetValues(CancellationToken ct) =>
        Ok(ApiResponse<List<ValueDto>>.Ok(await Mediator.Send(new GetValuesQuery(), ct)));

    [HttpGet("testimonials")]
    public async Task<ActionResult<ApiResponse<List<TestimonialDto>>>> GetTestimonials(CancellationToken ct) =>
        Ok(ApiResponse<List<TestimonialDto>>.Ok(await Mediator.Send(new GetTestimonialsQuery(), ct)));

    [HttpGet("reviews")]
    public async Task<ActionResult<ApiResponse<List<ReviewDto>>>> GetReviews(CancellationToken ct) =>
        Ok(ApiResponse<List<ReviewDto>>.Ok(await Mediator.Send(new GetReviewsQuery(), ct)));

    [HttpGet("reference-companies")]
    public async Task<ActionResult<ApiResponse<List<ReferenceCompanyDto>>>> GetReferenceCompanies(CancellationToken ct) =>
        Ok(ApiResponse<List<ReferenceCompanyDto>>.Ok(await Mediator.Send(new GetReferenceCompaniesQuery(), ct)));

    [HttpGet("video-testimonials")]
    public async Task<ActionResult<ApiResponse<List<VideoTestimonialDto>>>> GetVideoTestimonials(CancellationToken ct) =>
        Ok(ApiResponse<List<VideoTestimonialDto>>.Ok(await Mediator.Send(new GetVideoTestimonialsQuery(), ct)));

    [HttpGet("case-studies")]
    public async Task<ActionResult<ApiResponse<List<CaseStudyDto>>>> GetCaseStudies(CancellationToken ct) =>
        Ok(ApiResponse<List<CaseStudyDto>>.Ok(await Mediator.Send(new GetCaseStudiesQuery(), ct)));

    [HttpGet("site-settings")]
    public async Task<ActionResult<ApiResponse<SiteSettingsDto>>> GetSiteSettings(CancellationToken ct) =>
        Ok(ApiResponse<SiteSettingsDto>.Ok(await Mediator.Send(new GetSiteSettingsQuery(), ct)));
}
