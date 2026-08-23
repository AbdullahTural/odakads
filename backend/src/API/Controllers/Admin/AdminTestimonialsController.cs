using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Testimonials.Commands;
using HasanHabibSeyda.Application.Features.Testimonials.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/testimonials")]
public class AdminTestimonialsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<TestimonialDto>>>> GetAll(
        [FromQuery] QueryParameters parameters, CancellationToken ct) =>
        Ok(ApiResponse<PagedResult<TestimonialDto>>.Ok(
            await Mediator.Send(new GetTestimonialsPagedQuery(parameters), ct)));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<TestimonialDto>>> GetById(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<TestimonialDto>.Ok(await Mediator.Send(new GetTestimonialByIdQuery(id), ct)));

    [HttpPost]
    public async Task<ActionResult<ApiResponse<TestimonialDto>>> Create(
        [FromBody] CreateTestimonialCommand command, CancellationToken ct) =>
        Ok(ApiResponse<TestimonialDto>.Ok(await Mediator.Send(command, ct), "Referans oluşturuldu."));

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<TestimonialDto>>> Update(
        Guid id, [FromBody] UpdateTestimonialCommand command, CancellationToken ct) =>
        Ok(ApiResponse<TestimonialDto>.Ok(await Mediator.Send(command with { Id = id }, ct), "Referans güncellendi."));

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<bool>.Ok(await Mediator.Send(new DeleteTestimonialCommand(id), ct), "Referans silindi."));
}
