using HasanHabibSeyda.Application.Common.Extensions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Testimonials.Queries;

public record GetTestimonialsPagedQuery(QueryParameters Parameters) : IRequest<PagedResult<TestimonialDto>>;

public class GetTestimonialsPagedQueryHandler
    : IRequestHandler<GetTestimonialsPagedQuery, PagedResult<TestimonialDto>>
{
    private readonly IAppDbContext _db;

    public GetTestimonialsPagedQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PagedResult<TestimonialDto>> Handle(GetTestimonialsPagedQuery request, CancellationToken ct)
    {
        var p = request.Parameters;
        var query = _db.Testimonials.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim();
            query = query.Where(x =>
                EF.Functions.Like(x.Name, $"%{s}%") ||
                EF.Functions.Like(x.Company, $"%{s}%") ||
                EF.Functions.Like(x.Content, $"%{s}%"));
        }

        query = (p.SortBy?.ToLowerInvariant()) switch
        {
            "name" => p.IsDescending ? query.OrderByDescending(x => x.Name) : query.OrderBy(x => x.Name),
            "rating" => p.IsDescending ? query.OrderByDescending(x => x.Rating) : query.OrderBy(x => x.Rating),
            _ => p.IsDescending ? query.OrderByDescending(x => x.CreatedDate) : query.OrderBy(x => x.CreatedDate),
        };

        var paged = await query.ToPagedResultAsync(p.Page, p.PageSize, ct);
        return new PagedResult<TestimonialDto>(
            paged.Items.Select(x => x.ToDto()).ToList(),
            paged.Page, paged.PageSize, paged.TotalCount);
    }
}
