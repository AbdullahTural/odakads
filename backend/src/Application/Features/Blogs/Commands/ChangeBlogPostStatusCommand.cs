using FluentValidation;
using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Blogs.Common;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Blogs.Commands;

/// <summary>Hizli durum degisimi (yayinla / yayindan kaldir / arsivle).</summary>
public record ChangeBlogPostStatusCommand(Guid Id, string Status) : IRequest<BlogAdminDetailDto>;

public class ChangeBlogPostStatusCommandValidator : AbstractValidator<ChangeBlogPostStatusCommand>
{
    public ChangeBlogPostStatusCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Status).Must(BlogStatuses.IsValid).WithMessage("Geçersiz durum değeri.");
    }
}

public class ChangeBlogPostStatusCommandHandler
    : IRequestHandler<ChangeBlogPostStatusCommand, BlogAdminDetailDto>
{
    private readonly IAppDbContext _db;

    public ChangeBlogPostStatusCommandHandler(IAppDbContext db) => _db = db;

    public async Task<BlogAdminDetailDto> Handle(ChangeBlogPostStatusCommand request, CancellationToken ct)
    {
        var entity = await _db.BlogPosts
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Blog yazısı", request.Id);

        var now = DateTime.UtcNow;
        BlogWrite.ApplyStatus(entity, request.Status, null, now);
        entity.UpdatedDate = now;

        await _db.SaveChangesAsync(ct);
        return entity.ToAdminDetailDto();
    }
}
