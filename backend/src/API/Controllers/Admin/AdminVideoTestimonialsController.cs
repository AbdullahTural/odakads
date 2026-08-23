using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.VideoTestimonials.Commands;
using HasanHabibSeyda.Application.Features.VideoTestimonials.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/video-testimonials")]
public class AdminVideoTestimonialsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<VideoTestimonialDto>>>> GetAll(
        [FromQuery] QueryParameters parameters, CancellationToken ct) =>
        Ok(ApiResponse<PagedResult<VideoTestimonialDto>>.Ok(
            await Mediator.Send(new GetVideoTestimonialsPagedQuery(parameters), ct)));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<VideoTestimonialDto>>> GetById(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<VideoTestimonialDto>.Ok(await Mediator.Send(new GetVideoTestimonialByIdQuery(id), ct)));

    [HttpPost]
    public async Task<ActionResult<ApiResponse<VideoTestimonialDto>>> Create(
        [FromBody] CreateVideoTestimonialCommand command, CancellationToken ct) =>
        Ok(ApiResponse<VideoTestimonialDto>.Ok(await Mediator.Send(command, ct), "Video referans oluşturuldu."));

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<VideoTestimonialDto>>> Update(
        Guid id, [FromBody] UpdateVideoTestimonialCommand command, CancellationToken ct) =>
        Ok(ApiResponse<VideoTestimonialDto>.Ok(await Mediator.Send(command with { Id = id }, ct), "Video referans güncellendi."));

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<bool>.Ok(await Mediator.Send(new DeleteVideoTestimonialCommand(id), ct), "Video referans silindi."));
}
