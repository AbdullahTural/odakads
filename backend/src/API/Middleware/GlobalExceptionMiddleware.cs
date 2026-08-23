using System.Text.Json;
using HasanHabibSeyda.Application.Common.Exceptions;

namespace HasanHabibSeyda.API.Middleware;

/// <summary>Tum istisnalari yakalar, ApiResponse formatinda JSON hata dondurur ve loglar.</summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleAsync(context, ex);
        }
    }

    private async Task HandleAsync(HttpContext context, Exception ex)
    {
        var (status, message, errors) = ex switch
        {
            AppValidationException v => (422, v.Message, (object?)v.Errors),
            NotFoundException n => (404, n.Message, null),
            AppUnauthorizedException u => (401, u.Message, null),
            _ => (500, "Beklenmeyen bir sunucu hatası oluştu.", null),
        };

        if (status == 500)
            _logger.LogError(ex, "İşlenmeyen istisna: {Message}", ex.Message);
        else
            _logger.LogWarning("İstek hatası ({Status}): {Message}", status, ex.Message);

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";

        var payload = new
        {
            success = false,
            message,
            data = (object?)null,
            errors,
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(payload, JsonOptions));
    }
}
