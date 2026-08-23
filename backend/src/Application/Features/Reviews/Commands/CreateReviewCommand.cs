using FluentValidation;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;

namespace HasanHabibSeyda.Application.Features.Reviews.Commands;

public record CreateReviewCommand : IRequest<ReviewDto>
{
    public string Author { get; init; } = string.Empty;
    public string Service { get; init; } = string.Empty;
    public int Rating { get; init; } = 5;
    public string Comment { get; init; } = string.Empty;
    public DateTime Date { get; init; }
    public string Source { get; init; } = "Armut";
    public string? CompanyLogoUrl { get; init; }
    public bool IsActive { get; init; } = true;
}

public class CreateReviewCommandValidator : AbstractValidator<CreateReviewCommand>
{
    public CreateReviewCommandValidator()
    {
        RuleFor(x => x.Author).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Service).NotEmpty().MaximumLength(160);
        RuleFor(x => x.Comment).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Source).NotEmpty().MaximumLength(60);
        RuleFor(x => x.CompanyLogoUrl).MaximumLength(500).When(x => !string.IsNullOrWhiteSpace(x.CompanyLogoUrl));
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Date).NotEmpty();
    }
}

public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, ReviewDto>
{
    private readonly IAppDbContext _db;

    public CreateReviewCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ReviewDto> Handle(CreateReviewCommand request, CancellationToken ct)
    {
        var entity = new Review
        {
            Author = request.Author.Trim(),
            Service = request.Service.Trim(),
            Rating = request.Rating,
            Comment = request.Comment.Trim(),
            Date = request.Date.Date,
            Source = request.Source.Trim(),
            CompanyLogoUrl = string.IsNullOrWhiteSpace(request.CompanyLogoUrl)
                ? null
                : request.CompanyLogoUrl.Trim(),
            IsActive = request.IsActive,
        };

        _db.Reviews.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
