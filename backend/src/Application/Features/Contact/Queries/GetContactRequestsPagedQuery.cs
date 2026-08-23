using HasanHabibSeyda.Application.Common.Extensions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Contact.Queries;

public record GetContactRequestsPagedQuery(QueryParameters Parameters) : IRequest<PagedResult<ContactRequestDto>>;

public class GetContactRequestsPagedQueryHandler
    : IRequestHandler<GetContactRequestsPagedQuery, PagedResult<ContactRequestDto>>
{
    private readonly IAppDbContext _db;

    public GetContactRequestsPagedQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PagedResult<ContactRequestDto>> Handle(GetContactRequestsPagedQuery request, CancellationToken ct)
    {
        var p = request.Parameters;
        var query = _db.ContactRequests.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim();
            query = query.Where(x =>
                EF.Functions.Like(x.FullName, $"%{s}%") ||
                EF.Functions.Like(x.Email, $"%{s}%") ||
                EF.Functions.Like(x.Company, $"%{s}%") ||
                EF.Functions.Like(x.ServiceType, $"%{s}%"));
        }

        query = (p.SortBy?.ToLowerInvariant()) switch
        {
            "fullname" => p.IsDescending ? query.OrderByDescending(x => x.FullName) : query.OrderBy(x => x.FullName),
            "isread" => p.IsDescending ? query.OrderByDescending(x => x.IsRead) : query.OrderBy(x => x.IsRead),
            "createddate" => p.IsDescending ? query.OrderByDescending(x => x.CreatedDate) : query.OrderBy(x => x.CreatedDate),
            // Varsayilan: en yeni once
            _ => query.OrderByDescending(x => x.CreatedDate),
        };

        var paged = await query.ToPagedResultAsync(p.Page, p.PageSize, ct);
        return new PagedResult<ContactRequestDto>(
            paged.Items.Select(x => x.ToDto()).ToList(),
            paged.Page, paged.PageSize, paged.TotalCount);
    }
}
