using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.ReferenceCompanies.Commands;
using HasanHabibSeyda.Application.Features.ReferenceCompanies.Queries;
using HasanHabibSeyda.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/reference-companies")]
public class AdminReferenceCompaniesController : BaseApiController
{
    private readonly LogoUploadService _logoUpload;

    public AdminReferenceCompaniesController(LogoUploadService logoUpload) => _logoUpload = logoUpload;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ReferenceCompanyDto>>>> GetAll(
        [FromQuery] QueryParameters parameters, CancellationToken ct) =>
        Ok(ApiResponse<PagedResult<ReferenceCompanyDto>>.Ok(
            await Mediator.Send(new GetReferenceCompaniesPagedQuery(parameters), ct)));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ReferenceCompanyDto>>> GetById(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<ReferenceCompanyDto>.Ok(await Mediator.Send(new GetReferenceCompanyByIdQuery(id), ct)));

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ReferenceCompanyDto>>> Create(
        [FromBody] CreateReferenceCompanyCommand command, CancellationToken ct) =>
        Ok(ApiResponse<ReferenceCompanyDto>.Ok(
            await Mediator.Send(command, ct), "Referans firma oluşturuldu."));

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ReferenceCompanyDto>>> Update(
        Guid id, [FromBody] UpdateReferenceCompanyCommand command, CancellationToken ct) =>
        Ok(ApiResponse<ReferenceCompanyDto>.Ok(
            await Mediator.Send(command with { Id = id }, ct), "Referans firma güncellendi."));

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<bool>.Ok(
            await Mediator.Send(new DeleteReferenceCompanyCommand(id), ct), "Referans firma silindi."));

    [HttpPost("upload-logo")]
    [RequestSizeLimit(2 * 1024 * 1024)]
    public async Task<ActionResult<ApiResponse<LogoUploadResultDto>>> UploadLogo(
        IFormFile file, CancellationToken ct)
    {
        try
        {
            var result = await _logoUpload.SaveLogoAsync(file, ct);
            return Ok(ApiResponse<LogoUploadResultDto>.Ok(result, "Logo yüklendi."));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<LogoUploadResultDto>.Fail(ex.Message));
        }
    }
}
