using FluentValidation;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;

namespace HasanHabibSeyda.Application.Features.VideoTestimonials.Commands;

public record CreateVideoTestimonialCommand : IRequest<VideoTestimonialDto>
{
    public string Name { get; init; } = string.Empty;
    public string Company { get; init; } = string.Empty;
    public string? ThumbnailUrl { get; init; }
    public string VideoUrl { get; init; } = string.Empty;
    public string Duration { get; init; } = string.Empty;
    public string Quote { get; init; } = string.Empty;
    public int DisplayOrder { get; init; }
    public bool IsActive { get; init; } = true;
}

public class CreateVideoTestimonialCommandValidator : AbstractValidator<CreateVideoTestimonialCommand>
{
    public CreateVideoTestimonialCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Company).NotEmpty().MaximumLength(160);
        RuleFor(x => x.VideoUrl).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Quote).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Duration).NotEmpty().MaximumLength(20);
    }
}

public class CreateVideoTestimonialCommandHandler
    : IRequestHandler<CreateVideoTestimonialCommand, VideoTestimonialDto>
{
    private readonly IAppDbContext _db;

    public CreateVideoTestimonialCommandHandler(IAppDbContext db) => _db = db;

    public async Task<VideoTestimonialDto> Handle(CreateVideoTestimonialCommand request, CancellationToken ct)
    {
        var entity = new VideoTestimonial
        {
            Name = request.Name.Trim(),
            Company = request.Company.Trim(),
            ThumbnailUrl = request.ThumbnailUrl,
            VideoUrl = request.VideoUrl.Trim(),
            Duration = request.Duration.Trim(),
            Quote = request.Quote.Trim(),
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
        };

        _db.VideoTestimonials.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
