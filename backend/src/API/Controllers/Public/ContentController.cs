using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.Features.Content.Queries;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Public;

/// <summary>Public site icerigi — {anahtar: deger}. Frontend bilesenleri fallback ile tuketir.</summary>
[Route("api/content")]
[ResponseCache(Duration = 120, Location = ResponseCacheLocation.Any)]
public class ContentController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<Dictionary<string, string>>>> Get(CancellationToken ct) =>
        Ok(ApiResponse<Dictionary<string, string>>.Ok(await Mediator.Send(new GetContentQuery(), ct)));
}
