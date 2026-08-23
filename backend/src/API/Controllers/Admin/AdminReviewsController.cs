using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Reviews.Commands;
using HasanHabibSeyda.Application.Features.Reviews.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/reviews")]
public class AdminReviewsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ReviewDto>>>> GetAll(
        [FromQuery] QueryParameters parameters, CancellationToken ct) =>
        Ok(ApiResponse<PagedResult<ReviewDto>>.Ok(
            await Mediator.Send(new GetReviewsPagedQuery(parameters), ct)));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ReviewDto>>> GetById(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<ReviewDto>.Ok(await Mediator.Send(new GetReviewByIdQuery(id), ct)));

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ReviewDto>>> Create(
        [FromBody] CreateReviewCommand command, CancellationToken ct) =>
        Ok(ApiResponse<ReviewDto>.Ok(await Mediator.Send(command, ct), "Armut yorumu oluşturuldu."));

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ReviewDto>>> Update(
        Guid id, [FromBody] UpdateReviewCommand command, CancellationToken ct) =>
        Ok(ApiResponse<ReviewDto>.Ok(await Mediator.Send(command with { Id = id }, ct), "Armut yorumu güncellendi."));

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<bool>.Ok(await Mediator.Send(new DeleteReviewCommand(id), ct), "Armut yorumu silindi."));
}
