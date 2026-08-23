using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Services.Commands;
using HasanHabibSeyda.Application.Features.Services.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/services")]
public class AdminServicesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ServiceDto>>>> GetAll(
        [FromQuery] QueryParameters parameters, CancellationToken ct) =>
        Ok(ApiResponse<PagedResult<ServiceDto>>.Ok(
            await Mediator.Send(new GetServicesPagedQuery(parameters), ct)));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ServiceDto>>> GetById(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<ServiceDto>.Ok(await Mediator.Send(new GetServiceByIdQuery(id), ct)));

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ServiceDto>>> Create(
        [FromBody] CreateServiceCommand command, CancellationToken ct) =>
        Ok(ApiResponse<ServiceDto>.Ok(await Mediator.Send(command, ct), "Hizmet oluşturuldu."));

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ServiceDto>>> Update(
        Guid id, [FromBody] UpdateServiceCommand command, CancellationToken ct) =>
        Ok(ApiResponse<ServiceDto>.Ok(await Mediator.Send(command with { Id = id }, ct), "Hizmet güncellendi."));

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<bool>.Ok(await Mediator.Send(new DeleteServiceCommand(id), ct), "Hizmet silindi."));
}
