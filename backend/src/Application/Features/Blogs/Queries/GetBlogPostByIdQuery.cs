using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Blogs.Queries;

/// <summary>Admin tam detay (editor + onizleme) — durumdan bagimsiz.</summary>
public record GetBlogPostByIdQuery(Guid Id) : IRequest<BlogAdminDetailDto>;

public class GetBlogPostByIdQueryHandler : IRequestHandler<GetBlogPostByIdQuery, BlogAdminDetailDto>
{
    private readonly IAppDbContext _db;

    public GetBlogPostByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<BlogAdminDetailDto> Handle(GetBlogPostByIdQuery request, CancellationToken ct)
    {
        var entity = await _db.BlogPosts.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Blog yazısı", request.Id);
        return entity.ToAdminDetailDto();
    }
}
