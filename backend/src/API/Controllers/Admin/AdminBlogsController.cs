using HasanHabibSeyda.API.Services;
using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Blogs.Commands;
using HasanHabibSeyda.Application.Features.Blogs.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/blogs")]
public class AdminBlogsController : BaseApiController
{
    private readonly MediaUploadService _media;

    public AdminBlogsController(MediaUploadService media) => _media = media;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<BlogAdminListItemDto>>>> GetAll(
        [FromQuery] QueryParameters parameters, [FromQuery] string? status, CancellationToken ct) =>
        Ok(ApiResponse<PagedResult<BlogAdminListItemDto>>.Ok(
            await Mediator.Send(new GetBlogPostsPagedQuery(parameters, status), ct)));

    [HttpGet("check-slug")]
    public async Task<ActionResult<ApiResponse<BlogSlugCheckDto>>> CheckSlug(
        [FromQuery] string slug, [FromQuery] Guid? excludeId, CancellationToken ct) =>
        Ok(ApiResponse<BlogSlugCheckDto>.Ok(
            await Mediator.Send(new CheckBlogSlugQuery(slug ?? string.Empty, excludeId), ct)));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<BlogAdminDetailDto>>> GetById(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<BlogAdminDetailDto>.Ok(await Mediator.Send(new GetBlogPostByIdQuery(id), ct)));

    [HttpPost]
    public async Task<ActionResult<ApiResponse<BlogAdminDetailDto>>> Create(
        [FromBody] CreateBlogPostCommand command, CancellationToken ct) =>
        Ok(ApiResponse<BlogAdminDetailDto>.Ok(await Mediator.Send(command, ct), "Blog yazısı oluşturuldu."));

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<BlogAdminDetailDto>>> Update(
        Guid id, [FromBody] UpdateBlogPostCommand command, CancellationToken ct) =>
        Ok(ApiResponse<BlogAdminDetailDto>.Ok(
            await Mediator.Send(command with { Id = id }, ct), "Blog yazısı güncellendi."));

    [HttpPost("{id:guid}/status")]
    public async Task<ActionResult<ApiResponse<BlogAdminDetailDto>>> ChangeStatus(
        Guid id, [FromBody] ChangeBlogStatusRequest body, CancellationToken ct) =>
        Ok(ApiResponse<BlogAdminDetailDto>.Ok(
            await Mediator.Send(new ChangeBlogPostStatusCommand(id, body.Status ?? string.Empty), ct),
            "Durum güncellendi."));

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id, CancellationToken ct) =>
        Ok(ApiResponse<bool>.Ok(await Mediator.Send(new DeleteBlogPostCommand(id), ct), "Blog yazısı silindi."));

    [HttpPost("upload-cover")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<ActionResult<ApiResponse<MediaUploadResultDto>>> UploadCover(
        IFormFile file, CancellationToken ct)
    {
        try
        {
            var result = await _media.SaveImageAsync(file, "blog", ct);
            return Ok(ApiResponse<MediaUploadResultDto>.Ok(result, "Görsel yüklendi."));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<MediaUploadResultDto>.Fail(ex.Message));
        }
    }
}

/// <summary>Durum degistirme istek govdesi (POST .../status).</summary>
public record ChangeBlogStatusRequest(string? Status);
