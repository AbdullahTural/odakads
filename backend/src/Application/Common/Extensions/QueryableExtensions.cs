using HasanHabibSeyda.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Common.Extensions;

public static class QueryableExtensions
{
    /// <summary>IQueryable'i sayfalayip PagedResult'a donusturur.</summary>
    public static async Task<PagedResult<T>> ToPagedResultAsync<T>(
        this IQueryable<T> query,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<T>(items, page, pageSize, totalCount);
    }
}
