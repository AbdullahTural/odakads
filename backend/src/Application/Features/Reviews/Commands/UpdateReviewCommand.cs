using FluentValidation;
using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Reviews.Commands;

public record UpdateReviewCommand : IRequest<ReviewDto>
{
    public Guid Id { get; init; }
    public string Author { get; init; } = string.Empty;
    public string Service { get; init; } = string.Empty;
    public int Rating { get; init; } = 5;
    public string Comment { get; init; } = string.Empty;
    public DateTime Date { get; init; }
    public string Source { get; init; } = "Armut";
    public string? CompanyLogoUrl { get; init; }
    public bool IsActive { get; init; } = true;
}

public class UpdateReviewCommandValidator : AbstractValidator<UpdateReviewCommand>
{
    public UpdateReviewCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Author).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Service).NotEmpty().MaximumLength(160);
        RuleFor(x => x.Comment).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Source).NotEmpty().MaximumLength(60);
        RuleFor(x => x.CompanyLogoUrl).MaximumLength(500).When(x => !string.IsNullOrWhiteSpace(x.CompanyLogoUrl));
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Date).NotEmpty();
    }
}

public class UpdateReviewCommandHandler : IRequestHandler<UpdateReviewCommand, ReviewDto>
{
    private readonly IAppDbContext _db;

    public UpdateReviewCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ReviewDto> Handle(UpdateReviewCommand request, CancellationToken ct)
    {
        var entity = await _db.Reviews.FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Armut yorumu", request.Id);

        entity.Author = request.Author.Trim();
        entity.Service = request.Service.Trim();
        entity.Rating = request.Rating;
        entity.Comment = request.Comment.Trim();
        entity.Date = request.Date.Date;
        entity.Source = request.Source.Trim();
        entity.CompanyLogoUrl = string.IsNullOrWhiteSpace(request.CompanyLogoUrl)
            ? null
            : request.CompanyLogoUrl.Trim();
        entity.IsActive = request.IsActive;

        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
