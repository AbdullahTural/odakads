using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Blogs.Queries;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Public;

/// <summary>
/// Public blog uclari — yalnizca yayindaki yazilar. Build-time SSG (fetch:blog) ve
/// ziyaretci tarafi tuketimi icin. <c>ApiResponse&lt;T&gt;</c> doner.
/// </summary>
[Route("api/blogs")]
[ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
public class BlogsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<BlogListItemDto>>>> GetPublished(CancellationToken ct) =>
        Ok(ApiResponse<List<BlogListItemDto>>.Ok(await Mediator.Send(new GetPublishedBlogPostsQuery(), ct)));

    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<BlogDetailDto>>> GetBySlug(string slug, CancellationToken ct) =>
        Ok(ApiResponse<BlogDetailDto>.Ok(await Mediator.Send(new GetBlogPostBySlugQuery(slug), ct)));
}
