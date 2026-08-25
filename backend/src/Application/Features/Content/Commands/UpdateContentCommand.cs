using FluentValidation;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Content.Commands;

/// <summary>Verilen {anahtar: deger} setini upsert eder (bilinen anahtarlar guncellenir/eklenir).</summary>
public record UpdateContentCommand : IRequest<Dictionary<string, string>>
{
    public Dictionary<string, string> Items { get; init; } = new();
}

public class UpdateContentCommandValidator : AbstractValidator<UpdateContentCommand>
{
    public UpdateContentCommandValidator()
    {
        RuleForEach(x => x.Items)
            .Must(kv => !string.IsNullOrWhiteSpace(kv.Key) && kv.Key.Length <= 100)
            .WithMessage("Geçersiz içerik anahtarı (en fazla 100 karakter).");
        RuleForEach(x => x.Items)
            .Must(kv => (kv.Value ?? string.Empty).Length <= 4000)
            .WithMessage("İçerik değeri 4000 karakteri aşamaz.");
    }
}

public class UpdateContentCommandHandler : IRequestHandler<UpdateContentCommand, Dictionary<string, string>>
{
    private readonly IAppDbContext _db;

    public UpdateContentCommandHandler(IAppDbContext db) => _db = db;

    public async Task<Dictionary<string, string>> Handle(UpdateContentCommand request, CancellationToken ct)
    {
        var existing = await _db.ContentBlocks.ToDictionaryAsync(x => x.Key, ct);

        foreach (var (rawKey, rawValue) in request.Items)
        {
            var key = (rawKey ?? string.Empty).Trim();
            if (key.Length == 0) continue;
            var value = (rawValue ?? string.Empty).Trim();

            if (existing.TryGetValue(key, out var block))
                block.Value = value;
            else
                _db.ContentBlocks.Add(new ContentBlock { Key = key, Value = value });
        }

        await _db.SaveChangesAsync(ct);
        return await _db.ContentBlocks.AsNoTracking().ToDictionaryAsync(x => x.Key, x => x.Value, ct);
    }
}
