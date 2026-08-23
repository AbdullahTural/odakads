using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Contact.Commands;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace HasanHabibSeyda.API.Controllers.Public;

[Route("api/contact")]
public class ContactController : BaseApiController
{
    /// <summary>Public iletisim formu. Frontend buraya gonderir; DB'ye kaydeder + e-posta atar.</summary>
    [EnableRateLimiting("contact")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ContactResponseDto>>> Submit(
        [FromBody] CreateContactRequestCommand command, CancellationToken ct)
    {
        var result = await Mediator.Send(command, ct);
        return Ok(ApiResponse<ContactResponseDto>.Ok(result, result.Message));
    }
}
