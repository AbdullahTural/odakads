using HasanHabibSeyda.API.Services;
using HasanHabibSeyda.Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HasanHabibSeyda.API.Controllers.Admin;

/// <summary>Site yönetimi — "Siteyi Yayına Al" (statik yeniden üretim).</summary>
[Authorize(Roles = "Admin")]
[Route("api/admin/site")]
public class AdminSiteController : BaseApiController
{
    private readonly SiteRebuildService _rebuild;

    public AdminSiteController(SiteRebuildService rebuild) => _rebuild = rebuild;

    /// <summary>Mevcut yayınlama durumunu döner (frontend bunu periyodik sorgular).</summary>
    [HttpGet("rebuild")]
    public ActionResult<ApiResponse<RebuildState>> Status() =>
        Ok(ApiResponse<RebuildState>.Ok(_rebuild.State));

    /// <summary>Yeniden yayınlamayı başlatır.</summary>
    [HttpPost("rebuild")]
    public ActionResult<ApiResponse<RebuildState>> Start()
    {
        var (started, message) = _rebuild.TryStart();
        if (!started)
            return Ok(ApiResponse<RebuildState>.Fail(message));
        return Ok(ApiResponse<RebuildState>.Ok(_rebuild.State, message));
    }
}
