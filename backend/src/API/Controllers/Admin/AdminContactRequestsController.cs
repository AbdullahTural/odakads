using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Contact.Commands;
using HasanHabibSeyda.Application.Features.Contact.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/contact-requests")]
public class AdminContactRequestsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ContactRequestDto>>>> GetAll(
        [FromQuery] QueryParameters parameters, CancellationToken ct) =>
        Ok(ApiResponse<PagedResult<ContactRequestDto>>.Ok(
            await Mediator.Send(new GetContactRequestsPagedQuery(parameters), ct)));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ContactRequestDto>>> GetById(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<ContactRequestDto>.Ok(await Mediator.Send(new GetContactRequestByIdQuery(id), ct)));

    [HttpPut("{id:guid}/read")]
    public async Task<ActionResult<ApiResponse<ContactRequestDto>>> MarkRead(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<ContactRequestDto>.Ok(
            await Mediator.Send(new MarkContactRequestReadCommand(id), ct), "Okundu olarak işaretlendi."));

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<bool>.Ok(await Mediator.Send(new DeleteContactRequestCommand(id), ct), "Talep silindi."));
}
