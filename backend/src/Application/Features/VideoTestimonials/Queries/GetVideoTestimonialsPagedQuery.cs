using HasanHabibSeyda.Application.Common.Extensions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.VideoTestimonials.Queries;

public record GetVideoTestimonialsPagedQuery(QueryParameters Parameters)
    : IRequest<PagedResult<VideoTestimonialDto>>;

public class GetVideoTestimonialsPagedQueryHandler
    : IRequestHandler<GetVideoTestimonialsPagedQuery, PagedResult<VideoTestimonialDto>>
{
    private readonly IAppDbContext _db;

    public GetVideoTestimonialsPagedQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PagedResult<VideoTestimonialDto>> Handle(GetVideoTestimonialsPagedQuery request, CancellationToken ct)
    {
        var p = request.Parameters;
        var query = _db.VideoTestimonials.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim();
            query = query.Where(x =>
                EF.Functions.Like(x.Name, $"%{s}%") ||
                EF.Functions.Like(x.Company, $"%{s}%") ||
                EF.Functions.Like(x.Quote, $"%{s}%"));
        }

        query = (p.SortBy?.ToLowerInvariant()) switch
        {
            "name" => p.IsDescending ? query.OrderByDescending(x => x.Name) : query.OrderBy(x => x.Name),
            _ => p.IsDescending ? query.OrderByDescending(x => x.DisplayOrder) : query.OrderBy(x => x.DisplayOrder),
        };

        var paged = await query.ToPagedResultAsync(p.Page, p.PageSize, ct);
        return new PagedResult<VideoTestimonialDto>(
            paged.Items.Select(x => x.ToDto()).ToList(),
            paged.Page, paged.PageSize, paged.TotalCount);
    }
}
