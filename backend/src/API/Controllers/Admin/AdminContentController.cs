using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.Features.Content.Commands;
using HasanHabibSeyda.Application.Features.Content.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/content")]
public class AdminContentController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<Dictionary<string, string>>>> Get(CancellationToken ct) =>
        Ok(ApiResponse<Dictionary<string, string>>.Ok(await Mediator.Send(new GetContentQuery(), ct)));

    [HttpPut]
    public async Task<ActionResult<ApiResponse<Dictionary<string, string>>>> Update(
        [FromBody] UpdateContentCommand command, CancellationToken ct) =>
        Ok(ApiResponse<Dictionary<string, string>>.Ok(
            await Mediator.Send(command, ct), "İçerik güncellendi."));
}
