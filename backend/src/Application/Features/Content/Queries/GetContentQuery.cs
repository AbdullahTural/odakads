using HasanHabibSeyda.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Content.Queries;

/// <summary>Tum icerik bloklarini {anahtar: deger} sozlugu olarak doner.</summary>
public record GetContentQuery : IRequest<Dictionary<string, string>>;

public class GetContentQueryHandler : IRequestHandler<GetContentQuery, Dictionary<string, string>>
{
    private readonly IAppDbContext _db;

    public GetContentQueryHandler(IAppDbContext db) => _db = db;

    public async Task<Dictionary<string, string>> Handle(GetContentQuery request, CancellationToken ct) =>
        await _db.ContentBlocks.AsNoTracking().ToDictionaryAsync(x => x.Key, x => x.Value, ct);
}
