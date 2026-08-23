using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.CaseStudies.Commands;
using HasanHabibSeyda.Application.Features.CaseStudies.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/case-studies")]
public class AdminCaseStudiesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<CaseStudyDto>>>> GetAll(
        [FromQuery] QueryParameters parameters, CancellationToken ct) =>
        Ok(ApiResponse<PagedResult<CaseStudyDto>>.Ok(
            await Mediator.Send(new GetCaseStudiesPagedQuery(parameters), ct)));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<CaseStudyDto>>> GetById(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<CaseStudyDto>.Ok(await Mediator.Send(new GetCaseStudyByIdQuery(id), ct)));

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CaseStudyDto>>> Create(
        [FromBody] CreateCaseStudyCommand command, CancellationToken ct) =>
        Ok(ApiResponse<CaseStudyDto>.Ok(await Mediator.Send(command, ct), "Vaka çalışması oluşturuldu."));

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<CaseStudyDto>>> Update(
        Guid id, [FromBody] UpdateCaseStudyCommand command, CancellationToken ct) =>
        Ok(ApiResponse<CaseStudyDto>.Ok(await Mediator.Send(command with { Id = id }, ct), "Vaka çalışması güncellendi."));

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<bool>.Ok(await Mediator.Send(new DeleteCaseStudyCommand(id), ct), "Vaka çalışması silindi."));
}
