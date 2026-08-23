using FluentValidation;
using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.VideoTestimonials.Commands;

public record UpdateVideoTestimonialCommand : IRequest<VideoTestimonialDto>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Company { get; init; } = string.Empty;
    public string? ThumbnailUrl { get; init; }
    public string VideoUrl { get; init; } = string.Empty;
    public string Duration { get; init; } = string.Empty;
    public string Quote { get; init; } = string.Empty;
    public int DisplayOrder { get; init; }
    public bool IsActive { get; init; } = true;
}

public class UpdateVideoTestimonialCommandValidator : AbstractValidator<UpdateVideoTestimonialCommand>
{
    public UpdateVideoTestimonialCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Company).NotEmpty().MaximumLength(160);
        RuleFor(x => x.VideoUrl).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Quote).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Duration).NotEmpty().MaximumLength(20);
    }
}

public class UpdateVideoTestimonialCommandHandler
    : IRequestHandler<UpdateVideoTestimonialCommand, VideoTestimonialDto>
{
    private readonly IAppDbContext _db;

    public UpdateVideoTestimonialCommandHandler(IAppDbContext db) => _db = db;

    public async Task<VideoTestimonialDto> Handle(UpdateVideoTestimonialCommand request, CancellationToken ct)
    {
        var entity = await _db.VideoTestimonials.FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Video referans", request.Id);

        entity.Name = request.Name.Trim();
        entity.Company = request.Company.Trim();
        entity.ThumbnailUrl = request.ThumbnailUrl;
        entity.VideoUrl = request.VideoUrl.Trim();
        entity.Duration = request.Duration.Trim();
        entity.Quote = request.Quote.Trim();
        entity.DisplayOrder = request.DisplayOrder;
        entity.IsActive = request.IsActive;

        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
